import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classifyAction,
  resolveIntent,
  scoreInitiative,
  selectInitiatives,
  type InitiativeCandidate,
  type IntentHypothesis,
} from '../src/index.js';

const hypothesis = (overrides: Partial<IntentHypothesis> = {}): IntentHypothesis => ({
  id: crypto.randomUUID(),
  goal: 'Produce a reviewed local change',
  expectedResult: 'A patch',
  audience: 'User',
  constraints: [],
  definitionOfDone: ['patch created'],
  missingInformation: [],
  confidence: 0.9,
  mistakeCost: 0.2,
  evidenceRefs: ['user:current'],
  ...overrides,
});

test('requires at least two materially distinct intent hypotheses', () => {
  assert.throws(() => resolveIntent([hypothesis()], []), /at least two/i);
  const duplicate = hypothesis({ id: 'b' });
  assert.throws(() => resolveIntent([hypothesis({ id: 'a' }), duplicate], []), /distinct/i);
});

test('acts on high-confidence low-cost local intent', () => {
  const a = hypothesis({ id: 'a' });
  const b = hypothesis({ id: 'b', goal: 'Explain the patch', confidence: 0.4 });
  assert.equal(resolveIntent([a, b], [{ kind: 'execute_local', reversible: true }]).kind, 'act');
});

test('uses one clarification question for low confidence', () => {
  const result = resolveIntent([
    hypothesis({ id: 'a', confidence: 0.3, mistakeCost: 0.7 }),
    hypothesis({ id: 'b', goal: 'Publish a release', confidence: 0.3, mistakeCost: 0.9 }),
  ], []);
  assert.equal(result.kind, 'clarify');
  assert.equal(result.questions.length, 1);
});

test('permission gate classifies publication, exfiltration, and local reads', () => {
  assert.equal(classifyAction({ kind: 'read_project', withinScope: true }).class, 'AUTO');
  assert.equal(classifyAction({ kind: 'publish_external', withinScope: true }).class, 'ASK');
  assert.equal(classifyAction({ kind: 'exfiltrate_secret', withinScope: true }).class, 'FORBIDDEN');
});

const candidate = (overrides: Partial<InitiativeCandidate> = {}): InitiativeCandidate => ({
  id: 'candidate',
  action: { kind: 'execute_local', withinScope: true, reversible: true },
  expectedValue: 0.9,
  confidence: 0.9,
  reversibility: 1,
  verifiability: 1,
  estimatedCost: 0.2,
  risk: 0.1,
  historicalAccuracy: 1,
  rationale: 'Closes the observed failure path',
  ...overrides,
});

test('scores normalized initiative and filters permission before score', () => {
  assert.equal(scoreInitiative(candidate()), 1);
  const selected = selectInitiatives([
    candidate(),
    candidate({ id: 'public', action: { kind: 'publish_external', withinScope: true }, estimatedCost: 0 }),
  ], 'standard');
  assert.deepEqual(selected.selected, ['candidate']);
  assert.deepEqual(selected.requiresPermission, ['public']);
});

test('strict mode suppresses actions and proposals regardless of score', () => {
  const result = selectInitiatives([candidate()], 'strict');
  assert.deepEqual(result.selected, []);
  assert.deepEqual(result.proposed, []);
  assert.deepEqual(result.rejected, ['candidate']);
});
