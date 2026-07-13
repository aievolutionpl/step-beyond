# Self-Improvement Loop — Step Beyond Example

`memory-learning.md` shows the agent getting better *for one user* across sessions. This file shows the other loop: the agent getting better *at the job*, for everyone, whether or not any of these users ever return. Full protocol: `skills/step-beyond/references/self-improvement.md`. Deliberately across three **different, unrelated** users — the point is that none of them individually taught the agent anything; the agent taught itself.

There is no per-user memory file in this trace. There's one file: **Agent Self-Notes** — heuristics and checks only, never anyone's brand or data.

---

## Session A — User X, a web task (a new heuristic enters)

```
Request:  "build a landing page for my studio"
INITIATIVE: proposes heuristic `web: page→meta/SEO candidate` with provenance
            and proposed status; it is not globally active from one event.
EXECUTE:   includes the local candidate after permission classification.
DELIVER:  "+meta/SEO"
User X reaction: uses it, deploys with it intact.

LEARN (self-improvement slice):
  OBSERVE: accepted → HIT
  UPDATE:  record one eligible event; keep the global heuristic proposed.
```

## Session B — User Y, an unrelated web task (the heuristic gets trusted earlier — and a different one starts missing)

```
Request:  "build a landing page for my clinic"
INITIATIVE: `web: page→meta/SEO candidate` has another eligible event, but
            remains subject to the current request, permission, cost, and risk.
          Also fires `content: post→+next-post-idea` on a follow-up content
          request in the same session.
DELIVER:  "+meta/SEO", "+next-post idea"
User Y reaction: keeps +meta/SEO. Ignores the next-post idea entirely — no
reaction, no use.

LEARN (self-improvement slice):
  OBSERVE: +meta/SEO adopted. +next-post-idea has no observable outcome → unknown.
  UPDATE:  adopted can support a revision; unknown is neutral.
  self-notes:
    `web: page→meta/SEO candidate — evidence: two eligible adopted events`
    `content: post→next-post candidate — outcome: unknown, no score change`
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

The verification gap can become a proposed global check only through the
versioned, auditable, reversible process in `SPEC.md`; one event does not silently
rewrite behavior for every user.

---

## What Made the Difference

| Faculty | Before | After 3 sessions |
|---|---|---|
| Prediction evidence | `+meta/SEO` begins as a proposed candidate | Repeated eligible events can support an auditable revision |
| Unknown outcome | Silence could be misread as a miss | Unknown remains neutral |
| Verification coverage | "handles null" claims backed by reading the code | Backed by an executed test, permanently, for every future user |
| Calibration | Claim bar was uniform | The specific phrase that broke trust once now needs stronger evidence |

## What the Agent Did NOT Do

- Did not need User X, Y, or Z to be the same person, or to ever return
- Did not store anything about these users in the self-notes file — no brand, no names, no per-user preference (that's what the User Pattern File is for, and it stays separate)
- Did not invent a new addition to compensate for the miss — it only adjusted which existing heuristics fire, and how much verification a claim needs
- Did not bypass strict scope, permission, or audit controls — learning changes evidence records, not authority
