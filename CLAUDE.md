# CLAUDE.md — Modern Makes

Complete context for Claude Code. Read this before touching anything.

## Wiki Knowledge Base

Path: `C:\Users\matty\claude-obsidian`

At the start of every session, silently read:
1. `C:\Users\matty\claude-obsidian\wiki\principles.md` — universal decision-making lens
2. `C:\Users\matty\claude-obsidian\wiki\hot.md` — recent context

When you need deeper context:
3. Read `C:\Users\matty\claude-obsidian\wiki\index.md`
4. For domain specifics, read `C:\Users\matty\claude-obsidian\wiki\<domain>\_index.md`
5. Only then read individual wiki pages

Do NOT read the wiki for general coding questions or things already in this project.

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

## Claude Code Skills

### Design Skill Routing

| Task | Primary Skill | Secondary |
|---|---|---|
| New page build | `hallmark` | `stitch-design-taste` |
| New component with animation | `transitions review` | `design-motion-principles` |
| Add transitions to existing component | `transitions apply` | — |
| Design quality audit | `impeccable` | `web-design-guidelines` |
| Catch AI-slop patterns | `hallmark` | — |
| Agency-grade polish pass | `high-end-visual-design` | — |
| Visual direction / opinionated taste | `@design-taste-frontend` | — |
| Image → code (screenshot/mockup) | `image-to-code` | — |
| Generate hero image | `nanobanana` | — |
| YouTube thumbnail | `youtube-thumbnail-design` | — |

### Rules

- **Every new page build** → invoke `hallmark` first
- **Every new component** → invoke `transitions review` first
- Never stack more than 2 design skills on a single task
- Explicit invocation (`@agent` or `/skill-name`) beats auto-selection for design tasks
- `frontend-design` is always active as baseline — no need to invoke explicitly

### Project-specific exceptions

- Modern Makes uses **no Tailwind** — skip any skill output that uses utility classes; translate to CSS custom properties from `global.css`
- Motion/animation must respect the existing CSS nav hysteresis pattern (80px down / 60px up)
- Never output `<style>` blocks without checking if `is:global` is needed first

---

## Project Identity

**Modern Makes** — faceless prosumer FDM 3D printing editorial publication.
**Live site:** modernmakes.github.io
**Stack:** Astro 4.x, static output, GitHub Pages
**Deploy:** Every push to `main` triggers `.github/workflows/deploy.yml` → `astro build` → deploys `dist/`
**Pages:** 361 pages, zero errors required at build
**GA4:** `G-CGR4N532H6`
**Contact:** `modernmakesco@gmail.com`

---

## Content Briefs (from Cowork)

Content briefs are researched and drafted in the separate Cowork workspace at
`C:\Users\matty\cowork\Modern Makes\briefs\` — filenames follow `YYYY-MM-DD-slug.md`.
When asked to write an article, check that folder first for a matching brief before
starting from scratch. Briefs are pre-verification-checked per Cowork's rules but are
not publish-ready — confirm claims still hold before writing the final article.

---

## Brand & Voice

See BRAND.md for full brand reference (voice, verdict taxonomy, tokens, tagline pool, positioning).

- **Colors:** Electric Orange `#FF5A1F` (`--accent`), dark-first aesthetic
- **Typography:** Barlow Condensed 800 (display `--fd`), Lora 400 (body `--fb`), JetBrains Mono (`--fm`), Barlow UI (`--fu`)
- **Voice:** Opinionated enthusiast, editorial "we tested" framing — never "I tested"
- **Content rule:** Curation publication — we synthesize community consensus, we do not conduct hands-on reviews. No opinions on products the team hasn't used. Factual framing only.
- **These are NOT reviews** — never use the word "review" in titles, labels, or badges for hardware pages. Use "specs", "verdict", "where to buy" instead.
- **No fake metrics** — never fabricate audience numbers. Use honest qualitative descriptors. "Audience metrics available on request."
- **Bambu Lab** — news and guides only, no ecosystem hub. Ecosystem hubs are self-build printers only.

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

The `lg-*` layout rules (two-column editorial: breadcrumb → H1 → sticky sidebar TOC + prose) are defined in `global.css` under `/* ── EDITORIAL LAYOUT (lg-*) ── */`. Use these for all info/legal pages — do not re-implement inline.

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
    ComponentLayout.astro   — hardware component pages (hotends, extruders, probes)
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
      extruders/
        index.astro         — extruder card grid, verdict filter tabs
        [slug].astro        — dynamic route, one page per Airtable record
      probes/
        index.astro         — bed probe card grid, verdict filter tabs
        [slug].astro        — dynamic route, one page per Airtable record
    guides/, news/, filament/, tools/, press/
    legal/
      terms-of-service.astro
      cookie-policy.astro
    editorial.astro
    advertise.astro
    partners.astro
    search.astro
    sitemap.astro
    newsletter/
      archive.astro
    404.astro
  content/
    news/        — .md files for news articles
    guides/      — .md files for guides
    comparisons/ — .md files for comparisons
  data/
    homepage.json           — drives every homepage section
    ads.json                — ad slot config
    hardware/               — JSON files fetched from Airtable
      hotends.json          — 16 records
      extruders.json        — 30 records
      bed-probes.json       — 9 records
      nozzles.json          — 20 records
      build-plates.json     — 12 records
      mainboards.json       — 10 records
      toolboards.json       — 8 records
      part-cooling.json     — 11 records
      air-filtration.json   — 8 records
      enclosures.json       — 16 records
      filament-dryers.json  — 9 records
      heaters.json          — 25 records
      psus.json             — 8 records
      gantrys.json          — 7 records
      motion-system.json    — 23 records
      lighting-cameras.json — 8 records
      motors.json           — 12 records
      printers.json         — 8 records
      filament.json         — empty
  styles/
    global.css              — entire design system
  components/
    Nav.astro, Footer.astro, AdSlot.astro, BeehiivEmbed.astro, [homepage section components]
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
specs[]               — { label, value } array for specs table
quickSpecs[]          — { label, value } array for sidebar
vendors[]             — { name, url, price, region, primary, affiliate }
compatibleToolheads[] — { name, href? }
compatiblePrinters[]  — { name } (separate from toolheads — different sidebar section)
relatedComponents[]   — { title, category, href }
heroImageUrl          — used in Product schema image field
pageTitle             — overrides default title
primaryVendorUrl      — used in Product schema offers.url
hasPageH1={true}      — always pass this
```

### ArticleLayout.astro

```
title, excerpt, category, date, readTime
heroImage           — optional, falls back to gradient
currentPath         — pass ecosystem path for correct nav highlight (e.g. '/voron')
```

---

## Airtable Integration

**Hardware DB:** `appt6uoXxkQJEe3Rp`
**Editorial DB:** `appjJWszZBOS13e0i`

### Hardware DB Tables

| Table | ID | Status |
|---|---|---|
| Hotends | tblWYO1fRFXcY6fXF | 16 records — only table fully migrated to Workhorse/Bleeding Edge/Skip |
| Extruders | tblTWR36Uq0RM4TB2 | 30 records |
| Bed Probes | tblbKbuuUQhCSX38C | 9 records |
| Nozzles | tblGOrDOH1cBBjgUv | 20 records |
| Build Plates | tblmKDQDt0wHypEjx | 12 records |
| Mainboards | tbl7zcODDUtBp63PX | 10 records |
| Toolboards | tblPaWOgRQDq6TrwH | 8 records |
| Part Cooling | tblCzOd1Crf4K9ZkO | 11 records |
| Air Filtration | tblPecAiQBq1Wbuy6 | 8 records |
| Enclosure | tbldFKTCpesINRv3n | 16 records |
| Filament Dryers | tblAFI1uYCz9ovbJI | 9 records |
| Heaters | tbleG8nGHrCiVWPRP | 25 records |
| PSUs | tbl8vxrHDWKksQs1e | 8 records |
| Gantrys | tblbofl1tnNRRHdaH | 7 records |
| Motion System | tbl2CQ6TAnkwprQkX | 23 records |
| Lighting & Cameras | tbljCecwZZPXMsSoI | 8 records |
| Filament | tblCD21uNiq1db1HC | empty |
| Printers | tblboLo18BZ2k0E9n | 8 records |
| Motors | tblRXZNO0ITQeNg9q | 12 records |

### Editorial DB Tables

| Table | ID | Status |
|---|---|---|
| Newsletter Issues | tblgCX2IZ2e0hHOaD | empty, Status field has "Sent" option |

### Data sync workflow

```bash
npm run fetch-data
git add src/data/hardware/
git commit -m "data: [description]"
# Matt pushes from GitHub Desktop
```

**Never hardcode Airtable API tokens** — set in plain VS Code terminal only, immediately before use. Never paste into Claude Code or this chat. The token was exposed twice and required rotation each time.

### Hotends JSON field names

- `Name`, `Brand`, `Type`, `Max Temp (°C)`, `Max Flow (mm³/s)`, `Thermistor`, `Heater Type`
- `Price (USD)`, `Verdict`, `Verdict Label`, `Description`, `Body`
- `Pros`, `Cons` (multiline text, one item per line)
- `Compatible Printers`, `Compatible Toolheads` (multiselect arrays)
- `Heat Break`, `Heat Block`, `Nozzle Thread`, `Mount Style`, `Fan Size`, `Part Number`
- `Weight (g)`
- `Vendor 1 Name` through `Vendor 5 Name` + `Vendor N URL` + `Vendor N Affiliate`
- `Related 1 Name` + `Related 1 URL` through `Related 3 Name` + `Related 3 URL`
- `Image URL`

### Extruders JSON field names

`Name`, `Brand`, `Gear Ratio`, `Weight (g)`, `Price (USD)`, `Verdict`, `Verdict Label`, `Compatible Printers`, `Compatible Toolheads`, `Pros`, `Cons`, `Description`, `Vendor 1 Name/URL/Affiliate`, `Image URL`, `Updated`

### Slug generation

```js
function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
```

"Rapido 2 UHF" → `rapido-2-uhf`, "Chube Air" → `chube-air`

---

## Make.com Webhooks

### Scenario 1 — Beehiiv Newsletter Subscribe

- **Webhook:** `https://hook.us1.make.com/rb9wcdyixxygfhoihhr0mnjpm1k61hu4`
- **Flow:** Custom Webhook → HTTP (Beehiiv API) → Webhook Response
- **Beehiiv endpoint:** `POST https://api.beehiiv.com/v2/publications/pub_1e077e32-a7aa-4f8e-87f8-da9d0db45b44/subscriptions`
- **Payload fields:** `email`, `utm_source`, `utm_medium`, `utm_campaign`
- **Status:** Active, tested — confirmed live via Make.com API check 2026-07-13.

### Scenario 2 — Contact Form Handler

- **Webhook:** `https://hook.us1.make.com/xxkrs4kgfwvgp0d83ve2oylwy6pntes2`
- **Flow:** Custom Webhook → Gmail Send → Webhook Response
- **Routes to:** modernmakesco@gmail.com
- **Form types:** `contact` (about), `advertise`, `partner`
- **Payload always includes:** `type`, `page`, relevant form fields
- **Status:** ⚠️ Documented here as "Active, tested," but a live Make.com API check on 2026-07-13 showed this scenario as **inactive**. Unconfirmed which is correct — verify in Make.com before assuming contact/advertise/partner form submissions are actually being delivered.

### BeehiivEmbed.astro UTM sources

- HomeNewsletterCTA: `utm_campaign=homepage_cta`
- Article pages: `utm_campaign=article_footer__[slug]`
- Guide pages: `utm_campaign=guide_footer__[slug]`
- Newsletter archive empty state: `utm_campaign=archive_empty_state`

---

## Beehiiv

**Publication ID:** `pub_1e077e32-a7aa-4f8e-87f8-da9d0db45b44`
**Welcome email:** configured at Settings → Emails → Welcome Email (not Automations — paywalled)
**Footer address:** placeholder — update in Beehiiv Settings → Publication Details once Canadian mailbox obtained

---

## SEO & Schema

### Double H1 prevention

Every layout that renders a visible H1 passes `hasPageH1={true}` to Base.astro. Never create a page with two H1s.

### Title format by page type

- Hardware detail: `"[Name] Hotend — Specs, Verdict & Where to Buy — Modern Makes"`
- Hardware index: `"Best FDM Hotends for Voron & Prosumer Printers — Modern Makes"`
- Article: `"[Headline] — Modern Makes"`
- Guide: `"[Title] — Modern Makes"`
- Origin story: `"How [Brand] Started: [Subtitle] — Modern Makes"`

### Schema by layout

- `ComponentLayout` → Product + BreadcrumbList
- `ArticleLayout` → NewsArticle + BreadcrumbList
- `GuideLayout` → HowTo + BreadcrumbList
- `ComparisonLayout` → Article + BreadcrumbList
- `FilamentLayout` → TechArticle + BreadcrumbList
- `MotionSystemLayout` → SoftwareSourceCode + BreadcrumbList
- Hardware index → ItemList
- Ecosystem hubs → CollectionPage + BreadcrumbList

Schema injected via `<script type="application/ld+json" slot="head">` — Base.astro has `<slot name="head" />` in `<head>`.

---

## Known Patterns & Gotchas

- **`<style is:global>`** required for any styles that interact with JS-toggled classes — Astro's default scoping hashes class names at build time
- **`toSlug`** must be defined inside `getStaticPaths` AND again in the frontmatter render section separately — it is not accessible across both due to Astro hoisting
- **Case-sensitive file paths** on Linux/GitHub Pages — Windows dev doesn't catch mismatches; 404s on existing images almost always trace to case mismatch. All media lives under lowercase, hyphenated paths: `public/media/ecosystems/voron/`, `public/media/articles/`, `public/media/hardware/[category]/`
- **Media path rule** — All paths under `public/media/` are lowercase, hyphenated, no spaces — GitHub Pages is case-sensitive (Linux). This applies to folder names, filenames, and every reference to them in code or content.
- **`typecast: true`** required on all Airtable write operations (update_records, create_records) — without it, singleSelect fields with new values fail silently
- **Field IDs** (format `fldXXXXXXXXXXXXXX`) required when field names contain UTF-8 special characters (degree symbols, superscripts) — names cause silent API failures
- **UTF-8 encoding** — add explicit `'utf8'` to `writeFile` calls to prevent garbled degree/cubed symbols in JSON
- **Make.com blueprint imports** — header key names always blank after import, enter manually. Hook IDs reference numbers that don't exist in importing account — re-select webhook from dropdown. Gmail module needs re-authorization after every import
- **Make.com `Run once`** — must be triggered by a live form submission before dynamic variables like `{{1.utm_source}}` become mappable in subsequent modules
- **Astro `z.string().optional()`** required for any frontmatter field not present in all files in a collection — missing required fields cause silent build failures
- **CSS nav hysteresis** — nav snaps solid at 80px scroll down, unsnaps at 60px scroll up — eliminates flicker at threshold
- **`Astro.site`** — set in `astro.config.mjs`. Use for absolute URLs in schema: `new URL(Astro.site).href.replace(/\/$/, '')`
- **`fetch-data` script** — `scripts/fetch-airtable.mjs` requires `AIRTABLE_TOKEN` env var. Run from VS Code terminal where token is set. GitHub Actions also runs nightly
- **AdSlot component** — `<AdSlot slotName="slot-name" />` renders nothing when `"active": false` in `ads.json`
- **Newsletter forms** — any `<form data-nl>` with `<input type="email">` and `<button type="submit">` gets wired automatically by Base.astro inline JS

---

## Content Collections

```
src/content/
  news/        → /news/[slug]        → ArticleLayout
  guides/      → /guides/[slug]      → GuideLayout
  comparisons/ → /comparisons/[slug] → ComparisonLayout
```

Frontmatter schemas in `src/content/config.ts`. Dynamic routes in `src/pages/news/[slug].astro` etc.

---

## Voron Ecosystem

- **Printed parts color:** Red (not orange)
- **Build sizes:** 250/300/350mm (no 400mm variant)
- **Model selector:** Voron 2.4 / Trident — JS swaps subsystem cards, spec strip, hero image, "Now browsing" bar using `localStorage` + `data-models` attributes
- **Community mods:** 18 mods at `/voron/mods` — category filter (Toolhead, Gantry, Motion, Electronics, Bed, Filtration, Cosmetic, QOL) + model filter
- **Toolhead pages:** Stealthburner, XOL, Dragon Burner, Mini Stealthburner, Archetype
- **Origin page:** `/voron/origin` — Maksim Zolin, 2015, open-source spec, 15k+ serial numbers

---

## Hardware Section

- **Hardware index** (`/hardware`) — category grid, dynamic counts from JSON `.length`. No Motion Mods card — lives at `/voron/mods`
- **Verdict values:** `Workhorse`, `Bleeding Edge`, `Skip` (canonical taxonomy). Legacy `Buy`/`Top Pick` alias to Workhorse; `Consider`/`Solid Choice`/`Niche Pick` alias to Bleeding Edge — resolved case-insensitively by `resolveVerdict()` in `src/lib/hardware.ts`. Any other non-empty token passes through as its own neutral (blue) badge/tab, so category-specific values (e.g. Part Cooling TOP/MID) still render and filter. Only Hotends is fully migrated in Airtable; other categories may still store legacy values.
- **Verdict badge colors:** Workhorse = green (`.verdict-best`), Bleeding Edge = blue (`.verdict-rec`), Skip = grey (`.verdict-skip`) — defined in `global.css`. Passthrough/unknown tokens reuse the blue `.verdict-rec` style.
- **Hotend detail** (`/hardware/hotends/[slug]`) — redirect from old `/hardware/hotends/rapido-2` → `/hardware/hotends/rapido-2-uhf`

---

## Origin Story Pages

- `/voron/origin` — Maksim Zolin, 2015, open-source spec, 15k+ serial numbers
- `/ratrig/origin` — Portuguese extrusion supplier → CoreXY kits, V-Core lineage
- `/vzbot/origin` — Simon Vez, TronXY X5S, AWD, 2020
- `/hevort/origin` — MirageC, triple independent Z ball screws, mechanical precision first

All use `ArticleLayout`, `category="HISTORY"`, `currentPath` set to ecosystem path.

---

## Tools

**Native tools (Astro pages):**

- `/tools/pressure-advance` — G-code generator, Klipper/Marlin/RRF, printer presets
- `/tools/flowrate` — volumetric flow rate calculator with hotend tier recommendation
- `/tools/cost` — filament + electricity print cost estimator
- `/tools/filament-converter` — bidirectional g↔m, PLA/PETG/ABS/ASA/PA-CF/TPU, spool remaining %
- `/tools/pa-calculator` — speed/accel grid, OrcaSlicer import, per-cell copy
- `/tools/pin-mapper` — Klipper pin reference, 7 boards (Octopus Pro, Octopus, Manta M8P v1/v2, SKR 3, Spider v2.2, Leviathan v1.2)
- `/tools/motor-simulator` — full physics simulation, 45-motor database, Chart.js torque curves
- `/tools/pa-tuner` — AI-powered PA analysis via Anthropic API, optional photo upload

All tool cards are internal links — no external tool cards on tools index.

---

## Hero Images

Gradient fallbacks on all hotend pages and several articles. Workflow:

1. Generate in Ideogram.ai or via `nanobanana` MCP
2. **Lunar studio prompt:** product on moon surface, Earth visible, dramatic rim lighting, electric orange glow
3. Save to `public/Media/articles/YYYY/MM/[slug]/hero.webp`
4. For hotends: add Image URL in Airtable → run `npm run fetch-data`
5. For articles/guides: add `heroImage` to frontmatter

---

## Pending Work (priority order)

1. **Canadian virtual mailbox** — BC address for Beehiiv footer CASL compliance. Options: iPostal1, Anytime Mailbox, UPS Store box
2. **Hero images** — all hotend pages + several articles still showing gradient fallback
3. **Verdict migration** — only Hotends uses the canonical Workhorse/Bleeding Edge/Skip taxonomy in Airtable. Extruders, Bed Probes, Mainboards, Motors had verdicts set manually 2026-07-14; remaining categories still store legacy/passthrough values. `resolveVerdict()` normalises all of them, but migrate the source data table-by-table for consistency.
4. **Hardware record quality** — most tables are now populated (see Airtable DB Tables) but many records are still sparse; audit field completeness before promoting a category's index page.
5. **Content sprint** — RatRig pre-assembled, Bambu neXt, Prusa HT Hotend, AtomForm Palette 300, Bambu cloud slowdown (3–4/week target)
6. **Make.com automations** — Newsletter Scaffold (needs Published Date field in Articles table), Idea-to-Brief, Stale Content Alerts *(this one already exists as a built scenario in Make.com, currently inactive — confirmed 2026-07-13, don't treat as unbuilt)*, Publish Trigger, Sponsor Deal Alerts, Affiliate Link Expiry, Short-form Repurposing, Monthly Revenue Log
7. **Voron subsystem stub pages** — 5 left (confirmed 2026-07-13, not 8): `/voron/configurator`, `/voron/bed`, `/voron/gantry`, `/voron/toolhead`, `/voron/z-system`. **Before writing content for `bed` or `toolhead`:** confirm what `index.astro` actually links to — `bed.astro` may be an orphaned duplicate of the already-built `bed-surfaces.astro`, and `toolhead.astro` may duplicate the already-built `toolhead-mounts.astro` + `toolheads/` directory. `configurator`, `gantry`, and `z-system` have no such ambiguity — briefs for these three are already drafted in Cowork's `briefs\` folder.
8. **Domain** — `modernmakes.io` recommended; schema URLs need updating after purchase
9. **GA4 custom events** — `tool_click` and `newsletter_signup` partially wired
10. **og-default.jpg** — exists at `public/og-default.jpg` but verify it's wired correctly

## Caveman skill scope
Caveman mode (compressed responses) applies to conversational replies and 
general Claude Code output only. It is suspended for:
- Any content that ships to the live site (blog posts, hardware page copy, 
  buying guides, newsletter copy — anything in src/content/ or similar)
- Commit messages (caveman-commit already removed)
- Code review output (caveman-review already removed)

When drafting or editing anything destined for publication, write in full 
Modern Makes editorial voice (see BRAND.md / editorial standards) — never 
caveman-compressed.