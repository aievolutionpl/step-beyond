# Self-Improvement Loop — Step Beyond Example

`memory-learning.md` shows the agent getting better *for one user* across sessions. This file shows the other loop: the agent getting better *at the job*, for everyone, whether or not any of these users ever return. Full protocol: `skills/step-beyond/references/self-improvement.md`. Deliberately across three **different, unrelated** users — the point is that none of them individually taught the agent anything; the agent taught itself.

There is no per-user memory file in this trace. There's one file: **Agent Self-Notes** — heuristics and checks only, never anyone's brand or data.

---

## Session A — User X, a web task (a new heuristic enters)

```
Request:  "build a landing page for my studio"
EXTEND:   fires heuristic `web: page→+meta/SEO` for the first time this
          agent has logged it. New heuristic → starts at conf 0.60
          (domain-default prior).
DELIVER:  "+meta/SEO"
User X reaction: uses it, deploys with it intact.

LEARN (self-improvement slice):
  OBSERVE: accepted → HIT
  SCORE:   conf 0.60 → 0.60 + (1 - 0.60) × 0.15 = 0.66
  self-notes: `web: page→+meta/SEO   conf 0.66  (hit 1/1)`
```

## Session B — User Y, an unrelated web task (the heuristic gets trusted earlier — and a different one starts missing)

```
Request:  "build a landing page for my clinic"
EXTEND:   `web: page→+meta/SEO` fires again — now ranked higher (conf 0.66
          beats the domain-default prior of 0.60, so it's offered before
          other candidate L2s, not after).
          Also fires `content: post→+next-post-idea` on a follow-up content
          request in the same session.
DELIVER:  "+meta/SEO", "+next-post idea"
User Y reaction: keeps +meta/SEO. Ignores the next-post idea entirely — no
reaction, no use.

LEARN (self-improvement slice):
  OBSERVE: +meta/SEO accepted → HIT.       +next-post-idea ignored → MISS.
  SCORE:   meta/SEO:  0.66 → 0.66 + (1 - 0.66) × 0.15 = 0.71
           next-post: 0.60 → 0.60 - 0.60 × 0.20         = 0.48
  self-notes:
    `web: page→+meta/SEO           conf 0.71  (hit 2/2)   → fire early`
    `content: post→+next-post-idea conf 0.48  (hit 0/1)   → fire last`
```

## Session C — User Z, a code task (a break becomes a permanent check)

```
Request:  "write a function that handles a possibly-missing user record"
DELIVER:  function shipped with the claim "handles the null case."
User Z reaction (days later, different session): reports it crashed on a
null input in production. The claim was wrong — VERIFY never actually fed
the function a null, it inferred "handles null" from reading the code.

LEARN (self-improvement slice):
  OBSERVE: a break reached the user despite VERIFY → this is not a heuristic
           miss, it's a verification-coverage gap.
  ADJUST:  add a permanent check to references/self-improvement.md's
           "Verify Gaps Closed" table:
           `code: "handles null" claimed without feeding an actual null →
            now mandatory`
  CALIBRATION: the phrase "handles the null case" now requires an executed
           test with a real null, not code-reading, before it can ship again.
```

**From this point on, every future session — any user, any domain — runs the function through an actual null before claiming it's handled.** User Z never comes back, and the fix still holds.

---

## What Made the Difference

| Faculty | Before | After 3 sessions |
|---|---|---|
| Prediction accuracy | `+meta/SEO` fires at default confidence, same rank as everything else | Fires early, ranked above generic domain defaults (conf 0.71) |
| — | `+next-post-idea` fires by default every time a post is written | Fires last / heading toward drop (conf 0.48) — it was guessing, not predicting |
| Verification coverage | "handles null" claims backed by reading the code | Backed by an executed test, permanently, for every future user |
| Calibration | Claim bar was uniform | The specific phrase that broke trust once now needs stronger evidence |

## What the Agent Did NOT Do

- Did not need User X, Y, or Z to be the same person, or to ever return
- Did not store anything about these users in the self-notes file — no brand, no names, no per-user preference (that's what the User Pattern File is for, and it stays separate)
- Did not invent a new addition to compensate for the miss — it only adjusted which existing heuristics fire, and how much verification a claim needs
- Did not raise the ceiling, override STOP, or grant itself new license — self-improvement sharpens existing behavior, never expands it (`SPEC.md` §10)
