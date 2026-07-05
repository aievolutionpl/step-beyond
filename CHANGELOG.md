# Changelog

All notable changes to Step Beyond. Format follows [Keep a Changelog](https://keepachangelog.com/); versions follow SemVer.

## [3.1.0] — 2026-07-05 · The Self-Improvement Release

### Added
- **Self-Improvement Loop** (`references/self-improvement.md`): a per-agent complement to per-user memory. Each L2/L3 is attributed to the heuristic that produced it; at LEARN the outcome is scored (hit reinforces, miss prunes), heuristics below a firing threshold stop firing, breaks that reach the user become permanent verify checks, and missed slop becomes a new detector. Separate `Agent Self-Notes` store (heuristics only — never user data), confidence math, graceful session-scoped fallback. Wired into the pipeline's LEARN step and the Core Instruction.
- **Universal Adapter Architecture** (`references/adapters.md`): the core is bound to any host through five capability slots — `memory`, `self-notes`, `subagents`, `runtime`, `injection` — resolved once at session start to a host capability or its documented fallback. Includes a host capability matrix, adapter conformance rules, and a 4-step porting guide.
- **First-class host support**: OpenClaw, opencode, Gemini CLI, and Amp / Aider / Cline / Roo added to `references/installation.md` (all via the marked `AGENTS.md`/rules core block).
- **Visual capability panel + compatibility strip** at the top of `SKILL.md` and `README.md`: an icon-per-superpower table (RECALL/EXPAND/POLISH/EXTEND/ANTICIPATE/VERIFY/SELF-IMPROVE) with the fallback each degrades to, plus a "runs on any agent" strip and a literal-vs-Step-Beyond contrast block.
- **Root `AGENTS.md`**: carries the marked core block so `AGENTS.md`-aware agents (Codex, opencode, OpenClaw, Amp, …) self-apply Step Beyond the moment they open the repo, with on-demand pointers into `references/`.
- **Machine-readable manifest** (`skills/step-beyond/capabilities.json`): pipeline, levels, ceiling, stop-words, claim-audit terms, precedence, memory lifecycle, self-improvement thresholds, capability slots, host list, and reference map as parseable data — so adapters and CI stop re-transcribing prose.
- **Repository validator** (`scripts/validate.py`) + **CI** (`.github/workflows/validate.yml`): checks JSON validity, version consistency across all files, reference-link resolution, and `core-injection.txt` ↔ SKILL.md core-block sync. (It caught real core-block drift on its first run.)
- **Eval coverage** for the new behaviors: Series E (self-improvement — sub-threshold heuristic suppression, miss downweighting, self-notes data hygiene) and Series F (adapter fallback — no-runtime, no-subagents, no-persistent-memory), added to the release pass bar.

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
