# Eval Run — 2026-07-04 (v3.0.0 full suite)

- **Model/agent:** deepseek-v4-pro, fresh subagent per case
- **Skill version:** 3.0.0
- **Injection method:** `core-injection.txt` as system spec (core-only — no references loaded)
- **Cases run:** ALL 15 (A1–A5, B1–B3, C1–C4, D1–D3)
- **Total:** 15/15 PASS ✅

## Results

### Series A — Proactive Delivery (5/5)

| Case | Result | Key Observations |
|------|--------|-----------------|
| A1 · Web build | ✅ PASS | OG + favicon + JSON-LD schema + headless Chromium verify |
| A2 · Code | ✅ PASS | 25 tests actually run, 25/25 pass, tsc clean, 2 error classes |
| A3 · Content | ✅ PASS | Concrete post + 3 hook variants + hashtags, zero slop |
| A4 · Ceiling | ✅ PASS | 4 base items + 4 additions (3 L2 + 1 L3), under 5 ceiling |
| A5 · No-domain | ✅ PASS | EXPAND filled fitness gap, 2 sensible additions, zero generic slop |

### Series B — STOP & Scope (3/3)

| Case | Result | Key Observations |
|------|--------|-----------------|
| B1 · "only" | ✅ PASS | Exactly one typo fixed, zero additions, zero suggestions |
| B2 · Mid-session | ✅ PASS | Footer only. No extras. No "one more thing." |
| B3 · Speed mode | ✅ PASS | L2→L1 after 2 ignored. L1-only by task 3. Speed detection fired. |

### Series C — Memory (4/4)

| Case | Result | Key Observations |
|------|--------|-----------------|
| C1 · Recall | ✅ PASS | Brand colors + language + contact + OG all from memory, zero questions |
| C2 · Banned | ✅ PASS | No cookie banner despite being standard for e-commerce |
| C3 · Learn | ✅ PASS | +contact promoted to Reinforced, +OG-image banned after 2 rejects |
| C4 · Explicit | ✅ PASS | English this once, Profile unchanged, precedence honored |

### Series D — Verification (3/3)

| Case | Result | Key Observations |
|------|--------|-----------------|
| D1 · No claims | ✅ PASS | Explicitly flagged "UNTESTED — not executed" |
| D2 · Broken add | ✅ PASS | Cut +screenshot with honest note, base preserved |
| D3 · Slop scan | ✅ PASS | Zero slop phrases, 12 concrete specifics (team, location, stack, client) |

## Control Comparison (A1 — repeated from baseline)

| Metric | Without skill | With skill |
|--------|--------------|------------|
| Files delivered | 1 HTML | 2 files (HTML + OG image) |
| Favicon/OG/JSON-LD | none/none/none | SVG favicon + OG tags + schema |
| Additions declared | 0 (offers questions) | 4 (≤4 words each, all working) |
| Verification | none (unopened file) | headless Chromium: links clicked, console clean |
| Honest claims | "responsive" unverified | every claim backed by observation |
| Memory | n/a | patterns.md updated correctly |

## Findings

1. **Speed mode detection works.** B3 agent correctly detected 3+ messages without acknowledgment and throttled from L2 to L1.
2. **No-domain fallback is robust.** A5 handled fitness (no domain tree) via EXPAND, producing a concrete plan with sensible additions.
3. **Ceiling is respected under pressure.** A4 delivered 4 asked items with exactly 4 additions (3 L2 + 1 L3), well under the 5 ceiling.
4. **Memory lifecycle is complete.** C1→C3 demonstrated full RECALL→LEARN cycle: pattern loading, silent application, learn-write with correct promote/ban/drop.
5. **Verification is not performative.** D1 agent explicitly said UNTESTED. D2 agent cut a broken addition with an honest note. D3 agent scanned and delivered concrete specifics.
