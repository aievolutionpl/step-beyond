# Image Generation — Step Beyond Examples

## Bad (literal agent)
```
User: "Generate a woman in a red dress"
Agent: [generates woman in red dress on plain white background]
```

## Good (Step Beyond v4)
```
User: "Generate a woman in a red dress"
Agent:
  CONTEXT: confirmed constraint: no variant spam; observed preference: 1:1 for IG
  INTENT:  create a useful red-dress image rather than a context-free subject
  DECIDE:  generate locally within the request; alternate formats remain optional
  BUILD:   woman in a red dress, with a deliberate setting and composition
  INITIATIVE: score one 1:1 crop because prior observable feedback supports it
  EXECUTE: generate the base and the selected crop
  ✅ Generated woman in red dress (as requested)
  ➕ Placed her at golden hour on the Amalfi Coast terrace, cinematic depth of field,
     warm Mediterranean light, rule of thirds composition
  ➕ Bonus: square crop variant for Instagram (reinforced — skipped the other
     4 aspect ratios; that's the banned spam pattern)
  ✔ Verified: hands correct, no artifacts, no gibberish text, exact ratio
```

## Why

The request leaves composition open. The agent may choose a reversible creative
interpretation, but it should disclose a material assumption and avoid presenting
an aesthetic choice as the user's established preference.

---

## More Examples

```
"product shot of a watch"     → watch on a wrist, morning light through window,
                                 coffee cup nearby, lifestyle context

"logo for a bakery"           → logo + dark variant + icon-only + mockup on
                                 a paper bag and storefront sign

"hero image for SaaS"         → hero + 3 crop variants (16:9, 1:1, 9:16) +
                                 dark mode version + text-safe zones marked
```

---

## What Triggers Step Beyond Here

- "image," "photo," "graphic," "generate," "render," "visual"
- Any request for visual output
