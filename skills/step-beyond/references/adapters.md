# 🔌 Universal Adapter Architecture — One Core, Any Host

> **"The pipeline is the invariant. The adapter is the thin layer that binds it to whatever memory, subagents, and runtime the host happens to have."**

Step Beyond is one behavioral core (`SKILL.md` / `templates/core-injection.txt`). It runs on Claude Code, Codex, Hermes, OpenClaw, Cursor, opencode, Gemini CLI, and any custom loop **without forking the core** — because everything host-specific is isolated behind an adapter, and every capability degrades gracefully when a host lacks it.

```
        ┌─────────────────────────────────────────────┐
        │      STEP BEYOND CORE (host-agnostic)        │
        │  RECALL·EXPAND·BUILD·EXTEND·VERIFY·           │
        │  DELIVER·LEARN + self-improve · ceiling · STOP│
        └───────────────────────┬─────────────────────┘
                                 │  capability contract
        ┌────────────────────────┼────────────────────────┐
        │            │           │            │            │
     [memory]    [subagents]  [runtime]   [files]     [injection]
        │            │           │            │            │
   ┌────┴───┐   ┌────┴────┐  ┌───┴───┐   ┌────┴───┐  ┌─────┴─────┐
  MCP/mem0/  Task tool/   headless   fs / repo   skill / rules /
  Obsidian/  handoffs/    browser/   docs        AGENTS.md /
  file/none  crew/none    shell/none              config
```

The core never calls a host API directly. It calls **five capability slots**; each adapter wires the slots it can and leaves the rest to the documented fallback.

---

## 1. The Capability Contract (five slots)

Every adapter answers the same five questions once, at session start. This is the entire integration surface.

| Slot | Question | Wire to | Fallback if absent |
|------|----------|---------|-------------------|
| **memory** | Where do user patterns persist? | MCP memory, mem0, Obsidian, `AGENTS.md`/`CLAUDE.md` section, `patterns.md` | Session-only tracking |
| **self-notes** | Where do the agent's own heuristic scores persist? | Same store, separate key/section | Session-scoped scoring |
| **subagents** | Can independent work run in parallel / a fresh verifier spawn? | Task tool, handoffs, crew, graph nodes | Solo + Fresh-Eyes Protocol |
| **runtime** | Can the agent execute what it builds? | Shell, headless browser, test runner, REPL | Line-by-line trace + honest "untested" |
| **injection** | How does the core reach the model as first instruction? | Skill file, system prompt, rules file, config block | Paste `core-injection.txt` verbatim |

**Detection is cheap and once-per-session.** Probe, cache the answer, move on — never re-probe per message.

```
ON SESSION START:
  memory     = first available of [dedicated tool, vault, project file, writable fs] else session-only
  self-notes = same store, key "step-beyond:self-notes"                else session-scoped
  subagents  = host exposes spawn/handoff/crew?                        else solo
  runtime    = host exposes shell/browser/test?                        else trace-only
  injection  = done at install (skill / rules / config)
```

---

## 2. Host Capability Matrix

What each supported host provides out of the box. `⚠` = works via fallback, not native.

| Host | memory | self-notes | subagents | runtime | injection point |
|------|:------:|:----------:|:---------:|:-------:|-----------------|
| **Claude Code / Agent SDK** | MCP / `CLAUDE.md` / fs | ✅ | ✅ Task tool | ✅ shell + browser | skill (plugin) |
| **Codex CLI** | `AGENTS.md` / fs | ✅ | ⚠ solo | ✅ shell | `config.toml` / custom-instructions |
| **Hermes** | fs / vault | ✅ | ✅ skills-as-agents | ✅ shell | `config.yaml` skills |
| **OpenClaw** | `AGENTS.md` / fs | ✅ | ⚠ solo (or native if present) | ✅ shell | `AGENTS.md` + system prompt |
| **opencode** | `AGENTS.md` / fs | ✅ | ⚠ solo | ✅ shell | `AGENTS.md` / rules |
| **Cursor / Windsurf** | project rules / fs | ⚠ rules section | ⚠ solo | ✅ shell/tasks | `.cursorrules` / `.windsurfrules` |
| **Gemini CLI** | `GEMINI.md` / fs | ⚠ section | ⚠ solo | ✅ shell | `GEMINI.md` / system |
| **GitHub Copilot** | `copilot-instructions.md` | ⚠ section | ✗ | ⚠ IDE run | instructions file |
| **Amp / Aider / Cline / Roo** | project file / fs | ⚠ section | ⚠ varies | ✅ shell/edits | rules / system prompt |
| **OpenAI Agents SDK / CrewAI / AutoGen / LangGraph** | tool / store | ✅ | ✅ native | depends on tools | orchestrator instructions |
| **Custom ReAct loop** | whatever you wire | ✅ if wired | ✅ if implemented | tool-dependent | first system message |

The point of the matrix: **behavior is identical down every column.** A `⚠` never means "broken" — it means the core runs the documented fallback and the pipeline is unchanged.

---

## 3. Adapter Rules (what an adapter MUST preserve)

An adapter is allowed to compress wording for its host, but it MUST NOT change semantics. Non-negotiables (see `SPEC.md` §8):

1. **One shared ceiling.** 5/3/1 is global across every tool and subagent the host exposes — never per-agent.
2. **STOP before adding.** STOP words disable L2/L3 *before* any addition is proposed, in the host's own language too.
3. **Claim audit before delivery.** No "works/tested/responsive" without a check the host actually ran; if `runtime` is absent, the adapter labels output "untested" — it never fakes verification.
4. **Readiness ≠ benchmark.** An adapter must not present "files exist / installs cleanly" as proof the *model* follows the behavior.
5. **Fallbacks are mandatory, not optional.** A missing slot triggers its documented fallback; the adapter never disables a pipeline stage because a capability is absent.

An adapter that breaks any of these is non-conformant regardless of how well it fits its host.

---

## 4. Adding a New Host in 4 Steps

```
1. INJECT   — find the host's "first instruction" surface (skill / rules /
              system prompt / config). Point it at templates/core-injection.txt.
2. MAP      — fill the five capability slots. Unknown slot → use the fallback.
3. PROBE    — confirm detection at session start returns sane values (cache them).
4. VERIFY   — run 3 eval cases from evals/cases.md: one proactive-delivery,
              one STOP-compliance, one claim-audit. Green → the host is supported.
```

That is the whole porting cost. The core is never touched.

---

## 5. Per-Host Initiative Notes — Where Each Host Earns Extra Quality

The capability matrix (§2) says what wires natively. This section says what that *buys the user* — the concrete quality delta each of the four best-tuned hosts unlocks when the pipeline runs on it. Same behavior everywhere; the ceiling and the honesty rules never change. What changes is how much the host lets the agent do in parallel and how it proves its work. Initiative doctrine: `references/initiative.md`; first-run wiring: `references/onboarding.md`.

| Host | What its native slots unlock | Initiative sweet spot |
|------|------------------------------|-----------------------|
| **Claude Code / Agent SDK** | Fullest profile: Task-tool **subagents** + shell **and** headless browser. | Parallel EXTENDERs build independent L2s at once; a **fresh-context VERIFIER** (Verifier Firewall) checks large deliverables while the builder keeps moving. Runtime lets VERIFY actually *open and click* web output — the strongest evidence for a claim. Best host for Rung 3 anticipation on multi-file work. |
| **Codex CLI** | Shell runtime, solo. | No parallelism, so initiative goes *deep, not wide*: one strongly-verified addition beats three shallow ones. VERIFY runs real commands (tests, builds) — claims are execution-backed. Subagents fall back to the **Fresh-Eyes Protocol** (re-read the deliverable cold before delivery), declared honestly as solo. |
| **Hermes** | **Skills-as-agents** give real parallel roles + shell. | Onboard `step-beyond` **first** so it frames every later skill. The skills-as-agents model covers BUILDER/EXTENDER/VERIFIER roles natively — use them for the same parallel-additions + fresh-verifier plays as Claude Code, without the Task tool. |
| **OpenClaw** | `AGENTS.md` core loads first; shell runtime; solo (or native spawn if present). | Core-in-`AGENTS.md` means initiative is on from the very first task of every session — no per-task priming needed. Solo by default → Fresh-Eyes verify; if a build exposes native spawning, promote to parallel and update the profile. |

**The point:** a user on Codex is not getting a "lesser" Step Beyond — they're getting one tuned to go deep and verify by execution, honestly labeled where it can't parallelize. A user on Claude Code gets one that fans out and clicks through the result. The *judgment* (what to add, when to stop, what to propose vs. build) is identical; the host only decides the shape of the muscle behind it.

---

## 6. Anti-Patterns (adapter-specific)

| ❌ | ✅ |
|---|---|
| Forking core wording per host and letting them drift | One `core-injection.txt`; adapters point at it |
| Disabling VERIFY because the host has no runtime | Keep VERIFY; switch to trace + honest "untested" label |
| Per-agent ceilings in a multi-agent host | One global ceiling owned by the orchestrator |
| Faking `subagents` with sequential self-talk and calling it parallel | Declare solo; run Fresh-Eyes Protocol honestly |
| Storing user data in self-notes to "port learning" | Self-notes hold heuristics only; user data stays in the per-user file |
| Selling a leaner host as "lesser" or a fuller host as "required" | Same judgment everywhere; host decides parallelism + evidence type, not quality |
