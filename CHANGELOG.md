# Changelog

All notable changes to Step Beyond. Format follows [Keep a Changelog](https://keepachangelog.com/); versions follow SemVer.

## [Unreleased]

## [3.3.0] — 2026-07-07 · The Initiative & Onboarding Release

### Added
- **Initiative Doctrine** (`references/initiative.md`): the "think like an LLM engineer" reasoning standard that decides *how* additions are chosen while the pipeline runs — not a new stage. Contents: the executor→owner mindset (done-state / gap / failure / trajectory), the **Initiative Derivation** (a 7-step method for producing a *specific* next step instead of generic filler), the **5-rung Initiative Ladder** (REPAIR / COMPLETE / SAVE / ANTICIPATE / **PROPOSE**) whose top rung surfaces a big out-of-scope move — a refactor, schema change, or security sweep — in one line rather than silently building or silently discarding it, a Good-vs-Generic worked contrast table, the engineer's system reflexes (interface / null-path / observability / second-caller / reversibility), and guardrails keeping initiative subordinate to the ceiling, STOP, memory, and VERIFY.
- **Agent Onboarding Ritual** (`references/onboarding.md`): the once-per-host first-run choreography, elevated from a buried install step to a first-class capability. Six beats (detect → wire → seed → calibrate → announce → activate); **per-host onboarding profiles** for Claude Code, Codex, Hermes, and OpenClaw (what wires natively, what falls back); the bounded, honest **capability announcement** (one message, ≤5 lines, names only powers actually wired, always includes the STOP off-switch) with good/bad examples; cold-start vs. warm-start vs. re-onboard handling; a degraded-environment table; the initiative-from-turn-one handoff; and an onboarding anti-patterns list. Distinguished explicitly from `examples/codebase-onboarding.md` (onboarding a *human* to a codebase).
- **Per-Host Initiative Notes** (`references/adapters.md` §5, new): the concrete quality delta each of the four best-tuned hosts unlocks — Claude Code (parallel EXTENDERs + fresh-context browser-clicking VERIFIER), Codex (deep + execution-verified, honest solo Fresh-Eyes), Hermes (skills-as-agents for parallel roles), OpenClaw (`AGENTS.md`-first, always-on initiative) — with the invariant that a leaner host is tuned differently, never "lesser."

### Changed
- **Core Instruction** (`SKILL.md` + `templates/core-injection.txt`): both gain an identical `INITIATIVE` clause — advance the goal, not the prompt; every addition explainable in one sentence tied to the specific request; name (don't silently build/swallow) the bigger out-of-scope move. Kept canonical/identical across both files.
- **`SKILL.md`**: new "Initiative Principle" section after the Core Instruction; progressive-disclosure table wired to `initiative.md` and `onboarding.md` (top two rows); adapters row notes per-host quality; version → 3.3.0 with a new version-history row; skill description extended (initiative + self-onboarding).
- **`references/installation.md`**: the Self-Install section now points at the onboarding ritual as the step that wakes the freshly-installed agent up.
- **`SPEC.md`**: new normative **§12 Agent Onboarding** (SHOULD-level six-beat ritual, honest announcement, no-block, warm-start) and **§13 Initiative** (derive-don't-checklist selection, cheapest-verifiable-step-forward, one-line PROPOSE for out-of-scope moves) — both explicitly subordinate to the ceiling, STOP, precedence, and claim-audit rules.
- **READMEs** (`README.md`, `README_PL.md`): new two-layer INITIATIVE/ONBOARDING callout under the capability panel; new "Initiative Layer" and "First-Run Onboarding" sections with worked examples; repository tree lists the two new references; self-install prompt now asks the agent to run onboarding and return its capability announcement; version badges → 3.3.0 (PL header → v3.3); PL "Universal" table gained OpenClaw/opencode + Gemini CLI rows for parity.
- **Plugin manifests** (`.claude-plugin/plugin.json`, `marketplace.json`): version → 3.3.0; descriptions and keywords note initiative + onboarding.
- **`references/memory.md`**: clarified that an agent re-shipping an addition in a later session is *not itself* an accept signal — promotion to Reinforced requires an observed user reaction (use, praise, silent build-on-top), never just a repeat delivery. Found via a targeted eval run (`evals/results/2026-07-06-benchmark.md`) where an agent correctly avoided this trap on its own; the spec didn't say so explicitly.
- **`SKILL.md`** (Ceiling section): added a BASE-vs-EXTEND rule for edits to previously-shipped artifacts — wiring a new page into existing nav, fixing an import, etc. is BASE (required for the ask to work) and doesn't cost ceiling budget; a genuinely optional add-on riding along does and counts as EXTEND.
- **`references/verification.md`** (Claim Audit): added a third verification outcome between "verified" and "untested" — partial verification, where some checks are blocked by infrastructure (sandbox network policy, missing credentials) rather than by the deliverable itself. Claims must be scoped to exactly what was checked, with the specific blocker named for what wasn't.
- **`evals/README.md`**: added guidance for multi-turn cases (B2/B3/C3/C4) to resume the same spawned agent instance for turn 2+ rather than re-describing turn 1 in a single prompt where the harness supports it; added a reminder to independently verify artifacts rather than trust self-reports, and a sample-size note (run each case 3×+ before treating pass rate as a release gate).

## [3.2.0] — 2026-07-06 · The Environment-Awareness Release

### Added
- **Environment Scan** (`references/environment-scan.md`): RECALL gains a second, always-available source alongside memory — reading manifests (`package.json`/`pyproject.toml`/`Cargo.toml`/`go.mod`), `git log`/blame, directory structure, existing code style, config/CI/lint files, and docs (`README.md`/`CLAUDE.md`/`AGENTS.md`) before acting. No pipeline stage added — this enriches step 0 (RECALL) only, preserving the 7-stage shape. Read-only, budget-capped, session-cached, and explicit about what it never opens (secrets/.env/credentials).
- **Four new examples**: `examples/code-development.md` (CODE — environment scan before writing code), `examples/codebase-onboarding.md` (domain-agnostic flagship — full onboarding trace: README/tree/git log/CI → tour + verified run instructions + predicted first task), `examples/research-analysis.md` (RESEARCH — claim audit + sourced anticipation), `examples/self-improvement-loop.md` (cross-cutting — the per-agent Self-Improvement loop worked across three unrelated users, the first example of this loop anywhere in the repo).
- **`examples/README.md`**: documents the de facto Bad/Good/Why/More-Examples/Triggers format, indexes every example file by domain, and states transparently which of the 11 domains still lack a dedicated example.

### Changed
- **Precedence rule** now five-tier: `explicit instruction > user memory > environment (ground truth) > agent self-notes > domain defaults` (was four-tier, and inconsistently three-tier in `references/memory.md` and SKILL.md's Memory section). Reconciled across `SKILL.md` (Core Instruction + Mental Model + Memory section), `templates/core-injection.txt`, `references/memory.md`, `references/self-improvement.md`, `examples/memory-learning.md`, and `SPEC.md` §2/§7.
- **`SKILL.md` / `core-injection.txt` reconciled to one canonical wording** — the two files had drifted (three-tier vs four-tier precedence); the Core Instruction block is now identical in substance in both places.
- **EXPAND's Intent Brief** gains an `ENVIRONMENT` line (`SKILL.md`) between `IMPLIED` and `MEMORY`.
- **Capability panel**: `SKILL.md` and `README.md`/`README_PL.md` gain a `SCAN` row (eight instincts, was seven), and the Core Instruction / pipeline diagrams note environment scanning inside RECALL.
- **Domain count fixed**: "10 domains" → "11 domains" (`SKILL.md` progressive-disclosure table and priming-examples closer; `README.md`/`README_PL.md` repository-tree comments).
- **`references/domains.md`**: CODE/WEB/DATA/TECHNICAL RECALL lines note that stack/conventions may come from an environment scan when memory hasn't seen the repo yet.
- **`examples/image-generation.md`**: added a RECALL step to its trace, for consistency with the other example files.
- **`examples/web-development.md`**: added an explicit `ENVIRONMENT` trace step (reads `package.json`, existing component conventions, `git log`) — the flagship demonstration of environment-scanning.
- **`examples/content-creation.md`**: the L3 next-post prediction is now shown as earned from an observed trajectory/pattern signal, not asserted for free.
- **`examples/memory-learning.md`**: added a scope note distinguishing the per-user Memory loop shown here from the new per-agent Self-Improvement loop (`examples/self-improvement-loop.md`).
- **`SPEC.md`**: §2 RECALL definition extended to name environment inspection as an available source; §7 precedence updated to five-tier with a clarifying sentence that environment supplies/corrects factual context but never outranks an explicit instruction or a `Banned` entry.
- **Quick Start reworked around agent self-install** (`README.md`, `README_PL.md`): the primary path is now "hand your agent the repo link" — a copy-paste prompt that tells any coding agent to read the install docs, detect its own host, and wire the skill in. Manual paths (Claude Code plugin, core-block paste) demoted to a secondary "prefer to do it yourself?" block. The "Universal" section links up to the self-install path.
- **New `Self-Install (agent-driven)` section** in `references/installation.md`: a deterministic 5-step recipe (detect host → install by matching method → wire memory/self-notes → verify → report & activate) with a host-signal→target table and an idempotency rule, written for an agent to follow when handed the repo link.
- Plugin manifest (`.claude-plugin/plugin.json`) and version badges (`README.md`, `README_PL.md`) bumped to 3.2.0.

## [3.1.0] — 2026-07-05 · The Self-Improvement Release

### Added
- **Self-Improvement Loop** (`references/self-improvement.md`): a per-agent complement to per-user memory. Each L2/L3 is attributed to the heuristic that produced it; at LEARN the outcome is scored (hit reinforces, miss prunes), heuristics below a firing threshold stop firing, breaks that reach the user become permanent verify checks, and missed slop becomes a new detector. Separate `Agent Self-Notes` store (heuristics only — never user data), confidence math, graceful session-scoped fallback. Wired into the pipeline's LEARN step and the Core Instruction.
- **Universal Adapter Architecture** (`references/adapters.md`): the core is bound to any host through five capability slots — `memory`, `self-notes`, `subagents`, `runtime`, `injection` — resolved once at session start to a host capability or its documented fallback. Includes a host capability matrix, adapter conformance rules, and a 4-step porting guide.
- **First-class host support**: OpenClaw, opencode, Gemini CLI, and Amp / Aider / Cline / Roo added to `references/installation.md` (all via the marked `AGENTS.md`/rules core block).
- **Visual capability panel + compatibility strip** at the top of `SKILL.md` and `README.md`: an icon-per-superpower table (RECALL/EXPAND/POLISH/EXTEND/ANTICIPATE/VERIFY/SELF-IMPROVE) with the fallback each degrades to, plus a "runs on any agent" strip and a literal-vs-Step-Beyond contrast block.

### Changed
- **Precedence rule** now four-tier: explicit instruction > user memory > agent self-notes > domain defaults (was three-tier). Updated in SKILL.md, core-injection, SPEC §7.
- **SPEC.md**: LEARN stage (§2) updated to include heuristic scoring; new normative §10 (Self-Improvement Loop) and §11 (Adapter Capability Contract).
- **Core Instruction / `core-injection.txt`**: LEARN step gains the self-scoring clause; identity line becomes "an extension of the user's thinking that improves with every task."
- **Plugin manifests** bumped to 3.1.0; descriptions and keywords updated (`self-improvement`, `agent-adapter`).
- READMEs and version-history tables updated for v3.1; framework table expanded with OpenClaw / opencode / Gemini CLI / Amp / Aider / Cline / Roo.

## [3.0.0] — 2026-07-04 · The Learning Release

### Added
- **7-step pipeline**: RECALL → EXPAND → BUILD → EXTEND → VERIFY → DELIVER → LEARN.
- **Memory Protocol** (`references/memory.md`): store-agnostic pattern learning — Obsidian, memory MCP, mem0, `CLAUDE.md`, plain files. Portable User Pattern File (Profile / Reinforced / Banned / Watching / Trajectories), promote/ban/decay lifecycle, precedence rules.
- **EXPAND step**: silent prompt upgrade — the request is decompressed into an intent brief (goal, audience, implied requirements, memory constraints, done-criteria) before building.
- **Verify Loop** (`references/verification.md`): base check, addition check (unverifiable → cut to suggestion), slop scan, claim audit; failure protocol; Fresh-Eyes Protocol for solo agents.
- **AI Slop Index** (`references/slop.md`): detection lists for text, code, web/design, image, and data deliverables.
- **Subagent orchestration** (`references/subagents.md`): builder / extender / verifier / critic roles, Verifier Firewall, spawn-vs-solo rules, prompt templates.
- **Claude Code plugin packaging**: `.claude-plugin/plugin.json` + `marketplace.json`; skill moved to `skills/step-beyond/` (plugin layout).
- **Eval suite** (`evals/`): 15 behavioral cases across 4 series (proactive delivery, STOP compliance, memory, verification) + results template and a real baseline run (`evals/results/2026-07-04-baseline.md`) — A1 and B1 pass; with-skill agent verified its page in headless Chromium and wrote memory back, control agent shipped an unopened file with unverified claims.
- **Open Loops** memory section (discovered during the baseline eval — the test agent invented it, and it earned its place): unfinished threads awaiting user input, closed before anything new is added next session.
- Core clarification from eval finding: STOP words kill L2/L3, never L1 quality or verification of what is touched.
- **Templates**: starter `user-patterns.md` memory file, ready-to-inject `core-injection.txt` (~450 tokens).
- New example: `examples/memory-learning.md` — three sessions from cold start to trajectory prediction.

### Changed
- Domain trees moved to `references/domains.md` and extended with RECALL + VERIFY lines per domain, plus a no-match fallback.
- SKILL.md restructured for progressive disclosure (core < 500 lines; deep protocols load on demand).
- Installation guide expanded: Claude Code plugin install, OpenAI Agents SDK / CrewAI / LangGraph, memory wiring table.
- READMEs (EN/PL) rewritten for v3 and kept in sync.
- Repository links corrected to `github.com/aievolutionpl/step-beyond`.

## [2.0.0] — 2026-07-04
Engineered for token efficiency. Core Instruction block. Priming examples. Mental model diagram. Trajectory prediction signals. Token-optimized decision trees.

## [1.5.0] — 2026-07-04
Full internationalization. FAQ. Version History. 6-framework installation.

## [1.4.0] — 2026-07-04
Best Practices for Proactive Agents — 8 universal patterns.

## [1.3.0] — 2026-07-04
THE CEILING: hard limits, silence mode, enough detector, decision trees v1.

## [1.0.0] — 2026-06-24
Initial release. 3 levels (Polish / Extend / Anticipate). 4 domains.
