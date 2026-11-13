# Step Beyond Reference Runtime

The reference runtime enforces the stateful and safety-critical parts of
[`SPEC.md`](../SPEC.md). It complements the portable skill; it does not replace
the model's semantic reasoning.

## Requirements and validation

```bash
npm install
npm run validate
```

Node.js 20 or newer is required. The packages have no production dependencies.

## Core policies

```ts
import {
  classifyAction,
  detectStrictScope,
  resolveIntent,
  selectInitiatives,
} from '@step-beyond/runtime-core';

const strict = detectStrictScope('Popraw tylko literówkę, nic więcej.');
// { active: true, matched: ['tylko', 'nic więcej'], mode: 'strict' }

const permission = classifyAction({
  kind: 'publish_external',
  withinScope: true,
});
// { class: 'ASK', ... }
```

`resolveIntent` requires at least two materially distinct hypotheses. It returns
`act`, `act_with_disclosure`, `clarify`, or `ask_permission`.

`selectInitiatives` classifies permission before applying the adaptive score.
Strict mode returns no selected action and no proposal.

## Next-move planning

```ts
import {
  planNextMoves,
  predictFromTrajectories,
  predictionAccuracy,
  updatePredictionAccuracy,
} from '@step-beyond/runtime-core';

const next = predictFromTrajectories(
  ['landing page', 'og image'],                       // requests this session
  [{ sequence: ['landing page', 'og image', 'deploy preview'], seen: 4 }],
);
// [{ step: 'deploy preview', confidence: 0.67, matched: 2, seen: 4 }]

const plan = planNextMoves(
  [
    {
      id: 'tests', description: 'Tests for the new parser', source: 'trajectory',
      action: { kind: 'execute_local', withinScope: true, reversible: true },
      confidence: 0.9, expectedValue: 0.8, effort: 0.1, separable: true,
      historicalAccuracy: predictionAccuracy({ hits: 6, misses: 1 }),
    },
    {
      id: 'deploy', description: 'Deploy the preview', source: 'explicit',
      action: { kind: 'publish_external', withinScope: true },
      confidence: 1, expectedValue: 0.9, effort: 0.2, separable: true,
    },
  ],
  'standard',
);
// plan.doAhead = ['tests'], plan.propose = ['deploy']
```

`planNextMoves` classifies permission before anything else, so an `ASK` action
is at most proposed and a `FORBIDDEN` one is held. An action with
`reversible: false` is also at most proposed, whatever its class. Every decision carries reason
codes and its calibrated confidence. Strict mode holds everything. Per-rung
budgets are configurable through the third argument; overflow moves down one
rung. `decideTurn` accepts optional `predictions` and `mode` and returns the plan
as `nextMoves`; it holds all predictions while intent resolution is `clarify` or
`ask_permission`.

`updatePredictionAccuracy` applies an observed outcome; `unknown` changes
nothing. The model still writes the predictions. The runtime only decides what
may be done with them.

## Context and token budget

`assembleContext` accepts `maxContextTokens`. Give entries a normalized
`relevance` and estimated `tokenCost`; the assembler selects the most relevant
entries without mixing project facts into user memory and returns IDs omitted by
the budget. Keep the portable skill resident and load references only when a task
needs them.

```ts
const context = assembleContext({
  instruction,
  userEntries,
  projectFacts,
  maxContextTokens: 1200,
});
```

This is a simple greedy budget, not a retrieval framework. Hosts may provide a
better retriever, but adapters should still pass only scoped, provenance-bearing
entries to the controller.

## Verification

```ts
import { createVerificationRecord } from '@step-beyond/runtime-core';

const record = createVerificationRecord({
  claim: 'local tests pass; external API was not exercised',
  checkExecuted: true,
  result: 'pass',
  unchecked: ['external API'],
  method: 'npm test',
  evidence: ['22 tests passed'],
  environmentBlockers: ['missing service credential'],
});
// status: 'partially_verified'
```

Artifacts and claims remain separate. An unverified claim is omitted or narrowed;
the artifact is preserved when useful.

## Evidence review

A reference flow for reviewing what a model extracted from a conversation and
its documents. It ends at a report for a human and has no write, execute, or
publish path.

```ts
import { runEvidenceReview } from '@step-beyond/adapter-reference';
import { recordDecision } from '@step-beyond/runtime-core';

const { review, run, snapshot } = await runEvidenceReview({
  readSources: async () => [{ id: 'chat', text }, { id: 'rules', text: rules }],
  callModel: async ({ instruction, sources }) => {
    const reply = await host.model(instruction, sources);   // your model call
    return { rawOutput: reply.text, model: reply.model, parameters: reply.params, usage: reply.usage };
  },
  decisions,                                                // history kept by the host
});
// review.status: 'ready_for_review' | 'stale_sources' | 'invalid_output'
// review.executionAuthorized: false — always

// After the user rules on a claim, the host records it with a reference to
// the user's own message, and passes it back in `decisions` next time.
decisions.push(recordDecision({
  claim: review.claims[0], snapshot, decision: 'Keep the current rule', evidenceRef: 'user-message:42',
}));
```

The flow is: read sources → snapshot → call the model → re-read sources →
validate → stop. Each reviewed claim keeps four things apart:

| Field | Values | Meaning |
|---|---|---|
| `evidence` | `supported`, `partially_supported`, `unsupported`, `not_applicable` | Whether every part of the claim cites a quote found in its source |
| `validity` | `current`, `historical`, `unknown` | The model's time label; missing means `unknown` |
| `decision` | `none`, `settled`, `possibly_settled`, `reopened` | What the host's decision history says |
| `requiredActions` | `fix_evidence`, `split_or_map_evidence`, `verify_before_use`, `user_decision`, `confirm_gap` | What the reviewer still has to do |

Rules the checks enforce:

- **Claims and evidence.** A claim may split into `parts`, each with its own
  quotes. A part is supported only when all its quotes resolve. A single-part
  statement that joins clauses (`and`, `i`, `oraz`, `;`, …) is flagged
  `possible_compound_statement`. This is a word-level hint, not semantic analysis.
- **Quotes.** Matching is exact. The source spelling is restored only when the
  quote differs by letter case alone and all such occurrences are spelled the
  same; the change is listed in `review.corrections`. Whitespace, punctuation,
  and wording differences fail. `review.rawOutput` is never modified.
- **Decisions.** `settled` requires a `DecisionRecord` whose fingerprint equals
  the claim's (kind, normalized statement, cited quotes, attached action) and
  which pins an unchanged digest for every source the claim cites. Changed or
  unpinned sources give `reopened`. `reopened` and `possibly_settled` add
  `user_decision` for every claim kind. A reworded claim that
  shares a quote with a record, or names one in `priorDecisionRef`, gives
  `possibly_settled` and still asks the user. Rewording is not recognized
  semantically.
- **Authority.** Only declared claim fields are read. `approved`, `permission`,
  and similar fields are dropped and listed in `review.ignoredFields`. An
  attached `action` is classified by `classifyAction` for information; the class
  is not a permission.
- **Time.** `historical` or `unknown` adds `verify_before_use`, also on a
  settled claim. A prior decision does not confirm a fact.
- **Integrity.** If any source differs from the pre-call snapshot, the status is
  `stale_sources` and no claim is evaluated.
- **Verification.** Each claim gets a `VerificationRecord`. Quote presence is
  the only executed check, so the best status is `partially_verified`;
  semantic coverage is always listed as unchecked.

`run` records the model identifier, parameters, token usage, start time, and
duration, and lists what was not recorded under `limitations`.

The lower-level functions `snapshotSources`, `changedSourceIds`, `matchQuote`,
`parseExtraction`, `reviewExtraction`, and `recordDecision` are exported from
`@step-beyond/runtime-core`.

## User-model store

```ts
import { JsonUserModelStore } from '@step-beyond/runtime-store';

const store = new JsonUserModelStore('.step-beyond', 'user-123');
await store.append(entry);
const entries = await store.list();
const audit = await store.audit();
await store.correct(entry.id, 'Corrected value', 'user correction');
await store.remove(entry.id, 'user deletion');
await store.rollback(audit[0].revision);
```

The store writes an atomic JSON snapshot and append-only JSONL audit file per
namespace. It rejects likely credentials and inferred facts. Applications should
use opaque, non-personal namespace identifiers.

## Reference adapter

```ts
import { ReferenceAdapter } from '@step-beyond/adapter-reference';

const adapter = new ReferenceAdapter({
  detect: () => ({
    executeLocal: true,
    persistMemory: true,
    publishExternal: true,
  }),
  executeLocal: async (input) => host.execute(input),
  publishExternal: async (input) => host.publish(input),
});

await adapter.executeLocal({ command: 'npm test' });
await adapter.publishExternal(payload, permissionReference);
```

Publication fails without a permission reference. Missing execution returns an
explicit `unavailable` result with `verified: false`.

## Eval runner

```ts
import { runSuite } from './evals/runner/src/index.js';

const report = await runSuite(cases, arms, repetitions, createFreshAdapter);
```

The factory is called for every case, arm, and repetition. Reports retain raw
transcripts and artifacts and aggregate tokens, cost, latency, pass rate, and
consent violations.

`npm run eval:runtime` uses deterministic replay fixtures only. It is a smoke
test of the harness, not evidence of model or host behavior.

## Degradation

If runtime policy is unavailable, continue only as prompt-only behavior and name
the degraded guarantees. Missing storage suppresses durability claims. Missing
execution narrows verification. Missing publication capability never authorizes
an alternative external channel.
