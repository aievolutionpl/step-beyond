<p align="center">
  <img src="step%20beyond%20banner.png" alt="Step Beyond banner" width="100%">
</p>

# Step Beyond

Step Beyond helps an agent reconstruct the user's real goal, use relevant
context, take permission-aware initiative, verify claims, and learn without
turning uncertain observations into facts.

Version 4 introduces two explicit operating modes:

- **prompt-only** — a portable skill for semantic reasoning;
- **runtime-backed** — the skill plus deterministic policy, persistence,
  permission, initiative, verification, and evaluation modules.

Only adapter/host combinations supported by repeated behavioral measurements
should be called **verified**. The reference runtime and deterministic smoke eval
do not by themselves prove behavior for every model or host.

## Why the hybrid architecture

Prompts are good at interpreting language and generating alternatives. They are
not reliable owners of shared counters, durable memory, permissions, audit logs,
or evidence. Step Beyond keeps the first category in the model and moves the
second into a lightweight TypeScript controller.

```text
host adapter
    -> context assembler
    -> intent resolver
    -> permission gate
    -> adaptive initiative scorer
    -> host executor
    -> verification ledger
    -> learning updater
```

The normative contract is [`SPEC.md`](SPEC.md). The approved architecture is
[`docs/superpowers/specs/2026-07-13-hybrid-runtime-design.md`](docs/superpowers/specs/2026-07-13-hybrid-runtime-design.md).

## Implemented runtime modules

| Package | Responsibility |
|---|---|
| `@step-beyond/runtime-core` | strict scope, intent decisions, permission classes, adaptive initiative, verification, learning, context, turn control |
| `@step-beyond/runtime-store` | namespace isolation, secret rejection, atomic JSON state, append-only audit, correction, deletion, rollback |
| `@step-beyond/adapter-reference` | cached capability detection, honest degradation, explicit publication permission |
| `@step-beyond/eval-runner` | fresh runs, comparison arms, deterministic assertions, raw evidence, token/cost/latency/consent metrics |

The packages have no production dependencies. Development uses TypeScript,
`node:test`, and `tsx`.

Token cost is bounded by a relevance-ranked context budget. The short portable
skill stays resident; references and project context are loaded progressively,
only when the current task needs them.

## Quick start

Requirements: Node.js 20 or newer.

```bash
npm install
npm run validate
```

Import the policy functions directly:

```ts
import {
  classifyAction,
  detectStrictScope,
  resolveIntent,
  selectInitiatives,
} from '@step-beyond/runtime-core';
```

See [`docs/runtime.md`](docs/runtime.md) for API examples, persistence, adapter
wiring, and degradation behavior.

## Portable skill

Install `skills/step-beyond/` in a host that supports skills, or inject
`skills/step-beyond/templates/core-injection.txt` as standing instructions.

The portable layer:

- forms several intent hypotheses instead of selecting the first interpretation;
- distinguishes confidence from mistake cost;
- treats `only` / `just` / `tylko` / `nic więcej` as absolute strict scope;
- distinguishes understanding, proposing, execution, and publication;
- reports `verified`, `partially_verified`, and `unverified` claims;
- treats `unknown` as neutral and keeps project facts outside user memory.

Without the runtime these are behavioral instructions, not enforceable
guarantees. Hosts must label that state as prompt-only.

## Permission classes

- `AUTO`: cheap, reversible, local, in scope.
- `AUTO_WITH_DISCLOSURE`: reversible local action based on a material assumption.
- `ASK`: publication, sending, cost, credentials, security, destructive or
  irreversible action, or high-cost ambiguity.
- `FORBIDDEN`: authority escalation, secret exfiltration, sensitive-memory
  persistence without a valid basis, or action outside granted authority.

Permission is evaluated before initiative score.

## Adaptive initiative

The old fixed `5/3/1` ceiling is replaced by:

```text
expected_value * confidence * reversibility * verifiability
* historical_accuracy / max(cost + risk, epsilon)
```

`fast`, `standard`, and `exploratory` modes adjust thresholds. `strict` disables
optional actions and unsolicited proposals completely.

## Memory and learning

Memory entries distinguish facts, preferences, constraints, observations,
hypotheses, trajectories, open loops, and negative feedback. Every entry carries
provenance, scope, confidence, timestamps, origin, sensitivity, and status.

The reference store rejects likely credentials, isolates namespaces, and supports
inspection, correction, soft deletion, audit history, and rollback. Silence is
not automatically a rejection. `unknown` does not change learning state.

## Verification

A useful artifact is not removed only because an external integration cannot be
run. The ledger narrows the claim instead:

- `verified` — stated scope checked and passed;
- `partially_verified` — named checks passed, named scope remains unchecked;
- `unverified` — no meaningful execution evidence supports the claim.

## Evaluation

```bash
npm test
npm run typecheck
npm run eval:runtime
```

`eval:runtime` is a deterministic replay smoke test. Its generated report says so
explicitly and must not be presented as a live-model benchmark.

A publishable behavioral benchmark should run fresh sessions repeatedly across:

1. baseline without Step Beyond;
2. current released behavior;
3. new prompt-only behavior;
4. runtime-backed behavior;
5. relevant ablations.

It must preserve raw transcripts and artifacts and report model/runtime/adapter
versions, parameters, tokens, cost, latency, and consent violations. Existing
historical Markdown results remain examples with their original limitations.

## Status

The TypeScript implementation is a reference runtime. Additional production host
adapters and live-model benchmark claims require separate adapter-specific runs.
See [`evals/README.md`](evals/README.md) and the generated smoke report in
`evals/results/runtime-smoke.json`.

## License

MIT
