# CLAUDE.md — Modern Makes

Complete context for Claude Code. Read this before touching anything.

---

## Commands

```bash
npm run dev          # Dev server at http://localhost:4321
npm run build        # Production build → dist/
npm run preview      # Preview production build
npm run fetch-data   # Pull Airtable → src/data/hardware/ JSON files
```

No lint or test commands. The PostToolUse build hook runs `npm run build` automatically after every file edit — watch for build errors in the output before proceeding.

**Git workflow:** All commits are made via Claude Code (`git add` + `git commit`). Matt pushes from GitHub Desktop only — never run `git push` from terminal.

---

## Project Identity

**Modern Makes** — faceless prosumer FDM 3D printing editorial publication.  
**Live site:** modernmakes.github.io  
**Stack:** Astro 4.x, static output, GitHub Pages  
**Deploy:** Every push to `main` triggers `.github/workflows/deploy.yml` → `astro build` → deploys `dist/`  
**Pages:** ~100 pages, zero errors required at build  
**GA4:** `G-CGR4N532H6`  
**Contact:** `modernmakesco@gmail.com`

---

## Brand & Voice

- **Colors:** Electric Orange `#FF5A1F` (`--accent`), dark-first aesthetic
- **Typography:** Barlow Condensed 800 (display `--fd`), Lora 400 (body `--fb`), JetBrains Mono (`--fm`), Barlow UI (`--fu`)
- **Voice:** Opinionated enthusiast, editorial "we tested" framing — never "I tested"
- **Content rule:** No opinions on products the team hasn't used. Factual framing only.
- **These are NOT reviews** — never use the word "review" in titles, labels, or badges for hardware pages. Use "specs", "verdict", "where to buy" instead.

---

## Design System

**No Tailwind** — the package is installed but unused. Use CSS custom properties from `src/styles/global.css`.

Key tokens:
```css
--accent: #FF5A1F       /* electric orange */
--black: #1A1A1A
--bg: #F7F6F3           /* off-white */
--surface: #FFFFFF
--border: #E2E2E0
--g1, --g2              /* grey scale */
--dark-bg, --dark-surface, --dark-border
--fd                    /* Barlow Condensed — display */
--fb                    /* Lora — body prose */
--fu                    /* Barlow — UI */
--fm                    /* JetBrains Mono — specs/code */
--max-w: 1200px
--article-w: 720px
```

Pre-built utility classes — use before writing new CSS:
`.container`, `.section`, `.section-lg`, `.section-head`, `.card`, `.product-card`, `.spec-chip`, `.btn-buy`, `.verdict`, `.grid-2/3/4`, `.eyebrow`, `.dark-section`, `.callout-orange`

Component styles live in `<style>` blocks within `.astro` files.  
**Critical:** Components that interact with JS-toggled classes (like `.scrolled`) need `<style is:global>` — Astro's default scoping breaks them.

---

## File Structure

```
src/
  layouts/
    Base.astro              — wraps every page. hasPageH1, hasHero, heroPage props
    ArticleLayout.astro     — news articles. currentPath prop for nav highlight
    GuideLayout.astro       — how-to guides with steps, tools, parts
    ComparisonLayout.astro  — VS articles with score bars
    FilamentLayout.astro    — filament material pages
    ComponentLayout.astro   — hardware component pages (hotends etc)
    MotionSystemLayout.astro — gantry/motion mod pages
  pages/
    index.astro             — homepage (data-driven from homepage.json)
    voron/
      index.astro           — Voron hub (model selector, subsystem grid)
      mods/index.astro      — 18 community mods with category/model filter
      toolheads/            — 5 toolhead pages (stealthburner, xol, etc)
      origin.astro          — Voron history editorial page
      [subsystem pages]     — extruders, motion-system, electronics, etc
    ratrig/, vzbot/, hevort/ — ecosystem hubs + origin.astro pages
    hardware/
      index.astro           — hardware category grid (dynamic counts from JSON)
      hotends/
        index.astro         — hotend card grid, verdict filter tabs
        [slug].astro        — dynamic route, one page per Airtable record
    guides/, news/, filament/, tools/, press/
  content/
    news/       — .md files for news articles
    guides/     — .md files for guides
    comparisons/ — .md files for comparisons
  data/
    homepage.json           — drives every homepage section
    ads.json                — ad slot config
    hardware/               — JSON files fetched from Airtable
      hotends.json          — 12 records (Rapido 2 family, Chube, Goliath, Tricorn)
      extruders.json        — 3 records (Fysetc Sherpa V3, SLM Sherpa Micro, Lite Pro)
      bed-probes.json       — 5 records
      nozzles.json          — empty
      build-plates.json     — empty
      mainboards.json       — 1 record (StrideMax Dual FD)
      toolboards.json       — empty
      part-cooling.json     — 1 record (Wonsmart WS9290)
      motors.json           — 1 record (SLM NEMA17 Water Cooler)
      [other tables]        — empty
  styles/
    global.css              — entire design system
  components/
    Nav.astro, Footer.astro, AdSlot.astro, [homepage section components]
```

---

## Layouts — Key Props

### Base.astro
```
title, description, ogImage
heroPage={true}     — removes padding-top: 80px from <main> (homepage, hero articles)
hasHero={true}      — nav starts transparent (dark hero pages)
hasPageH1={true}    — suppresses sr-only H1 (any page with its own visible H1)
```
Always pass `hasPageH1={true}` from layouts that render their own H1 to avoid duplicate H1s.

### ComponentLayout.astro (hardware pages)
```
title, brand, category, excerpt, verdict, price: { usd }
specs[]             — { label, value } array for specs table
quickSpecs[]        — { label, value } array for sidebar
vendors[]           — { name, url, price, region, primary, affiliate }
compatibleToolheads[] — { name, href? }
compatiblePrinters[]  — { name } (separate from toolheads — different sidebar section)
relatedComponents[] — { title, category, href }
heroImageUrl        — used in Product schema image field
pageTitle           — overrides default "[name] — [brand] [category] Review" title
primaryVendorUrl    — used in Product schema offers.url
hasPageH1={true}    — always pass this
```

### ArticleLayout.astro
```
title, excerpt, category, date, readTime
heroImage           — optional, falls back to gradient
currentPath         — pass ecosystem path for correct nav highlight (e.g. '/voron')
```

---

## Airtable Integration

**Hardware DB Base ID:** `appt6uoXxkQJEe3Rp`

### Tables and IDs
| Table | ID |
|---|---|
| Hotends | tblWYO1fRFXcY6fXF |
| Extruders | tblTWR36Uq0RM4TB2 |
| Bed Probes | tblbKbuuUQhCSX38C |
| Nozzles | tblGOrDOH1cBBjgUv |
| Build Plates | tblmKDQDt0wHypEjx |
| Mainboards | tbl7zcODDUtBp63PX |
| Toolboards | tblPaWOgRQDq6TrwH |
| Part Cooling | tblCzOd1Crf4K9ZkO |
| Air Filtration | tblPecAiQBq1Wbuy6 |
| Enclosure | tbldFKTCpesINRv3n |
| Filament Dryers | tblAFI1uYCz9ovbJI |
| Heaters | tbleG8nGHrCiVWPRP |
| PSUs | tbl8vxrHDWKksQs1e |
| Gantrys | tblbofl1tnNRRHdaH |
| Motion System | tbl2CQ6TAnkwprQkX |
| Lighting & Cameras | tbljCecwZZPXMsSoI |
| Filament | tblCD21uNiq1db1HC |
| Printers | tblboLo18BZ2k0E9n |
| Motors | tblRXZNO0ITQeNg9q |

### Data sync workflow
```bash
npm run fetch-data
git add src/data/hardware/
git commit -m "data: [description]"
# Matt pushes from GitHub Desktop
```

**Never hardcode Airtable API tokens** — the token lives in VS Code environment and GitHub Secrets (`AIRTABLE_TOKEN`) only. Never paste it in Claude Code or this chat.

### Hotends JSON field names (most important table)
Fields match Airtable field names exactly:
- `Name`, `Brand`, `Type`, `Max Temp (°C)`, `Max Flow (mm³/s)`, `Thermistor`, `Heater Type`
- `Price (USD)`, `Verdict`, `Verdict Label`, `Description`, `Body`
- `Pros`, `Cons` (multiline text, one item per line)
- `Compatible Printers`, `Compatible Toolheads` (multiselect arrays)
- `Heat Break`, `Heat Block`, `Nozzle Thread`, `Mount Style`, `Fan Size`, `Part Number`
- `Weight (g)`
- `Vendor 1 Name` through `Vendor 5 Name` + `Vendor N URL` + `Vendor N Affiliate`
- `Related 1 Name` + `Related 1 URL` through `Related 3 Name` + `Related 3 URL`
- `Image URL`

### Slug generation
```js
function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
```
"Rapido 2 UHF" → `rapido-2-uhf`, "Chube Air" → `chube-air`

---

## SEO & Schema

### Double H1 prevention
Every layout that renders a visible H1 passes `hasPageH1={true}` to Base.astro. This suppresses the sr-only fallback H1. Never create a page with two H1s.

### Title format by page type
- Hardware detail: `"[Name] Hotend — Specs, Verdict & Where to Buy — Modern Makes"`
- Hardware index: `"Best FDM Hotends for Voron & Prosumer Printers — Modern Makes"`
- Article: `"[Headline] — Modern Makes"`
- Guide: `"[Title] — Modern Makes"`
- Origin story: `"How [Brand] Started: [Subtitle] — Modern Makes"`

### Schema by layout
- `ComponentLayout` → Product + BreadcrumbList (injected automatically)
- `ArticleLayout` → NewsArticle + BreadcrumbList
- `GuideLayout` → HowTo + BreadcrumbList
- `ComparisonLayout` → Article + BreadcrumbList
- `FilamentLayout` → TechArticle + BreadcrumbList
- `MotionSystemLayout` → SoftwareSourceCode + BreadcrumbList
- Hardware index → ItemList
- Ecosystem hubs → CollectionPage + BreadcrumbList

Schema is injected via `<script type="application/ld+json" slot="head">` — Base.astro has `<slot name="head" />` in `<head>`.

---

## Known Patterns & Gotchas

### Astro scoped styles + JS class toggling
If JS toggles a class on an element, its styles must be in `<style is:global>` — Astro's default scoping hashes class names at build time, breaking runtime JS class matching.

### CSS hysteresis for nav
Nav snaps solid at 80px scroll down, unsnaps at 60px scroll up — eliminates flicker at threshold.

### Image paths on GitHub Pages
Case-sensitive. Voron images are at `public/Media/ecosystems/Voron/` (capital V). Wrong case = broken image in production even if it works locally on Windows.

### GitHub Pages base URL
`Astro.site` is set in `astro.config.mjs`. Use it for absolute URLs in schema: `new URL(Astro.site).href.replace(/\/$/, '')`.

### fetch-data script
`scripts/fetch-airtable.mjs` requires `AIRTABLE_TOKEN` env var. Run from VS Code terminal where the token is set. The GitHub Actions workflow also runs it nightly.

### Node.js version
**Deadline: June 16, 2026** — update `fetch-airtable.yml` and `deploy.yml` from Node 20 to Node 24 to avoid GitHub Actions deprecation failures.

### AdSlot component
`<AdSlot slotName="slot-name" />` renders nothing when `"active": false` in `ads.json`. Safe to place anywhere.

### Newsletter forms
Any `<form data-nl>` with `<input type="email">` and `<button type="submit">` gets wired automatically by Base.astro inline JS.

---

## Content Collections

```
src/content/
  news/       → /news/[slug]       → ArticleLayout
  guides/     → /guides/[slug]     → GuideLayout
  comparisons/ → /comparisons/[slug] → ComparisonLayout
```

Frontmatter schemas defined in `src/content/config.ts`. Dynamic routes in `src/pages/news/[slug].astro` etc select layout from collection.

---

## Voron Ecosystem — Specific Notes

- **Printed parts color:** Red (not orange)
- **Build sizes:** 250/300/350mm (no 400mm variant exists)
- **Model selector:** Two buttons (Voron 2.4 / Trident) — JS swaps subsystem cards, spec strip, hero image, and "Now browsing" context bar using `localStorage` + `data-models` attributes
- **Community mods:** 18 mods at `/voron/mods` with category filter (Toolhead, Gantry, Motion, Electronics, Bed, Filtration, Cosmetic, QOL) and model filter
- **Toolhead pages:** `/voron/toolheads/` — Stealthburner, XOL, Dragon Burner, Mini Stealthburner, Archetype
- **Origin page:** `/voron/origin` — editorial history, ArticleLayout, category "HISTORY"

---

## Hardware Section — Specific Notes

- **Hardware index** (`/hardware`) — category grid with dynamic counts from JSON `.length`. No "Motion Mods" card — that content lives at `/voron/mods`.
- **Hotend index** (`/hardware/hotends`) — verdict filter tabs (BUY / CONSIDER / SKIP / UPDATED) matching guides page filter pattern. Count badges on each tab.
- **Hotend detail** (`/hardware/hotends/[slug]`) — fully data-driven from Airtable JSON. One page per record. Redirect from old `/hardware/hotends/rapido-2` → `/hardware/hotends/rapido-2-uhf`.
- **Verdict values:** `BUY`, `CONSIDER`, `SKIP`, `UPDATED` — used for filter tabs and verdict badges
- **Verdict badge colors:** BUY = green, CONSIDER = blue, SKIP = grey, UPDATED = orange (defined in `global.css`)

---

## Origin Story Pages

Four editorial history pages:
- `/voron/origin` — Maksim Zolin, 2015, open-source spec, 15k+ serial numbers
- `/ratrig/origin` — Portuguese extrusion supplier → CoreXY kits
- `/vzbot/origin` — Simon Vez, TronXY X5S, AWD, 2020
- `/hevort/origin` — MirageC, triple independent Z ball screws, mechanical precision

All use `ArticleLayout`, `category="HISTORY"`, `currentPath` set to their ecosystem path.

---

## Tools Section

**Internal tools (Astro pages):**
- `/tools/pressure-advance` — Klipper/Marlin/RRF G-code generator with printer presets

**External tools (link out, `target="_blank"`):**
- Motor Simulator — https://tools.excit3d.shop/motor-sym/
- Pin Mapper — https://tools.excit3d.shop/pin-mapper/
- PA Calculator — https://tools.excit3d.shop/pa-calc/
- PA Tuner — https://tools.excit3d.shop/pa-tuner/

External tool cards show `↗ External tool` chip and open in new tab.

---

## Pending Work (priority order)

1. **Verdict filter on hotend index** — tabs matching guides page filter pattern (in progress)
2. **Beehiiv newsletter capture** — embed on homepage CTA + bottom of every article/guide layout
3. **Node.js 20 → 24 upgrade** — deadline June 16, 2026 in `fetch-airtable.yml` and `deploy.yml`
4. **Hero images** — hotend pages all showing gradient fallback (no Image URL in Airtable records). Generate in Ideogram.ai, upload to `public/`, add paths to Airtable Image URL field, run fetch-data.
5. **Extruder pages** — wire extruders.json to `/hardware/extruders/[slug]` (same pattern as hotends)
6. **Bed probe pages** — wire bed-probes.json to `/hardware/probes/[slug]`
7. **GA4 custom events** — tool_click and newsletter_signup events on tools pages
8. **Content sprint** — RatRig pre-assembled, Bambu neXt, Prusa HT Hotend, AtomForm Palette 300
9. **Make.com automations** — 8 designed, none built (idea-to-brief, publish triggers, newsletter scaffold, stale alerts, repurposing, affiliate expiry, revenue log, sponsor alerts)
10. **Domain** — `modernmakes.io` recommended, schema URLs need updating after purchase
11. **og-default.jpg** — still needed for pages without hero images
