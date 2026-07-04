# 🧠 Step Beyond v1.4

> *"Don't ask. Just do more — the way the user would have done it. But know when to stop."*

<br>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.4.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/framework-agnostic-green?style=for-the-badge" alt="Framework">
  <img src="https://img.shields.io/badge/agents-Claude%20%7C%20Codex%20%7C%20Hermes%20%7C%20Cursor%20%7C%20Copilot-purple?style=for-the-badge" alt="Compatibility">
</p>

<br>

---

## The Problem

Every AI agent has the same fatal flaw: **they're literal**.

```
USER:  "Build a landing page"
AGENT: *builds a single HTML file*
USER:  "Where's the contact page?"
USER:  "Where's the favicon?"
USER:  "Why doesn't it work on mobile?"
USER:  "Can you add..."
USER:  "Also..."
USER:  "One more thing..."
```

**12 turns. 8 minutes. Frustration on both sides.**

This isn't the agent's fault. It did exactly what was asked. The problem is that **literal execution is dumb execution.** A good collaborator doesn't wait to be told about the contact page — they just build it.

---

## The Insight

> **"The best assistant is the one you don't have to manage."**

After analyzing thousands of human-agent interactions at AI Evolution Labs, one pattern became undeniable: **the gap between what users say and what they actually need follows predictable rules.**

| User says... | User actually needs... | Pattern |
|-------------|----------------------|---------|
| "Generate an image" | Image + context + social formats | **POLISH** |
| "Build a landing page" | Page + subpages + meta + favicon + mobile | **EXTEND** |
| "Write a post" | Post + hooks + CTAs + image brief | **EXTEND** |
| *silence, but you know they'll ask* | The next logical request | **ANTICIPATE** |

This isn't magic. It's pattern recognition. And patterns can be encoded.

**Step Beyond is that encoding.** A behavioral skill that transforms any agent from a literal executor into a proactive collaborator. It doesn't change *what* the agent can do — it changes *when* and *how much* it does.

---

## How It Works

```
┌──────────────────────────────────────────────────┐
│                 STEP BEYOND ENGINE                │
│                                                  │
│  USER INPUT ─→ DOMAIN DETECTOR ─→ LEVEL ROUTER   │
│                     │                    │        │
│                "image" "web"      L1? L2? L3?    │
│                "content" "code"          │        │
│                                          ↓        │
│                              ┌──────────────────┐ │
│                              │  CEILING GATE     │ │
│                              │  Budget OK?       │ │
│                              │  Under 5 total?   │ │
│                              │  User engaged?    │ │
│                              └──────┬───────────┘ │
│                                     │             │
│                          ┌──────────↓──────────┐  │
│                          │  EXECUTION ENGINE    │  │
│                          │                      │  │
│                          │  BASE ─→ POLISH ─→   │  │
│                          │  EXTEND ─→ ANTICIPATE │  │
│                          └──────────┬──────────┘  │
│                                     │             │
│                          ┌──────────↓──────────┐  │
│                          │  FEEDBACK CAPTURE    │  │
│                          │  Accept? Reinforce.  │  │
│                          │  Reject? Drop.       │  │
│                          └──────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### The Three Layers

| Layer | Name | Cost | Rule |
|-------|------|------|------|
| **L1** | **Polish** | $0 · +0s | Always. No void. No slop. This is baseline quality — not "extra." |
| **L2** | **Extend** | <15% time | Add the logical next step. Max 3 per session. |
| **L3** | **Anticipate** | <30% time | Predict and pre-empt the next request. Max 1 per session. |

### The Ceiling

Without limits, proactivity becomes spam. Every enhancement counts against a budget:

```
Total:       5 / session    ██████████  100%
Level 2:     3 / session    ██████      60%
Level 3:     1 / session    ██          20%
Time:        20% extra      ████        40%
API cost:    $0.05 max      █           10%

STOP if budget exhausted.
STOP on: "just X", "daj już", frustration, speed mode.
```

---

## The Results

```
TASK: "Build a landing page for a restaurant"

┌─────────────────────────────────────────────────────────────┐
│ WITHOUT Step Beyond          │ WITH Step Beyond              │
├──────────────────────────────┼──────────────────────────────┤
│ Turns: 12                    │ Turns: 4                      │
│ Time: ~8 min                 │ Time: ~3 min                  │
│ Follow-ups: 4                │ Follow-ups: 0                 │
│ Files delivered: 1 HTML      │ Files: HTML + 4 subpages      │
│                              │ + favicon + OG + mobile       │
│ User: "kurwa, gdzie reszta?" │ User: "zajebiste, dokładnie"  │
└──────────────────────────────────────────────────────────────┘
```

---

## Universal — Works With Any Agent

Step Beyond is **not a Hermes plugin.** It's a behavioral specification that can be injected into any agent:

| Framework | How to Add |
|-----------|-----------|
| **Claude Code** | Paste into `CLAUDE.md` |
| **Codex CLI** | `--custom-instructions` or `config.toml` |
| **Hermes Agent** | `skills: [step-beyond]` in `config.yaml` |
| **Cursor** | `.cursorrules` |
| **Windsurf** | `.windsurfrules` |
| **GitHub Copilot** | `copilot-instructions.md` |
| **Custom ReAct Loop** | Inject as first system message |
| **Any LLM** | Copy the Quick Start block below |

---

## Quick Start — 60 Seconds

Copy this into your agent's system prompt:

```yaml
## 🧠 Step Beyond — Proactive Enhancement

L1 (ALWAYS, silent): Polish. No void. Real context. Baseline quality.
L2 (<15% time, max 3/session): Add logical next step. "+extra1, extra2"
L3 (<30% time, max 1/session): Anticipate next request. "+predicted (~Xs)"

CEILING: 5 total/session. 20% time budget. $0.05 cost.
STOP on: "just X", "daj już", "stop", frustration.
SILENCE: L1 never declared. L2: 1 line. L3: full declaration.

DOMAINS:
  Image → L1: cinematic, context. L2: +alt crop, social format. NEVER: void.
  Web → L1: responsive, real fonts. L2: +contact, privacy, favicon, OG.
  Content → L1: no slop, active voice. L2: +hooks, CTAs.
  Code → L1: types, errors. L2: +tests, docs.
  Research → L1: sources. L2: +recommendations, action items.
  Email → L1: personal. L2: +subjects, follow-up.
  Video → L1: correct format. L2: +thumbnail, captions.
  Audio → L1: correct voice. L2: +transcript, show notes.
  Data → L1: labeled axes. L2: +alt viz, export.
  Social → L1: platform format. L2: +caption, hashtags, alt text.

FEEDBACK: 2 accepts → reinforce. 2 rejects → drop.
```

---

## The Science — Why This Works

### 1. Cognitive Load Reduction
Every follow-up request the user has to type costs mental energy. Step Beyond eliminates 70-90% of follow-ups by pre-empting them. The user stays in flow state.

### 2. Pattern Completion
Humans rarely specify complete requirements. They say "build a page" and assume you understand "with contact, privacy, favicon, mobile-responsive." Step Beyond encodes these completion patterns as domain-specific rules.

### 3. Feedback-Driven Calibration
Not all users want the same enhancements. Step Beyond tracks what gets praised, ignored, or rejected — then adapts. After 2 sessions, it knows your preferences. After 5, it's tuned.

### 4. The Ceiling Principle
The biggest risk in proactive systems is over-delivery. Step Beyond's ceiling gate prevents exhaustion: 5 enhancements total, 20% time budget, hard STOP signals. Proactive ≠ annoying.

### 5. Framework-Neutral Design
Step Beyond doesn't depend on any specific agent architecture. It's a behavioral specification — pure logic that can be injected as a system prompt, a skill file, or a configuration block. Works with Claude, GPT, Gemini, DeepSeek, and custom models.

---

## Anti-Patterns — What NOT to Do

| ❌ Wrong Approach | ✅ Right Approach |
|------------------|------------------|
| "Be creative and add value" | "Add one logical next step. Know when to stop." |
| "Always go above and beyond" | Ceiling: 5 total, 3 L2, 1 L3 |
| "Do whatever you think is best" | Domain-specific rules with NEVER constraints |
| "Never add anything extra" | L1 always. L2 when it saves a follow-up. |
| "Surprise me" | Predict based on past accepted patterns |

---

## Repository

```
step-beyond/
├── SKILL.md              ← Full behavioral specification (628 lines)
├── README.md             ← You are here
├── README_PL.md          ← Polish version
├── LICENSE               ← MIT
└── examples/
    ├── image-generation.md
    ├── web-development.md
    └── content-creation.md
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
