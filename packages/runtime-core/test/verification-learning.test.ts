import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyLearningEvent,
  createVerificationRecord,
  proposeHeuristicRevision,
  renderVerifiedClaims,
} from '../src/index.js';

test('derives all three verification states without deleting the artifact', () => {
  assert.equal(createVerificationRecord({ claim: 'tests pass', checkExecuted: true, result: 'pass', unchecked: [] }).status, 'verified');
  assert.equal(createVerificationRecord({ claim: 'integration works', checkExecuted: true, result: 'pass', unchecked: ['external API'] }).status, 'partially_verified');
  assert.equal(createVerificationRecord({ claim: 'deployment works', checkExecuted: false, result: 'not_run', unchecked: ['deployment'] }).status, 'unverified');

  const output = renderVerifiedClaims('artifact-content', [
    createVerificationRecord({ claim: 'deployment works', checkExecuted: false, result: 'not_run', unchecked: ['deployment'] }),
  ]);
  assert.equal(output.artifact, 'artifact-content');
  assert.deepEqual(output.claims, []);
});

test('unknown learning outcome is neutral', () => {
  const state = { accepts: 2, rejects: 1, adopted: 0, reverted: 0, corrected: 0, ignored: 0 };
  assert.deepEqual(applyLearningEvent(state, { outcome: 'unknown', subjectRef: 'x', evidenceRef: 'none' }), state);
});

test('global heuristic revision needs multiple eligible events and starts proposed', () => {
  assert.equal(proposeHeuristicRevision('h1', [{ outcome: 'explicit_accept', subjectRef: 'h1', evidenceRef: 'a' }]), null);
  const revision = proposeHeuristicRevision('h1', [
    { outcome: 'explicit_accept', subjectRef: 'h1', evidenceRef: 'a' },
    { outcome: 'adopted', subjectRef: 'h1', evidenceRef: 'b' },
    { outcome: 'explicit_accept', subjectRef: 'h1', evidenceRef: 'c' },
  ]);
  assert.equal(revision?.status, 'proposed');
});
