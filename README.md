# 🧠 Step Beyond — Proactive Enhancement Layer

> **"Don't just do what's asked. Be an extension of the user's thinking."**

A behavioral skill that transforms AI agents from literal executors into **proactive collaborators**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.2.0-blue)]()

---

## What is Step Beyond?

**Step Beyond** is a framework-agnostic behavioral skill for AI agents. It adds a **proactive enhancement layer** on top of any agent's normal behavior.

Instead of just executing commands literally, a Step Beyond agent:

- **Polishes** — never delivers "an object in a void"
- **Extends** — adds logical next steps without being asked
- **Anticipates** — predicts what the user will ask for next

---

## 🔺 Three Levels

| Level | Name | Cost | Example |
|-------|------|------|---------|
| **1** | **Polish** | $0, +0s | Woman in cinematic scene, not white void |
| **2** | **Extend** | <15% time | Landing page + contact + privacy + favicon |
| **3** | **Anticipate** | <30% time | "They'll want this on Instagram" → prepare format |

---

## 🎯 What Makes v1.2 Different

- 📊 **Outcomes Rubric** — 5-criterion scoring for enhancement quality
- 🔄 **Feedback Loop** — agent learns which enhancements you accept/reject
- ⚠️ **Anti-Overuse Fingerprinting** — detects when same enhancement is overused
- 💰 **Cost Awareness** — every Level 2-3 declares time impact
- 🔬 **Pre-Delivery Gate** — 5-second mental checklist before output
- 📋 **Enhancement Scorecard** — weighted scoring (Relevance ×3, Surprise ×2, etc.)
- 🧬 **Dreaming Integration** — findings feed into self-improvement cycles
- 🌐 **8 Domain Categories** — Image, Web, Content, Research, Video, Audio, Email, Social

---

## 📦 Installation

Copy `SKILL.md` to your agent's skills directory:

```bash
cp SKILL.md ~/.hermes/skills/step-beyond/SKILL.md
```

Or for other frameworks — the skill is framework-agnostic. Just inject it as a system prompt layer.

---

## 🔧 Usage

The skill loads **first** in the agent's skill chain:

```
1. step-beyond        ← Behavioral foundation
2. [quality gate]     ← Anti-slop, style rules
3. [brand context]    ← Brand-specific preferences
4. [task-specific]    ← Domain skills (imagegen, web-dev, etc.)
```

### Example

```
USER: "Build a landing page"

AGENT:
  ✅ Landing page built (as requested)
  ➕ Polish: responsive mobile-first, proper typography hierarchy
  ➕ Extend: contact page, privacy policy, favicon, OG image (adds ~2min)
```

---

## 🧠 How It Learns

Step Beyond tracks your reactions:

| Signal | What it learns |
|--------|---------------|
| You say "nice!" | Reinforce — this pattern works |
| You say "too much" | Mark as rejected, never repeat |
| You use the enhancement | Upgrade — this is exactly right |
| You ignore it 3× | Drop from rotation |

Nightly, findings feed into **Dreaming** (self-improvement cycles) so the agent gets better every day.

---

## 📁 Repo Structure

```
step-beyond/
├── SKILL.md              ← Main skill (what the agent loads)
├── README.md             ← This file
├── LICENSE               ← MIT
└── examples/
    ├── image-generation.md
    ├── web-development.md
    └── content-creation.md
```

---

## 🤝 Contributing

This skill is designed to grow. If you discover new domain patterns, anti-overuse signals, or enhancement types — open a PR.

---

## 📄 License

MIT — use it, remix it, ship it.

---

> **"I don't ask if I can do more. I just do more — the way you would have done it."**
> — Step Beyond
