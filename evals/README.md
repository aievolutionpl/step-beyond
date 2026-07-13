# Step Beyond Evaluations

The repository contains two evidence classes:

- historical Markdown runs and examples with their original limitations;
- an executable provider-neutral harness in `evals/runner/`.

## Runtime smoke test

```bash
npm run eval:runtime
```

This executes deterministic replay fixtures from `evals/cases/runtime/` and
generates `evals/results/runtime-smoke.json`. It tests the runner and assertions,
not live model or host behavior.

## Live behavioral benchmark contract

An adapter implements:

```ts
interface EvalAdapter {
  run(evalCase: EvalCase): Promise<EvalObservation>;
}
```

`runSuite` creates a fresh adapter for every case, comparison arm, and repetition.
Required arms are baseline, current release, prompt-only, runtime-backed, and
relevant ablations.

Each observation retains output, transcript, artifacts, token count, cost,
latency, and consent violations. A publishable report must also identify provider,
model/version, parameters, prompt version, runtime version, adapter version, and
seed when supported.

Run at least five repetitions per case in CI when cost permits. Performance or
compatibility claims require a documented sample-size rationale and should use at
least twenty fresh runs per case by default.

**Release-gate floor:** a case with fewer than three independent fresh runs may
be retained as exploratory evidence, but it MUST NOT contribute to a release
pass rate. This is a minimum eligibility rule, not evidence that `N=3` is enough
for a performance or compatibility claim; the stronger guidance above still
applies.

Multi-session cases must use genuine continuity. Run Session A, persist the
observable event through the adapter, then start Session B with fresh conversation
context and only the declared store available. Preserve the store diff and audit
record as persistence evidence. Repeating Session A's facts inside Session B's
prompt does not test memory.

Metrics include intent accuracy, unnecessary clarification, harmful assumptions,
initiative acceptance, strict-scope compliance, unsupported claims, memory
precision, correction latency, follow-up reduction, tokens, cost, and actions
without required consent.

Narrative examples and a passing package build are not behavioral benchmark
evidence.
