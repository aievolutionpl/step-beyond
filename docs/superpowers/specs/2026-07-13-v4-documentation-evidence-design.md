# Step Beyond v4 Documentation and Evidence Design

## Goal

Make the v4 repository internally consistent, evidence-honest, and professionally
presented without restoring behavior that v4 intentionally removed.

## Source of truth

`SPEC.md` remains the only normative behavioral source. Its canonical lifecycle
is:

`CONTEXT → INTENT → DECIDE → BUILD → INITIATIVE → EXECUTE → VERIFY → DELIVER → LEARN`

The memorable labels `RECALL`, `SCAN`, `EXPAND`, `POLISH`, `EXTEND`,
`ANTICIPATE`, `VERIFY`, and `SELF-IMPROVE` may be used in README capability
panels, but they are benefits rather than a second pipeline. Documentation will
map each label to one or more canonical lifecycle stages explicitly.

The fixed v3 `5/3/1` ceiling will not return. The approved v4 design states that
it was replaced by an adaptive initiative budget, and the runtime already tests
that policy.

## Documentation consistency

Active references and worked examples will use the v4 lifecycle, permission
classes, adaptive initiative, claim-scoped verification states, and conservative
learning terminology. Historical changelog entries and versioned eval reports
will retain their original wording because rewriting them would falsify the
record.

An automated documentation-contract test will compare the canonical lifecycle
declared in `SPEC.md` with the portable skill and README lifecycle mapping. It
will also reject active guidance that presents the fixed ceiling as current
behavior. This creates an executable drift check instead of relying on grep
alone.

## Evaluation evidence

The existing v4 benchmark contract is stronger than the stale request: it asks
for at least five repetitions per case in CI when cost permits and at least
twenty by default for performance or compatibility claims. Those requirements
remain.

The result template will make evidence gaps visible with fields for provider,
model/version, prompt/runtime/adapter versions, date, repetitions (`N`), and
`pass/N`. Its coverage table will enumerate the current case catalog and mark
unexecuted cases as `NOT RUN`. Memory cases will specify genuine cross-session
setup, persistence evidence, and pass/fail criteria without inventing results.

Historical Markdown reports remain clearly historical and keep their sample-size
limitations.

## Host coexistence

The adapter reference will define one owner for each responsibility when a host
already provides memory, verification, skills, or project instructions:

- host facilities provide transport and execution;
- `SPEC.md` supplies Step Beyond policy semantics;
- project facts stay separate from user memory;
- one verification record owns each material claim;
- native host memory is used only when its provenance, correction, deletion, and
  sensitivity behavior can satisfy the declared mode;
- otherwise the adapter degrades honestly to prompt-only or a Step Beyond store.

Claude Code and Cursor will receive concrete binding and deduplication examples.

## Slop detection

The slop reference will retain its domain coverage while converting loose lists
into operational entries. Every entry will include a pattern name, a detection
rule, and a repair. Checks will avoid arbitrary numeric guarantees and will not
treat stylistic preferences as universal defects without contextual evidence.

## README information architecture

`README.md` will become the complete English landing page. `README_PL.md` will
mirror its claims and structure in Polish. `README_CHATGPT.md` will retain a
smaller ChatGPT-specific scope while using the same capability mapping,
limitations, and evidence language.

The main README sequence will be:

1. banner, value proposition, version and honest operating modes;
2. “What Your Agent Gains” capability panel;
3. explicit capability-to-lifecycle map;
4. before/after explanation and hybrid architecture;
5. quick start and host integration paths;
6. memory, permission, initiative, verification, and evaluation behavior;
7. status and verified limitations;
8. requested AI Evolution Polska attribution footer.

Claims such as “zero broken additions”, universal host support, acceptance rate,
or follow-up reduction will not appear as measured facts without repeated eval
evidence. The copy will describe mechanisms and intended benefits instead.

## Verification

The final gate will run:

- the full Node test suite;
- TypeScript typechecking;
- the deterministic runtime eval;
- documentation drift and link checks;
- searches for obsolete active pipeline and fixed-ceiling language;
- searches for unsupported quantitative or absolute README claims;
- English/Polish/ChatGPT version and lifecycle mapping checks.

Any result not established by these checks will be reported as unverified or
left as an explicit future measurement, never promoted to a fact.
