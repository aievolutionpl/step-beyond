# 🔎 Environment Scan — Ground Truth Before You Build

> **"Memory tells you what the user wants. The environment tells you what's actually true right now. Read both before you act."**

RECALL (pipeline step 0) has two always-on sources, not one. `references/memory.md` covers the stored side — what this user prefers, accepted, banned. This file covers the other half: the live project the agent is actually sitting inside. Neither requires the other. A brand-new session with zero memory can still scan a repo; a memory-rich session still re-checks the environment, because memory can go stale and the environment can't lie about what's on disk right now.

---

## 1. What to Scan (priority order, budget-capped)

Same "detect what's available, use the first useful thing" spirit as Memory's store detection — except here every layer is usually available at once, so read the ones relevant to the request, not all of them:

```
1. MANIFESTS/LOCKFILES   — package.json, pyproject.toml, Cargo.toml, go.mod,
                            Gemfile, requirements.txt, composer.json
                            → stack, versions, tooling already chosen
                            (test framework, linter, formatter, scripts)
2. VCS HISTORY           — git log --oneline -20, git log -- <path>, blame on
                            a file you're about to touch
                            → active areas, recent direction, why code looks
                            the way it does, who/what churns
3. DIRECTORY STRUCTURE   — top 2-3 levels, monorepo markers, where
                            tests/docs/config live
                            → where a new file belongs
4. NEIGHBORING CODE      — 2-3 files of the same kind you're about to write
                            → naming, formatting, error handling, import
                            order, test co-location — match it, don't
                            invent a new style
5. CONFIG/CI/LINT        — .eslintrc, .prettierrc, tsconfig.json,
                            .github/workflows, Makefile, pre-commit hooks
                            → the quality bar already enforced; match it,
                            don't fight it
6. PROJECT DOCS          — README.md, CLAUDE.md, AGENTS.md, CONTRIBUTING.md,
                            docs/
                            → conventions the project already wrote down,
                            install/run/test commands, explicit house rules
```

Read what the request touches. "Fix this typo" needs none of this. "Add an endpoint" needs 1, 4, and 5 at minimum.

---

## 2. How Findings Feed the Pipeline

| Finding | Feeds | Effect |
|---|---|---|
| Test framework installed, no tests directory yet | ANTICIPATE (L3) | Trajectory signal: they'll want tests started — one small L2, not an invented test culture |
| Manifest has a deploy/build script | EXPAND (DONE) | Definition of done includes "deployable," not just "compiles" |
| Neighboring files use named exports, no default export | BUILD (L1) | Match silently — this is baseline, not an addition to declare |
| CI runs `lint --max-warnings 0` | VERIFY | Lint must actually pass, not just "look clean" |
| README says "run `npm test` before committing" | VERIFY | Run that exact command — don't invent your own |
| git log shows a recent commit fixing a race condition in this file | EXPAND (IMPLIED) | Treat the area as fragile; check for the same class of bug nearby before adding to it |
| Profile says `stack: Next.js`, package.json says Astro | EXPAND, then LEARN | Environment wins for this session (it's current ground truth); flag the drift so LEARN can update the stale Profile fact |

This is what makes `references/domains.md`'s CODE tree line — `RECALL: stack, conventions, test framework` — real instead of aspirational. Domain defaults describe *what* to recall; this file describes *how* to actually get it when memory hasn't already cached it.

---

## 3. Budget & NEVER

```
BUDGET:   a few targeted reads/greps for THIS request — not a full-repo crawl.
          Once per session; cache findings in working context. Refresh only
          if the request moves to an unrelated part of the repo.
READ-ONLY: a scan never writes, stages, or commits anything.

NEVER:
  - Open .env, secrets.*, credentials.*, *.pem, id_rsa, .aws/, or anything
    whose name signals sensitive material. Skip it, note "not inspected."
  - Treat scan output as license to change things beyond what was asked —
    it informs EXPAND/ANTICIPATE, it does not raise the ceiling.
  - Rewrite existing conventions "while you're in there." Matching a
    convention is not an invitation to refactor it.
  - Write scan findings into the User Pattern File. That file is for
    LEARNED preferences (accept/reject/ignore over time) — re-derivable
    facts about the current repo state don't belong there; re-scan instead
    of caching them as if they were durable user memory.
  - Over-scan a trivial request. Same proportionality rule as VERIFY: effort
    matches the ask.
```

**Degrades gracefully:** no filesystem/shell access at all (pure chat, an image-generation task, a hosted tool with no read capability)? The scan step is a no-op — RECALL falls back to memory alone, or to reasoning from the prompt if there's no memory either. This is an accelerant, never a dependency; the pipeline is unchanged either way.

---

## 4. Precedence — Environment vs. Everything Else

```
EXPLICIT INSTRUCTION  >  USER MEMORY  >  ENVIRONMENT (ground truth)  >  AGENT SELF-NOTES  >  DOMAIN DEFAULTS
```

Environment and memory answer different questions, so most of the time they don't conflict at all:

```
ENVIRONMENT = what IS true right now, re-derived every relevant session
MEMORY      = what the USER wants, learned and persisted over time
```

- Memory says `stack: Next.js`; this particular repo's `package.json` says Astro (different project, or the user migrated since Profile was written). Environment wins for the session's facts — build for Astro — and the drift gets flagged for `LEARN` to correct the stale Profile entry. Silently overwriting Profile mid-session is not the move; noting the correction and updating it at the normal write point is.
- Memory has a `Banned: web: +cookie-banner` entry; the environment happens to already contain a cookie-banner component from a previous contributor. The ban still holds — the environment doesn't get a vote on a user preference. Don't add a *new* one; matching an *existing* file the user didn't ask you to touch is a separate question from proactively adding more of it.
- Memory is silent on this domain entirely (first time this user has asked for this kind of thing) — environment scan fills the gap on its own; domain defaults (`references/domains.md`) only get consulted for whatever the environment couldn't tell you.
- User explicitly says "use Redux here" while every other file in the repo uses Zustand — explicit instruction wins, this once. Note the friction in the delivery (one line), don't silently "correct" their choice back to match the repo.

---

## 5. Where This Matters Most

Every domain in `references/domains.md` benefits, but scanning is most load-bearing — and most visibly absent when skipped — in **CODE**, **WEB**, **DATA**, and **TECHNICAL**: domains where "conventions" and "stack" are literal, checkable facts sitting in the repo rather than stylistic preferences. See those trees' RECALL lines.

---

## 6. Why This Matters

| Without environment scan | With environment scan |
|---|---|
| Guesses a stack or convention | Reads the manifest/lockfile, knows for certain |
| Introduces a new naming or formatting style | Matches the file it's about to sit next to |
| Ships code that fails CI on the first push | Matches the lint/CI bar already in force |
| Memory says one stack, repo says another — ships wrong | Environment catches the drift, corrects it, flags Profile for update |
| "Onboard me to this codebase" → a generic paragraph | A tour backed by an actually-read README, tree, and git log |

The Memory Protocol makes the agent remember *the user*. This protocol makes it *look before it builds* — the two together are what turns "one step ahead" from a slogan into something the agent can actually back up.
