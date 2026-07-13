import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path: string) => readFile(path, 'utf8');

test('normative spec contains hybrid policy vocabulary', async () => {
  const spec = await read('SPEC.md');
  for (const term of ['AUTO_WITH_DISCLOSURE', 'partially_verified', 'unknown', 'IntentHypothesis']) {
    assert.match(spec, new RegExp(term), `SPEC.md must define ${term}`);
  }
});

test('portable instructions do not retain fixed 5/3/1 or STOP-bypass semantics', async () => {
  const [skill, core, chatgpt, chatgptCore] = await Promise.all([
    read('skills/step-beyond/SKILL.md'),
    read('skills/step-beyond/templates/core-injection.txt'),
    read('skills/step-beyond-chatgpt/SKILL.md'),
    read('skills/step-beyond-chatgpt/templates/chatgpt-core-instruction.txt'),
  ]);
  for (const content of [skill, core, chatgpt, chatgptCore]) {
    assert.doesNotMatch(content, /CEILING:\s*5 total/iu);
    assert.doesNotMatch(content, /PROPOSE stays|MUST NOT be suppressed by STOP/iu);
    assert.match(content, /strict scope/iu);
  }
  assert.ok(core.trim().split(/\s+/u).length < 350, 'core injection must stay below 350 words');
  assert.ok(skill.split(/\r?\n/u).length < 150, 'portable skill must stay below 150 lines');
});

test('README does not present targets or host matrices as verified results', async () => {
  const readme = await read('README.md');
  assert.doesNotMatch(readme, /eliminates 70[–-]90%/iu);
  assert.doesNotMatch(readme, /Verified targets:/iu);
  assert.match(readme, /runtime-backed/iu);
});
