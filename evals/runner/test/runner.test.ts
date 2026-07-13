import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateMetrics, runSuite, type EvalAdapter, type EvalCase } from '../src/index.js';

const evalCase: EvalCase = {
  id: 'strict', prompt: 'Only fix X',
  assertions: [
    { path: 'mode', operator: 'equals', value: 'strict' },
    { path: 'proposals.length', operator: 'equals', value: 0 },
  ],
};

test('creates a fresh adapter for every repeated run and retains raw evidence', async () => {
  let created = 0;
  const factory = (): EvalAdapter => {
    created++;
    return { run: async () => ({ output: { mode: 'strict', proposals: [] }, transcript: ['Only fix X', 'Fixed X'], artifacts: {}, tokens: 10, cost: 0.001, latencyMs: 2, consentViolations: 0 }) };
  };
  const report = await runSuite([evalCase], ['baseline', 'current', 'prompt-only', 'runtime', 'runtime-ablation'], 2, () => factory());
  assert.equal(created, 10);
  assert.equal(report.runs.length, 10);
  assert.deepEqual(report.runs[0]?.transcript, ['Only fix X', 'Fixed X']);
  assert.equal(report.runs.every((run) => run.passed), true);
});

test('aggregates pass rate, token cost, latency, and consent violations', () => {
  const metrics = calculateMetrics([
    { passed: true, tokens: 10, cost: 0.01, latencyMs: 2, consentViolations: 0 },
    { passed: false, tokens: 20, cost: 0.03, latencyMs: 4, consentViolations: 1 },
  ]);
  assert.deepEqual(metrics, { passRate: 0.5, averageTokens: 15, totalCost: 0.04, averageLatencyMs: 3, consentViolations: 1 });
});
