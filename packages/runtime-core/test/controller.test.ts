import assert from 'node:assert/strict';
import test from 'node:test';

import { assembleContext, decideTurn, type IntentHypothesis } from '../src/index.js';

const hypotheses: IntentHypothesis[] = [
  {
    id: 'edit', goal: 'Edit locally', expectedResult: 'patch', audience: 'user',
    constraints: [], definitionOfDone: ['patch'], missingInformation: [],
    confidence: 0.9, mistakeCost: 0.1, evidenceRefs: ['user:1'],
  },
  {
    id: 'explain', goal: 'Explain only', expectedResult: 'answer', audience: 'user',
    constraints: [], definitionOfDone: ['answer'], missingInformation: [],
    confidence: 0.4, mistakeCost: 0.1, evidenceRefs: ['user:1'],
  },
];

test('keeps project facts separate and preserves provenance', () => {
  const context = assembleContext({
    instruction: 'Fix it',
    userEntries: [{ id: 'u1', kind: 'preference', value: 'Polish', source: 'user', confidence: 1 }],
    projectFacts: [{ id: 'p1', value: 'TypeScript', source: 'package.json' }],
  });
  assert.equal(context.userEntries.length, 1);
  assert.equal(context.projectFacts.length, 1);
  assert.equal(context.sources.get('p1'), 'package.json');
});

test('assembles only the most relevant context within the token budget', () => {
  const context = assembleContext({
    instruction: 'Fix the TypeScript parser',
    maxContextTokens: 12,
    userEntries: [
      { id: 'u1', kind: 'preference', value: 'Use Polish', source: 'user', confidence: 1, relevance: 0.8, tokenCost: 4 },
      { id: 'u2', kind: 'preference', value: 'Old image preference', source: 'user', confidence: 1, relevance: 0.1, tokenCost: 6 },
    ],
    projectFacts: [
      { id: 'p1', value: 'TypeScript parser package', source: 'package.json', relevance: 1, tokenCost: 8 },
    ],
  });
  assert.deepEqual(context.projectFacts.map((entry) => entry.id), ['p1']);
  assert.deepEqual(context.userEntries.map((entry) => entry.id), ['u1']);
  assert.equal(context.estimatedTokens, 12);
  assert.deepEqual(context.omitted, ['u2']);
});

test('strict turn has no optional actions or proposals', () => {
  const result = decideTurn({
    message: 'Popraw tylko literówkę, nic więcej.', hypotheses,
    operations: [{ kind: 'execute_local', withinScope: true, reversible: true }],
    candidates: [], verification: [],
  });
  assert.equal(result.mode, 'strict');
  assert.deepEqual(result.initiatives.selected, []);
  assert.deepEqual(result.initiatives.proposed, []);
});
