# Codebase Onboarding — Step Beyond Examples

This trace demonstrates project inspection inside `CONTEXT`. It is a worked
fixture, not evidence that every host exposes filesystem, shell, or VCS access.

## Bad (literal agent)
```
User: "Onboard me to this codebase"
Agent: [skims the top-level file listing, writes a generic paragraph like
        "this looks like a TypeScript project with a src/ folder" — never
        opens the README, never runs anything, never checks what's actually
        being worked on]
```

## Good (Step Beyond v4)
```
User: "Onboard me to this codebase"

Agent (internal):
  CONTEXT:     read README.md (states purpose + "run `npm run dev`" +
               "tests: `npm test`"). Read CLAUDE.md (house rule: "no default
               exports"). Walked directory tree — monorepo, apps/web +
               packages/ui + packages/api. package.json → Next.js, Vitest,
               Playwright. git log --oneline -20 → last 8 commits all touch
               packages/api/billing/ — that's where the team's attention
               currently is. CI workflow (.github/workflows/ci.yml) runs
               lint + typecheck + test on every PR.
  INTENT:      done means three things: (1) an accurate tour, (2)
               run instructions that were actually EXECUTED, not paraphrased
               from the README, (3) one concrete, low-risk first task —
               not a generic "read the code" suggestion.
  DECIDE:      run local documented commands because the user requested repo
               onboarding; do not publish or change project files.
  BUILD:       tour organized by the monorepo's own boundaries (apps/web,
               packages/ui, packages/api), naming what each does from what
               was actually read, not guessed.
  INITIATIVE:  treat verified run instructions and one evidence-backed first-task
               candidate as useful; avoid unrelated cleanup suggestions.
  EXECUTE:     ran `npm install && npm run dev` — it started cleanly on
               port 3000. +ran `npm test` — 142 passing, 3 skipped.
  VERIFY:      claim audit — "run instructions verified" is only said
               because both commands were actually executed, not because
               the README said so.
  DELIVER:     one first-task pick, tied to something the scan actually
               found: packages/api/billing/ has active development (git
               log) but its test coverage is thin (2 test files vs. 11
               source files) — flagged as a good first PR, not invented.

Agent (delivered):
  ✅ Tour: apps/web (Next.js UI) · packages/ui (shared components) ·
     packages/api (billing-focused right now — see git history)
  ➕ Run instructions verified: `npm install && npm run dev` (port 3000,
     started clean) · `npm test` (142 passing, 3 skipped)
  ➕ First-task pick: packages/api/billing/ is where the team is actively
     working but has the thinnest test coverage in the repo (~1 line)
  ✔ Verified: both commands actually run, not paraphrased from docs
```

## Why

"Onboarding" is the purest test of whether an agent actually looked at the project or is pattern-matching from the file extensions. A tour that could describe any repo is worthless; a tour that names the exact stack, quotes the exact test count, and points at the exact area with recent commits and thin coverage could only have come from reading the thing. This is also the clearest Claim Audit case in the whole example set: "run instructions verified" is a claim, and the only way to earn it here is to have run them. Full protocol: `skills/step-beyond/references/environment-scan.md`.

---

## More Examples

```
"review this PR"           → reads the surrounding files' existing
                              conventions first, so feedback is judged
                              against this repo's actual house style,
                              not generic best practices

"where should this file go?" → checks existing module boundaries and
                              naming before answering, rather than
                              guessing from the request alone

"is this repo healthy?"    → checks CI status, test coverage trend (if
                              visible), open TODOs, and staleness of
                              dependencies — not a vibe-based answer
```

---

## What Triggers Step Beyond Here

- "onboard," "get me up to speed," "walk me through this repo," "how does this codebase work," "orient me"
- Any request where the deliverable depends on the state of an existing project rather than a fresh, standalone artifact
