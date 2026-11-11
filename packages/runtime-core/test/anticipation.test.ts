import assert from 'node:assert/strict';
import test from 'node:test';

import {
  decideTurn,
  planNextMoves,
  predictFromTrajectories,
  predictionAccuracy,
  updatePredictionAccuracy,
  type IntentHypothesis,
  type NextMovePrediction,
} from '../src/index.js';

const local = { kind: 'execute_local', withinScope: true, reversible: true } as const;
const prediction = (overrides: Partial<NextMovePrediction> & { id: string }): NextMovePrediction => ({
  description: overrides.id, source: 'trajectory', action: local,
  confidence: 0.9, expectedValue: 0.8, effort: 0.1, separable: true, ...overrides,
});

test('confident, cheap, separable local prediction is done ahead', () => {
  const plan = planNextMoves([prediction({ id: 'tests' })], 'standard');
  assert.deepEqual(plan.doAhead, ['tests']);
  assert.ok(plan.decisions.tests!.reasonCodes.includes('confident_cheap_separable'));
});

test('no confidence lets a prediction bypass permission', () => {
  const plan = planNextMoves([
    prediction({ id: 'deploy', source: 'explicit', confidence: 1, action: { kind: 'publish_external', withinScope: true } }),
    prediction({ id: 'leak', confidence: 1, action: { kind: 'exfiltrate_secret' } }),
  ], 'exploratory');
  assert.deepEqual(plan.doAhead, []);
  assert.deepEqual(plan.propose, ['deploy']);
  assert.deepEqual(plan.hold, ['leak']);
});

test('large or inseparable predictions are staged instead of applied', () => {
  const plan = planNextMoves([
    prediction({ id: 'big', effort: 0.9 }),
    prediction({ id: 'entangled', separable: false }),
  ], 'exploratory');
  assert.deepEqual(plan.doAhead, []);
  assert.deepEqual(plan.prepare.sort(), ['big', 'entangled']);
});

test('weak sources are offered or held, never executed', () => {
  const plan = planNextMoves([
    prediction({ id: 'guess', source: 'domain_prior', confidence: 0.7 }),
    prediction({ id: 'noise', source: 'domain_prior', confidence: 0.3 }),
  ], 'standard');
  assert.deepEqual(plan.doAhead, []);
  assert.deepEqual(plan.propose, ['guess']);
  assert.deepEqual(plan.hold, ['noise']);
});

test('strict scope holds every prediction', () => {
  const plan = planNextMoves([prediction({ id: 'tests' })], 'strict');
  assert.deepEqual(plan.hold, ['tests']);
  assert.deepEqual(plan.decisions.tests!.reasonCodes, ['strict_scope']);
});

test('attention budget demotes overflow instead of piling up extras', () => {
  const plan = planNextMoves(['a', 'b', 'c'].map((id) => prediction({ id })), 'fast');
  assert.equal(plan.doAhead.length, 1);
  assert.equal(plan.prepare.length, 0);
  assert.equal(plan.propose.length, 1);
  assert.equal(plan.hold.length, 1);
});

test('poor track record lowers the rung', () => {
  const trusted = planNextMoves([prediction({ id: 'x', historicalAccuracy: 1 })], 'standard');
  const doubted = planNextMoves([prediction({ id: 'x', historicalAccuracy: 0.5 })], 'standard');
  assert.deepEqual(trusted.doAhead, ['x']);
  assert.deepEqual(doubted.doAhead, []);
});

test('trajectories predict the next step from the session tail', () => {
  const predicted = predictFromTrajectories(
    ['Landing page', 'OG image'],
    [
      { sequence: ['landing page', 'og image', 'deploy preview'], seen: 4 },
      { sequence: ['landing page', 'contact form'], seen: 1 },
      { sequence: ['logo', 'brand book'], seen: 9 },
    ],
  );
  assert.equal(predicted[0]!.step, 'deploy preview');
  assert.equal(predicted[0]!.matched, 2);
  assert.ok(predicted[0]!.confidence > 0.6);
  assert.ok(!predicted.some((item) => item.step === 'brand book'));
  assert.deepEqual(predictFromTrajectories([], [{ sequence: ['a', 'b'], seen: 3 }]), []);
});

test('steps already done in the session are not predicted again', () => {
  const predicted = predictFromTrajectories(['a', 'b', 'a'], [{ sequence: ['a', 'b'], seen: 5 }]);
  assert.deepEqual(predicted, []);
});

test('calibration learns from observable outcomes only', () => {
  let state = { hits: 0, misses: 0 };
  assert.equal(predictionAccuracy(state), 0.5);
  state = updatePredictionAccuracy(state, 'unknown');
  assert.deepEqual(state, { hits: 0, misses: 0 });
  state = updatePredictionAccuracy(state, 'adopted');
  state = updatePredictionAccuracy(state, 'explicit_accept');
  assert.equal(predictionAccuracy(state), 0.75);
  state = updatePredictionAccuracy(state, 'ignored');
  assert.equal(state.misses, 0.5);
  state = updatePredictionAccuracy(state, 'reverted');
  assert.ok(predictionAccuracy(state) < 0.75);
});

const hypotheses = (confidence: number): IntentHypothesis[] => [
  { id: 'edit', goal: 'Edit locally', expectedResult: 'patch', audience: 'user', constraints: [], definitionOfDone: ['patch'], missingInformation: [], confidence, mistakeCost: 0.1, evidenceRefs: ['user:1'] },
  { id: 'explain', goal: 'Explain only', expectedResult: 'answer', audience: 'user', constraints: [], definitionOfDone: ['answer'], missingInformation: [], confidence: 0.2, mistakeCost: 0.1, evidenceRefs: ['user:1'] },
];

test('turn controller plans next moves and respects strict scope and blocked intent', () => {
  const base = { operations: [local], candidates: [], verification: [], predictions: [prediction({ id: 'tests' })] };
  const open = decideTurn({ ...base, message: 'Add the parser', hypotheses: hypotheses(0.9) });
  assert.deepEqual(open.nextMoves.doAhead, ['tests']);

  const strict = decideTurn({ ...base, message: 'Popraw tylko literówkę, nic więcej.', hypotheses: hypotheses(0.9) });
  assert.deepEqual(strict.nextMoves.hold, ['tests']);

  const unclear = decideTurn({ ...base, message: 'Make it better', hypotheses: hypotheses(0.3) });
  assert.equal(unclear.intent.kind, 'clarify');
  assert.deepEqual(unclear.nextMoves.doAhead, []);

  const fast = decideTurn({ ...base, message: 'Add the parser', hypotheses: hypotheses(0.9), mode: 'fast' });
  assert.equal(fast.mode, 'fast');
});
