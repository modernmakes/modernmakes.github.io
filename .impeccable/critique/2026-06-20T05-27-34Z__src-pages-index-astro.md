---
target: src/pages/index.astro (homepage)
total_score: 30
p0_count: 0
p1_count: 4
timestamp: 2026-06-20T05-27-34Z
slug: src-pages-index-astro
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Newsletter has subscribing/success states & nav active states; ticker items give no real destination. |
| 2 | Match System / Real World | 3 | Speaks enthusiast language fluently; "Review" labels contradict the brand's own vocabulary rule. |
| 3 | User Control and Freedom | 3 | Nav search + escape work; auto-scrolling ticker can only pause on hover (no focus/keyboard/reduced-motion). |
| 4 | Consistency and Standards | 2 | Contradicts its own rules: "Review" labels, two side-stripe borders, off-scale radii, eyebrow on every section. |
| 5 | Error Prevention | 3 | Newsletter uses type=email + required; few error surfaces on a homepage. |
| 6 | Recognition Rather Than Recall | 4 | Everything visible and labeled; clear nav, captioned tools, no memory demands. |
| 7 | Flexibility and Efficiency | 3 | Nav search with Enter-to-go; no accelerators needed at this surface. |
| 8 | Aesthetic and Minimalist Design | 3 | Strong composition undercut by repeated eyebrows + side-stripes adding AI-tell noise. |
| 9 | Error Recovery | 3 | Newsletter catch resets the button; relies on browser-default validation only. |
| 10 | Help and Documentation | 3 | Tool cards self-describe; not a help-heavy surface. |
| **Total** | | **30/40** | **Good — solid foundation, specific integrity issues to fix** |

## Anti-Patterns Verdict

**Does this look AI-generated?** Partly — and the tells are concentrated and fixable, not pervasive.

**LLM assessment:** The composition is genuinely good — varied section rhythm (full-bleed hero → ticker → light card grid → dark ecosystem → CTA strip → tools → dark builds), real art-direction shifts between light and dark registers, and a confident three-voice type system. It does NOT read as a template homepage. But two AI grammar tells surface: (1) a tiny uppercase tracked orange **eyebrow above nearly every section** ("Printer Ecosystems", "Free Weekly Newsletter", "Free Tools", "Builds & Prosumer", plus "Latest") — the single most recognizable AI-scaffold cadence; and (2) **side-stripe accent borders** on the ecosystem cards and the newsletter strip.

**Deterministic scan:** `detect.mjs` exit 2. Two **warning**-level `side-tab` hits — `HomeEcosystemHubs.astro:143` (`border-left: 3px solid var(--accent)`) and `HomeNewsletterCTA.astro:45` (`border-left: 4px solid var(--accent)`). Both pair the stripe with `border-radius: 0 Npx Npx 0`, the textbook tell. Remaining hits are advisory: dark gradient hex stops in `HomeBuilds`/`HomePrinters` (decorative, acceptable drift), `5px`/`9px` radii outside the documented scale, and one `rgba(34,197,94,.12)` green that IS documented (false positive — detector didn't match the rgba against the hex token). Note: `HomePrinters.astro` was scanned but is **not imported by the homepage** — dead component.

**Visual overlays:** Not run this pass. Source + deterministic review only; no live browser injection, so no overlay tab is available.

## Overall Impression

This is a strong, well-paced editorial homepage that mostly earns its "Workshop Press" voice — then quietly violates the publication's own most emphatic rules. The biggest opportunity isn't visual polish; it's **brand integrity**: the word "Review" appears as section labels on a site whose first content commandment is "these are NOT reviews," and two cards wear the exact side-stripe border the design system bans. Fix the integrity issues and this jumps from "good homepage" to "unmistakably this brand."

## What's Working

1. **Register-switching art direction.** The alternation between off-white editorial sections and near-black prosumer sections (#161616 ecosystems, #0a0a0a builds) gives the page real rhythm and signals "the serious stuff lives in the dark." That's voice, not decoration.
2. **The hero's daily-rotation mechanic.** Day-of-year seeding means every visitor sees the same slide on a given day, with a graceful gradient fallback if the image 404s. Smart, resilient, and avoids a janky client carousel.
3. **The builds feature card.** The hand-drawn SVG gantry schematic as the feature image is a genuinely original touch — exactly the kind of personality that defeats the AI-slop test.

## Priority Issues

- **[P1] "Review" labels contradict the publication's #1 content rule.** `HomeBuilds.astro` tags a card `Hotends · Review`, and `homepage.json` carries `"type": "review"`. PRODUCT.md/CLAUDE.md: "These are NOT reviews — never use the word 'review' in titles, labels, or badges." 
  - **Why it matters:** This is the brand's load-bearing promise (curation, not hands-on testing). Undermining it on the homepage erodes the exact trust the publication sells.
  - **Fix:** Replace "Review" with "Specs", "Verdict", or "Breakdown" in `HomeBuilds.astro` build-card categories and purge the `"type":"review"` framing from `homepage.json`.
  - **Suggested command:** /impeccable clarify

- **[P1] Two side-stripe accent borders — absolute ban, and contradicts your own DESIGN.md.** `HomeEcosystemHubs.astro:143` and `HomeNewsletterCTA.astro:45`.
  - **Why it matters:** It's the most recognizable AI-UI tell, and it directly breaks the Hairline Rule you just documented (DESIGN.md lists this verbatim as a "Don't").
  - **Fix:** Rewrite as a full 1px hairline border with a background tint, or carry the accent via the eyebrow/CTA only. Drop the `border-radius: 0 Npx Npx 0` asymmetry with it.
  - **Suggested command:** /impeccable polish

- **[P1] Reveal animations gate content visibility, with no reduced-motion fallback.** `.la-card`, `.eco-container`, and `.nlcta-container` all start `opacity: 0` and only become visible when an IntersectionObserver adds a class. None honor `prefers-reduced-motion`; the hero ken-burns and 40s infinite ticker don't either.
  - **Why it matters:** Transitions pause on hidden tabs and headless renderers — if JS fails, an observer misfires, or a crawler renders the page, these sections can ship blank. For an SEO-dependent publication that's a real risk. The infinite ticker is also a vestibular trigger that only pauses on hover.
  - **Fix:** Make the visible state the default and let JS add an enhancement class (invert the logic), and add a `@media (prefers-reduced-motion: reduce)` block that disables ken-burns, the ticker scroll, and the reveals.
  - **Suggested command:** /impeccable animate

- **[P1] Every ticker link points to `/`.** All five `homepage.json` ticker items have `"href": "/"`.
  - **Why it matters:** The "Latest" news ticker is the most time-sensitive element on the page; clicking any item reloads the homepage. It reads as broken/placeholder and burns trust on first interaction.
  - **Fix:** Point each ticker item at its real article/route, or if destinations don't exist yet, render them as non-link text rather than dead anchors.
  - **Suggested command:** /impeccable harden

- **[P2] Eyebrow above nearly every section.** "Printer Ecosystems", "Free Weekly Newsletter", "Free Tools", "Builds & Prosumer", plus the "Latest" labels — the tiny-uppercase-tracked-kicker cadence on 4–5 consecutive sections.
  - **Why it matters:** This is the saturated AI-scaffolding tell; it flattens an otherwise distinctive page into "generated landing page" grammar.
  - **Fix:** Keep one deliberate kicker as a brand system OR vary the cadence — let some sections open straight on the condensed headline, use a ruled label on others. Don't repeat the same eyebrow treatment section after section.
  - **Suggested command:** /impeccable typeset

## Persona Red Flags

**Jordan (Confused First-Timer):** Clicks a compelling ticker headline ("Prusa CORE One INDX 8-nozzle toolchanger now orderable") and lands back on the homepage — no feedback, no destination, instant confusion. The "Review" vs "not reviews" inconsistency would also confuse anyone reading carefully.

**Riley (Deliberate Stress Tester):** Disables JS or throttles to slow 3G → the Latest grid, ecosystem block, and newsletter strip can render invisible (opacity:0 with no observer fire). Tabs to the ticker → can't pause it (hover-only). Finds the `2.4 · 400mm` Voron variant chip, cross-checks, and catches that **no 400mm Voron exists** — a factual error on a publication that sells accuracy. **[P2]**

**Casey (Distracted Mobile User):** The hero collapses cleanly and tap targets are reasonable, but the auto-scrolling ticker with no pause control is hard to read one-handed on the move, and the infinite animation keeps the CPU/battery working with no reduced-motion escape.

## Minor Observations

- **Dead carousel CSS in the hero.** `.hero-dots` and `.hero-sidebar` are fully styled (including responsive rules) but never rendered — the component ships a single daily slide. Leftover from a multi-slide carousel; safe to delete.
- **`HomePrinters.astro` is unused.** Not imported by `index.astro`; the detector only saw it because the scan targeted the whole `home/` dir.
- **Off-scale radii.** `5px` (newsletter input/strip) and `9px` (build card) sit outside the documented rounded scale (4/8/10/12). Either snap to the scale or add `5px` to DESIGN.md — the codebase uses 5px for inputs in several places, so it may deserve a token.
- **Unused `latestArticles` block in `homepage.json`.** `HomeLatestArticles.astro` pulls from content collections via `getCollection`, so the hand-maintained `latestArticles` array (with its `/printers/`, `/accessories/`, `/software/` links) is never rendered — stale config worth removing to prevent confusion.
- **Visible hero headline is an `<h2>`** while the document H1 is sr-only (homepage doesn't set `hasPageH1`). Defensible for an editorial homepage, but worth a conscious decision.

## Questions to Consider

- What if one section opened cold on its condensed headline with no eyebrow at all — would the page feel more like a publication and less like a landing page?
- Does the ecosystem card need a border accent at all, or would the orange "Explore the ecosystem →" CTA carry enough of the brand on its own?
- If a reader screenshots one section to share, which one is unmistakably Modern Makes — and how do you get more of that?
