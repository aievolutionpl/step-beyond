# Memory Protocol

`SPEC.md` is normative. This reference explains how to apply its user-model rules.

## Record kinds

Keep `fact`, `preference`, `constraint`, `observation`, `hypothesis`,
`trajectory`, `open_loop`, and `negative_feedback` distinct. Each entry records
source, source reference, timestamps, scope, confidence, confirmations, last use,
revalidation date, explicit/inferred origin, sensitivity, and status.

An inferred hypothesis never becomes a fact automatically. An observation does
not become a preference without supporting feedback. Current repository state is
project context, not user memory.

## Outcomes

Use only observable outcomes: `explicit_accept`, `explicit_reject`, `adopted`,
`reverted`, `corrected`, `ignored`, and `unknown`. Silence or unavailable usage
data is `unknown` and changes no score.

## Prediction records

Next-move prediction reads and writes four record shapes:

| Record | Kind | Written when | Used for |
|---|---|---|---|
| Trajectory `A → B → C (seen N×)` | `trajectory` | the user's next request followed the previous one, observed | predicting the next step from the session tail |
| Hit `domain: move` | `observation`, then `preference` after repeated support | a predicted move was requested, kept, or built on | raising that kind of move one rung |
| Miss `domain: move` | `negative_feedback` | a move was removed, reverted, or declined | lowering it one rung; an explicit "never" blocks it |
| Open loop | `open_loop` | an offer or placeholder is left unresolved | re-offering once at the next relevant task |

Rules:

- record the sequence of **requests**, in the user's terms, not your internal
  steps; one line each, with a date;
- a trajectory seen once is a hypothesis; it becomes reliable evidence from the
  third observation;
- a request you failed to predict is the best trajectory candidate: store
  `previous request → this request`;
- when the store is small (Hermes `USER.md`, a short rules file), keep only
  explicit constraints, explicit "never" feedback, and the strongest two or
  three trajectories;
- the portable store is `~/.step-beyond/user-patterns.md`; when the host has
  its own memory, that store is the owner and the portable file is not written.

## Safety and control

- reject secrets and unnecessary personal data before persistence;
- isolate user namespaces from project facts and global heuristics;
- expose inspection, correction, deletion, audit, and rollback;
- prefer minimal, scoped entries with revalidation dates;
- never claim durability unless a write and reload were observed.

Prompt-only hosts may track context in-session but must label it non-durable. The
reference implementation is documented in `docs/runtime.md`.
