import { createHash } from 'node:crypto';

import { classifyAction } from './action-policy.js';
import { createVerificationRecord } from './verification.js';
import type { ActionDecision, OperationKind, ProposedAction, VerificationRecord } from './types.js';

/**
 * Evidence review: deterministic checks on a model's extraction of claims from
 * source documents. The model writes the claims; this module decides what may
 * be said about them. Four axes stay separate on every claim:
 * evidence support, time validity, prior user decision, and required action.
 * Nothing here grants permission to execute anything.
 */

export interface SourceDocument { id: string; text: string }
export interface SourceSnapshot { id: string; digest: string }

export type ClaimKind = 'fact' | 'decision' | 'proposal' | 'gap' | 'discrepancy';
export type ClaimValidity = 'current' | 'historical' | 'unknown';

export interface ClaimEvidence { sourceId: string; quote: string }
export interface ClaimPart { text: string; evidence: ClaimEvidence[] }

export interface ExtractedClaim {
  id: string;
  kind: ClaimKind;
  statement: string;
  /** One entry per separately provable piece of the statement. */
  parts: ClaimPart[];
  validity: ClaimValidity;
  author?: string;
  /** A proposal the model attached. It is classified, never authorized. */
  action?: ProposedAction;
  /** A hint only. It can surface a decision for review, never settle one. */
  priorDecisionRef?: string;
}

export interface IgnoredField { claimId: string | null; field: string; reasonCode: string }

export type ParsedExtraction =
  | { ok: true; claims: ExtractedClaim[]; ignoredFields: IgnoredField[] }
  | { ok: false; error: string };

export type QuoteMatch =
  | { status: 'exact'; quote: string }
  | { status: 'case_restored'; quote: string }
  | { status: 'ambiguous' }
  | { status: 'not_found' };

export interface QuoteCorrection {
  claimId: string;
  partIndex: number;
  sourceId: string;
  kind: 'case_only';
  from: string;
  to: string;
}

export type EvidenceStatus = 'supported' | 'partially_supported' | 'unsupported' | 'not_applicable';
export type DecisionStatus = 'none' | 'settled' | 'possibly_settled' | 'reopened';
export type RequiredAction = 'fix_evidence' | 'split_or_map_evidence' | 'verify_before_use' | 'user_decision' | 'confirm_gap';

/** A decision the user actually made, recorded by the host with its evidence. */
export interface DecisionRecord {
  id: string;
  fingerprint: string;
  evidenceKeys: string[];
  /** Digests of the sources the decision relied on, at the time it was made. */
  sourceDigests: Record<string, string>;
  decision: string;
  /** Reference to the user's own statement of the decision. Required. */
  evidenceRef: string;
  decidedAt: string;
}

export interface ReviewedPart {
  text: string;
  supported: boolean;
  evidence: Array<ClaimEvidence & { match: QuoteMatch['status']; resolvedQuote: string | null }>;
}

export interface ReviewedClaim {
  id: string;
  kind: ClaimKind;
  statement: string;
  author: string | null;
  fingerprint: string;
  evidenceKeys: string[];
  parts: ReviewedPart[];
  evidence: EvidenceStatus;
  validity: ClaimValidity;
  decision: DecisionStatus;
  decisionRefs: string[];
  requiredActions: RequiredAction[];
  reasonCodes: string[];
  /** Policy class of the attached proposal. A class is not a permission. */
  actionDecision: ActionDecision | null;
  verification: VerificationRecord;
}

export interface EvidenceReview {
  status: 'ready_for_review' | 'stale_sources' | 'invalid_output';
  /** The model's answer, byte for byte. Corrections live beside it, not in it. */
  rawOutput: string;
  claims: ReviewedClaim[];
  corrections: QuoteCorrection[];
  ignoredFields: IgnoredField[];
  changedSources: string[];
  error: string | null;
  /** The review ends at a human. It never authorizes execution. */
  executionAuthorized: false;
}

const CLAIM_KINDS: readonly ClaimKind[] = ['fact', 'decision', 'proposal', 'gap', 'discrepancy'];
const VALIDITIES: readonly ClaimValidity[] = ['current', 'historical', 'unknown'];
const OPERATION_KINDS: readonly OperationKind[] = [
  'read_context', 'read_project', 'execute_local', 'request_permission', 'publish_external',
  'write_user_model', 'record_evidence', 'exfiltrate_secret', 'escalate_authority',
];
const CLAIM_FIELDS = new Set(['id', 'kind', 'statement', 'parts', 'evidence', 'validity', 'author', 'action', 'priorDecisionRef']);
const AUTHORITY_FIELD = /approv|authoriz|permission|consent|settled|verified|decided|resolved/iu;
const COMPOUND_HINT = /;|\s(?:and|or|but|i|oraz|a także|lub|ale)\s/iu;

const sha256 = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const normalize = (value: string) => value.trim().replace(/\s+/gu, ' ').toLowerCase();
const evidenceKey = (sourceId: string, quote: string) => `${sourceId}\u0000${quote.toLowerCase()}`;

export function snapshotSources(sources: SourceDocument[]): SourceSnapshot[] {
  return sources.map((source) => ({ id: source.id, digest: sha256(source.text) }));
}

/** Source ids added, removed, or changed between a snapshot and the current documents. */
export function changedSourceIds(before: SourceSnapshot[], now: SourceDocument[]): string[] {
  const current = new Map(snapshotSources(now).map((snapshot) => [snapshot.id, snapshot.digest]));
  const changed = new Set<string>();
  for (const snapshot of before) {
    if (current.get(snapshot.id) !== snapshot.digest) changed.add(snapshot.id);
    current.delete(snapshot.id);
  }
  for (const id of current.keys()) changed.add(id);
  return [...changed].sort();
}

/**
 * Exact match first. Otherwise the source spelling is restored only when the
 * quote differs by letter case alone and every such occurrence is spelled the
 * same way. No whitespace, punctuation, or fuzzy matching: those change content.
 */
/** `starts[i]` is the source offset where lowered unit `i` begins, or -1 inside an expanded character. */
function lowerByCodePoint(value: string): { lowered: string; starts: number[] } {
  const pieces: string[] = [];
  const starts: number[] = [];
  let offset = 0;
  for (const character of value) {
    const lower = character.toLowerCase();
    pieces.push(lower);
    for (let unit = 0; unit < lower.length; unit++) starts.push(unit === 0 ? offset : -1);
    offset += character.length;
  }
  starts.push(offset);
  return { lowered: pieces.join(''), starts };
}

export function matchQuote(quote: string, text: string): QuoteMatch {
  if (quote.trim() === '') return { status: 'not_found' };
  if (text.includes(quote)) return { status: 'exact', quote };
  // Lowercase code point by code point, remembering where each lowered unit
  // came from, so one indexed search works even when lowercasing changes length.
  const lowerQuote = lowerByCodePoint(quote).lowered;
  const { lowered, starts } = lowerByCodePoint(text);
  const spellings = new Set<string>();
  for (let index = lowered.indexOf(lowerQuote); index !== -1; index = lowered.indexOf(lowerQuote, index + 1)) {
    const from = starts[index];
    const to = starts[index + lowerQuote.length];
    // Both ends must fall on a source character boundary.
    if (from !== undefined && to !== undefined && from >= 0 && to >= 0) spellings.add(text.slice(from, to));
  }
  if (spellings.size === 0) return { status: 'not_found' };
  if (spellings.size > 1) return { status: 'ambiguous' };
  return { status: 'case_restored', quote: [...spellings][0]! };
}

function parseEvidence(value: unknown): ClaimEvidence[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return null;
  const evidence: ClaimEvidence[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.sourceId !== 'string' || typeof item.quote !== 'string') return null;
    evidence.push({ sourceId: item.sourceId, quote: item.quote });
  }
  return evidence;
}

function parseAction(value: unknown): ProposedAction | null {
  if (!isRecord(value) || !OPERATION_KINDS.includes(value.kind as OperationKind)) return null;
  const action: ProposedAction = { kind: value.kind as OperationKind };
  if (typeof value.withinScope === 'boolean') action.withinScope = value.withinScope;
  if (typeof value.reversible === 'boolean') action.reversible = value.reversible;
  if (typeof value.assumptionRequired === 'boolean') action.assumptionRequired = value.assumptionRequired;
  if (typeof value.securitySensitive === 'boolean') action.securitySensitive = value.securitySensitive;
  if (typeof value.estimatedCost === 'number') action.estimatedCost = value.estimatedCost;
  return action;
}

/**
 * Reads only the declared claim fields. Anything else is dropped and reported;
 * fields that look like authority (`approved`, `permission`, `settled`, …) are
 * reported as ignored authority claims. Model output carries no permissions.
 */
export function parseExtraction(rawOutput: string): ParsedExtraction {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawOutput);
  } catch (error) {
    return { ok: false, error: `Model output is not valid JSON: ${(error as Error).message}` };
  }
  if (!isRecord(parsed) || !Array.isArray(parsed.claims)) return { ok: false, error: 'Model output must be an object with a "claims" array' };

  const ignoredFields: IgnoredField[] = [];
  const ignore = (claimId: string | null, field: string) => ignoredFields.push({
    claimId, field, reasonCode: AUTHORITY_FIELD.test(field) ? 'model_authority_claim_ignored' : 'unknown_field_ignored',
  });
  for (const field of Object.keys(parsed)) if (field !== 'claims') ignore(null, field);

  const claims: ExtractedClaim[] = [];
  const seen = new Set<string>();
  for (const [index, item] of parsed.claims.entries()) {
    const where = `claims[${index}]`;
    if (!isRecord(item)) return { ok: false, error: `${where} must be an object` };
    const { id, kind, statement } = item;
    if (typeof id !== 'string' || id === '') return { ok: false, error: `${where}.id must be a non-empty string` };
    if (seen.has(id)) return { ok: false, error: `${where}.id "${id}" is duplicated` };
    seen.add(id);
    if (!CLAIM_KINDS.includes(kind as ClaimKind)) return { ok: false, error: `${where}.kind must be one of ${CLAIM_KINDS.join(', ')}` };
    if (typeof statement !== 'string' || statement.trim() === '') return { ok: false, error: `${where}.statement must be a non-empty string` };

    let parts: ClaimPart[];
    if (item.parts !== undefined) {
      if (!Array.isArray(item.parts) || item.parts.length === 0) return { ok: false, error: `${where}.parts must be a non-empty array` };
      parts = [];
      for (const part of item.parts) {
        const evidence = isRecord(part) ? parseEvidence(part.evidence) : null;
        if (!isRecord(part) || typeof part.text !== 'string' || part.text.trim() === '' || evidence === null) {
          return { ok: false, error: `${where}.parts entries need "text" and an "evidence" array of {sourceId, quote}` };
        }
        parts.push({ text: part.text, evidence });
      }
      if (item.evidence !== undefined) ignore(id, 'evidence');
    } else {
      const evidence = parseEvidence(item.evidence);
      if (evidence === null) return { ok: false, error: `${where}.evidence must be an array of {sourceId, quote}` };
      parts = [{ text: statement, evidence }];
    }

    const claim: ExtractedClaim = {
      id, kind: kind as ClaimKind, statement, parts,
      // A missing or unrecognized time label is never read as "current".
      validity: VALIDITIES.includes(item.validity as ClaimValidity) ? item.validity as ClaimValidity : 'unknown',
    };
    if (typeof item.author === 'string') claim.author = item.author;
    if (typeof item.priorDecisionRef === 'string') claim.priorDecisionRef = item.priorDecisionRef;
    if (item.action !== undefined) {
      const action = parseAction(item.action);
      if (action) claim.action = action; else ignoredFields.push({ claimId: id, field: 'action', reasonCode: 'invalid_action_ignored' });
    }
    for (const field of Object.keys(item)) if (!CLAIM_FIELDS.has(field)) ignore(id, field);
    claims.push(claim);
  }
  return { ok: true, claims, ignoredFields };
}

/** Parts and the attached action are part of the identity: a decision about one proposal does not cover another. */
function fingerprintOf(kind: ClaimKind, statement: string, partKeys: Array<[string, string[]]>, action: ProposedAction | undefined): string {
  const actionKey = action
    ? [action.kind, action.withinScope ?? null, action.reversible ?? null, action.assumptionRequired ?? null, action.securitySensitive ?? null, action.estimatedCost ?? null]
    : null;
  return sha256(JSON.stringify([kind, normalize(statement), partKeys, actionKey]));
}

function matchDecision(
  claim: ExtractedClaim, fingerprint: string, evidenceKeys: string[], citedSources: string[], decisions: DecisionRecord[], digests: Map<string, string>,
): { status: DecisionStatus; refs: string[]; reasonCodes: string[] } {
  const exact = decisions.filter((record) => record.fingerprint === fingerprint && record.evidenceRef.trim() !== '');
  if (exact.length > 0) {
    // Every source the claim cites now must have been pinned by the record, unchanged.
    const valid = exact.filter((record) => citedSources.every((id) => digests.has(id) && record.sourceDigests[id] === digests.get(id))
      && Object.entries(record.sourceDigests).every(([id, digest]) => digests.get(id) === digest));
    return valid.length > 0
      ? { status: 'settled', refs: valid.map((record) => record.id), reasonCodes: ['prior_decision_applies'] }
      : { status: 'reopened', refs: exact.map((record) => record.id), reasonCodes: ['decision_context_changed'] };
  }
  const keys = new Set(evidenceKeys);
  const related = decisions.filter((record) => record.id === claim.priorDecisionRef || record.evidenceKeys.some((key) => keys.has(key)));
  const reasonCodes: string[] = [];
  if (claim.priorDecisionRef !== undefined && !decisions.some((record) => record.id === claim.priorDecisionRef)) {
    reasonCodes.push('unknown_decision_ref');
  }
  if (related.length > 0) return { status: 'possibly_settled', refs: related.map((record) => record.id), reasonCodes: [...reasonCodes, 'prior_decision_may_apply'] };
  return { status: 'none', refs: [], reasonCodes };
}

function reviewClaim(
  claim: ExtractedClaim, texts: Map<string, string>, digests: Map<string, string>, decisions: DecisionRecord[], corrections: QuoteCorrection[],
): ReviewedClaim {
  const reasonCodes: string[] = [];
  const parts: ReviewedPart[] = claim.parts.map((part, partIndex) => {
    const evidence = part.evidence.map((item) => {
      const text = texts.get(item.sourceId);
      const match: QuoteMatch = text === undefined ? { status: 'not_found' } : matchQuote(item.quote, text);
      if (text === undefined) reasonCodes.push('unknown_source');
      else if (match.status === 'not_found') reasonCodes.push('quote_not_in_source');
      else if (match.status === 'ambiguous') reasonCodes.push('quote_case_ambiguous');
      else if (match.status === 'case_restored') {
        reasonCodes.push('quote_case_restored');
        corrections.push({ claimId: claim.id, partIndex, sourceId: item.sourceId, kind: 'case_only', from: item.quote, to: match.quote });
      }
      const resolvedQuote = match.status === 'exact' || match.status === 'case_restored' ? match.quote : null;
      return { ...item, match: match.status, resolvedQuote };
    });
    // Every quote a part cites must resolve; one good quote does not excuse a bad one.
    return { text: part.text, evidence, supported: evidence.length > 0 && evidence.every((item) => item.resolvedQuote !== null) };
  });

  const cited = parts.some((part) => part.evidence.length > 0);
  const supportedParts = parts.filter((part) => part.supported).length;
  const evidence: EvidenceStatus = claim.kind === 'gap' && !cited
    ? 'not_applicable'
    : supportedParts === parts.length ? 'supported' : supportedParts > 0 ? 'partially_supported' : 'unsupported';
  if (parts.some((part) => part.evidence.length === 0) && evidence !== 'not_applicable') reasonCodes.push('part_without_evidence');

  const evidenceKeys = [...new Set(parts.flatMap((part) => part.evidence.map((item) => evidenceKey(item.sourceId, item.resolvedQuote ?? item.quote))))].sort();
  // Part texts and their own quotes are part of the identity, not just the headline statement.
  const partKeys = parts.map((part): [string, string[]] => [
    normalize(part.text), part.evidence.map((item) => evidenceKey(item.sourceId, item.resolvedQuote ?? item.quote)).sort(),
  ]);
  const fingerprint = fingerprintOf(claim.kind, claim.statement, partKeys, claim.action);
  const citedSources = [...new Set(parts.flatMap((part) => part.evidence.map((item) => item.sourceId)))];
  const decision = matchDecision(claim, fingerprint, evidenceKeys, citedSources, decisions, digests);
  reasonCodes.push(...decision.reasonCodes);

  const requiredActions: RequiredAction[] = [];
  if (evidence === 'unsupported' || evidence === 'partially_supported') requiredActions.push('fix_evidence');
  if (claim.kind === 'gap') requiredActions.push('confirm_gap');
  if (parts.length === 1 && claim.kind !== 'gap' && COMPOUND_HINT.test(claim.statement)) {
    reasonCodes.push('possible_compound_statement');
    requiredActions.push('split_or_map_evidence');
  }
  // Time validity is independent of a prior decision: a settled rule does not confirm a fact.
  if (claim.validity !== 'current') {
    reasonCodes.push(claim.validity === 'historical' ? 'historical_information' : 'validity_unknown');
    requiredActions.push('verify_before_use');
  }
  const needsDecision = claim.kind === 'discrepancy' || claim.kind === 'proposal' || claim.action !== undefined;
  // An uncertain or invalidated prior decision goes back to the user whatever the claim kind.
  const priorDecisionOpen = decision.status === 'reopened' || decision.status === 'possibly_settled';
  if ((needsDecision && decision.status !== 'settled') || priorDecisionOpen) requiredActions.push('user_decision');

  const actionDecision = claim.action ? classifyAction(claim.action) : null;
  if (actionDecision) reasonCodes.push('proposal_is_not_permission');

  const unchecked = ['whether each quote semantically covers its part'];
  if (claim.validity !== 'current') unchecked.push('whether the information is still current');
  const verification = createVerificationRecord({
    claim: claim.statement,
    checkExecuted: evidence !== 'not_applicable',
    result: evidence === 'not_applicable' ? 'not_run' : evidence === 'supported' ? 'pass' : 'fail',
    unchecked,
    method: 'quote presence in snapshotted sources',
    evidence: parts.flatMap((part) => part.evidence.flatMap((item) => item.resolvedQuote === null ? [] : [`${item.sourceId}: ${item.resolvedQuote}`])),
  });

  return {
    id: claim.id, kind: claim.kind, statement: claim.statement, author: claim.author ?? null,
    fingerprint, evidenceKeys, parts, evidence, validity: claim.validity,
    decision: decision.status, decisionRefs: decision.refs,
    requiredActions, reasonCodes: [...new Set(reasonCodes)], actionDecision, verification,
  };
}

export function reviewExtraction(input: {
  rawOutput: string;
  /** Snapshot taken before the model call. */
  snapshot: SourceSnapshot[];
  /** Sources re-read after the model call. */
  sources: SourceDocument[];
  /** Decision history supplied by the host. Model output cannot add to it. */
  decisions?: DecisionRecord[];
}): EvidenceReview {
  const base = { rawOutput: input.rawOutput, claims: [], corrections: [], ignoredFields: [], changedSources: [], error: null, executionAuthorized: false as const };
  const changedSources = changedSourceIds(input.snapshot, input.sources);
  if (changedSources.length > 0) {
    return { ...base, status: 'stale_sources', changedSources, error: 'Sources changed during analysis; re-run against the current sources' };
  }
  const parsed = parseExtraction(input.rawOutput);
  if (!parsed.ok) return { ...base, status: 'invalid_output', error: parsed.error };

  const texts = new Map(input.sources.map((source) => [source.id, source.text]));
  const digests = new Map(input.snapshot.map((snapshot) => [snapshot.id, snapshot.digest]));
  const corrections: QuoteCorrection[] = [];
  const claims = parsed.claims.map((claim) => reviewClaim(claim, texts, digests, input.decisions ?? [], corrections));
  return { ...base, status: 'ready_for_review', claims, corrections, ignoredFields: parsed.ignoredFields };
}

/**
 * Records a decision the user made about a reviewed claim. The record binds to
 * the exact claim and to the digests of the sources it cites, so a reworded or
 * changed matter is not silently covered by it.
 */
export function recordDecision(input: {
  claim: Pick<ReviewedClaim, 'fingerprint' | 'evidenceKeys' | 'parts'>;
  snapshot: SourceSnapshot[];
  decision: string;
  evidenceRef: string;
  decidedAt?: string;
}): DecisionRecord {
  if (input.evidenceRef.trim() === '') throw new Error('A decision record requires a reference to the user\'s own decision');
  if (input.decision.trim() === '') throw new Error('A decision record requires the decision text');
  const cited = new Set(input.claim.parts.flatMap((part) => part.evidence.map((item) => item.sourceId)));
  const sourceDigests: Record<string, string> = {};
  for (const snapshot of input.snapshot) if (cited.has(snapshot.id)) sourceDigests[snapshot.id] = snapshot.digest;
  const missing = [...cited].filter((id) => !(id in sourceDigests));
  if (missing.length > 0) throw new Error(`A decision cannot be recorded for a claim citing sources without a snapshot: ${missing.join(', ')}`);
  return {
    id: crypto.randomUUID(), fingerprint: input.claim.fingerprint, evidenceKeys: [...input.claim.evidenceKeys],
    sourceDigests, decision: input.decision, evidenceRef: input.evidenceRef,
    decidedAt: input.decidedAt ?? new Date().toISOString(),
  };
}
