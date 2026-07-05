# 📈 Self-Improvement Loop — The Agent That Gets Sharper

> **"A miss is not a failure — it is a downweight. Every prediction is a bet; score the bet, and the next one is better."**

The Memory Protocol (`references/memory.md`) learns *the user*. This protocol learns *the agent's own judgment*. They are two loops inside the single `LEARN` step, and they answer different questions:

| Question | Answered by |
|----------|-------------|
| "What does **this user** want?" (brand, bans, trajectories) | **Memory** — per-user, in the User Pattern File |
| "Which of **my heuristics** actually predict well?" | **Self-Improvement** — per-agent, in the agent's own notes |

Memory makes the agent better *for you*. Self-improvement makes it better *at the job* — for everyone, whether or not this specific user ever returns. An agent running Step Beyond for a month is measurably better at it than one installed yesterday. That delta is this loop.

---

## 1. The Core Idea — Every Prediction Is a Scored Bet

Every L2/L3 addition rests on a heuristic: *"builds a page → they'll deploy → +meta/SEO."* That heuristic is a **hypothesis about the world**, not a law. The self-improvement loop treats each firing as an experiment and reads the result:

```
PREDICT  → at EXTEND/ANTICIPATE: log the addition + the heuristic that produced it
OBSERVE  → at LEARN: read the outcome — accepted / rejected / ignored / cut-in-verify
SCORE    → hit → heuristic gains confidence.  miss → it loses confidence.
ADJUST   → confidence low  → stop firing it (or fire it last).
           confidence high → fire it earlier, trust it across domains.
```

This is deliberately the same shape as the memory lifecycle (accept/reject/ignore) — but the subject is the *heuristic*, not the *user preference*. A user can ban `+dark-mode` for themselves; the self-improvement loop can down-rank the *heuristic* "modern web apps want dark-mode" if it keeps missing across many users.

---

## 2. What Actually Gets Sharpened

The loop tightens four distinct faculties. Track them separately — a miss in one is not a miss in another.

| Faculty | Signal it reads | How it sharpens |
|---------|----------------|-----------------|
| **Prediction accuracy** | Was the L2/L3 accepted or ignored? | Re-rank the heuristic that fired. Repeatedly-ignored heuristics stop firing. |
| **Verification coverage** | Did a break slip past VERIFY to the user? | Add the missed check to the domain verify table — permanently. A break that reaches the user is a hole in the checklist, not bad luck. |
| **Slop detection** | Did the user flag phrasing/pattern the SLOP SCAN missed? | Add the pattern to the slop index. Every escaped slop is one new detector. |
| **Calibration** | Did a claim ("works") turn out unverified? | Tighten the claim audit: that phrase now requires stronger evidence before it ships. |

**The rule that makes this safe:** the loop only ever *adjusts confidence and coverage*. It never invents new additions to compensate, never raises the ceiling, never overrides an explicit STOP. Self-improvement makes existing behavior sharper — it does not grant new license.

---

## 3. The Self-Note Schema (where the agent stores its own lessons)

Persist alongside — but separate from — the User Pattern File. This file is about the *agent*, portable across users:

```markdown
# Step Beyond — Agent Self-Notes
updated: 2026-07-05
sessions_observed: 47

## Heuristic Scores        ← per-heuristic confidence, updated on outcome
- web: page→+meta/SEO           conf 0.91  (hit 21/23)   → fire early
- image: 4:5→+1:1 crop          conf 0.78  (hit 14/18)   → fire
- content: post→+next-post-idea conf 0.34  (hit  6/17)   → fire last / drop soon
- data: analysis→+exec-summary  conf 0.88  (hit 15/17)   → fire

## Verify Gaps Closed      ← breaks that reached a user → now permanent checks
- web: forms submitted but never checked the success STATE, not just POST → added
- code: "handles null" claimed without feeding an actual null → now mandatory

## Slop Caught Late        ← patterns a user flagged that the scan missed
- text: "It's worth noting that" (missed variant of "it's important to note")
- design: 3 near-identical card shadows read as template → vary or flatten

## Calibration Adjustments ← claims that overreached → higher evidence bar
- "responsive" now requires an actual 375px render, not CSS inspection
```

**Section rules:**

| Section | Written when | Read at |
|---------|-------------|---------|
| **Heuristic Scores** | An L2/L3 outcome is observed (LEARN) | EXTEND/ANTICIPATE — to rank which heuristic fires |
| **Verify Gaps Closed** | A break reaches the user despite VERIFY | VERIFY — merged into the domain check table |
| **Slop Caught Late** | User flags slop the scan missed | SLOP SCAN — merged into the slop index |
| **Calibration Adjustments** | A shipped claim proves unbacked | CLAIM AUDIT — raises the evidence bar for that phrase |

---

## 4. Lifecycle — Confidence Math (keep it simple)

No ML required. A running hit-rate with a floor and a ceiling on how fast it moves:

```
START      new heuristic enters at conf 0.60 (domain-default prior)
HIT        conf += (1 - conf) * 0.15      ceiling asymptotes toward 1.0
MISS       conf -= conf * 0.20            a miss bites harder than a hit rewards
FIRE-GATE  conf ≥ 0.50 → eligible to fire (ranked by conf within a domain)
           conf < 0.35 → stop firing; keep the record so it can recover on evidence
DROP       conf < 0.20 after ≥ 10 firings → archive (it had its chance)
DECAY      unfired 90 days → drift toward 0.60 (the world changes; re-test it)
```

Misses are weighted heavier than hits on purpose: a proactive agent that annoys once costs more trust than it earns by helping once. Calibrating toward caution is correct.

---

## 5. Where Self-Notes Live (per host)

Same graceful-degradation principle as memory — use the first store available:

| Platform has… | Store self-notes in |
|---------------|---------------------|
| Dedicated memory tool (MCP / mem0) | entity keyed `step-beyond:self-notes` |
| Agent instruction file the agent may edit (`CLAUDE.md`, `AGENTS.md`) | marked section `<!-- step-beyond:self-notes:start -->` … `:end`, ≤30 lines |
| A writable skills/config dir | `step-beyond/self-notes.md` |
| Nothing writable | **session-scoped**: hold scores in working context; the agent still stops repeating a within-session miss |

Never bloat: cap Heuristic Scores at the ~20 highest-signal entries; prune the lowest-confidence, least-fired rows first (same PRUNE discipline as memory).

---

## 6. Interaction With Memory (precedence when they disagree)

Both loops feed EXTEND/ANTICIPATE. When they conflict, resolve cleanly:

```
EXPLICIT INSTRUCTION  >  USER MEMORY  >  AGENT SELF-NOTES  >  DOMAIN DEFAULTS
```

- User's `Reinforced: +dark-mode` beats a low global confidence for the dark-mode heuristic — **this user** wants it, fire it. (Log the outcome to *both*.)
- User memory silent, self-notes say the heuristic misses often → fire it last or skip. Self-notes are the sharpened version of domain defaults, so they sit just above them.
- A user acceptance updates the per-user file **and** the per-agent heuristic score — one observation, two ledgers.

**Never store in self-notes:** anything user-specific or private. Self-notes are about *heuristics and checks*, portable and content-free — never a user's data, brand, or identity. That's what the User Pattern File is for, and it stays separate.

---

## 7. Why This Matters

| Without self-improvement | With self-improvement |
|--------------------------|----------------------|
| Same wrong prediction, every user, forever | A heuristic that misses stops firing after ~10 misses |
| Same break slips past VERIFY repeatedly | Each escaped break becomes a permanent new check |
| Slop scan frozen at install-day patterns | Grows a detector every time slop is flagged |
| "Works" overclaimed at the same rate | Claim bar rises on the exact phrases that burned trust |
| Static skill | A skill that is measurably better at month 2 than day 1 |

The Memory Protocol makes the agent remember. This protocol makes it **learn from being wrong**. Together they are why "go one step beyond, every task" stays welcome instead of becoming noise: the steps get more accurate the more the agent takes them.
