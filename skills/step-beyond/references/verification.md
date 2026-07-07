# ✅ Verify Loop — Nothing Ships Unchecked

> **"Delivered" means verified. A broken addition is worse than no addition. A false claim is worse than both.**

Proactivity without verification is how agents lose trust: they add five things, two are broken, and the user stops reading the additions entirely. The Verify Loop is the gate between BUILD and DELIVER. It is **not optional** and it applies to the base *and* every L2/L3.

---

## 1. The Four Checks (in order)

```
VERIFY = BASE CHECK → ADDITION CHECK → SLOP SCAN → CLAIM AUDIT
```

### ① BASE CHECK — does the requested thing actually work?

Exercise the deliverable the way the user will. Observing behavior, not re-reading your own output.

| Domain | Minimum verification |
|--------|---------------------|
| **Web** | Open the page. Click every nav link. Submit the form. Resize to 375px. Check console for errors. |
| **Code** | Run it. Run the tests. Feed it the edge case you claim to handle (null, empty, invalid). |
| **Content** | Read it aloud (internally). Check every number/claim against its source. Run the slop scan hard. |
| **Image** | Look at the output: hands, text-in-image, artifacts, requested elements present, correct ratio. |
| **Data** | Do the numbers sum? Axes labeled? Does the chart type match the claim it supports? |
| **Research** | Every claim has a source. Every source was actually consulted, not assumed. |
| **Email** | Render check, link check, spam-trigger scan, correct recipient variables. |
| **Technical** | Run the script/pipeline once. Kill it mid-way — does it recover? Check logs exist. |

If you *cannot* execute (no runtime, no browser): trace through the logic line-by-line as the machine would, state clearly that it's untested, and never claim otherwise.

### ② ADDITION CHECK — every L2/L3, same bar as base

```
For each addition:
  verified working?      → ship it, declare it
  can't verify it?       → CUT IT. Mention as suggestion instead: "could add X next"
  broken?                → fix (max 2 attempts) → still broken? CUT IT.
```

An unverified addition converts to a **suggestion** — it costs one line and zero trust. This rule is what makes the ceiling safe: 5 additions are fine *because* all 5 work.

### ③ SLOP SCAN — see `references/slop.md`

Run the domain-matched slop checklist against the deliverable. Slop found → rewrite the offending parts → rescan **once**. (One rescan — infinite polishing loops are their own failure mode.)

### ④ CLAIM AUDIT — the delivery message itself

Scan what you're about to tell the user. Every claim must map to an observation:

| You're about to say | Only allowed if |
|--------------------|-----------------|
| "works" / "działa" | You executed it and saw it work |
| "tested" | Tests ran and passed — paste the evidence if nontrivial |
| "responsive" | You rendered it at mobile width |
| "handles errors" | You triggered an error and watched the handling |
| "fast" / "optimized" | You measured something |

Can't back the claim? Delete the claim, not the work. *"Built X — not yet run in a live browser"* is honest and keeps trust. False "works" spends trust you don't get back.

**Partial verification is not "untested."** Sometimes *some* checks are possible and others are blocked by something outside your control — a sandboxed network policy, a missing credential, a service you can't reach but the user's environment can. Don't collapse this to one blanket "untested" label, and don't paper over the gap either. Scope each claim to exactly what you checked: state plainly what you verified (and how), name what you couldn't and why (the specific blocker, not a vague "couldn't test everything"), and never let a passing check on the reachable parts imply the unreachable parts also passed. *"Verified the page renders and every internal link works at 375px; couldn't exercise the Maps embed or font CDN — this sandbox's network policy blocks that host, the URL itself is correct"* is the honest middle ground between "fully tested" and "untested."

---

## 2. Failure Protocol

```
Found broken during verify:
  1. FIX          → re-verify (the fix itself can break things)
  2. Max 3 fix-verify cycles on the BASE, 2 on any addition
  3. Base still broken   → tell the user exactly what fails and what you tried.
                           Never ship it silently as "done".
  4. Addition still broken → CUT, deliver base, one line: "tried +X, hit Y, skipped"
```

Honest failure reporting **is** L1 quality. "It doesn't work and here's why" beats "done ✅" followed by the user discovering it.

---

## 3. Fresh-Eyes Protocol (solo agents — no subagents available)

Verification by the builder suffers confirmation bias: you see what you meant, not what you made. Simulate a fresh reviewer:

```
1. FINISH building completely. Close the mental "author" mode.
2. RE-READ the ORIGINAL request — not your interpretation of it.
   Ask: does the deliverable answer *these words*?
3. WALK THROUGH as the user: open it / run it / read it top to bottom,
   in the order they will, with zero knowledge of your reasoning.
4. CHECKLIST, not memory: run the domain verify table + slop list mechanically.
   Bias hides in "I'm sure that part is fine."
5. ONE HOSTILE PASS: "what would a reviewer flag here?" — name the weakest
   part of the deliverable. If you can name it, fix it or disclose it.
```

If subagents ARE available, delegate step 3–5 to a fresh-context verifier instead — see `references/subagents.md`.

---

## 4. Verification Budget

Verification is part of the job, not overhead — but it has a shape:

```
Base check:      always, no budget cap — unverified base is undelivered work
Addition checks: ~30s each; can't verify in that? → suggestion, not addition
Slop scan:       one pass + one rescan, max
Claim audit:     seconds — it's just honesty
```

The ceiling already limits additions to 5. Five verifications is cheap. Fifty would be the real problem — and the ceiling is why that can't happen.
