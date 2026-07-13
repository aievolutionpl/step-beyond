# Step Beyond Hybrid Runtime Design

**Status:** Proposed
**Date:** 2026-07-13
**Scope:** Architecture and migration design only; no runtime implementation

## 1. Purpose

Step Beyond should help an agent reconstruct the user's real goal, use relevant
context, take safe initiative, request permission for consequential actions,
verify its claims, and learn without turning uncertain observations into facts.

The current repository expresses most of this behavior in prompts and Markdown
protocols. That is valuable as a portable behavior layer, but it cannot reliably
enforce state transitions, permissions, memory boundaries, initiative budgets,
or evidence requirements. This design introduces a hybrid architecture:

- a short portable skill for semantic reasoning;
- a small deterministic runtime for policy, state, permissions, and evidence;
- host adapters that expose capabilities without changing behavior;
- a repeatable evaluation harness that separates examples from measurements.

The design preserves prompt-only operation as a degraded mode. It does not
claim that prompt-only and runtime-backed modes provide identical guarantees.

## 2. Current-State Diagnosis

### 2.1 What is described

The repository describes a RECALL-to-LEARN lifecycle, L1/L2/L3 additions,
STOP signals, memory promotion and demotion, verification, self-improvement,
environment scanning, subagent use, onboarding, and host capability mapping.

### 2.2 What is suggested to the model

`skills/step-beyond/SKILL.md`, `templates/core-injection.txt`, installation
snippets, and the ChatGPT adapter instruct a model to apply these behaviors.
Compliance depends on instruction following and available context.

### 2.3 What is enforced

There is currently no executable controller that owns the initiative budget,
blocks actions requiring consent, validates memory transitions, records claim
evidence, or guarantees one shared state across tools and subagents.

### 2.4 What is tested

The repository contains behavioral cases, rubrics, example outcomes, and several
documented runs. They provide useful exploratory evidence, but most results are
single runs and there is no executable, repeatable model harness in the repo.

### 2.5 Claims that need stronger evidence

Compatibility with every named host, acceptance rates, follow-up reduction,
and zero-error behavior must be treated as hypotheses or targets until repeated
adapter-specific measurements support them.

## 3. Resolved Policy Decisions

This design resolves the following current ambiguities:

1. `only`, `just`, `nothing else`, and equivalent strict-scope signals disable
   both built additions and unsolicited proposals. In-scope verification remains
   allowed, but it is reported without extra recommendations.
2. The fixed `5/3/1` ceiling is replaced by an adaptive initiative budget.
3. No response or unobservable usage maps to `unknown`, not rejection.
4. A useful artifact is not removed merely because full execution is blocked.
   The unsupported claim is removed or narrowed instead.
5. Inferring a need does not grant permission to execute or publish an action.
6. Project facts and user preferences live in separate stores.
7. `SPEC.md` is the only normative source of behavioral semantics. Skills,
   templates, adapters, examples, and docs are derived or explanatory views.

## 4. Considered Approaches

### 4.1 Prompt-only 4.0

Shorten and clarify the skill, add intent hypotheses, and repair contradictions.

**Benefits:** maximum portability and the smallest adoption cost.

**Limitations:** state, permission, and evidence rules remain advisory. Host and
model differences continue to cause nondeterministic behavior.

### 4.2 Hybrid skill plus lightweight runtime — recommended

Keep semantic judgment in the model. Move stateful and safety-critical decisions
into a small controller with pure policy functions and explicit host adapters.

**Benefits:** preserves portability while making the highest-risk invariants
testable and enforceable.

**Limitations:** requires an SDK, schema migrations, and honest capability labels
for hosts that do not integrate the controller.

### 4.3 Full cognitive runtime

Move orchestration, planning, memory, policies, telemetry, and learning into a
large agent framework.

**Benefits:** maximum observability and experimental control.

**Limitations:** excessive coupling, high maintenance cost, and pressure to
replace host-native orchestration. This is not justified by current evidence.

## 5. Architecture

```text
Host adapter
    |
Turn controller
    +-- Context assembler <---- User-model store
    +-- Intent resolver
    +-- Action policy gate
    +-- Initiative scorer <---- Heuristic ledger
    +-- Host executor
    +-- Verification ledger
    +-- Delivery composer
    +-- Learning updater ------> User-model store / heuristic ledger
```

### 5.1 Portable behavior layer

The portable layer is a compact model instruction responsible for:

- producing multiple plausible intent hypotheses;
- identifying goals, audiences, constraints, and completion criteria;
- generating base-work and optional-action candidates;
- explaining assumptions and uncertainty;
- composing a result-first response from runtime decisions.

It must not claim to enforce persistence, consent, shared budgets, or evidence
when no runtime provides those capabilities.

### 5.2 Turn controller

The controller owns one turn state and coordinates the modules below. It accepts
a normalized `TurnContext` and returns a `TurnDecision`. It does not implement a
general agent loop or replace the host's tool system.

### 5.3 Context assembler

The assembler combines, with explicit provenance:

- the current user instruction;
- relevant conversation context;
- confirmed user-model entries;
- project facts derived from the current environment;
- host capabilities and policy configuration;
- prior open loops relevant to the task.

It never silently merges project facts into the user model.

### 5.4 Intent resolver

The model proposes two to four materially different hypotheses. The runtime
validates their schema, applies explicit constraints, calculates decision risk,
and selects action, safe assumption, or clarification behavior.

### 5.5 Action policy gate

The gate classifies each proposed operation before scoring initiative. Permission
classification cannot be overridden by a high initiative score.

### 5.6 Initiative scorer

The scorer ranks only policy-allowed optional actions. It uses normalized factors
and a mode-specific threshold rather than a fixed number of additions.

### 5.7 Verification ledger

Every material delivery claim maps to a recorded check and evidence scope.
Delivery generation consumes the ledger instead of relying on the model to
remember which claims were actually verified.

### 5.8 Learning updater

The updater consumes explicit outcome events. It proposes auditable, reversible
changes to the user model or heuristic ledger and treats `unknown` as neutral.

### 5.9 Host adapters

An adapter maps host operations to a small capability interface:

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

Missing capabilities produce explicit degradation. An adapter may not rewrite
core policy to make a host appear conformant.

## 6. Core Data Model

All persisted records use versioned schemas and UTC timestamps.

### 6.1 Intent hypothesis

```text
IntentHypothesis {
  id
  goal
  expected_result
  audience
  constraints[]
  definition_of_done[]
  missing_information[]
  confidence
  mistake_cost
  evidence_refs[]
}
```

### 6.2 User-model entry

```text
UserModelEntry {
  id
  kind: fact | preference | constraint | observation | hypothesis |
        trajectory | open_loop | negative_feedback
  value
  source
  source_ref
  created_at
  updated_at
  scope
  confidence
  confirmations
  last_used_at
  revalidate_at
  origin: explicit | inferred
  sensitivity
  status: active | disputed | expired | deleted
}
```

Rules:

- inferred hypotheses never become facts automatically;
- observations do not become preferences without supporting feedback;
- entries are visible, correctable, and deletable by the user;
- secrets and unnecessary personal data are rejected before persistence;
- current repository state is stored in a separate project-context cache;
- user data and global heuristic data use isolated namespaces.

### 6.3 Initiative candidate

```text
InitiativeCandidate {
  id
  intent_id
  action
  expected_value
  confidence
  reversibility
  verifiability
  estimated_cost
  risk
  permission_class
  rationale
}
```

### 6.4 Action decision

```text
ActionDecision {
  candidate_id
  class: AUTO | AUTO_WITH_DISCLOSURE | ASK | FORBIDDEN
  allowed_scope
  reason_codes[]
  permission_ref
}
```

### 6.5 Verification record

```text
VerificationRecord {
  id
  claim
  method
  check_executed
  evidence
  result
  verified_scope
  unchecked[]
  environment_blockers[]
  status: verified | partially_verified | unverified
}
```

### 6.6 Learning event and revision

```text
LearningEvent {
  id
  subject_ref
  outcome: explicit_accept | explicit_reject | adopted | reverted |
           corrected | ignored | unknown
  evidence_ref
  occurred_at
}

HeuristicRevision {
  id
  heuristic_id
  previous_version
  proposed_version
  reason_events[]
  created_at
  status: proposed | active | reverted
}
```

## 7. Intent Resolution Algorithm

1. Detect strict scope and explicit constraints before expansion.
2. Ask the model for two to four distinct hypotheses. Duplicate paraphrases do
   not count as alternatives.
3. Validate required fields and evidence references.
4. Remove hypotheses that conflict with explicit instructions or current project
   facts.
5. Estimate confidence and mistake cost separately. High confidence does not
   erase high consequences.
6. Choose behavior:
   - high confidence and low mistake cost: proceed;
   - medium confidence and reversible local action: choose the safest variant
     and disclose the assumption briefly;
   - low confidence or high mistake cost: ask one short blocking question;
   - public, expensive, irreversible, security-sensitive, or credential-related
     action: require permission regardless of confidence.
7. Record the selected hypothesis and rejected alternatives for audit. Show them
   only when they affect a user decision or the user requests the reasoning.

## 8. Initiative and Permission Policy

### 8.1 Permission classes

`AUTO` covers cheap, reversible, in-scope local operations such as reading files,
running an existing test command, or making a change required for the requested
artifact to function.

`AUTO_WITH_DISCLOSURE` covers low-risk, reversible local work based on a material
but reasonably safe assumption. The assumption is disclosed in one sentence.

`ASK` covers external publication, sending messages, purchases, destructive or
irreversible operations, architectural migrations, material cost, credentials,
security-sensitive changes, and ambiguous actions with high mistake cost.

`FORBIDDEN` covers authority escalation, secret exfiltration, sensitive-memory
storage without a valid basis, and actions outside granted scope.

Understanding, proposing, executing, and publishing are separate permissions.
Permission to perform one does not imply permission for the next.

### 8.2 Adaptive score

For candidates allowed by the policy gate:

```text
score = expected_value * confidence * reversibility * verifiability
        / max(estimated_cost + risk, epsilon)
```

All factors are normalized and accompanied by reason codes. Thresholds are
configured by user mode:

- `fast`: high threshold and at most the strongest qualifying action;
- `standard`: balanced threshold;
- `exploratory`: lower proposal threshold, unchanged permission requirements;
- `strict`: optional actions and unsolicited proposals disabled.

The runtime also considers prior accuracy for comparable predictions. It never
uses a high historical score to bypass current risk or explicit scope.

## 9. Verification Policy

The runtime separates artifacts from claims. If a deliverable cannot be fully
executed because a service or credential is unavailable, the artifact may still
be returned. Only supported claims are emitted.

Examples:

- `verified`: tests were executed and passed in the stated scope;
- `partially_verified`: static checks passed, but an external integration was
  blocked and is named explicitly;
- `unverified`: the artifact was created, but no meaningful execution check was
  possible.

No passing check may imply that unchecked components also passed. Evidence is
stored as structured data where possible and as a bounded text reference where
the host cannot provide structured output.

## 10. Learning Policy

User learning, heuristic evaluation, verification-gap learning, and slop-pattern
learning are independent streams.

Rules:

- `unknown` is neutral;
- silence is not automatically rejection;
- user-specific preferences never update other users' profiles;
- a global heuristic revision requires evidence from multiple eligible events;
- every automatic revision is versioned, attributable, and reversible;
- one user's private content is never copied into global heuristic records;
- memory corrections take effect immediately and invalidate conflicting cached
  decisions.

Initial releases should run global heuristic revisions in proposal-only mode.
Automatic activation is allowed only after evals demonstrate acceptable rollback,
poisoning resistance, and false-update rates.

## 11. Evaluation Harness

### 11.1 Test layers

Deterministic unit and integration tests cover STOP parsing, permission classes,
initiative scoring, memory transitions, secret rejection, schema migrations,
claim-to-evidence mapping, and adapter degradation.

Behavioral model evals use fresh sessions, recorded transcripts, isolated stores,
and independent artifact checks. They include all ambiguity, memory-conflict,
strict-scope, risk, verification, and prediction cases listed in the project
brief.

### 11.2 Comparison arms

Every release benchmark compares:

1. model without Step Beyond;
2. current released Step Beyond;
3. new prompt-only behavior;
4. new runtime-backed behavior;
5. optional runtime policy without the full skill as an ablation.

### 11.3 Repetition and reproducibility

CI uses at least five fresh runs per behavioral case when cost permits. Release
claims use at least twenty runs per case or a documented power-based sample size.
Each run records provider, model, model version, parameters, seed when supported,
prompt version, runtime version, adapter version, transcript, artifacts, latency,
tokens, and cost.

### 11.4 Metrics

The harness reports:

- intent accuracy;
- unnecessary clarification rate;
- harmful assumption rate;
- proactive action acceptance;
- strict STOP compliance;
- unsupported claim rate;
- memory precision;
- memory correction latency;
- follow-up reduction;
- token and monetary cost;
- actions executed without required consent.

Narrative examples remain documentation. They are never counted as benchmark
observations unless produced by a recorded harness run.

## 12. Repository Boundaries

Proposed implementation layout:

```text
SPEC.md                              normative behavior
skills/step-beyond/SKILL.md          portable reasoning layer
skills/step-beyond/references/       explanatory protocols
packages/runtime-core/               pure policy and schema modules
packages/runtime-store/              persistence and migrations
packages/adapter-reference/          first supported host adapter
evals/cases/                          machine-readable fixtures
evals/runner/                         repeatable model runner
evals/results/                        generated reports plus raw-run references
```

Generated summaries may be checked for drift against `SPEC.md`. Host support is
listed as `planned`, `prompt-only`, `runtime-backed`, or `verified`; only the last
state requires repeated adapter tests.

## 13. Migration Plan

### Phase 0 — Truth and terminology

- mark unsupported percentages and compatibility claims as targets;
- make `SPEC.md` the normative source;
- align strict STOP, verification states, outcome terms, and permission language.

### Phase 1 — Schemas and pure policies

- add versioned schemas;
- implement intent decision, action gate, initiative scorer, memory transition,
  and verification-status functions;
- cover them with deterministic tests.

### Phase 2 — Shadow runtime

- run the controller beside existing prompt behavior;
- record disagreements without changing agent actions;
- use disagreements to refine policy thresholds and reason codes.

### Phase 3 — State and evidence

- add the user-model store, project-context cache, heuristic ledger, and
  verification ledger;
- add inspection, correction, deletion, audit, and rollback interfaces.

### Phase 4 — Reference adapter

- implement one host adapter end to end;
- test real capability detection, permission requests, execution, persistence,
  and degraded behavior;
- leave every other host honestly labeled until its adapter tests pass.

### Phase 5 — Behavioral comparison

- run all benchmark arms repeatedly;
- publish raw-run references, confidence intervals, cost, and limitations;
- remove or revise claims not supported by measurements.

### Phase 6 — Portable-layer reduction

- shorten the skill based on what the runtime now enforces;
- remove duplicated normative rules from adapters and installation snippets;
- retain progressive disclosure for reasoning guidance and examples.

## 14. Delivery and Failure Behavior

The controller fails closed for permission and sensitive-memory decisions. It
fails open only for low-risk reasoning assistance: if the runtime is unavailable,
the host may continue in prompt-only mode after clearly labeling the degraded
guarantees.

Storage failures preserve the user's requested base work but suppress memory
claims. Verification failures preserve artifacts where useful, remove unsupported
claims, and report the exact unchecked scope. Adapter capability detection is
cached per session and refreshed when a failed operation contradicts it.

## 15. Acceptance Criteria for Implementation Planning

Implementation planning may begin after review confirms that:

- strict-scope behavior is absolute;
- permission classes cover execution and publication separately;
- facts, preferences, observations, and hypotheses cannot be conflated;
- `unknown` is neutral;
- verification records support all three states;
- global learning is auditable and reversible;
- prompt-only degradation is described honestly;
- the eval harness can compare all required variants;
- unsupported performance and compatibility claims are treated as targets.

This document intentionally stops before implementation task breakdown. The next
artifact, after approval, is a staged implementation plan with tests and review
gates for each phase.
