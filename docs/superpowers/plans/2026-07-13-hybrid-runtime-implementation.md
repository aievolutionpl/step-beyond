# Hybrid Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dependency-light TypeScript reference runtime that enforces Step Beyond intent, permission, initiative, memory, verification, and learning policies and provides a repeatable evaluation harness.

**Architecture:** A pure `runtime-core` package owns deterministic decisions; `runtime-store` owns auditable JSON persistence; `adapter-reference` maps host capabilities; and `eval-runner` executes machine-readable cases. The portable skill remains responsible for semantic hypothesis generation and response composition, while documentation is updated to distinguish prompt-only guidance from runtime-backed guarantees.

**Tech Stack:** Node.js 20+, TypeScript 5, `node:test`, `tsx`, JSON/JSONL, npm workspaces; no production dependencies.

## Global Constraints

- `SPEC.md` is the only normative source of behavioral semantics.
- Strict-scope phrases disable optional actions and unsolicited proposals.
- Permission classification runs before initiative scoring and cannot be bypassed.
- `unknown` is neutral and silence is not automatically rejection.
- User memory, project facts, and global heuristics remain isolated.
- Verification has `verified`, `partially_verified`, and `unverified` states.
- All persisted changes are attributable, auditable, and reversible.
- Prompt-only mode remains available but may not claim runtime guarantees.
- Every production behavior is implemented test-first.

---

## File Map

- `package.json`: workspace scripts and development tooling.
- `tsconfig.json`: strict shared TypeScript configuration.
- `packages/runtime-core/src/types.ts`: versioned public policy types.
- `packages/runtime-core/src/strict-scope.ts`: locale-aware strict-scope detection.
- `packages/runtime-core/src/intent.ts`: intent validation and decision selection.
- `packages/runtime-core/src/action-policy.ts`: action classification.
- `packages/runtime-core/src/initiative.ts`: adaptive scoring and mode thresholds.
- `packages/runtime-core/src/verification.ts`: evidence-to-claim status projection.
- `packages/runtime-core/src/learning.ts`: neutral outcomes and revision proposals.
- `packages/runtime-core/src/context.ts`: provenance-preserving context assembly.
- `packages/runtime-core/src/controller.ts`: deterministic turn orchestration.
- `packages/runtime-core/src/index.ts`: public exports.
- `packages/runtime-core/test/*.test.ts`: policy unit tests.
- `packages/runtime-store/src/json-store.ts`: atomic state, audit log, correction, deletion, and rollback.
- `packages/runtime-store/test/json-store.test.ts`: persistence tests.
- `packages/adapter-reference/src/index.ts`: capability contract and reference adapter.
- `packages/adapter-reference/test/adapter.test.ts`: degradation and permission tests.
- `evals/runner/src/*.ts`: case loading, assertions, metrics, repeated execution, and reports.
- `evals/cases/runtime/*.json`: machine-readable policy scenarios.
- `evals/runner/test/*.test.ts`: deterministic harness tests.
- `skills/step-beyond/SKILL.md`: shorter portable reasoning contract.
- `skills/step-beyond/templates/core-injection.txt`: aligned minimal prompt-only contract.
- `SPEC.md`: normative hybrid semantics.
- `README.md`: evidence-calibrated claims and runtime quick start.

---

### Task 1: Workspace and strict-scope foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `packages/runtime-core/package.json`
- Create: `packages/runtime-core/src/types.ts`
- Create: `packages/runtime-core/src/strict-scope.ts`
- Create: `packages/runtime-core/src/index.ts`
- Test: `packages/runtime-core/test/strict-scope.test.ts`

**Interfaces:**
- Produces: `UserMode`, `StrictScopeResult`, and `detectStrictScope(message: string): StrictScopeResult`.

- [ ] **Step 1: Add the failing strict-scope tests**

```ts
test('treats Polish nic więcej as absolute strict scope', () => {
  assert.deepEqual(detectStrictScope('Popraw tylko literówkę, nic więcej.'), {
    active: true,
    matched: ['tylko', 'nic więcej'],
    mode: 'strict',
  });
});

test('does not activate strict mode for descriptive use of only', () => {
  assert.equal(detectStrictScope('The report only shows active users.').active, false);
});
```

- [ ] **Step 2: Run `npm test -- strict-scope` and confirm module-not-found failure**
- [ ] **Step 3: Add npm workspace tooling and implement boundary-aware imperative phrase matching**
- [ ] **Step 4: Run `npm test -- strict-scope` and confirm all strict-scope tests pass**
- [ ] **Step 5: Run `npm run typecheck` and commit `Add runtime workspace and strict scope policy`**

### Task 2: Intent hypotheses and decision matrix

**Files:**
- Modify: `packages/runtime-core/src/types.ts`
- Create: `packages/runtime-core/src/intent.ts`
- Modify: `packages/runtime-core/src/index.ts`
- Test: `packages/runtime-core/test/intent.test.ts`

**Interfaces:**
- Produces: `IntentHypothesis`, `IntentResolution`, `validateHypotheses(hypotheses)`, and `resolveIntent(hypotheses, operations)`.
- Consumes: strict-scope state from Task 1.

- [ ] **Step 1: Add failing tests for fewer than two distinct hypotheses, high-confidence/low-cost action, safe disclosed assumption, one-question clarification, and mandatory permission for public action**

```ts
test('asks one question when all plausible hypotheses carry high mistake cost', () => {
  const result = resolveIntent(highCostHypotheses, [{ kind: 'publish_external' }]);
  assert.equal(result.kind, 'clarify');
  assert.equal(result.questions.length, 1);
});
```

- [ ] **Step 2: Run the focused test and confirm missing resolver failures**
- [ ] **Step 3: Implement schema validation, duplicate-hypothesis rejection, constraint filtering, and the four-branch decision matrix**
- [ ] **Step 4: Run intent tests and the full suite**
- [ ] **Step 5: Commit `Add auditable intent resolution`**

### Task 3: Action policy and adaptive initiative

**Files:**
- Modify: `packages/runtime-core/src/types.ts`
- Create: `packages/runtime-core/src/action-policy.ts`
- Create: `packages/runtime-core/src/initiative.ts`
- Modify: `packages/runtime-core/src/index.ts`
- Test: `packages/runtime-core/test/action-policy.test.ts`
- Test: `packages/runtime-core/test/initiative.test.ts`

**Interfaces:**
- Produces: `classifyAction(input): ActionDecision`, `scoreInitiative(candidate): number`, and `selectInitiatives(candidates, mode): InitiativeSelection`.

- [ ] **Step 1: Add failing tests covering AUTO reads/tests, disclosed reversible assumptions, ASK publication/cost/security, FORBIDDEN exfiltration/escalation, and separate execute/publish permissions**
- [ ] **Step 2: Confirm focused policy tests fail because exports are absent**
- [ ] **Step 3: Implement reason-code based classification with deny rules evaluated first**
- [ ] **Step 4: Add failing scoring tests for factor normalization, zero denominator protection, user modes, historical accuracy, strict-mode empty output, and permission-first filtering**

```ts
test('strict mode suppresses actions and proposals regardless of score', () => {
  const result = selectInitiatives([maximumScoreCandidate], 'strict');
  assert.deepEqual(result, { selected: [], proposed: [], rejected: [maximumScoreCandidate.id] });
});
```

- [ ] **Step 5: Implement the documented multiplicative score and configurable thresholds**
- [ ] **Step 6: Run policy, initiative, full tests, and typecheck**
- [ ] **Step 7: Commit `Enforce permissions and adaptive initiative`**

### Task 4: Verification ledger

**Files:**
- Modify: `packages/runtime-core/src/types.ts`
- Create: `packages/runtime-core/src/verification.ts`
- Modify: `packages/runtime-core/src/index.ts`
- Test: `packages/runtime-core/test/verification.test.ts`

**Interfaces:**
- Produces: `createVerificationRecord`, `deriveVerificationStatus`, and `renderVerifiedClaims`.

- [ ] **Step 1: Add failing tests for fully verified, partially verified, unverified, blocked external integration, and preservation of useful artifacts without unsupported claims**
- [ ] **Step 2: Confirm the focused tests fail for the missing implementation**
- [ ] **Step 3: Implement claim-scoped evidence records and conservative status derivation**
- [ ] **Step 4: Run verification tests, full tests, and typecheck**
- [ ] **Step 5: Commit `Add claim-scoped verification ledger`**

### Task 5: User model and auditable persistence

**Files:**
- Create: `packages/runtime-store/package.json`
- Create: `packages/runtime-store/src/types.ts`
- Create: `packages/runtime-store/src/json-store.ts`
- Create: `packages/runtime-store/src/index.ts`
- Test: `packages/runtime-store/test/json-store.test.ts`

**Interfaces:**
- Produces: `JsonUserModelStore` with `list`, `append`, `correct`, `remove`, `audit`, and `rollback` methods.
- Consumes: `UserModelEntry` and versioned envelopes from runtime-core.

- [ ] **Step 1: Add failing tests for isolated namespaces, source metadata, hypothesis/fact separation, secret rejection, correction, soft deletion, audit history, rollback, and atomic reload**

```ts
test('rejects likely credentials before persistence', async () => {
  await assert.rejects(
    store.append(userEntry({ value: 'sk-live-secret-value' })),
    /sensitive value/i,
  );
  assert.deepEqual(await store.list(), []);
});
```

- [ ] **Step 2: Confirm the persistence tests fail because the package is absent**
- [ ] **Step 3: Implement an atomic JSON snapshot plus append-only JSONL audit log, sensitivity checks, version checks, and rollback revisions**
- [ ] **Step 4: Run store tests twice to prove reload persistence, then run the full suite and typecheck**
- [ ] **Step 5: Commit `Add auditable user model store`**

### Task 6: Learning updater and heuristic ledger

**Files:**
- Create: `packages/runtime-core/src/learning.ts`
- Modify: `packages/runtime-core/src/types.ts`
- Modify: `packages/runtime-core/src/index.ts`
- Test: `packages/runtime-core/test/learning.test.ts`

**Interfaces:**
- Produces: `applyLearningEvent`, `proposeHeuristicRevision`, and `activateHeuristicRevision`.

- [ ] **Step 1: Add failing tests proving `unknown` is neutral, silence cannot be converted to reject, user preferences cannot update global heuristics, multi-event evidence is required, and revisions can be reverted**
- [ ] **Step 2: Confirm expected failures**
- [ ] **Step 3: Implement independent per-user, heuristic, verification-gap, and slop-pattern learning streams with proposal-only global activation by default**
- [ ] **Step 4: Run learning tests, full tests, and typecheck**
- [ ] **Step 5: Commit `Add reversible learning policies`**

### Task 7: Context assembler and turn controller

**Files:**
- Create: `packages/runtime-core/src/context.ts`
- Create: `packages/runtime-core/src/controller.ts`
- Modify: `packages/runtime-core/src/types.ts`
- Modify: `packages/runtime-core/src/index.ts`
- Test: `packages/runtime-core/test/context.test.ts`
- Test: `packages/runtime-core/test/controller.test.ts`

**Interfaces:**
- Produces: `assembleContext(input): AssembledContext` and `decideTurn(input): TurnDecision`.
- Consumes: all runtime-core policies from Tasks 1–6.

- [ ] **Step 1: Add failing context tests that preserve provenance and keep project facts outside user memory**
- [ ] **Step 2: Add failing controller tests for strict scope, clarification, disclosed assumption, permission request, selected initiative, and verification-bound delivery claims**
- [ ] **Step 3: Confirm the focused tests fail for missing modules**
- [ ] **Step 4: Implement context assembly and deterministic orchestration in the order strict-scope → intent → action policy → initiative → verification projection**
- [ ] **Step 5: Run controller tests, full tests, and typecheck**
- [ ] **Step 6: Commit `Compose policies in the turn controller`**

### Task 8: Reference host adapter

**Files:**
- Create: `packages/adapter-reference/package.json`
- Create: `packages/adapter-reference/src/index.ts`
- Test: `packages/adapter-reference/test/adapter.test.ts`

**Interfaces:**
- Produces: `HostCapabilities`, `ReferenceAdapter`, and `detectCapabilities`.
- Consumes: runtime controller inputs and store interfaces.

- [ ] **Step 1: Add failing tests for capability detection, cached detection, local execution, permission mediation, external publication separation, and honest degradation when execution or storage is absent**
- [ ] **Step 2: Confirm adapter tests fail for the absent package**
- [ ] **Step 3: Implement the eight-operation capability contract with injected functions and no host-specific global state**
- [ ] **Step 4: Run adapter tests, full tests, and typecheck**
- [ ] **Step 5: Commit `Add reference host adapter`**

### Task 9: Repeatable evaluation harness

**Files:**
- Create: `evals/runner/package.json`
- Create: `evals/runner/src/types.ts`
- Create: `evals/runner/src/assertions.ts`
- Create: `evals/runner/src/metrics.ts`
- Create: `evals/runner/src/runner.ts`
- Create: `evals/runner/src/cli.ts`
- Create: `evals/runner/test/runner.test.ts`
- Create: `evals/cases/runtime/policy.json`

**Interfaces:**
- Produces: `EvalAdapter`, `runCase`, `runSuite`, `calculateMetrics`, and a CLI emitting JSON reports.

- [ ] **Step 1: Add failing tests for fresh adapter creation per run, repeated sampling, deterministic assertions, raw transcript/artifact retention, five comparison arms, metrics, token/cost aggregation, and consent-violation counting**
- [ ] **Step 2: Confirm harness tests fail for missing runner modules**
- [ ] **Step 3: Implement a provider-neutral adapter interface, JSON case loader, repeated execution, deterministic assertions, and metrics aggregation**
- [ ] **Step 4: Add machine-readable cases for ambiguity, strict scope, memory conflict, sensitive persistence, irreversible action, partial verification, correct prediction, and wrong prediction**
- [ ] **Step 5: Run runner tests and execute the deterministic replay suite with `npm run eval:runtime`**
- [ ] **Step 6: Run full tests and typecheck**
- [ ] **Step 7: Commit `Add repeatable runtime evaluation harness`**

### Task 10: Align normative spec, portable skill, and claims

**Files:**
- Modify: `SPEC.md`
- Modify: `skills/step-beyond/SKILL.md`
- Modify: `skills/step-beyond/templates/core-injection.txt`
- Modify: `skills/step-beyond/references/memory.md`
- Modify: `skills/step-beyond/references/initiative.md`
- Modify: `skills/step-beyond/references/verification.md`
- Modify: `skills/step-beyond/references/adapters.md`
- Modify: `README.md`
- Modify: `evals/README.md`
- Create: `docs/runtime.md`
- Test: `packages/runtime-core/test/documentation-contract.test.ts`

**Interfaces:**
- Documentation contract test reads repo files and rejects obsolete normative phrases.

- [ ] **Step 1: Add failing contract tests that reject active `5/3/1` semantics, STOP-bypassing proposals, silence-as-rejection, binary verification, unsupported `verified targets`, and unqualified performance percentages**
- [ ] **Step 2: Confirm the contract test fails against current docs**
- [ ] **Step 3: Rewrite `SPEC.md` as the normative hybrid contract and reduce the portable skill to intent hypotheses, candidate generation, assumption disclosure, and evidence-aware delivery**
- [ ] **Step 4: Align references and README; label host support and performance numbers as targets unless supported by generated reports**
- [ ] **Step 5: Add runtime installation, API, prompt-only degradation, memory inspection, eval runner, and adapter authoring guidance**
- [ ] **Step 6: Run documentation contract tests, link checks, full tests, typecheck, and runtime eval**
- [ ] **Step 7: Commit `Align Step Beyond documentation with the runtime`**

### Task 11: Final integration and release evidence

**Files:**
- Modify: `CHANGELOG.md`
- Modify: `package.json`
- Create: `evals/results/runtime-smoke.json`

**Interfaces:**
- Produces one reproducible validation command: `npm run validate`.

- [ ] **Step 1: Add `validate` to run formatting checks, typecheck, unit/integration tests, documentation contracts, and deterministic runtime evals**
- [ ] **Step 2: Run `npm run validate` and fix failures through test-first regression cycles**
- [ ] **Step 3: Run `npm pack --dry-run --workspaces` and inspect included files**
- [ ] **Step 4: Generate `evals/results/runtime-smoke.json` from the harness, never by hand**
- [ ] **Step 5: Update CHANGELOG with implemented scope and explicit unverified model/host claims**
- [ ] **Step 6: Re-run `npm run validate`, `git diff --check`, and inspect `git status --short`**
- [ ] **Step 7: Commit `Complete hybrid runtime implementation`**

## Plan Self-Review

- Spec coverage: intent, context, memory, initiative, permissions, verification,
  learning, adapter, eval harness, portable degradation, and claim calibration are
  each assigned to an independently testable task.
- Scope: one reference runtime and one adapter; additional production adapters
  remain out of scope until adapter-specific eval evidence exists.
- Type consistency: runtime decisions use the public types introduced in Task 1
  and extended in later tasks; adapters and harness consume only exported APIs.
- No implementation step relies on an undefined external service or credential.
- The final smoke report is generated by the runner and cannot be mistaken for a
  repeated live-model benchmark.
