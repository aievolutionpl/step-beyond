import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path: string) => readFile(path, 'utf8');

const expectedLifecycle = [
  'CONTEXT',
  'INTENT',
  'DECIDE',
  'BUILD',
  'INITIATIVE',
  'EXECUTE',
  'VERIFY',
  'DELIVER',
  'LEARN',
];

test('normative spec contains hybrid policy vocabulary', async () => {
  const spec = await read('SPEC.md');
  for (const term of ['AUTO_WITH_DISCLOSURE', 'partially_verified', 'unknown', 'IntentHypothesis']) {
    assert.match(spec, new RegExp(term), `SPEC.md must define ${term}`);
  }
});

test('derived skills declare the canonical lifecycle without redefining it', async () => {
  const spec = await read('SPEC.md');
  const lifecycleSection = spec.match(/## 2\. Turn lifecycle(?<body>[\s\S]*?)## 3\./u)?.groups?.body ?? '';
  const lifecycle = [...lifecycleSection.matchAll(/^\d+\. `([A-Z]+)`/gmu)].map((match) => match[1]);
  assert.deepEqual(lifecycle, expectedLifecycle);

  const declaration = lifecycle.join(' → ');
  const files = await Promise.all([
    read('skills/step-beyond/SKILL.md'),
    read('skills/step-beyond-chatgpt/SKILL.md'),
    read('skills/step-beyond-chatgpt/SKILL_PL.md'),
  ]);
  for (const content of files) assert.ok(content.includes(declaration));
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

test('active guidance does not teach the legacy v3 pipeline or unsupported rates', async () => {
  const activeGuidancePaths = [
    'skills/step-beyond/references/onboarding.md',
    'skills/step-beyond/references/environment-scan.md',
    'skills/step-beyond/references/subagents.md',
    'skills/step-beyond/references/domains.md',
    'examples/README.md',
    'examples/chatgpt-agent-mode.md',
    'examples/codebase-onboarding.md',
    'examples/code-development.md',
    'examples/content-creation.md',
    'examples/image-generation.md',
    'examples/memory-learning.md',
    'examples/research-analysis.md',
    'examples/self-improvement-loop.md',
    'examples/web-development.md',
  ];
  const activeGuidance = await Promise.all(activeGuidancePaths.map(read));
  for (const content of activeGuidance) {
    assert.doesNotMatch(content, /RECALL\s*→\s*EXPAND\s*→\s*BUILD/iu);
    assert.doesNotMatch(content, /Good \(Step Beyond v3\)/iu);
    assert.doesNotMatch(content, /acceptance\s*[~≈]?\s*\d+%/iu);
    assert.doesNotMatch(content, /CEILING:\s*5 total|5 additions across ALL agents/iu);
  }
});
