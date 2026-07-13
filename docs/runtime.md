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
