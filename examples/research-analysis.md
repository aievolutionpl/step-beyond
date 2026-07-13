# Research & Analysis — Step Beyond Examples

## Bad (literal agent)
```
User: "Research our top 3 competitors in the project management space"
Agent: [writes vague, unsourced paragraphs — "Competitor A is well known for
        its user-friendly interface" — nothing you could act on, nothing you
        could check]
```

## Good (Step Beyond v4)
```
User: "Research our top 3 competitors in the project management space"

Agent (internal):
  CONTEXT: confirmed industry: B2B SaaS. Prior observable feedback favored a
           table and executive summary.
  INTENT:  this is a decision input. Audience is not explicit, so keep the
           base broadly usable and disclose any material audience assumption.
           Done means
           something someone could act on this week, not a list of facts.
  DECIDE:  perform read-only research; ask before accessing gated or paid data.
  BUILD:   3 sourced competitor profiles — pricing (from their public pricing
           page), positioning (from their own homepage copy), 1 concrete
           gap each (a feature they're missing, cited from a review site or
           changelog).
  INITIATIVE: score a gap ranking and priority matrix as optional local analysis.
  EXECUTE: produce the authorized research and selected analysis.
  VERIFY:  claim audit — every stated fact traces to a specific source
           actually consulted (pricing page, changelog, review aggregator);
           no fact ships without one. Numbers cross-checked against a
           second source where the first seemed off.
  DELIVER: lead with the sourced profiles, distinguish analysis from source
           facts, and offer any higher-cost next step rather than executing it.

Agent (delivered):
  ✅ 3 competitor profiles — pricing, positioning, one sourced gap each
  ➕ Competitive gaps ranked by defensibility
  ➕ Priority matrix (effort vs. impact)
  ➕ Ranked action plan + exec summary — previously accepted format
  ✔ Verified: every claim maps to a source consulted; 2 numbers cross-checked
    against a second source after the first looked stale
```

## Why

Research becomes useful when claims remain traceable to consulted sources. An
action plan can be a valuable candidate, but the domain alone does not prove the
user wants it. V4 requires evidence, scoring, and permission before optional work.

---

## More Examples

```
"analyze this market"       → sized market + sourced trends + 2-3 entry
                               points ranked by feasibility

"compare these 3 tools"     → feature matrix (every cell sourced) +
                               pricing comparison + a recommendation with
                               the reasoning shown, not just asserted

"summarize this industry report" → summary + the 3 numbers that actually
                               matter for this business + what changed
                               since the last version (if one exists)
```

---

## What Triggers Step Beyond Here

- "research," "find," "analyze," "investigate," "competitor," "market," "look into"
- Any request whose deliverable is a set of claims someone else will rely on
