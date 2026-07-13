import assert from 'node:assert/strict';
import test from 'node:test';

import { detectStrictScope } from '../src/strict-scope.js';

test('treats Polish strict-scope phrases as absolute', () => {
  assert.deepEqual(detectStrictScope('Popraw tylko literówkę, nic więcej.'), {
    active: true,
    matched: ['tylko', 'nic więcej'],
    mode: 'strict',
  });
});

test('treats English strict-scope commands as absolute', () => {
  const result = detectStrictScope('Just fix the typo, nothing else.');
  assert.equal(result.active, true);
  assert.deepEqual(result.matched, ['just', 'nothing else']);
});

test('does not activate strict scope for descriptive use of only', () => {
  assert.equal(
    detectStrictScope('The report only shows active users.').active,
    false,
  );
});
