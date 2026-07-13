import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { JsonUserModelStore } from '../src/index.js';

const entry = (value = 'Polish replies') => ({
  id: 'pref-1', kind: 'preference' as const, value, source: 'user', sourceRef: 'turn:1',
  createdAt: '2026-07-13T00:00:00.000Z', updatedAt: '2026-07-13T00:00:00.000Z',
  scope: 'global', confidence: 1, confirmations: 1, lastUsedAt: null,
  revalidateAt: null, origin: 'explicit' as const, sensitivity: 'normal' as const,
  status: 'active' as const,
});

test('persists isolated namespaces and reloads atomically', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'step-beyond-'));
  const a = new JsonUserModelStore(dir, 'user-a');
  await a.append(entry());
  const b = new JsonUserModelStore(dir, 'user-b');
  assert.equal((await a.list()).length, 1);
  assert.equal((await b.list()).length, 0);
  assert.equal((await new JsonUserModelStore(dir, 'user-a').list())[0]?.value, 'Polish replies');
});

test('rejects likely credentials before persistence', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'step-beyond-'));
  const store = new JsonUserModelStore(dir, 'user-a');
  await assert.rejects(store.append(entry('sk-live-secret-value')), /sensitive value/i);
  assert.deepEqual(await store.list(), []);
});

test('records correction deletion and rollback in the audit log', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'step-beyond-'));
  const store = new JsonUserModelStore(dir, 'user-a');
  await store.append(entry());
  const correction = await store.correct('pref-1', 'English replies', 'user correction');
  await store.remove('pref-1', 'user deletion');
  assert.equal((await store.list()).length, 0);
  await store.rollback(correction.revision);
  assert.equal((await store.list({ includeDeleted: true }))[0]?.value, 'Polish replies');
  assert.ok((await store.audit()).length >= 4);
  const log = await readFile(join(dir, 'user-a.audit.jsonl'), 'utf8');
  assert.match(log, /correct/);
  assert.match(log, /rollback/);
});
