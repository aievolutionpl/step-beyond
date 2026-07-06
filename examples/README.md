# Step Beyond — Examples

Worked traces of the pipeline described in [`skills/step-beyond/SKILL.md`](../skills/step-beyond/SKILL.md), one file per scenario. These are illustrative, not exhaustive — read a couple to internalize the shape, then trust the pipeline for everything not covered here.

## Format

Every file in this directory follows the same five sections, in order:

| Section | What it contains |
|---|---|
| **Bad (literal agent)** | What an agent without Step Beyond does with the same request — the baseline you're improving on |
| **Good (Step Beyond)** | The same request run through the pipeline: an internal trace (RECALL/ENVIRONMENT/EXPAND/BUILD/EXTEND/VERIFY where relevant) followed by what actually gets delivered |
| **Why** | One paragraph on the reasoning — why the additions are predictable, not arbitrary |
| **More Examples** | A compressed table of similar request → outcome pairs, same domain |
| **What Triggers Step Beyond Here** | The keyword/pattern list that matches this domain's tree in `references/domains.md` |

New examples should follow this shape. It keeps every file scannable in under a minute and diffable against the others.

## Index

| File | Domain(s) | Demonstrates |
|---|---|---|
| [`web-development.md`](web-development.md) | WEB | Full pipeline including an explicit environment scan (stack/conventions read before building) |
| [`code-development.md`](code-development.md) | CODE | Environment scan as the flagship capability — reads conventions, lint config, and test framework before writing code |
| [`codebase-onboarding.md`](codebase-onboarding.md) | cross-domain | Environment scan as its own capability, independent of any single domain: README, directory tree, git log, and CI read to produce a tour, verified run instructions, and a predicted first task |
| [`image-generation.md`](image-generation.md) | IMAGE | Memory-driven context (banned/reinforced) applied before generation, plus baseline polish |
| [`content-creation.md`](content-creation.md) | CONTENT | An L3 anticipation that's earned from an observed trajectory, not asserted for free |
| [`research-analysis.md`](research-analysis.md) | RESEARCH | Claim audit (every statement traced to a consulted source) plus sourced anticipation of the next ask |
| [`memory-learning.md`](memory-learning.md) | cross-cutting | The per-user **Memory** loop across three sessions — cold start to trajectory prediction |
| [`self-improvement-loop.md`](self-improvement-loop.md) | cross-cutting | The per-agent **Self-Improvement** loop across three unrelated users — heuristic confidence rising/falling, independent of any one user's preferences |

`memory-learning.md` and `self-improvement-loop.md` are a deliberate pair: the first shows the agent getting better *for one user*, the second shows it getting better *at the job, for everyone*. Read them back to back — see `references/self-improvement.md` §"Interaction With Memory" for how the two loops relate.

## Domain Coverage

`references/domains.md` defines 11 domain trees: IMAGE, WEB, CONTENT, CODE, RESEARCH, EMAIL, TECHNICAL, VIDEO, AUDIO, DATA, SOCIAL.

Dedicated examples currently exist for: **IMAGE, WEB, CONTENT, CODE, RESEARCH**, plus two cross-cutting examples (memory, self-improvement) and one domain-agnostic flagship (onboarding).

**Not yet covered:** EMAIL, TECHNICAL, VIDEO, AUDIO, SOCIAL. If you write one, follow the format above and add a row to the index — see [`CONTRIBUTING.md`](../CONTRIBUTING.md).
