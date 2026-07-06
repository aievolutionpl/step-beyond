# Web Development — Step Beyond Examples

## Bad (literal agent)
```
User: "Build a landing page for my pizza place"
Agent: [writes single index.html with hero and menu section]
```

## Good (Step Beyond v3)
```
User: "Build a landing page for my pizza place"

Agent (internal):
  RECALL:      patterns.md → brand: navy+gold, language: PL. No repo scanned
               yet this session.
  ENVIRONMENT: package.json → Next.js 14 + Tailwind. Existing /components use
               named exports (no default export anywhere). git log -5 →
               last commits all touch app/(marketing)/, one two days ago.
               No tests directory. No CI workflow found in .github/.
  EXPAND:      landing page for THIS stack, matching existing conventions →
               hero, offer, CTA, contact path, meta, mobile. Done = deployable,
               same component style as the rest of the app — not a bare
               index.html dropped in next to a Next.js project.
  BUILD:       responsive landing in the existing Next.js/Tailwind pattern,
               named exports to match, navy+gold applied silently
  EXTEND:      +contact page w/ form + Google Maps embed, +favicon, +OG image
  VERIFY:      opened it, clicked every link, form submitted, 375px viewport,
               console clean

Agent (delivered):
  ✅ Landing page built with hero, menu, about section — matches the existing
     Next.js/Tailwind conventions already in the repo
  ➕ Added: contact page + form + Maps embed, favicon, OG image, responsive
     breakpoints
  ✔ Verified: every link clicked, form submitted, 375px viewport, console clean
```

## Why

A "landing page" is never just one page. It's the entry point to a business. Users will look for contact info, opening hours, location. Google will look for meta tags. Mobile users need responsive design. The agent that delivers the full ecosystem saves the user from having to ask for each piece individually — and the agent that reads the repo first ships something that actually belongs there, not a second competing convention. Full protocol: `skills/step-beyond/references/environment-scan.md`.

---

## More Examples

```
"fix the navbar bug"          → fix + check all navigation components +
                                 add mobile menu test + verify across breakpoints

"add a contact form"          → form + validation + spam protection +
                                 success/error states + email integration +
                                 thank-you page

"deploy this site"            → deploy + SSL cert + CDN config +
                                 custom 404 page + sitemap.xml + robots.txt

"build a restaurant site"     → home + menu + contact + reservations +
                                 gallery + Google Maps + opening hours +
                                 allergy info + catering page
```

---

## What Triggers Step Beyond Here

- "page," "site," "website," "landing," "build," "deploy"
- "fix," "add," "component," "section"
- Any HTML/CSS/JS work
