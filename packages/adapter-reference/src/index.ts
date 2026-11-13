import { reviewExtraction, snapshotSources } from '@step-beyond/runtime-core';
import type { DecisionRecord, EvidenceReview, SourceDocument, SourceSnapshot } from '@step-beyond/runtime-core';

export interface HostCapabilities {
  executeLocal: boolean;
  persistMemory: boolean;
  publishExternal: boolean;
}

export interface AdapterBindings {
  detect: () => HostCapabilities;
  executeLocal?: (input: unknown) => Promise<unknown>;
  publishExternal?: (input: unknown) => Promise<unknown>;
  readContext?: () => Promise<unknown>;
  readProject?: () => Promise<unknown>;
  requestPermission?: (input: unknown) => Promise<string>;
  readUserModel?: () => Promise<unknown>;
  writeUserModel?: (input: unknown) => Promise<unknown>;
  recordEvidence?: (input: unknown) => Promise<unknown>;
}

export class ReferenceAdapter {
  #cachedCapabilities: HostCapabilities | undefined;

  constructor(private readonly bindings: AdapterBindings) {}

  capabilities(): HostCapabilities {
    this.#cachedCapabilities ??= Object.freeze({ ...this.bindings.detect() });
    return this.#cachedCapabilities;
  }

  async executeLocal(input: unknown): Promise<unknown> {
    if (!this.capabilities().executeLocal || !this.bindings.executeLocal) {
      return { status: 'unavailable', verified: false, reason: 'execute_local capability is unavailable' };
    }
    return this.bindings.executeLocal(input);
  }

  async publishExternal(input: unknown, permissionRef?: string): Promise<unknown> {
    if (!permissionRef) throw new Error('Explicit permission reference is required for publication');
    if (!this.capabilities().publishExternal || !this.bindings.publishExternal) {
      return { status: 'unavailable', verified: false, reason: 'publish_external capability is unavailable' };
    }
    return this.bindings.publishExternal(input);
  }
}

// --- Evidence review flow -------------------------------------------------

/** Instruction handed to the model. Hosts may extend it; the checks do not depend on it. */
export const EXTRACTION_INSTRUCTION = [
  'Extract decisions, proposals, facts, gaps, and discrepancies from the sources.',
  'Return JSON: {"claims":[{"id","kind","statement","parts":[{"text","evidence":[{"sourceId","quote"}]}],"validity","author"}]}.',
  'kind is one of: fact, decision, proposal, gap, discrepancy. validity is one of: current, historical, unknown.',
  'One claim states one thing. If a statement has several provable pieces, give each its own part with its own verbatim quote.',
  'Quotes are copied character for character from the named source. Do not paraphrase inside a quote.',
  'Being able to do something is not consent to do it: report it as a proposal, never as a decision.',
  'Do not state that anything is approved, permitted, or already settled. Such fields are discarded.',
].join('\n');

export interface ModelCallInput { instruction: string; sources: SourceDocument[] }

export interface ModelCallResult {
  rawOutput: string;
  /** Exact model identifier as reported by the provider or CLI. */
  model?: string;
  parameters?: Record<string, unknown>;
  usage?: { inputTokens?: number; outputTokens?: number };
}

export interface EvidenceReviewRun {
  model: string | null;
  parameters: Record<string, unknown> | null;
  usage: { inputTokens: number | null; outputTokens: number | null };
  startedAt: string;
  durationMs: number;
  /** What keeps this run from being reproduced exactly. */
  limitations: string[];
}

export interface EvidenceReviewResult {
  review: EvidenceReview;
  run: EvidenceReviewRun;
  /** Digests of the sources the model saw; pass to `recordDecision`. */
  snapshot: SourceSnapshot[];
}

/**
 * Read sources → snapshot → call the model → re-read sources → validate →
 * stop. The result is a report for a human. This function has no write,
 * execute, or publish path, and it does not retry or repair the model's answer.
 */
export async function runEvidenceReview(input: {
  readSources: () => Promise<SourceDocument[]>;
  callModel: (call: ModelCallInput) => Promise<ModelCallResult>;
  decisions?: DecisionRecord[];
  instruction?: string;
  now?: () => number;
}): Promise<EvidenceReviewResult> {
  const now = input.now ?? Date.now;
  const before = await input.readSources();
  const snapshot = snapshotSources(before);
  const startedAt = now();
  const result = await input.callModel({ instruction: input.instruction ?? EXTRACTION_INSTRUCTION, sources: before });
  const durationMs = now() - startedAt;
  const review = reviewExtraction({
    rawOutput: result.rawOutput, snapshot, sources: await input.readSources(), decisions: input.decisions ?? [],
  });

  const limitations: string[] = [];
  if (!result.model) limitations.push('model identifier was not recorded');
  if (!result.parameters) limitations.push('call parameters were not recorded');
  return {
    review,
    snapshot,
    run: {
      model: result.model ?? null,
      parameters: result.parameters ?? null,
      usage: { inputTokens: result.usage?.inputTokens ?? null, outputTokens: result.usage?.outputTokens ?? null },
      startedAt: new Date(startedAt).toISOString(),
      durationMs,
      limitations,
    },
  };
}
