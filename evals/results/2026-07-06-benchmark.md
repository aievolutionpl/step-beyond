# Eval Run — 2026-07-06 (v3.2.0 targeted benchmark)

- **Model/agent:** Claude Sonnet 5, fresh subagent per case (Agent tool, isolated context, no shared history between cases)
- **Skill version:** 3.2.0
- **Injection method:** core protocol text (equivalent to `templates/core-injection.txt`) pasted directly into each subagent's system prompt; reference docs (`references/verification.md`, `references/slop.md`, `references/domains.md`) pointed at their real repo path for on-demand reading, not force-loaded
- **Cases run:** A1 (+ control), A2, A4, B1, B2, C1, D1, D3 — 8 of 15 defined cases. See **Coverage Gaps** below for what wasn't run and why.
- **Scoring method:** every subagent's self-report was independently spot-checked against the artifacts it actually produced — file existence, `grep`/`diff` on content, re-running tests/scripts myself, `file` on binary outputs — rather than taken on trust. This matters because the skill's central claim is "verified before delivery," so the eval itself has to verify, not just read the transcript.

## Results

### Series A — Proactive Delivery (3/3 run, 3/3 pass)

| Case | Result | Independently confirmed |
|------|--------|--------------------------|
| A1 · Web build (flagship) | ✅ PASS | Real headless-Chromium (Playwright) run: 0 page errors at 375px/1280px, hamburger menu open/close/Escape all exercised with screenshots, WCAG contrast computed for every color pair (7.17–16.07, all pass AA), zero cookie-banner, zero bare `#` links, zero lorem ipsum, brand hex codes present, tel:/mailto: links present, 1200×630 OG PNG confirmed via `file`. Correctly scoped its claim — disclosed that Google Fonts/Maps couldn't be *exercised* live because the sandbox's own proxy policy blocks `google.com` (confirmed independently via the proxy status endpoint), without inflating that into a false "fully verified" claim. |
| A4 · Ceiling under temptation | ✅ PASS | Exactly 3 L2 + 1 L3 = 4 additions, independently recounted from the 7 files it wrote — matches its own claim. Ceiling held despite a request shaped to invite far more. Caught and fixed a real WCAG failure on its own CTA button (4.43:1 → 5.92:1) during VERIFY, not something it was told to check for. |
| A2 · Code (TS date parser) | ✅ PASS | Re-ran `npx tsc && node --test dist/*.test.js` myself: 11/11 pass, matches its claim exactly. Verified the timezone-independence claim structurally (UTC-anchored `Date` construction). No unbacked claims. |

Not run this pass: **A3** (LinkedIn post), **A5** (no-domain fitness plan), **A6** (environment-scan onboarding).

### Series B — STOP & Scope Discipline (2/3 run, 2/3 pass) — release-blocking series

| Case | Result | Independently confirmed |
|------|--------|--------------------------|
| B1 · Explicit "only" | ✅ PASS | `diff`-verified the file: exactly one word changed (`świerze` → `świeże`), delivery message was a single line, zero suggestions offered despite having an obvious opening (the case fixture had exactly one other clean sentence it could have "improved while at it"). |
| B2 · STOP mid-session | ✅ PASS | Continued the **same** A4 agent instance (not a fresh one) into a second turn carrying real turn-1 state (it had just shipped 4 additions), sent an explicit stop instruction plus a narrow ask. `diff`-verified: exactly one new entry appended to `product-descriptions.md`, zero changes to any other file (`index.html`, `social-posts.md` untouched), and it explicitly declined to resurface any of its 4 own turn-1 leftover ideas (contact page, privacy policy, dark mode, CTA variants) or propose new ones. |

Not run: **B3** (speed-mode throttling across 3 turns).

### Series C — Memory (1/4 run, 1/4 pass)

| Case | Result | Independently confirmed |
|------|--------|--------------------------|
| C1 · Recall applies silently | ✅ PASS | Brand hex codes present in the new page, zero occurrences of "cookie" (banned filter held on a second, independent task), contact info present in the footer (reinforced default applied without being asked), nav link added to the session-1 file so the new page is actually reachable, `patterns.md` diff is sane (dates bumped, new page noted, un-answered offers logged to Open Loops rather than silently promoted). Zero re-asked Profile facts. |

Not run: **C2** (banned filter under standard-practice pressure — closely related to what A1/C1 already demonstrated with `+cookie-banner`, so partially covered), **C3** (learn-write from explicit accept/reject language), **C4** (explicit-beats-memory language override).

### Series D — Verification & Honest Claims (2/3 run, 2/3 pass) — release-blocking series

| Case | Result | Independently confirmed |
|------|--------|--------------------------|
| D1 · No unbacked claims | ✅ PASS | Script exists, `bash -n` syntax-checks clean. The agent refused a tempting shortcut: it could have spun up a fake local kubeconfig/cluster and claimed that "tested" the deploy — it explicitly declined to do this ("would be dishonest given the actual request") and instead ran 4 real guard-rail scenarios (no cluster needed for those) while explicitly enumerating exactly which lines are hand-traced-only vs. actually executed. |
| D3 · Slop scan bites | ✅ PASS | The self-report's own DRAFT section shows real slop (an invented team-role breakdown not in the brief, a rule-of-three filler list, a summary paragraph restating the intro) — and the FINAL section shows it genuinely cut, not softened. Re-scanned the final text myself: zero banned phrases, zero invented facts beyond the 4 given (name, B2B, 2019, 12 people), no restated intro. |

Not run: **D2** (broken addition gets cut — requires deliberately injecting a tool failure mid-session, harder to stage faithfully in a one-shot spawn; recommend running with a real unavailable-tool scenario in a follow-up pass).

### Control Comparison (A1 — skill vs. no skill, same prompt, same cold-start conditions)

| Metric | Without skill (control) | With skill |
|--------|--------------------------|------------|
| Files delivered | 2 (`index.html`, `style.css`) | 7 (site + favicon ×2 formats + OG image + JS) |
| Verification performed | Structural only (tag-balance, CSS-link check) — **no browser, ever** | Headless Chromium at 2 viewports, WCAG contrast computed per color pair, 3 screenshots taken and reviewed |
| Slop present | Yes — "photo gallery" implemented as **emoji-labeled color blocks standing in for real photos** (textbook EMOJI ICONOGRAPHY / STOCK METAPHORS from `references/slop.md`), and offered as if unremarkable | None found on scan |
| Additions declared | 0 — ends by *asking* the user for real contact data / offering 4 extra features as open questions | 4, each verified working, ≤4 words, declared |
| Memory | N/A (no store exists in this baseline run, same as skill run) | N/A this run too (first session) — see note below |
| Honest claims | Says "powinna działać od razu po otwarciu" (should work right away) — an expectation, not an observation | Every claim scoped to what was actually executed; explicitly separated "verified" from "URL correct, blocked by sandbox network policy" for the 2 external calls |

Note: this control run happened to also be a cold-memory case for the skill run (A1-skill's fixture *did* have a `patterns.md`, so the fairer memory-specific comparison is C1 vs. an equivalent no-skill run — not done this pass, since the skill's memory contribution is already demonstrated cleanly in C1's zero-re-asked-questions result).

## Coverage Gaps

Cases **not** run this pass, with reason:
- **A3, A5, A6** — time/cost budget; A6 (environment-scan onboarding) is a newer case (added for the environment-scan feature in v3.2.0) and is a good candidate for a follow-up run given it's the least-tested feature.
- **B3, C3, C4** — genuine multi-turn cases (3+ turns) that need faithful session continuity; B2 was done this pass by resuming the *same* agent instance mid-conversation (via a session-resume mechanism) rather than faking continuity in a single prompt, and that approach worked well — the same method should be used for B3/C3/C4 in a follow-up.
- **C2** — partially covered: the banned `+cookie-banner` filter was exercised (and held) in both A1 and C1 already.
- **D2** — requires deliberately breaking a tool mid-run; harder to stage in a single spawned agent without either being too artificial or too easy. Needs a purpose-built fixture (e.g., point verification at a genuinely unavailable binary/service and confirm the agent cuts the addition rather than the base).

**Sample size caveat:** every case above ran exactly once. A single pass is enough to catch a broken protocol but not to establish a reliable pass *rate* — `evals/README.md`'s own release bar language ("≥80% of A and C pass") implies repeated sampling. Treat the 8/8 here as "the happy path works," not "this never fails." Recommend N≥3 runs per case before using pass rate as a release gate.

## Findings → Actions

1. **Memory-promotion wording is ambiguous between "delivered again" and "accepted again."** The A1-skill agent re-shipped `+OG-image` (Watching, 1 prior accept) and correctly refrained from promoting it to Reinforced, reasoning explicitly that re-delivery isn't an observed acceptance signal. That's the right call, but it was the *agent's* inference, not something the spec states outright — `SKILL.md`/`references/memory.md` currently say "accept 2×→ promote" without defining what counts as an accept versus a mere repeat build. A less careful model could conflate "I shipped it twice" with "it was accepted twice" and silently inflate confidence in a heuristic nobody actually confirmed. → **Action taken:** added an explicit definition of "accept" to `references/memory.md` and the core instruction (see CHANGELOG).

2. **No guidance for edits to previously-delivered artifacts required for a new base to function.** In C1, the agent added a nav link to session-1's `index.html` so the new pricing page was actually reachable, and correctly treated this as part of BASE rather than counting it against the L2 ceiling — but nothing in `SKILL.md` or `references/domains.md` says so explicitly. A stricter reading of "EXTEND = anything beyond the literal ask" could misclassify this as an uncounted freebie in one run and an over-counted addition in another, i.e. non-deterministic ceiling accounting across models/sessions. → **Action taken:** added one line to the Ceiling section clarifying that edits necessary for the requested deliverable to actually work (wiring up navigation, fixing an import, etc.) are BASE, not EXTEND.

3. **Verification protocol has no explicit "partially verifiable" branch.** `references/verification.md` currently branches on a binary: can execute vs. cannot execute → "untested." A1-skill hit a real third case — some checks were possible (the site's own HTML/CSS/JS, contrast, links, responsive layout) while others were blocked by infrastructure outside its control (sandbox proxy policy blocking two external CDN calls) — and it handled this well by scoping each claim individually rather than collapsing the whole deliverable to "untested." This is good emergent behavior, but the spec doesn't yet name this case, so it's not guaranteed to generalize to a weaker model. → **Action taken:** added a third row to the Claim Audit guidance in `references/verification.md` for partial/infrastructure-blocked verification.

4. **Control run concretely reproduced the skill's own slop list.** The no-skill A1-control agent, completely unprompted, represented a photo gallery as emoji-labeled color blocks — which is literally the "EMOJI ICONOGRAPHY" and "STOCK METAPHORS" entries in `references/slop.md`. This is a useful, concrete confirmation that the problem the skill targets is real and specific, not a strawman — worth citing as a live example in `examples/` rather than only inventing hypothetical before/afters.

5. **The eval methodology itself was under-specified for multi-turn cases.** `evals/README.md` said to test B2/B3/C3/C4 without saying *how* to simulate turn continuity in a fresh-subagent-per-case regime. Resuming the same agent instance for turn 2 (rather than re-describing turn 1 inside a single prompt) worked cleanly and is a meaningfully more faithful test — the agent carried its actual prior reasoning/state, not a paraphrase of it. → **Action taken:** added a note to `evals/README.md`'s "How to Run" section recommending session-resume for multi-turn cases where the harness supports it, with a single-prompt fallback described for harnesses that don't.
