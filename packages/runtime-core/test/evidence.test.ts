import assert from 'node:assert/strict';
import test from 'node:test';

import { changedSourceIds, matchQuote, parseExtraction, recordDecision, reviewExtraction, snapshotSources } from '../src/index.js';
import type { SourceDocument } from '../src/index.js';

// All fixtures are synthetic.
const sources: SourceDocument[] = [
  { id: 'chat', text: 'System działa na Linux i można przeprowadzić migrację. Harmonogram wyślę jutro.' },
  { id: 'rules', text: 'Aktualna reguła: wdrożenia tylko w piątki.' },
  { id: 'old-note', text: 'Notatka z 2024: wdrożenia odbywają się w poniedziałki.' },
];
const snapshot = snapshotSources(sources);
const review = (claims: unknown[], extra: Record<string, unknown> = {}, decisions = undefined as Parameters<typeof reviewExtraction>[0]['decisions']) =>
  reviewExtraction({ rawOutput: JSON.stringify({ claims, ...extra }), snapshot, sources, ...(decisions ? { decisions } : {}) });

const discrepancy = {
  id: 'd1', kind: 'discrepancy', validity: 'historical',
  statement: 'Stara notatka przeczy aktualnej regule dni wdrożeń',
  parts: [
    { text: 'reguła: piątki', evidence: [{ sourceId: 'rules', quote: 'wdrożenia tylko w piątki' }] },
    { text: 'notatka: poniedziałki', evidence: [{ sourceId: 'old-note', quote: 'wdrożenia odbywają się w poniedziałki' }] },
  ],
};

test('matchQuote restores source spelling only for an unambiguous case-only difference', () => {
  assert.deepEqual(matchQuote('System działa', 'System działa na Linux'), { status: 'exact', quote: 'System działa' });
  assert.deepEqual(matchQuote('system działa', 'System działa na Linux'), { status: 'case_restored', quote: 'System działa' });
  assert.deepEqual(matchQuote('linux', 'Linux albo LINUX'), { status: 'ambiguous' });
  assert.deepEqual(matchQuote('System  działa', 'System działa'), { status: 'not_found' });
  assert.deepEqual(matchQuote('System dziala', 'System działa'), { status: 'not_found' });
  assert.deepEqual(matchQuote(' ', 'anything'), { status: 'not_found' });
  // A length-changing character elsewhere in the source does not block restoration.
  assert.deepEqual(matchQuote('linux', 'İstanbul office. System runs on Linux.'), { status: 'case_restored', quote: 'Linux' });
});

test('case 1: one quote under a compound statement is flagged, and ability is not consent', () => {
  const merged = review([{
    id: 'c1', kind: 'fact', validity: 'current', statement: 'System działa na Linux i migracja została zatwierdzona',
    evidence: [{ sourceId: 'chat', quote: 'System działa na Linux' }],
  }]).claims[0]!;
  assert.ok(merged.reasonCodes.includes('possible_compound_statement'));
  assert.ok(merged.requiredActions.includes('split_or_map_evidence'));
  assert.equal(merged.verification.status, 'partially_verified');

  const split = review([{
    id: 'c1', kind: 'proposal', validity: 'current', statement: 'System działa na Linux i można przeprowadzić migrację',
    parts: [
      { text: 'System działa na Linux', evidence: [{ sourceId: 'chat', quote: 'System działa na Linux' }] },
      { text: 'Migracja została zatwierdzona', evidence: [] },
    ],
    action: { kind: 'execute_local', withinScope: true, reversible: true },
  }]);
  const claim = split.claims[0]!;
  assert.equal(claim.evidence, 'partially_supported');
  assert.deepEqual(claim.parts.map((part) => part.supported), [true, false]);
  assert.ok(claim.reasonCodes.includes('part_without_evidence'));
  assert.ok(claim.requiredActions.includes('fix_evidence'));
  assert.equal(claim.verification.status, 'unverified');
  // An AUTO policy class on a proposal still does not authorize anything.
  assert.equal(claim.actionDecision?.class, 'AUTO');
  assert.ok(claim.requiredActions.includes('user_decision'));
  assert.equal(split.executionAuthorized, false);
});

test('case 2: a recorded decision is not asked again, and the fact stays unconfirmed', () => {
  const first = review([discrepancy]).claims[0]!;
  assert.equal(first.decision, 'none');
  assert.ok(first.requiredActions.includes('user_decision'));

  const decision = recordDecision({ claim: first, snapshot, decision: 'Keep the current rule', evidenceRef: 'user-message:42' });
  const second = review([discrepancy], {}, [decision]).claims[0]!;
  assert.equal(second.decision, 'settled');
  assert.deepEqual(second.decisionRefs, [decision.id]);
  assert.ok(!second.requiredActions.includes('user_decision'));
  assert.ok(second.requiredActions.includes('verify_before_use'));
  assert.equal(second.verification.status, 'partially_verified');
  assert.ok(second.verification.unchecked.includes('whether the information is still current'));

  assert.throws(() => recordDecision({ claim: first, snapshot, decision: 'Keep', evidenceRef: ' ' }), /user's own decision/);
});

test('case 3: authority fields in model output are ignored and reported', () => {
  const result = review(
    [{ ...discrepancy, approved: true, decisionStatus: 'settled', priorDecisionRef: 'made-up', note: 'x' }],
    { approved: true },
  );
  const claim = result.claims[0]!;
  assert.equal(claim.decision, 'none');
  assert.ok(claim.requiredActions.includes('user_decision'));
  assert.ok(claim.reasonCodes.includes('unknown_decision_ref'));
  assert.deepEqual(result.ignoredFields, [
    { claimId: null, field: 'approved', reasonCode: 'model_authority_claim_ignored' },
    { claimId: 'd1', field: 'approved', reasonCode: 'model_authority_claim_ignored' },
    { claimId: 'd1', field: 'decisionStatus', reasonCode: 'unknown_field_ignored' },
    { claimId: 'd1', field: 'note', reasonCode: 'unknown_field_ignored' },
  ]);
  assert.equal(result.executionAuthorized, false);
  assert.ok(result.rawOutput.includes('"approved":true'), 'raw output is preserved untouched');
});

test('case 4: sources that change during analysis hold the result', () => {
  const edited = sources.map((source) => source.id === 'rules' ? { ...source, text: 'Aktualna reguła: wdrożenia codziennie.' } : source);
  const result = reviewExtraction({ rawOutput: JSON.stringify({ claims: [discrepancy] }), snapshot, sources: edited });
  assert.equal(result.status, 'stale_sources');
  assert.deepEqual(result.changedSources, ['rules']);
  assert.deepEqual(result.claims, []);
  assert.deepEqual(changedSourceIds(snapshot, [...sources, { id: 'new', text: '' }].slice(1)), ['chat', 'new']);
});

test('case 5: a reworded or changed matter surfaces the old decision without inheriting it', () => {
  const first = review([discrepancy]).claims[0]!;
  const decision = recordDecision({ claim: first, snapshot, decision: 'Keep the current rule', evidenceRef: 'user-message:42' });

  const reworded = review([{ ...discrepancy, statement: 'Dni wdrożeń różnią się między regułą a notatką' }], {}, [decision]).claims[0]!;
  assert.equal(reworded.decision, 'possibly_settled');
  assert.deepEqual(reworded.decisionRefs, [decision.id]);
  assert.ok(reworded.requiredActions.includes('user_decision'));

  const unrelated = review([{
    id: 'x', kind: 'discrepancy', validity: 'current', statement: 'Harmonogram nie został dostarczony',
    evidence: [{ sourceId: 'chat', quote: 'Harmonogram wyślę jutro' }],
  }], {}, [decision]).claims[0]!;
  assert.equal(unrelated.decision, 'none');

  // Same claim, but a source it relied on has since changed: the decision reopens.
  const changed = sources.map((source) => source.id === 'old-note' ? { ...source, text: `${source.text} Dopisek.` } : source);
  const reopened = reviewExtraction({
    rawOutput: JSON.stringify({ claims: [discrepancy] }), snapshot: snapshotSources(changed), sources: changed, decisions: [decision],
  }).claims[0]!;
  assert.equal(reopened.decision, 'reopened');
  assert.ok(reopened.reasonCodes.includes('decision_context_changed'));
  assert.ok(reopened.requiredActions.includes('user_decision'));
});

test('case-only quote corrections are logged beside the untouched model answer', () => {
  const raw = JSON.stringify({ claims: [{ id: 'q', kind: 'fact', validity: 'current', statement: 'Jest reguła piątkowa', evidence: [{ sourceId: 'rules', quote: 'aktualna reguła: wdrożenia tylko w piątki' }] }] });
  const result = reviewExtraction({ rawOutput: raw, snapshot, sources });
  assert.equal(result.rawOutput, raw);
  assert.deepEqual(result.corrections, [{
    claimId: 'q', partIndex: 0, sourceId: 'rules', kind: 'case_only',
    from: 'aktualna reguła: wdrożenia tylko w piątki', to: 'Aktualna reguła: wdrożenia tylko w piątki',
  }]);
  const claim = result.claims[0]!;
  assert.equal(claim.evidence, 'supported');
  assert.equal(claim.parts[0]!.evidence[0]!.quote, 'aktualna reguła: wdrożenia tylko w piątki');
  assert.ok(claim.reasonCodes.includes('quote_case_restored'));
});

test('missing quotes, unknown sources, gaps, and unlabeled validity are handled conservatively', () => {
  const result = review([
    { id: 'a', kind: 'fact', validity: 'current', statement: 'Wdrożenia w środy', evidence: [{ sourceId: 'rules', quote: 'wdrożenia w środy' }] },
    { id: 'b', kind: 'fact', statement: 'Coś z nieznanego źródła', evidence: [{ sourceId: 'nope', quote: 'x' }] },
    { id: 'c', kind: 'gap', validity: 'current', statement: 'Brak zapowiedzianego harmonogramu' },
    { id: 'd', kind: 'fact', validity: 'current', statement: 'Dwa cytaty', evidence: [{ sourceId: 'rules', quote: 'wdrożenia tylko w piątki' }, { sourceId: 'rules', quote: 'zmyślone' }] },
  ]);
  const [a, b, c, d] = result.claims;
  assert.equal(a!.evidence, 'unsupported');
  assert.equal(a!.verification.status, 'unverified');
  assert.ok(b!.reasonCodes.includes('unknown_source'));
  assert.equal(b!.validity, 'unknown');
  assert.ok(b!.requiredActions.includes('verify_before_use'));
  assert.equal(c!.evidence, 'not_applicable');
  assert.deepEqual(c!.requiredActions, ['confirm_gap']);
  assert.equal(c!.verification.status, 'unverified');
  assert.equal(d!.evidence, 'unsupported', 'one fabricated quote fails the part');
});

test('malformed model output is reported, not repaired', () => {
  assert.equal(reviewExtraction({ rawOutput: 'not json', snapshot, sources }).status, 'invalid_output');
  assert.deepEqual(parseExtraction('{"claims":[{"id":"a","kind":"order","statement":"x"}]}'), {
    ok: false, error: 'claims[0].kind must be one of fact, decision, proposal, gap, discrepancy',
  });
  assert.equal(parseExtraction('{"claims":[{"id":"a","kind":"fact","statement":"x"},{"id":"a","kind":"fact","statement":"y"}]}').ok, false);
  const invalidAction = parseExtraction('{"claims":[{"id":"a","kind":"proposal","statement":"x","action":{"kind":"rm_rf"}}]}');
  assert.ok(invalidAction.ok && invalidAction.ignoredFields[0]!.reasonCode === 'invalid_action_ignored');
});

test('a decision does not carry over to a changed action', () => {
  const proposal = (kind: string) => ({
    id: 'p', kind: 'proposal', validity: 'current', statement: 'Rozesłać harmonogram',
    evidence: [{ sourceId: 'chat', quote: 'Harmonogram wyślę jutro' }], action: { kind, withinScope: true },
  });
  const local = review([proposal('execute_local')]).claims[0]!;
  const decision = recordDecision({ claim: local, snapshot, decision: 'Prepare it locally', evidenceRef: 'user-message:7' });
  assert.equal(review([proposal('execute_local')], {}, [decision]).claims[0]!.decision, 'settled');

  const publish = review([proposal('publish_external')], {}, [decision]).claims[0]!;
  assert.equal(publish.actionDecision?.class, 'ASK');
  assert.equal(publish.decision, 'possibly_settled');
  assert.ok(publish.requiredActions.includes('user_decision'));
});

test('a decision made without a cited source cannot be recorded or inherited', () => {
  const claim = { id: 'm', kind: 'discrepancy', validity: 'current', statement: 'Spór o termin', evidence: [{ sourceId: 'later', quote: 'Termin: marzec' }] };
  const unresolved = review([claim]).claims[0]!;
  assert.throws(() => recordDecision({ claim: unresolved, snapshot, decision: 'Keep', evidenceRef: 'user-message:9' }), /without a snapshot: later/);

  // A hand-built record with an incomplete digest map does not settle the claim either.
  const withLater = [...sources, { id: 'later', text: 'Termin: marzec' }];
  const forged = { id: 'r1', fingerprint: unresolved.fingerprint, evidenceKeys: unresolved.evidenceKeys, sourceDigests: {}, decision: 'Keep', evidenceRef: 'user-message:9', decidedAt: '2026-01-01T00:00:00.000Z' };
  const next = reviewExtraction({ rawOutput: JSON.stringify({ claims: [claim] }), snapshot: snapshotSources(withLater), sources: withLater, decisions: [forged] }).claims[0]!;
  assert.equal(next.evidence, 'supported');
  assert.equal(next.decision, 'reopened');
  assert.ok(next.requiredActions.includes('user_decision'));
});

test('a reopened or uncertain prior decision asks the user for any claim kind', () => {
  const rule = { id: 'r', kind: 'decision', validity: 'current', statement: 'Wdrożenia w piątki', evidence: [{ sourceId: 'rules', quote: 'wdrożenia tylko w piątki' }] };
  const first = review([rule]).claims[0]!;
  assert.deepEqual(first.requiredActions, []);
  const decision = recordDecision({ claim: first, snapshot, decision: 'Confirmed', evidenceRef: 'user-message:3' });

  const amended = sources.map((source) => source.id === 'rules' ? { ...source, text: `${source.text} Wyjątek: święta.` } : source);
  const reopened = reviewExtraction({ rawOutput: JSON.stringify({ claims: [rule] }), snapshot: snapshotSources(amended), sources: amended, decisions: [decision] }).claims[0]!;
  assert.equal(reopened.decision, 'reopened');
  assert.deepEqual(reopened.requiredActions, ['user_decision']);

  const reworded = review([{ ...rule, statement: 'Wdrażamy wyłącznie w piątki' }], {}, [decision]).claims[0]!;
  assert.equal(reworded.decision, 'possibly_settled');
  assert.deepEqual(reworded.requiredActions, ['user_decision']);
});
