# Step Beyond v4 Documentation and Evidence Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align all active documentation and eval scaffolding with the v4 contract, then rebuild the English, Polish, and ChatGPT README surfaces as an evidence-honest professional project page.

**Architecture:** `SPEC.md` remains unchanged as the normative source. Executable documentation-contract tests protect its nine-stage lifecycle and distinguish the eight user-facing capability labels from pipeline stages. Active references, examples, eval scaffolding, and READMEs become derived views; versioned historical reports remain untouched.

**Tech Stack:** Markdown, TypeScript, Node.js 20, `node:test`, `tsx`, PowerShell verification commands.

## Global Constraints

- Preserve the authors' v4 decision to replace the fixed `5/3/1` ceiling with adaptive initiative.
- Do not edit `LICENSE` or `step beyond banner.png`.
- Do not present percentages, host compatibility, or absolute performance claims as measured facts without repeated evidence.
- Keep English, Polish, and ChatGPT claims synchronized while adapting their depth to their audiences.
- Read every file completely before editing it.
- Use one thematic commit per task.

---

### Task 1: Executable lifecycle drift contract

**Files:**
- Modify: `packages/runtime-core/test/documentation-contract.test.ts`
- Modify: `skills/step-beyond/SKILL.md`
- Modify: `skills/step-beyond-chatgpt/SKILL.md`
- Modify: `skills/step-beyond-chatgpt/SKILL_PL.md`

**Interfaces:**
- Consumes: the ordered lifecycle in `SPEC.md` §2.
- Produces: a shared derived lifecycle declaration in each portable skill and a regression test that rejects drift.

- [ ] **Step 1: Add a failing lifecycle contract test**

Add a test that extracts numbered backtick stage names from `SPEC.md` §2 and
requires the exact order in all three skills:

```ts
const expectedLifecycle = ['CONTEXT', 'INTENT', 'DECIDE', 'BUILD', 'INITIATIVE', 'EXECUTE', 'VERIFY', 'DELIVER', 'LEARN'];

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
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npx tsx --test packages/runtime-core/test/documentation-contract.test.ts`

Expected: failure because the lifecycle sentence is absent from the derived skills.

- [ ] **Step 3: Add the canonical lifecycle declaration**

Add the same ordered lifecycle to each skill immediately after its statement that
`SPEC.md` is normative. State that internal reasoning may be compressed but the
semantics and order remain canonical.

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run: `npx tsx --test packages/runtime-core/test/documentation-contract.test.ts`

Expected: all documentation-contract tests pass.

- [ ] **Step 5: Commit**

```text
test: guard canonical v4 lifecycle across skills
```

### Task 2: Migrate active references and examples to v4 semantics

**Files:**
- Modify: `packages/runtime-core/test/documentation-contract.test.ts`
- Modify: `skills/step-beyond/references/onboarding.md`
- Modify: `skills/step-beyond/references/environment-scan.md`
- Modify: `skills/step-beyond/references/subagents.md`
- Modify: `skills/step-beyond/references/domains.md`
- Modify: `examples/README.md`
- Modify: every worked Markdown file under `examples/`

**Interfaces:**
- Consumes: v4 lifecycle, permission classes, adaptive initiative, verification states, and outcome vocabulary from `SPEC.md`.
- Produces: active explanatory material that no longer teaches the v3 pipeline, fixed addition caps, or silent execution beyond permission.

- [ ] **Step 1: Add a failing active-guidance scan test**

Create an explicit list of active reference/example paths and reject legacy
pipeline arrows, `Good (Step Beyond v3)`, current `5/3/1` instructions, and
unlabelled acceptance percentages:

```ts
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
}
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npx tsx --test packages/runtime-core/test/documentation-contract.test.ts`

Expected: failures in onboarding and multiple worked examples.

- [ ] **Step 3: Rewrite derived traces using v4 stages**

Use the ordered trace labels `CONTEXT`, `INTENT`, `DECIDE`, `BUILD`,
`INITIATIVE`, `EXECUTE`, `VERIFY`, `DELIVER`, and `LEARN` when a full trace is
shown. Replace fixed L2/L3 counting with permission-first candidate selection and
mode thresholds. Preserve useful scenario content, but disclose assumptions and
do not silently invent user facts.

- [ ] **Step 4: Remove unsupported active numeric claims**

Delete the `~60%` and `~85%+` onboarding claims and the example `~60%` versus
`~100%` table row. Replace them with `cold-start candidate selection` versus
`memory-informed candidate selection`, explicitly described as unmeasured.

- [ ] **Step 5: Run the focused test and full example search**

Run:

```powershell
npx tsx --test packages/runtime-core/test/documentation-contract.test.ts
rg -n 'RECALL\s*→\s*EXPAND\s*→\s*BUILD|Good \(Step Beyond v3\)|acceptance\s*[~≈]?\s*\d+%' examples skills/step-beyond/references
```

Expected: tests pass; search returns no active legacy matches.

- [ ] **Step 6: Commit**

```text
docs: align active guidance with v4 lifecycle
```

### Task 3: Make evaluation gaps and cross-session memory measurable

**Files:**
- Modify: `packages/runtime-core/test/documentation-contract.test.ts`
- Modify: `evals/README.md`
- Modify: `evals/cases.md`
- Modify: `evals/results/TEMPLATE.md`

**Interfaces:**
- Consumes: the existing five-repetition CI guidance and twenty-run default for publishable claims.
- Produces: a result schema with date/model/version/N/pass-N fields, explicit `NOT RUN` coverage, and memory cases that require distinct sessions and persistence evidence.

- [ ] **Step 1: Add a failing eval-document contract test**

```ts
test('eval template exposes repetition and coverage evidence', async () => {
  const template = await read('evals/results/TEMPLATE.md');
  for (const term of ['Provider', 'Model / version', 'Date', 'N', 'Pass / N', 'NOT RUN']) {
    assert.match(template, new RegExp(term, 'iu'));
  }
});
```

Also require `evals/cases.md` to contain `Session A`, `Session B`, `persistence
evidence`, and separate pass/fail criteria.

```ts
const cases = await read('evals/cases.md');
for (const term of ['Session A', 'Session B', 'persistence evidence', 'PASS:', 'FAIL:']) {
  assert.match(cases, new RegExp(term, 'iu'));
}
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npx tsx --test packages/runtime-core/test/documentation-contract.test.ts`

Expected: template and memory-case requirements are absent.

- [ ] **Step 3: Update the eval contract and template**

Keep the stronger repetition guidance already in `evals/README.md`, and make clear
that a release gate cannot use a case with fewer than three independent runs even
when a lower-cost exploratory run is recorded. Add report metadata and a coverage
matrix enumerating A1–A6, B1–B3, C1–C4, and D1–D3 as `NOT RUN` by default.

- [ ] **Step 4: Define cross-session memory cases**

For each Series C case, specify:

```text
Session A: observable event and expected persisted record
Session B: fresh context that loads the store
PASS: output and persistence evidence required
FAIL: re-asking known facts, applying banned behavior, or mutating memory from silence
```

Do not record outcomes in the case catalog.

- [ ] **Step 5: Verify**

Run: `npx tsx --test packages/runtime-core/test/documentation-contract.test.ts`

Expected: all documentation-contract tests pass.

- [ ] **Step 6: Commit**

```text
evals: expose repetition and cross-session evidence gaps
```

### Task 4: Define host-native capability ownership

**Files:**
- Modify: `packages/runtime-core/test/documentation-contract.test.ts`
- Modify: `skills/step-beyond/references/adapters.md`

**Interfaces:**
- Consumes: adapter capability surface and conformance modes from `SPEC.md`.
- Produces: deterministic ownership rules that prevent duplicate memory and verification in Claude Code and Cursor.

- [ ] **Step 1: Add a failing adapter documentation test**

Require the headings `When the host already has memory, verification, or skills`,
`Claude Code`, `Cursor`, and the phrases `one owner per record` and `one
verification record per material claim`:

```ts
test('adapter guidance assigns one owner to host-native capabilities', async () => {
  const adapters = await read('skills/step-beyond/references/adapters.md');
  for (const term of [
    'When the host already has memory, verification, or skills',
    'Claude Code',
    'Cursor',
    'one owner per record',
    'one verification record per material claim',
  ]) assert.match(adapters, new RegExp(term, 'iu'));
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npx tsx --test packages/runtime-core/test/documentation-contract.test.ts`

- [ ] **Step 3: Add responsibility and host tables**

Define host facilities as transport/execution, Step Beyond as policy, current
project files as project facts, and one selected store as the user-model owner.
For Claude Code, prefer explicit project instructions for project facts and use
MCP/native memory only if provenance/correction/deletion are observable. For
Cursor, treat project rules as instructions rather than learned user memory and
route editor diagnostics into the single verification ledger. Never run a second
VERIFY pass merely because both host and Step Beyond expose verification.

- [ ] **Step 4: Verify and commit**

Run: `npx tsx --test packages/runtime-core/test/documentation-contract.test.ts`

Commit:

```text
docs: define host-native capability ownership
```

### Task 5: Turn slop guidance into operational detectors

**Files:**
- Modify: `packages/runtime-core/test/documentation-contract.test.ts`
- Modify: `skills/step-beyond/references/slop.md`

**Interfaces:**
- Consumes: the existing text, code, web/design, image, and data/chart pattern inventory.
- Produces: consistent `Pattern | Detect | Repair` tables and a contextual scan procedure.

- [ ] **Step 1: Add a failing slop-reference test**

Require each domain section to contain a Markdown table header matching:

```text
| Pattern | Detect | Repair |
```

Require the domains `Text`, `Code`, `Web / Design`, `Image`, and `Data / Chart`.

```ts
test('slop reference defines detection and repair per domain', async () => {
  const slop = await read('skills/step-beyond/references/slop.md');
  for (const domain of ['Text', 'Code', 'Web / Design', 'Image', 'Data / Chart']) {
    const section = slop.match(new RegExp(`## \\d+\\. ${domain}(?<body>[\\s\\S]*?)(?=\\n## \\d+\\.|$)`, 'u'))?.groups?.body ?? '';
    assert.match(section, /\| Pattern \| Detect \| Repair \|/u, `${domain} needs an operational table`);
  }
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npx tsx --test packages/runtime-core/test/documentation-contract.test.ts`

- [ ] **Step 3: Convert each pattern to an operational entry**

Preserve the existing pattern names. For every row, state observable evidence
such as a phrase match, repeated structure, unused symbol, missing label, invalid
link, visual artifact, or unsupported placeholder; then state the smallest repair.
Remove arbitrary style quotas and replace them with context-aware detection.

- [ ] **Step 4: Verify and commit**

Run: `npx tsx --test packages/runtime-core/test/documentation-contract.test.ts`

Commit:

```text
docs: make slop detection operational
```

### Task 6: Rebuild and synchronize the README surfaces

**Files:**
- Modify: `packages/runtime-core/test/documentation-contract.test.ts`
- Modify: `README.md`
- Modify: `README_PL.md`
- Modify: `README_CHATGPT.md`

**Interfaces:**
- Consumes: the v4 design, canonical lifecycle, runtime API docs, eval limitations, and the user-approved capability panel.
- Produces: professional EN/PL landing pages and a concise ChatGPT page with equivalent claims.

- [ ] **Step 1: Add failing README parity tests**

Require all three files to contain `4.0.0-alpha.2`, the canonical lifecycle, all
eight capability labels, `prompt-only`, `runtime-backed`, and an evidence-limits
link to `evals/README.md`. Require the EN and PL files to contain the exact AI
Evolution Polska URLs and the English attribution footer requested by the user.

```ts
test('README surfaces share version capabilities lifecycle and evidence limits', async () => {
  const files = await Promise.all(['README.md', 'README_PL.md', 'README_CHATGPT.md'].map(read));
  for (const content of files) {
    for (const term of ['4.0.0-alpha.2', 'RECALL', 'SCAN', 'EXPAND', 'POLISH', 'EXTEND', 'ANTICIPATE', 'VERIFY', 'SELF-IMPROVE', 'prompt-only', 'runtime-backed']) {
      assert.match(content, new RegExp(term, 'u'));
    }
    assert.match(content, /CONTEXT → INTENT → DECIDE → BUILD → INITIATIVE → EXECUTE → VERIFY → DELIVER → LEARN/u);
    assert.match(content, /evals\/README\.md/u);
  }
  for (const content of files.slice(0, 2)) {
    assert.match(content, /https:\/\/www\.aievolutionpolska\.pl\//u);
    assert.match(content, /https:\/\/aievolutionlabs\.io\//u);
    assert.match(content, /Created with obsessive attention to detail by/u);
  }
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npx tsx --test packages/runtime-core/test/documentation-contract.test.ts`

- [ ] **Step 3: Write the English README**

Use this capability mapping:

```text
RECALL       → CONTEXT
SCAN         → CONTEXT
EXPAND       → INTENT + DECIDE
POLISH       → BUILD
EXTEND       → INITIATIVE + EXECUTE
ANTICIPATE   → INITIATIVE + DECIDE
VERIFY       → VERIFY
SELF-IMPROVE → LEARN
```

Follow the approved information architecture. Preserve the banner. Describe
mechanisms rather than promising outcomes. Link the runtime, spec, skills, eval
contract, and historical results with clear evidence labels.

- [ ] **Step 4: Write Polish and ChatGPT counterparts**

Mirror the English claims in natural Polish. Keep ChatGPT concise and explicitly
prompt-only unless an external runtime is connected. Include the capability map
so users do not mistake the labels for a second lifecycle.

- [ ] **Step 5: Run parity and unsupported-claim checks**

Run:

```powershell
npx tsx --test packages/runtime-core/test/documentation-contract.test.ts
rg -n '70.?90|85%|100%|zero broken|works everywhere|verified on' README.md README_PL.md README_CHATGPT.md
```

Expected: tests pass; search returns no unsupported claims.

- [ ] **Step 6: Commit**

```text
docs: rebuild professional v4 README surfaces
```

### Task 7: Release metadata and final verification

**Files:**
- Modify: `CHANGELOG.md`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `packages/runtime-core/package.json`
- Modify: `packages/runtime-store/package.json`
- Modify: `packages/adapter-reference/package.json`
- Modify: `evals/runner/package.json`
- Modify: `skills/step-beyond/SKILL.md`
- Modify: `skills/step-beyond-chatgpt/SKILL.md`
- Modify: `skills/step-beyond-chatgpt/SKILL_PL.md`

**Interfaces:**
- Consumes: all completed documentation and evidence improvements.
- Produces: consistent `4.0.0-alpha.2` metadata and a changelog entry that distinguishes verified checks from unmeasured behavior.

- [ ] **Step 1: Add the alpha.2 changelog entry**

Record lifecycle alignment, eval scaffolding, host ownership guidance, operational
slop checks, and README rebuild. State that behavioral acceptance and follow-up
effects remain unmeasured by this documentation release.

- [ ] **Step 2: Update version metadata mechanically**

Run `npm version 4.0.0-alpha.2 --no-git-tag-version`, then update workspace
package versions and internal dependency constraints to the same version. Update
the three skill frontmatters.

- [ ] **Step 3: Run full verification**

Run:

```powershell
npm run validate
git diff --check
rg -n '4\.0\.0-alpha\.1' package.json package-lock.json packages skills README.md README_PL.md README_CHATGPT.md CHANGELOG.md
rg -n 'RECALL\s*→\s*EXPAND\s*→\s*BUILD|CEILING:\s*5 total' examples skills/step-beyond/references README.md README_PL.md README_CHATGPT.md
git status --short
```

Expected: `validate` exits 0, no whitespace errors, no stale active version or
pipeline matches, and status contains only intended release files.

- [ ] **Step 4: Commit**

```text
chore: release v4.0.0-alpha.2 documentation polish
```

- [ ] **Step 5: Review commit structure and evidence**

Run `git log --oneline main..HEAD` and confirm each problem is isolated in its
own commit. Re-read the design document and report any unverified behavior or
remaining host/eval work as limitations rather than completion claims.
