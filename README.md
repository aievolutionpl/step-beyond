# 🧠 Step Beyond v3.0

> *"Don't ask. Just do more — the way the user would have done it. Verify it. Remember what worked. And know when to stop."*

<br>

<p align="center">
  <img src="https://img.shields.io/badge/version-3.0.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/framework-agnostic-green?style=for-the-badge" alt="Framework">
  <img src="https://img.shields.io/badge/memory-Obsidian%20%7C%20MCP%20%7C%20mem0%20%7C%20files-orange?style=for-the-badge" alt="Memory">
  <img src="https://img.shields.io/badge/agents-Claude%20%7C%20Codex%20%7C%20Hermes%20%7C%20Cursor%20%7C%20Copilot-purple?style=for-the-badge" alt="Compatibility">
</p>

<br>

---

## The Problem

Every AI agent has the same fatal flaws: **they're literal, they're forgetful, and they overclaim.**

```
USER:  "Build a landing page"
AGENT: *builds a single HTML file* "Done! ✅"
USER:  "Where's the contact page?"
USER:  "Where's the favicon?"
USER:  "Why doesn't it work on mobile?"
USER:  "...and the form is broken. Did you even open it?"
USER:  (next week) "I told you last time — our colors are navy and gold."
```

**12 turns. 8 minutes. Frustration on both sides. Repeated next session, from zero.**

A good collaborator doesn't wait to be told about the contact page — they build it. They don't ship a form they never submitted. And they don't ask for your brand colors twice.

---

## The Insight

> **"The best assistant is the one you don't have to manage."**

The gap between what users say and what they need follows predictable rules — and *this user's* rules are learnable:

| User says... | User actually needs... | Mechanism |
|-------------|----------------------|-----------|
| "Generate an image" | Image + context + social formats | **POLISH** |
| "Build a landing page" | Page + subpages + meta + favicon + mobile | **EXTEND** |
| *silence, but you know they'll ask* | The next logical request | **ANTICIPATE** |
| "Done! ✅" *(agent's claim)* | Proof it actually works | **VERIFY** |
| *same request, new session* | Their preferences, already applied | **MEMORY** |

**Step Beyond encodes all five.** A behavioral skill that transforms any agent from a literal executor into a proactive collaborator that learns.

---

## How It Works — The Pipeline

```
┌────────────────────────────────────────────────────────────┐
│                    STEP BEYOND v3 ENGINE                    │
│                                                            │
│  USER INPUT                                                 │
│      │                                                      │
│      ▼                                                      │
│  0. RECALL ─── read user patterns from ANY memory store     │
│      │         (Obsidian · MCP memory · mem0 · plain file)  │
│      ▼                                                      │
│  1. EXPAND ─── upgrade the prompt they gave into the        │
│      │         prompt they meant (intent brief)             │
│      ▼                                                      │
│  2. BUILD ──── base + L1 polish (always, silent)            │
│      │                                                      │
│      ▼                                                      │
│  3. EXTEND ─── L2 (max 3) + L3 (max 1), ceiling-gated,      │
│      │         memory-driven  [subagents: parallel]         │
│      ▼                                                      │
│  4. VERIFY ─── run it · render it · click it                │
│      │         slop scan · claim audit                      │
│      │         can't verify? CUT IT.  [subagents: fresh-    │
│      │         context verifier]                            │
│      ▼                                                      │
│  5. DELIVER ── base first, additions in ≤4 words each       │
│      │                                                      │
│      ▼                                                      │
│  6. LEARN ──── accepted? → default next time                │
│                rejected 2×? → banned forever                │
│                → written back to memory                     │
└────────────────────────────────────────────────────────────┘
```

### The Three Layers

| Layer | Name | Cost | Rule |
|-------|------|------|------|
| **L1** | **Polish** | $0 · +0s | Always. No void. No slop. Baseline quality — not "extra." |
| **L2** | **Extend** | <15% time | The missing piece. Max 3/session. Memory-selected first. |
| **L3** | **Anticipate** | <30% time | Predict the next request. Max 1/session. Trajectory-driven. |

### The Ceiling

```
Total:       5 / session    ██████████  100%
Level 2:     3 / session    ██████      60%
Level 3:     1 / session    ██          20%

STOP if budget exhausted.
STOP on: "just X", "only X", frustration, speed mode.
CUT any addition that can't be verified.
```

### The Memory (new in v3)

Works with **whatever memory the agent has** — one portable pattern file, any store:

```
Obsidian vault  →  {vault}/step-beyond/patterns.md
Memory MCP/mem0 →  document keyed "step-beyond:patterns"
CLAUDE.md       →  marked section, ≤40 lines
Plain files     →  step-beyond/patterns.md
Nothing         →  session-only mode (still learns within the session)
```

```
accept 2×  → REINFORCED  (default L2 from now on)
reject 2×  → BANNED      (never again)
ignore 3×  → DROPPED
result: ~60% addition acceptance cold → >85% by session 5
```

### The Verify Loop (new in v3)

```
BASE CHECK      exercise it the way the user will — open, run, click, read
ADDITION CHECK  every L2/L3, same bar. Unverifiable → becomes a suggestion.
SLOP SCAN       AI-slop index for text, code, design, image, data
CLAIM AUDIT     "works" / "tested" / "responsive" — only if observed
```

**A broken addition is worse than no addition. A false claim is worse than both.**

---

## The Results

```
TASK: "Build a landing page for a restaurant"

┌───────────────────────────────┬──────────────────────────────┐
│ WITHOUT Step Beyond           │ WITH Step Beyond v3          │
├───────────────────────────────┼──────────────────────────────┤
│ Turns: 12                     │ Turns: 4                     │
│ Follow-ups: 4                 │ Follow-ups: 0                │
│ Files: 1 HTML                 │ HTML + 4 subpages + favicon  │
│ Verified: never opened        │ Every link clicked, 375px ✓  │
│ Next session: starts from 0   │ Brand + preferences recalled │
└───────────────────────────────┴──────────────────────────────┘
```

---

## Universal — Works With Any Agent

| Framework | How to Add |
|-----------|-----------|
| **Claude Code** | `/plugin marketplace add aievolutionpl/step-beyond` → `/plugin install step-beyond@step-beyond` |
| **Claude Agent SDK / manual** | Copy `skills/step-beyond/` into `~/.claude/skills/` or paste block into `CLAUDE.md` |
| **Codex CLI** | `--custom-instructions` or `config.toml` |
| **Hermes Agent** | `skills: [step-beyond]` in `config.yaml` |
| **Cursor / Windsurf** | `.cursorrules` / `.windsurfrules` |
| **GitHub Copilot** | `copilot-instructions.md` |
| **OpenAI Agents SDK / CrewAI / LangGraph** | Inject core into orchestrator; map roles per `references/subagents.md` |
| **Custom ReAct Loop** | Inject as first system message |

Full instructions: [`skills/step-beyond/references/installation.md`](skills/step-beyond/references/installation.md)

---

## Quick Start — 60 Seconds

Copy this into your agent's system prompt:

```yaml
## 🧠 Step Beyond — Proactive Enhancement

PIPELINE: recall memory → expand intent → build base + L1 →
extend (L2 max 3, L3 max 1) → VERIFY (run it, slop scan, honest claims) →
deliver → learn (write patterns back to memory).

L1 (ALWAYS, silent): Polish. No void. Real context. Baseline quality.
L2 (<15% time, max 3): The missing piece. Memory-selected first. "+name"
L3 (<30% time, max 1): Anticipate the next request. "+name (~Xs)"

VERIFY: nothing ships unchecked. Can't verify an addition? Cut it.
Claim only what you observed — no unbacked "works"/"tested".

MEMORY (any store — Obsidian/MCP/file): accept 2× → default.
reject 2× → banned. Explicit instruction > memory > defaults.

CEILING: 5 total/session. STOP on: "just X", "only X", "stop", "enough".
SUBAGENTS (if available): parallel additions, fresh-context verifier.
```

---

## The Science — Why This Works

### 1. Cognitive Load Reduction
Every follow-up the user types costs mental energy. Step Beyond eliminates 70–90% of follow-ups by pre-empting them.

### 2. Pattern Completion
Humans rarely specify complete requirements. "Build a page" assumes contact, privacy, favicon, mobile. Step Beyond encodes these as domain rules — then overrides them with *this user's* learned patterns.

### 3. Memory-Driven Calibration
Domain defaults are a cold-start heuristic. The real signal is what *this user* accepted, rejected, and ignored — persisted in whatever memory exists, from Obsidian to a plain markdown file. After 5 sessions the agent isn't guessing anymore.

### 4. Trust Through Verification
Proactivity fails the moment one addition arrives broken — users stop reading all of them. The Verify Loop (run it, slop-scan it, audit every claim) is what makes 5 additions per session sustainable.

### 5. The Ceiling Principle
5 enhancements total, hard STOP signals, a permanent Banned list. Proactive ≠ annoying.

### 6. Framework-Neutral Design
Pure behavioral specification. System prompt, skill file, or config block. Claude, GPT, Gemini, DeepSeek, custom models.

---

## Anti-Patterns — What NOT to Do

| ❌ Wrong Approach | ✅ Right Approach |
|------------------|------------------|
| "Be creative and add value" | "Add one logical next step. Know when to stop." |
| "Always go above and beyond" | Ceiling: 5 total, 3 L2, 1 L3 |
| "Double-check your work" | The 4-step Verify Loop with Claim Audit |
| Ship 5 additions, 2 broken | Verify each — unverifiable becomes a suggestion |
| Re-ask brand colors every session | RECALL from the pattern file |
| "Surprise me" | Predict from this user's accepted patterns |

---

## Repository

```
step-beyond/
├── .claude-plugin/             ← Claude Code plugin + marketplace manifests
├── skills/step-beyond/         ← The skill (plugin layout)
│   ├── SKILL.md                ← Core behavioral spec
│   ├── references/             ← Progressive disclosure — loaded on demand
│   │   ├── memory.md           ← Memory Protocol (Obsidian/MCP/mem0/files)
│   │   ├── verification.md     ← Verify Loop + Fresh-Eyes Protocol
│   │   ├── slop.md             ← AI Slop Index (text/code/design/image/data)
│   │   ├── subagents.md        ← Orchestration: roles, firewall, templates
│   │   ├── domains.md          ← 10 domain decision trees
│   │   └── installation.md     ← Per-framework setup
│   └── templates/
│       ├── user-patterns.md    ← Starter memory file
│       └── core-injection.txt  ← Ready-to-inject core (custom loops)
├── evals/                      ← Behavioral regression suite + baseline results
├── examples/                   ← Before/after walkthroughs incl. memory-learning
├── CHANGELOG.md · CONTRIBUTING.md · LICENSE (MIT)
├── README.md                   ← You are here
└── README_PL.md                ← Polish version
```

---

<br>

<p align="center">
  <b>Created with obsessive attention to detail by</b>
</p>

<p align="center">
  <a href="https://aievolutionlabs.io">
    <b>AI EVOLUTION LABS</b>
  </a>
</p>

<p align="center">
  <sub>Jersey · Channel Islands · 2026</sub>
</p>

<p align="center">
  <sub>MIT License — Use it. Remix it. Ship it. Just don't remove the attribution.</sub>
</p>

<br>
