# Contributing to Step Beyond

Thanks for wanting to make agents less literal. Ground rules:

## What we accept

- **New domain trees** (`skills/step-beyond/references/domains.md`) — must include all six lines: TRIGGER, RECALL, L1, L2, L3, VERIFY, NEVER, and be backed by real usage, not speculation.
- **Slop patterns** (`references/slop.md`) — concrete, observed patterns with the "why it reads as slop" reasoning.
- **Eval cases** (`evals/cases.md`) — every behavioral claim in the spec should eventually have a case that can falsify it.
- **Framework installation recipes** (`references/installation.md`) — tested on the actual framework, with the exact config that worked.
- **Translations** — keep `README_PL.md` (and future languages) in sync with `README.md`; PRs that change one without the other will be asked to sync.

## The bar

1. **Token discipline.** This skill's core promise is behavioral impact per token. Every added line in SKILL.md or `core-injection.txt` must earn its tokens; deep material goes to `references/` (progressive disclosure).
2. **Run the evals.** Changes to the core instruction, ceiling, or any protocol require a fresh eval run (see `evals/README.md`) — at minimum all B and D cases. Attach the results file to the PR.
3. **No slop.** Contributions are checked against `references/slop.md`. Yes, really.
4. **One concept per PR.** A new domain tree and a README redesign are two PRs.

## Versioning

- Behavioral changes to the core instruction → **minor** bump (or major if pipeline shape changes).
- New reference content, examples, evals → **patch**.
- Update `CHANGELOG.md`, SKILL.md frontmatter `version`, and `.claude-plugin/plugin.json` together.

## License

MIT. By contributing you agree your contribution is MIT-licensed.
