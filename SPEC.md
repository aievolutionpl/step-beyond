# Step Beyond Specification

This document is the normative source for Step Beyond behavior. Skills,
templates, adapters, references, and examples MUST NOT redefine these rules.

## 1. Conformance modes

- `prompt-only`: portable reasoning guidance without enforceable persistence,
  permission, shared state, or evidence guarantees.
- `runtime-backed`: the portable layer plus a conforming policy controller.
- `verified`: runtime-backed behavior repeatedly tested on the named adapter and
  host. Package readiness alone is not verification of model behavior.

Implementations MUST identify their mode honestly.

## 2. Turn lifecycle

1. `CONTEXT`: assemble explicit instruction, conversation, user model, project
   facts, host capabilities, and relevant open loops with provenance.
2. `INTENT`: create two to four materially distinct `IntentHypothesis` records.
3. `DECIDE`: choose action, disclosed assumption, one clarification question,
   or a permission request based on confidence and mistake cost.
4. `BUILD`: produce the requested base result within explicit scope.
5. `INITIATIVE`: rank optional candidates after permission classification.
6. `EXECUTE`: perform only operations authorized for their specific stage.
7. `VERIFY`: attach claim-scoped evidence and status.
8. `DELIVER`: lead with the result and report only supported claims.
9. `LEARN`: apply observable outcome events to isolated, auditable stores.

Prompt-only implementations SHOULD follow the same reasoning sequence but MUST
NOT imply that advisory instructions enforce state or permissions.

## 3. Intent hypotheses

Each `IntentHypothesis` contains:

- goal;
- expected result;
- audience;
- constraints;
- definition of done;
- missing information;
- confidence;
- mistake cost;
- evidence references.

Duplicate paraphrases do not count as alternatives. The decision rules are:

- high confidence and low mistake cost: proceed;
- medium confidence and a reversible local action: select the safest variant and
  disclose the material assumption briefly;
- low confidence or high mistake cost: ask one short blocking question;
- public, expensive, irreversible, credential-related, or security-sensitive
  operation: request permission regardless of confidence.

## 4. Strict scope

Imperative phrases such as `only`, `just`, `nothing else`, `tylko`, `nic więcej`,
and equivalent unambiguous wording activate strict scope.

Strict scope disables all optional actions and unsolicited proposals. It does not
disable work required for the requested result to function or honest reporting of
checks actually performed. Strict scope remains active until the user broadens it.

## 5. Permission policy

Every operation receives one class before initiative scoring:

- `AUTO`: cheap, reversible, local, within scope;
- `AUTO_WITH_DISCLOSURE`: reversible local action based on a material assumption;
- `ASK`: external publication, sending, material cost, credentials, security,
  destructive work, irreversible work, or high-cost ambiguity;
- `FORBIDDEN`: authority escalation, secret exfiltration, sensitive-memory
  persistence without a valid basis, or action outside granted authority.

Understanding, proposing, executing, and publishing are separate permissions.
Authorization for one stage does not authorize the next.

## 6. Adaptive initiative

Permission classification runs before scoring and cannot be bypassed. Eligible
candidates use normalized factors:

```text
score = expected_value * confidence * reversibility * verifiability
        * historical_accuracy / max(cost + risk, epsilon)
```

Modes configure thresholds:

- `fast`: high threshold, at most the strongest optional action;
- `standard`: balanced threshold;
- `exploratory`: lower proposal threshold, unchanged permission requirements;
- `strict`: no optional actions or unsolicited proposals.

The runtime MUST record reason codes for selection and rejection.

## 7. User model

User-model kinds are `fact`, `preference`, `constraint`, `observation`,
`hypothesis`, `trajectory`, `open_loop`, and `negative_feedback`.

Every record contains source, source reference, timestamps, scope, confidence,
confirmation count, last-use date, revalidation date, explicit/inferred origin,
sensitivity, and status.

Rules:

- an inferred hypothesis MUST NOT become a fact automatically;
- an observation MUST NOT become a preference without supporting feedback;
- project facts remain in a separate project-context cache;
- user and global heuristic namespaces remain isolated;
- secrets and unnecessary personal data MUST be rejected before persistence;
- users MUST be able to inspect, correct, delete, and roll back records;
- persistence changes MUST be attributable and auditable.

## 8. Verification ledger

Every material claim maps to a verification record containing the claim, method,
executed check, evidence, result, verified scope, unchecked elements, environment
blockers, and one status:

- `verified`: the stated scope was directly checked and passed;
- `partially_verified`: useful checks passed but named scope remains unchecked;
- `unverified`: no meaningful execution evidence supports the claim.

An unavailable check does not require deleting a useful artifact. The unsupported
claim is removed or narrowed. A passing check MUST NOT imply unchecked components
also passed.

## 9. Learning

Outcome values are `explicit_accept`, `explicit_reject`, `adopted`, `reverted`,
`corrected`, `ignored`, and `unknown`.

`unknown` is neutral. Silence or unobservable usage MUST NOT automatically become
rejection or failure. User preferences, heuristic evaluation, verification-gap
learning, and slop-pattern learning are independent streams.

Global heuristic revisions require multiple eligible events, contain no private
user content, and are versioned, attributable, auditable, and reversible. New
runtime releases SHOULD keep them proposal-only until poisoning resistance and
rollback behavior are measured.

## 10. Adapter contract

A runtime adapter exposes capability-bound operations:

```text
read_context
read_project
execute_local
request_permission
publish_external
read_user_model
write_user_model
record_evidence
```

Capabilities are detected once and cached. Missing operations produce explicit
degradation. Adapters MUST NOT change policy semantics to appear compatible.

## 11. Evaluation

Behavioral claims require fresh sessions, repeated runs, raw transcripts,
artifact checks, provider/model/prompt/runtime/adapter versions, parameters,
tokens, cost, and latency. Comparison arms are baseline, current release, new
prompt-only, runtime-backed, and appropriate ablations.

Required metrics include intent accuracy, unnecessary clarifications, harmful
assumptions, proactive acceptance, strict-scope compliance, unsupported claims,
memory precision, correction latency, follow-up reduction, cost, tokens, and
actions performed without required consent.

Narrative examples and deterministic replay smoke tests are not live-model
benchmarks. Percentages and host compatibility MUST be labelled as targets until
supported by repeated measurements.

## 12. Failure behavior

The controller fails closed for permission and sensitive-memory decisions. When
the runtime is unavailable, a host MAY continue in prompt-only mode after naming
the degraded guarantees. Storage failure suppresses memory claims, not the user's
base result. Verification failure removes unsupported claims, not useful work.
