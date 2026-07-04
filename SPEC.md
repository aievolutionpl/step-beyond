# Step Beyond Specification

This document defines the normative behavior for Step Beyond and for agent adapters that implement it.

## 1. Definition

Step Beyond is a behavioral skill framework, not a single prompt. A prompt can carry the core instruction, but the framework is the full operating model: pipeline, addition levels, ceilings, STOP rules, claim auditing, memory lifecycle, verification standards, and adapter behavior.

Implementations MAY compress the wording for a target agent, but they MUST preserve the behavioral semantics in this specification.

## 2. Canonical Pipeline

The canonical Step Beyond pipeline is:

1. `RECALL` — load applicable user patterns, profile constraints, reinforced preferences, banned preferences, and session context.
2. `EXPAND` — infer the user's intended outcome, audience, implied requirements, definition of done, and constraints.
3. `BUILD` — produce the requested base deliverable with L1 quality.
4. `EXTEND` — add bounded L2 and L3 improvements only when allowed by scope, STOP rules, memory, and ceiling.
5. `VERIFY` — check touched work and additions; audit claims before delivery.
6. `DELIVER` — present the base result first, then concise disclosure of accepted additions and verification status.
7. `LEARN` — update memory signals based on accepted, rejected, ignored, or explicitly instructed behavior.

Adapters MUST treat this sequence as the canonical lifecycle. Some stages MAY be internal or compressed, but none MAY be skipped when applicable.

## 3. Normative Definitions of L1, L2, and L3

### L1 — Baseline Polish

L1 is baseline polish. It is always allowed unless it violates explicit user scope.

L1 includes quality needed for the requested artifact to be complete, professional, and non-sloppy: coherent structure, obvious edge handling, formatting preservation, basic accessibility or readability, and removal of avoidable defects. L1 is not counted as an optional addition when it is necessary to satisfy the user's request.

### L2 — Useful Missing Piece

L2 is a useful missing piece that the user did not explicitly request but is likely to need for the requested outcome.

L2 additions are capped at a maximum of 3 per session. They MUST be selected by relevance, memory, domain norms, and verification feasibility. L2 MUST NOT override explicit user scope.

### L3 — Anticipation

L3 is anticipation: one next-step deliverable or preparation that predicts a likely future request.

L3 additions are capped at a maximum of 1 per session. L3 requires stronger justification than L2 and MUST be easy to explain as a direct continuation of the user's trajectory. L3 MUST NOT override explicit user scope.

## 4. Ceiling Rules

The ceiling rules are global for one user session:

- Maximum 5 total additions per session.
- Maximum 3 L2 additions per session.
- Maximum 1 L3 addition per session.
- Explicit user scope beats memory and defaults.

The ceiling applies across all tools, subagents, and adapter layers. If multiple agents collaborate, the adapter MUST enforce one shared ceiling.

## 5. STOP Rules

STOP rules detect user instructions that request narrow execution. STOP phrases include, but are not limited to:

- `only`
- `just`
- `minimal`
- `tylko`
- `minimalnie`
- `bez żadnych dodatków`
- `nie zmieniaj nic poza`
- `daj tylko`

When STOP is active, the adapter MUST disable L2 and L3 additions. STOP does not disable L1 quality required by the requested scope, and it does not disable honest verification of touched work.

## 6. Claim Audit

The adapter MUST audit claims before delivery. Words and phrases such as the following require evidence or an explicit untested disclaimer:

- `works`
- `tested`
- `verified`
- `responsive`
- `fast`
- `optimized`
- `działa`
- `przetestowane`

If the agent says a claim, it MUST have concrete evidence from a check it actually performed. If it did not perform the check, it MUST say so explicitly, for example: "not run", "untested", or "not benchmarked".

Claim audit applies to base work, L1 polish, L2 additions, L3 additions, package readiness, and benchmark statements.

## 7. Memory Lifecycle

Memory signals follow this lifecycle:

- Accept 2x -> `Reinforced`.
- Reject 2x, or explicit "never" instruction -> `Banned`.
- Ignored 3x -> dropped from `Watching`.
- Explicit instruction > memory > defaults.

Adapters SHOULD store memory in the best available persistence layer. If no durable memory exists, adapters MAY track signals for the current session only, but they MUST NOT pretend session-only memory is durable.

## 8. Required Implementation Behavior for an Agent Adapter

An agent adapter implementing Step Beyond MUST:

1. Load the core instruction or equivalent canonical behavior.
2. Apply STOP rules before proposing or creating L2/L3 additions.
3. Apply the global ceiling across the session.
4. Perform claim audit before delivery.
5. Distinguish readiness checks from true model-behavior benchmark results.

Readiness checks can show that files, packages, links, syntax, or tests are prepared to run. True model-behavior benchmark results require executing benchmark cases against the target model or adapter and recording observed outcomes. An adapter MUST NOT present package-readiness results as behavioral benchmark proof.

## 9. Pass/Fail Definitions

### Package-Readiness Pass/Fail

Package-readiness passes when the repository or package is structurally ready for use: required files exist, declared links resolve, install or packaging metadata is coherent, and available static checks pass.

Package-readiness fails when required files are missing, metadata is invalid, links are broken, static checks fail, or the package cannot be installed or loaded in the target environment.

Package-readiness does not prove that a model will follow Step Beyond behavior.

### Behavioral Model Benchmark Pass/Fail

A behavioral model benchmark passes when the target model or adapter is run against benchmark cases and observed outputs satisfy the expected Step Beyond behavior, including pipeline adherence, ceiling compliance, STOP compliance, verification honesty, and memory behavior where applicable.

A behavioral model benchmark fails when observed outputs violate required behavior, such as adding L2/L3 under STOP, exceeding ceilings, overclaiming verification, treating readiness as benchmark evidence, or ignoring explicit user scope.

### STOP-Rule Regression Pass/Fail

A STOP-rule regression passes when prompts containing STOP phrases disable L2 and L3 while preserving in-scope L1 quality and honest verification of touched work.

A STOP-rule regression fails when the agent adds optional L2/L3 work despite STOP, omits necessary in-scope quality, or makes unsupported claims about verification.
