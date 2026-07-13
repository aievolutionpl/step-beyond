<p align="center">
  <img src="step%20beyond%20banner.png" alt="Step Beyond banner" width="100%">
</p>

# Step Beyond

### A behavioral framework for agents that understand intent, act within authority, verify claims, and learn from evidence.

**Version 4.0.0-alpha.2** · Hybrid prompt and TypeScript reference implementation

[Polski](README_PL.md) · [ChatGPT edition](README_CHATGPT.md) · [Specification](SPEC.md) · [Runtime API](docs/runtime.md)

Step Beyond turns a literal task request into a controlled agent workflow. The
model interprets language and proposes alternatives. The runtime handles policy,
permission, state, evidence, and audit records when the host exposes the required
capabilities.

The framework has two honest operating modes:

| Mode | What you get | What you do not get |
|---|---|---|
| **prompt-only** | Portable reasoning, strict-scope instructions, permission-aware decisions, claim discipline | Enforced persistence, shared state, deterministic permission gates, or audit guarantees |
| **runtime-backed** | The portable layer plus the reference policy controller, store, adapter contract, verification ledger, and eval runner | A claim that every model or host behaves correctly without adapter-specific behavioral evidence |

`verified` is an evidence status, not a marketing label. It applies only to the
adapter, host, model, and behavior covered by repeated recorded measurements.

## ⚡ What Your Agent Gains

These names describe user-facing capabilities. They do not replace the canonical
v4 lifecycle in [`SPEC.md`](SPEC.md).

| | Superpower | The instinct it installs |
|---|---|---|
| 🧠 | **RECALL** | Uses relevant, attributable user context without turning guesses into facts |
| 🔎 | **SCAN** | Reads the live project: stack, history, conventions, rules, and current constraints |
| 🔍 | **EXPAND** | Reconstructs the intended outcome instead of following the shortest literal interpretation |
| 🎨 | **POLISH** | Builds a complete professional baseline inside the requested scope |
| ➕ | **EXTEND** | Selects optional actions by value, permission, cost, risk, and verifiability |
| 🔮 | **ANTICIPATE** | Recognizes likely next needs without silently exceeding the user's authority |
| ✅ | **VERIFY** | Connects each material claim to a check and names anything left unverified |
| 📈 | **SELF-IMPROVE** | Learns from observable outcomes through auditable, reversible records |

### One lifecycle, one source of truth

```text
CONTEXT → INTENT → DECIDE → BUILD → INITIATIVE → EXECUTE → VERIFY → DELIVER → LEARN
```

| Capability label | Canonical lifecycle stage |
|---|---|
| RECALL | CONTEXT |
| SCAN | CONTEXT |
| EXPAND | INTENT + DECIDE |
| POLISH | BUILD |
| EXTEND | INITIATIVE + EXECUTE |
| ANTICIPATE | INITIATIVE + DECIDE |
| VERIFY | VERIFY |
| SELF-IMPROVE | LEARN |

`DELIVER` leads with the result and reports only claims supported by the
verification ledger. Internal reasoning may be compressed, but derived skills and
adapters preserve the lifecycle semantics and order.

## From literal execution to controlled initiative

| Literal agent behavior | Step Beyond behavior |
|---|---|
| Picks the first interpretation | Builds materially different intent hypotheses and weighs confidence against mistake cost |
| Treats project state as user preference | Keeps current project facts separate from the user model |
| Adds generic extras | Scores request-specific candidates after permission classification |
| Publishes because it inferred the goal | Separates understanding, proposing, local execution, and publication authority |
| Says “works” after reading the code | Records the check, evidence, scope, and remaining gaps |
| Learns from silence | Records `unknown` as neutral and updates state from observable outcomes |

## Why the hybrid architecture

Language models can interpret an incomplete request and generate alternatives.
They cannot guarantee shared counters, durable state, permission enforcement, or
an audit trail through prompt wording alone. Step Beyond assigns those jobs to a
small controller.

```text
host adapter
    ├─> context assembler
    ├─> intent resolver
    ├─> permission gate
    ├─> adaptive initiative scorer
    ├─> host executor
    ├─> verification ledger
    └─> learning updater
```

The normative contract lives in [`SPEC.md`](SPEC.md). The architecture rationale
lives in the [hybrid runtime design](docs/superpowers/specs/2026-07-13-hybrid-runtime-design.md).

### Reference packages

| Package | Responsibility |
|---|---|
| `@step-beyond/runtime-core` | Intent decisions, strict scope, permissions, adaptive initiative, verification, learning, and turn control |
| `@step-beyond/runtime-store` | Namespace isolation, secret rejection, atomic JSON state, audit history, correction, deletion, and rollback |
| `@step-beyond/adapter-reference` | Capability detection, explicit degradation, local execution, and publication permission boundaries |
| `@step-beyond/eval-runner` | Fresh adapter instances, comparison arms, repetitions, raw evidence, and cost/token/latency/consent metrics |

The runtime packages have no production dependencies. Development uses
TypeScript, `node:test`, and `tsx`.

## Quick start

### Run the reference runtime

Requirements: Node.js 20 or newer.

```bash
git clone https://github.com/aievolutionpl/step-beyond.git
cd step-beyond
npm install
npm run validate
```

`npm run validate` runs typechecking, the test suite, and the deterministic
runtime replay.

```ts
import {
  classifyAction,
  detectStrictScope,
  resolveIntent,
  selectInitiatives,
} from '@step-beyond/runtime-core';
```

See [`docs/runtime.md`](docs/runtime.md) for API examples, store operations,
adapter wiring, and degradation behavior.

### Install the portable skill

Copy [`skills/step-beyond/`](skills/step-beyond/) into a host that supports
skills, or inject
[`skills/step-beyond/templates/core-injection.txt`](skills/step-beyond/templates/core-injection.txt)
as standing instructions.

Use the dedicated [ChatGPT instructions](README_CHATGPT.md) for Custom GPT,
Project Instructions, or chat-based use. Without a connected runtime, those
instructions remain prompt-only.

## The operating contract

### Intent and strict scope

The agent creates multiple materially distinct intent hypotheses. Confidence and
mistake cost determine whether it proceeds, discloses an assumption, asks one
question, or requests permission.

Phrases such as `only`, `just`, `nothing else`, `tylko`, and `nic więcej`
activate strict scope. Strict scope disables optional actions and unsolicited
proposals. It still permits work required for the requested result to function
and checks required for honest reporting.

### Permission before initiative

| Class | Meaning |
|---|---|
| `AUTO` | Cheap, reversible, local, and within scope |
| `AUTO_WITH_DISCLOSURE` | Reversible local action based on a material assumption |
| `ASK` | Publication, sending, material cost, credentials, security, destructive work, irreversible work, or high-cost ambiguity |
| `FORBIDDEN` | Authority escalation, secret exfiltration, unjustified sensitive-memory persistence, or work outside granted authority |

The runtime classifies permission before it scores initiative. `fast`,
`standard`, and `exploratory` modes change the action threshold. `strict` removes
optional actions and unsolicited proposals. V4 uses this adaptive budget instead
of the fixed v3 `5/3/1` ceiling.

### Memory without guess promotion

The user model distinguishes facts, preferences, constraints, observations,
hypotheses, trajectories, open loops, and negative feedback. Each record carries
provenance, scope, confidence, timestamps, origin, sensitivity, and status.

The reference store:

- keeps project facts outside user memory;
- rejects likely credentials before persistence;
- supports inspection, correction, soft deletion, audit history, and rollback;
- treats silence and unobservable usage as `unknown`;
- isolates user records from global heuristic revisions.

When a host already provides memory, rules, skills, or verification, the adapter
assigns one owner to each record and one verification record to each material
claim. See the [adapter contract](skills/step-beyond/references/adapters.md).

### Verification that scopes the claim

| Status | Meaning |
|---|---|
| `verified` | The stated scope was checked and passed |
| `partially_verified` | Named checks passed; named scope remains unchecked |
| `unverified` | No meaningful execution evidence supports the claim |

An unavailable integration does not erase a useful artifact. The agent narrows
or removes the unsupported claim. The [verification reference](skills/step-beyond/references/verification.md)
defines evidence handling; the [slop index](skills/step-beyond/references/slop.md)
defines observable detection and repair rules for text, code, web, images, and
data visualizations.

## Evaluation and evidence

```bash
npm test
npm run typecheck
npm run eval:runtime
```

`eval:runtime` is a deterministic replay smoke test. It checks runtime policies,
the runner, and assertions. It does not measure live model or host behavior.

A behavioral report must preserve raw transcripts and artifacts, name every
model/prompt/runtime/adapter version, and record repetitions, parameters, tokens,
cost, latency, and consent violations. The release-gate and sample-size rules live
in [`evals/README.md`](evals/README.md). New reports start from
[`evals/results/TEMPLATE.md`](evals/results/TEMPLATE.md), where each case remains
`NOT RUN` until evidence exists.

Historical Markdown reports keep the limitations recorded when their runs took
place. They do not establish current v4 pass rates.

## Repository map

```text
SPEC.md                              normative behavior
skills/step-beyond/                  portable skill and references
skills/step-beyond-chatgpt/          prompt-only ChatGPT adapter
packages/runtime-core/               policy and lifecycle controller
packages/runtime-store/              auditable JSON user-model store
packages/adapter-reference/          reference capability adapter
evals/runner/                         repeatable evaluation harness
evals/cases.md                        behavioral case catalog
evals/results/                        templates and recorded reports
docs/runtime.md                       runtime API and degradation guide
examples/                              worked v4 traces
```

## Current status

Version 4 remains an alpha reference implementation. The repository includes a
tested TypeScript controller, store, adapter contract, and deterministic eval
harness. Production host adapters and behavioral claims need repeated
adapter-specific runs before they can carry `verified` status.

## License and attribution

**Created with obsessive attention to detail by**

[**AI EVOLUTION POLSKA**](https://www.aievolutionpolska.pl/)

[https://www.aievolutionpolska.pl/](https://www.aievolutionpolska.pl/) · [https://aievolutionlabs.io/](https://aievolutionlabs.io/)

MIT License — Use it. Remix it. Ship it. Just don't remove the attribution.
