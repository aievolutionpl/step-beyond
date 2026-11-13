import assert from 'node:assert/strict';
import test from 'node:test';

import { EXTRACTION_INSTRUCTION, ReferenceAdapter, runEvidenceReview } from '../src/index.js';

test('detects and caches real capabilities', () => {
  let detections = 0;
  const adapter = new ReferenceAdapter({
    detect: () => { detections++; return { executeLocal: true, persistMemory: false, publishExternal: true }; },
    executeLocal: async () => ({ ok: true }),
    publishExternal: async () => ({ id: 'published' }),
  });
  assert.deepEqual(adapter.capabilities(), adapter.capabilities());
  assert.equal(detections, 1);
});

test('degrades honestly when execution is absent', async () => {
  const adapter = new ReferenceAdapter({ detect: () => ({ executeLocal: false, persistMemory: false, publishExternal: false }) });
  const result = await adapter.executeLocal({ command: 'test' });
  assert.deepEqual(result, { status: 'unavailable', verified: false, reason: 'execute_local capability is unavailable' });
});

test('requires an explicit permission reference before publication', async () => {
  const adapter = new ReferenceAdapter({
    detect: () => ({ executeLocal: false, persistMemory: false, publishExternal: true }),
    publishExternal: async () => ({ id: 'published' }),
  });
  await assert.rejects(adapter.publishExternal({ body: 'hello' }), /permission/i);
  assert.deepEqual(await adapter.publishExternal({ body: 'hello' }, 'permission:123'), { id: 'published' });
});

// --- Evidence review flow (synthetic fixtures) ----------------------------

const docs = [{ id: 'chat', text: 'Użytkownik: zostajemy przy PostgreSQL. Asystent: można też rozważyć SQLite.' }];
const answer = JSON.stringify({ claims: [
  { id: 'c1', kind: 'decision', validity: 'current', author: 'user', statement: 'Zostajemy przy PostgreSQL', evidence: [{ sourceId: 'chat', quote: 'zostajemy przy PostgreSQL' }] },
  { id: 'c2', kind: 'proposal', validity: 'current', author: 'assistant', statement: 'Rozważyć SQLite', evidence: [{ sourceId: 'chat', quote: 'można też rozważyć SQLite' }] },
] });

test('runs the full flow and stops at a report for a human', async () => {
  let tick = 1_000;
  const seen: string[] = [];
  const { review, run, snapshot } = await runEvidenceReview({
    readSources: async () => docs,
    callModel: async (call) => {
      seen.push(call.instruction);
      tick += 250;
      return { rawOutput: answer, model: 'example-model-1', parameters: { temperature: 0 }, usage: { inputTokens: 120, outputTokens: 40 } };
    },
    now: () => tick,
  });
  assert.deepEqual(seen, [EXTRACTION_INSTRUCTION]);
  assert.deepEqual(snapshot.map((item) => item.id), ['chat']);
  assert.equal(review.status, 'ready_for_review');
  assert.equal(review.executionAuthorized, false);
  assert.deepEqual(review.claims.map((claim) => [claim.author, claim.evidence, claim.requiredActions]), [
    ['user', 'supported', []],
    ['assistant', 'supported', ['user_decision']],
  ]);
  assert.deepEqual(run, {
    model: 'example-model-1', parameters: { temperature: 0 }, usage: { inputTokens: 120, outputTokens: 40 },
    startedAt: new Date(1_000).toISOString(), durationMs: 250, limitations: [],
  });
});

test('records what limits reproducibility when the model is not identified', async () => {
  const { run } = await runEvidenceReview({ readSources: async () => docs, callModel: async () => ({ rawOutput: answer }) });
  assert.equal(run.model, null);
  assert.deepEqual(run.limitations, ['model identifier was not recorded', 'call parameters were not recorded']);
});

test('holds the result when a source changes while the model is running', async () => {
  let reads = 0;
  const { review } = await runEvidenceReview({
    readSources: async () => (reads++ === 0 ? docs : [{ id: 'chat', text: 'Użytkownik: jednak SQLite.' }]),
    callModel: async () => ({ rawOutput: answer, model: 'example-model-1' }),
  });
  assert.equal(review.status, 'stale_sources');
  assert.deepEqual(review.changedSources, ['chat']);
  assert.deepEqual(review.claims, []);
});
