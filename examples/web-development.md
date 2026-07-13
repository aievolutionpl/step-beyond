# Web Development — Step Beyond Examples

## Bad (literal agent)
```
User: "Build a landing page for my pizza place"
Agent: [writes single index.html with hero and menu section]
```

## Good (Step Beyond v4)
```
User: "Build a landing page for my pizza place"

Agent (internal):
  CONTEXT:     confirmed user preferences → brand: navy+gold, language: PL.
               package.json → Next.js 14 + Tailwind. Existing /components use
               named exports (no default export anywhere). git log -5 →
               last commits all touch app/(marketing)/, one two days ago.
               No tests directory. No CI workflow found in .github/.
  INTENT:      landing page for this stack, matching existing conventions →
               hero, offer, CTA, contact path, meta, mobile. Done = deployable,
               same component style as the rest of the app — not a bare
               index.html dropped in next to a Next.js project.
  DECIDE:      proceed with the reversible local build; do not publish.
  BUILD:       responsive landing in the existing Next.js/Tailwind pattern,
               named exports to match, navy+gold applied silently
  INITIATIVE:  score contact path, favicon, and OG image as request-specific
               candidates; keep only candidates above the active mode threshold.
  EXECUTE:     build the base and selected AUTO local candidates.
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

A landing page is an entry point to a business, but that does not authorize an
unbounded site build. The v4 agent reads the repo, completes the requested page,
then scores a small set of relevant local candidates. Publication, external
services, and higher-risk changes still require the appropriate permission.

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
