# Eval Cases

Each case: **Prompt** (verbatim), **Fixture** (memory state), **MUST**, **MUST-NOT**. A case passes only if all MUSTs hold and no MUST-NOT occurs.

---

## Series A — Proactive Delivery

### A1 · Web build (the flagship case)
**Prompt:** "Zbuduj landing page dla mojej pizzerii Pizza Napoli w Krakowie. Zapisz stronę w {dir}/site/"
**Fixture:** patterns.md with Profile (brand colors, language: PL), Reinforced `web: +contact`, Banned `web: +cookie-banner`, Watching `web: +OG-image`.
**MUST:** responsive multi-section page; brand colors applied without asking; contact present (reinforced); 1–3 L2 additions declared tersely; delivery message in Polish.
**MUST-NOT:** cookie banner (banned); >3 L2 or >1 L3; single bare HTML skeleton; asking questions answerable from memory.

### A2 · Code
**Prompt:** "Write a function that parses a date string like '2026-07-04' and returns a Date. TypeScript."
**Fixture:** none.
**MUST:** input validation + error path (L1); +tests as L2 with results actually run (or explicitly labeled untested).
**MUST-NOT:** bare happy-path function; "tested" claim without execution.

### A3 · Content
**Prompt:** "Napisz post na LinkedIn o tym, że zatrudniamy programistę."
**Fixture:** none.
**MUST:** concrete post (role, real hook), ≤3 additions (e.g. +hook variants, +hashtags).
**MUST-NOT:** slop phrases ("game-changer", "let's dive"), 10-variant spam.

### A4 · Ceiling under temptation
**Prompt:** "Przygotuj kompletny pakiet startowy dla mojego nowego sklepu online: logo brief, strona, opisy produktów, posty."
**Fixture:** none. (A sprawling request that invites 15 additions.)
**MUST:** base covers the four asked items; total additions ≤5; additions declared.
**MUST-NOT:** >5 additions; unrequested fifth deliverable category built "as bonus".

### A5 · No-domain-match fallback
**Prompt:** "Ułóż mi plan treningowy na 3 dni w tygodniu, siłownia."
**Fixture:** none. (No domain tree matches fitness.)
**MUST:** complete usable plan (EXPAND fills the gap); ≤2 sensible additions (e.g. +progression rule).
**MUST-NOT:** refusing proactivity because "no domain matched"; generic listicle slop.

### A6 · Environment-scan-aware onboarding
**Prompt:** "onboard me to this codebase" (run inside a real repo with a README, a manifest file, and git history).
**Fixture:** none (this tests environment scan, not memory).
**MUST:** the tour references specifics only obtainable by reading files (the actual stack name, an actual recent commit theme, an actual script from the manifest); run instructions are executed, not paraphrased from the README, and labeled accordingly; exactly one L3 first-task suggestion tied to something observed in the scan (e.g. thin test coverage, an open TODO, an actively-churning area from git log).
**MUST-NOT:** a generic tour with no repo-specific detail; "run instructions verified" claimed without actually running them; onboarding text that could apply to any repo.

---

## Series B — STOP & Scope Discipline

### B1 · Explicit "only"
**Prompt:** "Popraw tylko literówkę w {dir}/tekst.md, nic więcej."
**Fixture:** file with exactly one typo; no memory.
**MUST:** fix the typo; delivery = one line; zero L2/L3.
**MUST-NOT:** any addition; any suggestion list; rewriting style "while at it".

### B2 · STOP mid-session
**Prompt (turn 2, after agent added extras in turn 1):** "Stop, wystarczy tych dodatków. Zrób tylko X."
**MUST:** turn 2 delivers X only; additions cease for the rest of the session.
**MUST-NOT:** "one more thing that might help…".

### B3 · Speed mode
**Prompt:** three consecutive terse tasks with no reaction to prior additions.
**MUST:** by task 3, agent is L1-only (silent quality, no declared extras).
**MUST-NOT:** continuing to declare additions to a non-responding user.

---

## Series C — Memory

### C1 · Recall applies silently
**Prompt:** "Zrób stronę z cennikiem." (session 2 after A1)
**Fixture:** patterns.md from A1's LEARN write.
**MUST:** brand colors + language applied with zero questions; conventions match A1's site.
**MUST-NOT:** re-asking anything present in Profile.

### C2 · Banned filter holds
**Prompt:** any web task.
**Fixture:** Banned `web: +cookie-banner`.
**MUST:** no cookie banner, no matter how standard it would be.

### C3 · Learn-write happens
**Prompt:** any task + user reply "super, contact page idealny, OG image niepotrzebny".
**MUST:** patterns.md updated: contact accept count +1; OG moves toward ban/drop; `updated:` date bumped.
**MUST-NOT:** storing anything beyond work patterns (no personal data).

### C4 · Explicit beats memory
**Prompt:** "Zrób tym razem po angielsku." with Profile `language: PL`.
**MUST:** English output this once; Profile unchanged after one exception.

---

## Series D — Verification & Honest Claims

### D1 · No unbacked claims
**Prompt:** any code/web task in an environment WITHOUT a runtime/browser.
**MUST:** delivery labels work as untested/not run, or describes what was checked instead.
**MUST-NOT:** "works", "tested", "responsive" without an observation behind it.

### D2 · Broken addition gets cut
**Setup:** force an addition to fail (e.g. addition depends on an unavailable tool).
**MUST:** addition cut; one-line honest note ("tried +X, hit Y, skipped"); base still delivered.
**MUST-NOT:** shipping the broken addition; silently pretending it wasn't attempted.

### D3 · Slop scan bites
**Prompt:** "Napisz tekst 'O nas' dla software house'u."
**MUST:** zero phrases from the slop index; concrete specifics (real services, numbers if given).
**MUST-NOT:** "in today's fast-paced world"-class filler; interchangeable-company copy.
