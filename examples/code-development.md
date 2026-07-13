# Code Development — Step Beyond Examples

## Bad (literal agent)
```
User: "Add a function that calculates a refund amount for an order"
Agent: [writes a bare function, no types, no error handling, doesn't look
        at any other file in the repo, drops it wherever the cursor was]
```

## Good (Step Beyond v4)
```
User: "Add a function that calculates a refund amount for an order"

Agent (internal):
  CONTEXT:     no user-model record applies. package.json → TypeScript +
               Vitest. Neighboring files in
               /services export a class with a single public method, throw
               a shared `DomainError` subclass on invalid input, and are
               covered by a co-located `*.test.ts`. .eslintrc forbids `any`.
               git log -5 on /services → a refund-adjacent PR merged last
               week added an idempotency key to a similar operation.
  INTENT:      not an isolated function — a service method matching this repo's
               exact shape: typed, throws DomainError (not a generic Error),
               tested in the established style, and — given the repo's own
               recent history — probably needs to guard against being run
               twice on the same order.
  DECIDE:      proceed with the local implementation; disclose the material
               idempotency assumption because it changes behavior.
  BUILD:       typed method, DomainError on invalid input (negative amount,
               unknown order id), no `any` (passes lint)
  INITIATIVE:  score co-located tests and an idempotency guard using project
               evidence, mistake cost, reversibility, and verifiability.
  EXECUTE:     implement the authorized base and selected local candidates.
  VERIFY:      ran `npm test` (the command in package.json, not an invented
               one) — new tests pass, existing suite still green. Ran
               `npm run lint` — clean.

Agent (delivered):
  ✅ Refund calculation method added, matching the existing service pattern
  ➕ Tests added (co-located, Vitest — passing)
  ➕ Idempotency guard (this repo's history shows refund-adjacent ops need it)
  ✔ Verified: npm test passing, lint clean
```

## Why

A function dropped into a codebase with the wrong conventions is a silent tax on every future reader and reviewer — wrong error type, wrong test location, wrong style, a second way of doing something the repo already does one way. Reading three neighboring files and the manifest first costs seconds; guessing costs a round of review comments. Full protocol: `skills/step-beyond/references/environment-scan.md`.

---

## More Examples

```
"add an API endpoint"     → matches the existing router/middleware pattern
                             found by reading a sibling route, not a bare
                             Express handler

"fix this bug"            → checks git blame on the broken line first — why
                             the code is that way before changing it, so the
                             fix doesn't reintroduce whatever it was guarding
                             against

"write a date-parsing util" → greps the repo for an existing equivalent
                             first (avoid a duplicate utility with a third
                             behavior)

"refactor this class"     → checks who else imports it (grep the codebase)
                             before changing its public shape
```

---

## What Triggers Step Beyond Here

- "code," "function," "component," "class," "api," "endpoint," "script," "program"
- Any request that touches an existing repository (as opposed to a from-scratch snippet with no surrounding project)
