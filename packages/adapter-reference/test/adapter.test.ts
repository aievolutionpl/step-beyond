import assert from 'node:assert/strict';
import test from 'node:test';

import { ReferenceAdapter } from '../src/index.js';

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
