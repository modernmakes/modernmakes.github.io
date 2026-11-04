# Design + simplification audit — November 2026

Audit only. No code changed. Scope: everything under `src/` at commit `5179030`, judged against DESIGN.md (Small-Orange, Ink-on-Orange, on-dark text rules) and the overuse rules in the brief. Counts come from a PostCSS + regex scan of every `.astro`, `.css`, `.ts` and `.json` file, then hand-checked. Where a scan cannot tell intent (a divider, an eyebrow), the verdict is a judgement call and says so.

Verdicts: **Keep** (meets the rule), **Trim** (keep the element, fix the overuse), **Cut** (remove).

---

## Part A — AI-slop indicators

### A1. Tags and pills

Product badges are fine: verdict badges, flow-class/tier badges, spec chips, filter counts, "Best Option" vendor badge, compatibility chips. The decorative and repeated ones:

| Where | What | Verdict | Fix |
| --- | --- | --- | --- |
| `src/data/homepage.json:89-95` → `HomeEcosystemHubs.astro:69`, `:96` | "Launch", "Phase 1" ×3, "Phase 2" badges on the ecosystem cards and coming list | **Cut** | Internal roadmap language, no reader value. Drop the `badge` field and both spans; the coming list already says "coming". |
| `src/pages/guides/index.astro:140-160` | Each guide card shows category twice (`.gi-cat` on the image, `.gf-cat-chip` in the body) and difficulty twice (`.gi-diff-badge` on the image, `.gi-diff-chip` in the body) | **Cut** (image overlays) | Two badge rows per card. Keep the body row (category + difficulty), remove the two overlays on the image. |
| `src/pages/voron/mods/index.astro:102-109` | Category tag in the header **and** a pill row (models + difficulty) in the footer | **Trim** | Two badge rows. Move the category into the pill row, or render it as plain meta text beside "by @creator". |
| `src/pages/filament/index.astro:143-150` | Category badge + chip row (nozzle temp, bed temp, difficulty) | **Keep** | The chips are specs. One badge plus one spec row is within the rule. |
| `src/pages/tools/*/index.astro:27-29` (9 tool pages) | Hero chip row (`mm³/s`, "Hotend Matching", …) | **Trim** | Units and features restate the H1 + intro. Keep at most one chip, for the output unit (`mm³/s`); cut the feature chips. |
| `src/pages/voron/toolheads/*.astro:27` | Verdict-style badges "RECOMMENDED", "ENTHUSIAST", "SITUATIONAL" | **Trim — sign-off** | These are product badges, but they use labels outside the four-verdict taxonomy. See C8. |
| `src/pages/voron/{bed-surfaces,electronics,enclosure,…}.astro` (`cls: 'verdict-upd'`) | "BUDGET PICK" badges | **Trim — sign-off** | Same issue, outside the taxonomy. See C8. |

### A2. Eyebrows

71 `.eyebrow` uses plus 9 homepage/section kickers. The rule is kept where the eyebrow adds category, ecosystem or date that the heading lacks.

| Count | Where | Text | Verdict | Fix |
| --- | --- | --- | --- | --- |
| 6 | `comparisons/index.astro:38`, `contact/index.astro:16`, `filament/index.astro:84`, `guides/index.astro:73`, `hardware/index.astro:104`, `news/index.astro:38` | "Modern Makes" | **Cut** | It repeats the logo in the nav. No information. |
| 17 | `voron/*.astro` (e.g. `voron/hotends.astro:37`, `voron/toolheads/xol.astro:22`) | "Voron · Hotends", "Voron · Toolhead", … | **Cut** | Each H1 already says it ("Hotends for Voron 2.4 & Trident", "Xol Toolhead"). The breadcrumb above carries the path. |
| 9 | `tools/*/index.astro:23`, `tools/pressure-advance.astro:26`, `tools/retraction-tuning.astro:26` | "Calculator", "Converter", "Calibration Tool", "AI Tool", … | **Cut** | "Calculator" over "Flow Rate Calculator" restates the H1. Where the tool type matters (AI Tool), say it in the intro. |
| 5 | `HomeBuilds.astro:25`, `HomeEcosystemHubs.astro:42`, `HomeNewsletterCTA.astro:8`, `HomeToolsTeaser.astro:19`, `index.astro:61` | "Builds & Prosumer", "Printer Ecosystems", "Free Weekly Newsletter", "Free Tools", "Featured Hardware" | **Trim** | An eyebrow on every homepage section is the habit the rule names. Keep "Free Weekly Newsletter" (it adds "free" + cadence); cut the other four, whose H2s already name the section. |
| 2 | `privacy/index.astro:16`, `terms/index.astro:16` | "Legal" | **Cut** | Restates the page type. |
| 5 | `hotends/`, `extruders/`, `electronics/`, `motion-system/`, `build-surfaces/index.astro:15` | "Redirecting" | **Cut** | These pages go away entirely in B3. |
| 5 | `hevort/`, `k3/`, `vzbot/`, `printers/`, `newsletter/index.astro` | "Coming soon" | **Keep** | It is the page's status. |
| 3 | `ratrig/index.astro:28,45`, `voron/index.astro:39` | "Printer ecosystem", "Flagship" | **Keep** | They add a category to a bare brand name. |
| — | `TypeCover.astro:15`, `AdSlot.astro:74,104`, `ComparisonLayout.astro:149` ("Verdict") | data-driven | **Keep** | Category, sponsor and section-type labels. |
| — | `lab/liquid-glass.astro` | 9 internal eyebrows | n/a | Internal page; see B4. |

### A3. Excessive mono

445 JetBrains Mono declarations: 222 in CSS rules, 223 inline. Most are on numbers, specs, prices, dates and code, which is the rule. **69 rule-level uses sit on labels, links, CTAs or prose**, plus about 60 inline ones on the Voron pages.

| Group | Where (file:line) | Verdict | Fix |
| --- | --- | --- | --- |
| Breadcrumbs (9) | `article.css:91`, `global.css:615` (`.lg-breadcrumb`), `ComponentLayout.astro:517`, `MotionSystemLayout.astro:514`, `filament/[slug].astro:272`, `newsletter/archive.astro:209`, `sitemap/index.astro:201`, `voron/mods/index.astro:143`, `HardwareIndex.astro:256` + `hardware/hotends/index.astro:217` (`.hot-hero-crumbs`) | **Trim** | Barlow (`--fu`) 12px. See A11. |
| Form/field labels (9) | `global.css:734` (`.lg-form-label`), `.tc-label` in `tools/cost:172`, `filament-converter:174`, `flowrate:172`; `.ms-label` `motor-simulator:210`; `.pac-label` `pa-calculator:130`; `.pt-label` `pa-tuner:197`; `.pm-label` `pin-mapper:120`; `.newsletter-capture__label` `ArticleLayout:207`, `GuideLayout:629` | **Trim** | Labels are words, so use `--fu`. Keep mono on the value inputs. |
| Links/CTAs (6) | `global.css:411` (`.btn-review`), `global.css:709` (`.lg-email-link`), `MotionSystemLayout:587` (`.ms-attr-btn`), `filament/index:222` (`.fil-filter-btn`), `newsletter/archive:324` (`.arch-open-chip`), `voron/toolheads/*.astro` "← All Toolheads" inline | **Trim** | `--fu`. |
| Nav prose (1) | `Nav.astro:331` (`.desc`, dropdown descriptions) | **Trim** | Sentences, so `--fu`. |
| Prose/notes (8) | `MotionSystemLayout:651` (`.ms-toolhead-note`), `advertise:279` (`.adv-track-note`), `filament-converter:195`, `motor-simulator:234`, `retraction-tuning:472`, `HomeEcosystemHubs:344` (`.eco-coming-desc`), `ratrig:311`, `voron/toolheads/*.astro:24` ("Community mod by @…") | **Trim** | `--fu` or `--fb`. |
| Category/tag labels (~20) | `.gf-badge`, `.eco-chip`, `.comp-tag`, `.ms-sb-tag`, `.fil-cat-badge`, `.mod-cat-tag`, `.mod-model-pill`, `.tools-idx-badge`, `.srch-cat`, `.type-cover-eyebrow`, `.footer-soon-*`, … | **Keep** for count badges (`.gf-badge`, numbers) and the footer "Soon" tag (you specified it); **Trim** the word-only tags to `--fu` caps. | |
| Eyebrows in mono (3) | `HomeNewsletterCTA:48`, `lab/*` | **Trim** | Match the global `.eyebrow` (`--fu`). |

Inline mono is heaviest on the Voron toolhead pages (11–13 per page) and the tool pages (7–10 each). Those go when the inline styles become classes (B1, B2).

### A4. All-caps subtitles

241 `text-transform: uppercase` rules. Nearly all are labels and badges of three words or fewer, which is fine. Breaking the rule:

| Where | Text | Verdict | Fix |
| --- | --- | --- | --- |
| `voron/index.astro:493` (`.step-text`) | "Choose your printer to explore compatible parts and upgrades" | **Cut** caps | A full sentence in caps. Sentence case, `--fu` 13px. |
| `ComparisonLayout`, `FilamentLayout`, toolhead pages | Verdict badges like "RECOMMENDED" | **Keep** | Label, one word. |

I didn't measure text length on runtime-rendered caps (data-driven badges). A spot check found none over three words.

### A5. Excessive italics

13 italic rules. Deks and captions are fine; UI italics are not.

| Where | Verdict | Fix |
| --- | --- | --- |
| `Footer.astro:120` (`.footer-tagline`) | **Cut** | Upright Lora, or `--fu`. |
| `HomeNewsletterCTA.astro:65` (`.nlcta-sub`), `HomeToolsTeaser.astro:95` (`.tools-sub`) | **Cut** | UI subheads, not deks. |
| `PartCard.astro:178` (`.cfg-reason`), `ComponentLayout.astro:944` (`.comp-flow-note`), `search/index.astro:426` (`.srch-prompt p`) | **Cut** | Helper text. |
| `filament/index.astro:372`, `filament/[slug].astro:317` (verdict labels) | **Cut** | Label, not prose. |
| `FilamentLayout.astro:496`, `ratrig/index.astro:272`, `voron/index.astro:646` (hero taglines) | **Keep** | These act as deks under the H1. |
| `article.css:296` (figcaption), `article.css:308` (italic-only paragraph) | **Keep** | Editorial. |

### A6. Negative kerning

16 rules break "display ≥ 32px, no tighter than −0.02em". None are on body text; all are headings below 32px or slightly too tight.

| Where | Value | Verdict | Fix |
| --- | --- | --- | --- |
| `HomeBuilds.astro:155,256`, `ArticleLayout.astro:216`, `GuideLayout.astro:418,638`, `FilamentLayout.astro:645`, `newsletter/archive.astro:342`, `search/index.astro:387`, `voron/index.astro:532`, `article.css:176`, `global.css:684`, `global.css:290` | −0.2 to −0.3px on 18–28px headings | **Trim** | Remove (set to 0). |
| `HomeHero.astro:248,262` (`.hero-title`) | −0.3px, size inherited | **Trim** | Check the rendered size. If ≥ 32px, express it as ≥ −0.02em; otherwise 0. |
| `global.css:314` (`.display`) | −0.4px | **Trim** | Use `-0.01em` so it scales with size. |
| `404.astro:93` (`.nf-code`) | −4px @ 160px = −0.025em | **Trim** | −0.02em. |

The inline H1s on the Voron and tool pages (−0.5px at 48–56px, about −0.01em) are within the rule.

### A7. Containers with border + fill + shadow

| Where | Verdict | Fix |
| --- | --- | --- |
| `press.astro:149` (`.press-stat-card`) | **Trim** | Drop the shadow. |
| `Nav.astro:295` (`.nav-dd-panel`) | **Trim** | A dropdown needs its shadow to lift off the page. Drop the border. |
| `GlassCard.astro:54` (`.glass-card`) | **Trim** | Glass on purpose, but border + fill + shadow + shine sweep is four layers. Drop the shadow and the shine (A14). |
| `ComponentLayout.astro:891` (`.comp-flow-dot`) | **Keep** | An 8px marker; the ring is its border. |
| `lab/liquid-glass.astro:235` | n/a | Internal (B4). |

### A8. Overusing dividers

114 hairline `border-top`/`border-bottom` rules (excluding hover states) and 1 `<hr>` (lab page). Most separate table rows, list items or a card's footer, which is fine. Dividers where spacing or a colour change already separates:

| Where | Verdict | Fix |
| --- | --- | --- |
| `Footer.astro:96` (`.footer-top` border-bottom) + `Footer.astro:196` (`.footer-bottom` border-top) | **Cut one** | Two hairlines at the same seam, 1px apart. |
| `Footer.astro:83` (`.footer` border-top) | **Cut** | The footer is a dark band on a light page, so the colour change already separates it. |
| `article.css:72` (`.art-header` border-bottom) | **Cut** | The header is white and the body is `--bg`, so the fill change separates them. |
| `article.css:176` (`.art-content h2` border-bottom) | **Trim** | A rule under every H2, plus 40px of space above it. Keep space only. |
| `global.css:679` (`.lg-content section` border-top) | **Trim** | Every legal/info section gets a rule. Spacing is enough. |
| `ComponentLayout.astro:1092` (`.comp-prose`), `:1100` (`.comp-related`), `article.css:461` (`.art-related`) | **Trim** | Section-level rules between padded sections. Keep one before "Related" at most. |
| `ComponentLayout.astro:476` (`.comp-hero` border-bottom) | **Cut** | The dark hero meets a light body. |
| `global.css:331` (`.section-head` 2px ink rule) | **Keep** | This is a brand element (the editorial section rule), used once per section. |

### A9. Colour shades and opacities

Outside `global.css`: **230 distinct colour values** (79 hex, 151 rgb/rgba) used **1,284 times**. 442 of those uses are in `src/pages/voron/`. 1,530 inline `style=` attributes overall.

Values that equal an existing token but are hardcoded: 20 values, 333 uses. The main ones:
- `#fff`: 174 uses in 69 files (→ `--surface`)
- `#2E7D32`: 49 (→ a green token; it is the Printables/community green in DESIGN.md)
- `#E65100`: 23 (→ `--verdict-skip`)
- `#C62828`: 17 (→ `--danger`)
- `#E8F5E9` / `#A5D6A7`: 14 / 13 (→ printables tokens)
- `#FF5A1F`: 10 (→ `--accent`)

**The most important part of this section is legibility, not tidiness.** 361 `color: rgba(255,255,255,≤.59)` text declarations in about 50 files are below the 62% on-dark floor. `.4` white on `#1A1A1A` is about 3.8:1, which fails AA. The worst values:
- `.4` used 79 times
- `.3` used 71 times (some are borders)
- `.45` used 46 times
- `.5` used 37 times
- `.55` used 28 times

They're concentrated on the Voron toolhead and subsystem pages, the tool pages, the 404 page and the stub pages. The six gate pages were fixed in Phase 1; these were outside that scan.

Inline-style hot spots to move onto classes and tokens:

| Inline styles | File |
| --- | --- |
| 87–91 each | `voron/toolheads/{archetype,dragon-burner,mini-stealthburner,stealthburner,xol}.astro` |
| 69 | `voron/index.astro` |
| 41–50 each | `voron/{hotends,electronics,enclosure,lighting,motion-system,probe-system,extruders,bed-surfaces,toolhead-mounts}.astro` |
| 42 / 30 | `privacy/index.astro` / `terms/index.astro` |
| 23–27 each | `tools/{pa-tuner,pressure-advance,filament-converter,motor-simulator,pa-calculator}`, `press.astro`, `contact/index.astro` |

### A10. Section numbering

| Where | Verdict | Fix |
| --- | --- | --- |
| `voron/index.astro:62` ("01 · Choose your printer…") | **Cut** | A "01" with no 02. It is decorative. |
| `voron/configurator.astro:67` + `ToolheadPicker.astro:21` (01, 02, …) | **Keep** | A real step sequence. |
| `GuideLayout.astro:434` (`counter(guide-step)`) | **Keep** | Guide steps. |
| `lab/liquid-glass.astro` ("Pattern 01/02/03") | n/a | Internal. |

### A11. Code breadcrumbs

No `~/path` breadcrumbs. But all nine breadcrumb styles (A3) render in JetBrains Mono with `/` separators ("Home / News / PRINTER"), which reads as a file path. The article breadcrumb's last item is also the raw uppercase category. **Trim:** Barlow 12px, sentence-case last item, and keep the `/` or switch to `›`. One shared `.breadcrumb` class would replace nine copies (B6).

### A12. Gradient backgrounds

62 gradients. They split three ways:

**Functional, keep (25):**
- Image scrims for text legibility: `article.css:29`, `HomeHero.astro:138,144,259`, `HomeLatestArticles.astro:175`, `HardwareIndex.astro:135`, `HomeBuilds.astro:235`, `HomeEcosystemHubs.astro:219`, `comparisons/index.astro:125`, `news/index.astro:125`, `guides/index.astro:368`, `hardware/index.astro:274`, `hardware/hotends/index.astro:97`
- Ticker edge masks: `HomeTicker.astro:76-77`

**Decorative fills, replace:**

| Where | What | Replacement |
| --- | --- | --- |
| `homepage.json:9,18,27,36` → `HomeHero.astro:28,42,309` | **The homepage hero.** All four slides have `image: null`, so the gradient *is* the hero. | Solid `--dark-bg` with the slide's TypeCover-style type, or real slide images (better). |
| `index.astro:32-34` → `GlassCard.astro:36` | Featured-hotend band fallback (orange→orange-dk, and two near-blacks with orange alpha) | Solid `--dark-surface`. The cards have product images. |
| `news/index.astro:23`, `guides/index.astro:54`, `comparisons/index.astro:23`, `hardware/hotends/index.astro:95` | No-image card fallback | `<TypeCover>` (already used on the homepage and article heroes). |
| `HomeBuilds.astro:121-123,218` | Build card fills | Solid `--dark-surface`. |
| `voron/*.astro` ×9 (`linear-gradient(135deg,#1e1e1e,#111)`) | Subsystem card fills | Solid `--dark-surface`. |
| `FilamentLayout.astro:429` + radial `:436` | Filament hero wash and orange glow | Solid `--dark-bg`. |
| `ComparisonLayout.astro:454`, `FilamentLayout.astro:609` (`#fff8f0→#fff2e8`) | Peach card fill | Solid `--accent-t`. |
| `index.astro:118`, `HomeBuilds.astro:129`, `HomeEcosystemHubs.astro:112` | "Orange seam glow" `border-image` on three homepage bands | Plain `1px solid var(--dark-border)`, or nothing. |
| `index.astro:125` | Breathing radial glow (9s animation) | Cut (A14). |
| `GlassCard.astro:93` | Hover shine sweep | Cut (A14). |

**Dead data, delete:**
- `lib/related-content.ts:28-30,72`: the `GRADIENTS` array and the `gradient` field. Nothing reads them since TypeCover.
- `ratrigData.json:90,100,110,120`: the `bg` field. The page doesn't read it.

### A13. Periods in titles

7 headings end in a period. No button labels or data card titles do.

- `index.astro:62` "Hotends worth building around."
- `HomeBuilds.astro:26` "For the people who read the BOM twice."
- `HomeEcosystemHubs.astro:43` "Build your printer."
- `HomeToolsTeaser.astro:20` "Calculators built for serious printers."
- `404.astro:40` "Page not found."
- `newsletter/archive.astro:134` "First issue coming soon."
- `hevort/origin.astro:35` "Not a Kit. Not a Beginner Project." (inside an article page)

**Verdict: Trim — sign-off.** The four homepage H2s use the period as a deliberate editorial voice. Under your rule they go. Decide once and apply to all seven.

### A14. Verbose UI text and over-detailed decoration

**Copy that repeats the heading, or is formula:**

| Where | Text | Verdict |
| --- | --- | --- |
| `sitemap/index.astro:55` | "Every page on Modern Makes, organised by section." under "Sitemap" | **Cut** |
| `HomeToolsTeaser.astro:21` | "No sign-up. No fluff. Just the numbers you need." | **Trim**. A rule-of-three formula; one plain line ("Free, no sign-up.") is enough. |
| `voron/toolheads/*.astro:20` | Mono breadcrumb span repeats the H1 ("Xol Toolhead") | **Cut** |
| `hardware/index.astro:108` | "Real-world testing, honest verdicts." | **Cut — sign-off**. It contradicts the curation rule in CLAUDE.md/BRAND.md (we don't test hands-on). |
| `press.astro:87` | "Send us hardware. We test it and publish our findings." | **Rewrite — sign-off**. Same contradiction, on the page brands read. |

**Decoration that carries no information:**

| Where | What | Verdict |
| --- | --- | --- |
| `HomeBuilds.astro:36-49` | 12-shape "blueprint" SVG (dashed squares, rings, corner ticks) with a scroll animation | **Cut**. Replace with the guide's image or TypeCover. |
| `index.astro:120-131` | Breathing radial glow on the featured band | **Cut** |
| `GlassCard.astro:88-100` | Shine sweep on hover | **Cut** |
| `FilamentLayout.astro:436` | Radial orange glow in the hero | **Cut** |
| 3 homepage bands | Orange seam `border-image` | **Cut** (A12) |
| `retraction-tuning.astro:300-325` | Retraction diagram | **Keep**. It explains the mechanism. |

### A15. Confirm absent

- **Instrument Serif:** absent.
- **Dithering:** absent.
- **ASCII art:** absent. Box-drawing characters appear only in code comments, which aren't rendered.
- **Squircles / superellipse / `corner-shape`:** absent.

---

## Part B — Simplification (ponytail audit of `src/`)

**What this repo does:** A static Astro site that builds about 360 editorial pages from Markdown collections, Airtable-exported JSON (hardware records) and hand-built `.astro` pages. It deploys to GitHub Pages. There's no server and no user data stored; client JS runs the tools, filters and newsletter form. **Assumed load:** read-only static pages, many anonymous readers. The cost of mistakes here is readability, brand consistency and how much code has to change together, not scale.

### Must fix

1. **Low-contrast text on dark sections across about 50 files** (A9 list; e.g. `voron/toolheads/xol.astro:24-25`, `404.astro`, tool page heroes)
   - **What this is:** Secondary text on the dark planes uses ad-hoc white opacities.
   - **Problem:** 361 declarations sit at 59% white or less. At `.4` on `#1A1A1A` that is about 3.8:1, below AA. The Phase 1 fix only covered the six gate pages.
   - **Fix:** Replace them with `--on-dark-muted` (62%) or `--on-dark-soft` (78%) by script, keeping values ≤ .15 that are borders or fills. The same pass as Phase 1's contrast script, run over all files. About 0 net lines.
   - **If we skip it:** Most Voron, tool and stub pages fail an accessibility check and read washed-out on phones.

2. **Copy claims hands-on testing** (`hardware/index.astro:108`, `press.astro:87`)
   - **What this is:** Hero and press copy.
   - **Problem:** "Real-world testing" and "We test it and publish our findings" contradict the editorial policy (curation, no hands-on reviews) on About and Editorial. That's a credibility and disclosure risk with brands.
   - **Fix:** Rewrite both lines to the curation framing. 2 lines. Needs your wording.
   - **If we skip it:** A brand that sends hardware expects a test you don't run.

3. **Verdict labels outside the taxonomy on Voron pages** (`voron/toolheads/*.astro:27`; `cls: 'verdict-upd'` "BUDGET PICK" in `voron/{bed-surfaces,electronics,enclosure,…}.astro`)
   - **What this is:** Hand-written badges on the Voron pages.
   - **Problem:** "RECOMMENDED", "ENTHUSIAST", "SITUATIONAL" and "BUDGET PICK" bypass `resolveVerdict()` and the four verdicts. The same product can show a different verdict here than on its `/hardware/` page.
   - **Fix:** Map each to Benchmark / Workhorse / Bleeding Edge / Skip, or drop the badge. Editorial call.
   - **If we skip it:** Two verdict systems on one site.

### Should fix

4. **Five toolhead pages are one page copied five times** (`voron/toolheads/{archetype,dragon-burner,mini-stealthburner,stealthburner,xol}.astro`, 1,035 lines)
   - **What this is:** One page per toolhead, each with about 88 inline styles.
   - **Problem:** Two of them differ in only 48 of 198 lines. Every fix (contrast, mono, verdicts above) has to be made five times. That is how the faint-text bug survived.
   - **Fix:** One `voron/toolheads/[slug].astro` with classes, plus a `toolheads.json` holding the per-toolhead data.
   - **If we skip it:** Five-way drift on every change. **About −750 lines.**

5. **Nine Voron subsystem pages repeat the same shell** (`voron/{hotends,extruders,electronics,enclosure,lighting,motion-system,probe-system,bed-surfaces,toolhead-mounts}.astro`, 2,274 lines, 41–50 inline styles each)
   - **What this is:** Hand-built subsystem pages.
   - **Problem:** The hero, eyebrow, back link, card fill gradient and affiliate disclosure are pasted into each. The content blocks differ, so this is not one template.
   - **Fix:** A small `VoronSubsystemLayout` for the shared hero and disclosure, with classes in place of inline styles.
   - **If we skip it:** Same drift as #4, less severe. **About −200 lines.**

6. **`/hardware/hotends/` is hand-rolled; 17 other categories use `HardwareIndex`** (`hardware/hotends/index.astro`, 346 lines vs `components/HardwareIndex.astro`)
   - **What this is:** The hotend card grid with verdict tabs.
   - **Problem:** It duplicates HardwareIndex's tabs, crumbs and cards (`.gf-tab`, `.hot-hero-crumbs` are defined in both). A fix to one misses the other.
   - **Fix:** Render it through `HardwareIndex` and pass any hotend-only bits (flow class) as props. Check feature parity first.
   - **If we skip it:** The flagship category drifts from the rest. **About −300 lines.**

7. **Redirect stub pages instead of config redirects** (`src/pages/{hotends,extruders,electronics,motion-system,build-surfaces}/index.astro`, 160 lines)
   - **What this is:** Five full pages with a meta refresh, hero, eyebrow and CTA.
   - **Problem:** `astro.config.mjs` already has a `redirects` map that does this natively.
   - **Fix:** Add the five paths to `redirects` and delete the pages.
   - **If we skip it:** Five pages to style and audit for nothing. **−150 lines.**

8. **Dead CSS**
   - **Problem:** Classes that are never used.
     - `global.css`: `.body-prose`, `.card-price`, `.grid-2`, `.nl-input` (+ variants), `.dark-section` (+ 4 descendant rules), `.page-hero`, `.lg-callout`
     - `article.css`: `.art-hero-bg`, `.image-wide` (+ mobile rule), `.art-affected-box*`, `.art-affected-example`
     - `news/index.astro:138-175`: `.ni-badge*`, `.ni-type-*`, `.card-cat-row`
     - `contact/index.astro:93` (`.contact-grid`) and `HomeLatestArticles.astro:226` (`.la-card-price`)
   - **Fix:** Delete. CLAUDE.md lists `.grid-2` and `.dark-section` as pre-built utilities; drop them from that list too, or keep them deliberately.
   - **If we skip it:** Readers of the CSS chase rules that do nothing. **About −150 lines.**

9. **Unused dependencies** (`package.json`: `tailwindcss`, `@astrojs/tailwind`, `@perplexity-ai/perplexity_ai`)
   - **Problem:** Tailwind isn't in `integrations` (CLAUDE.md says "installed but unused"). Nothing in `src/` or `scripts/` imports the Perplexity SDK.
   - **Fix:** `npm uninstall` all three.
   - **If we skip it:** Slower installs and three packages to keep patched. **−3 dependencies.**

10. **Shared tool CSS copied between two pages** (`tools/pressure-advance.astro` and `tools/retraction-tuning.astro`)
    - **Problem:** Both define the same 39 `.pa-*` classes (59 rules in retraction-tuning). The hover-colour fix earlier this week had to be made twice.
    - **Fix:** Move them to one `src/styles/tools-gcode.css` imported by both.
    - **If we skip it:** Every change twice. **About −120 lines.**

11. **Tool hero block pasted into ten tool pages** (`tools/*/index.astro:20-30`, `pressure-advance.astro`, `retraction-tuning.astro`)
    - **Problem:** The same breadcrumb, eyebrow, H1, intro and chip row, all inline-styled.
    - **Fix:** A `ToolHero.astro` with `title`, `intro` and an optional `unit` prop.
    - **If we skip it:** The A2/A3/A9 fixes happen ten times. **About −80 lines.**

12. **Newsletter capture block duplicated in two layouts** (`ArticleLayout.astro:158+` and `GuideLayout.astro`, 12 class uses each; the 39-line CSS block differs by one line)
    - **Fix:** One `NewsletterCapture.astro`, used in both. **About −70 lines.**

13. **Tab and filter CSS defined three times** (`.gf-tab`/`.gf-badge` in `HardwareIndex.astro`, `guides/index.astro`, `hardware/hotends/index.astro`; `.ni-tab` in `news/index.astro` and `comparisons/index.astro`)
    - **Fix:** One `.gf-tab` block in `global.css`. #6 removes one copy anyway. **About −60 lines.**

14. **Dead data fields** (`lib/related-content.ts:18,26-30,72` `gradient`; `ComponentLayout.astro:28` `gradient?` prop; `ratrigData.json` `bg` ×4; `homepage.json` ecosystem `badge`, if A1 is accepted; `data/hardware/filament.json`, which is empty and never imported)
    - **Fix:** Delete. **About −15 lines, −1 file.**

15. **Inline JS hover on the Press CTA** (`press.astro:126-127`, `onmouseover`/`onmouseout`)
    - **Problem:** It sets opacity from JS, which bypasses the hover gating (it sticks after a tap on touch).
    - **Fix:** A gated CSS `:hover` rule. **−2 lines.**

### Nice to have

16. **Lab page ships to production** (`pages/lab/liquid-glass.astro`, 468 lines)
    - **Problem:** It's an internal prototype marked `noindex`, yet it's listed in `sitemap-0.xml`. Search engines get contradictory signals.
    - **Fix:** Move it out of `src/pages` (e.g. to `docs/prototype/`), or filter `/lab/` in the sitemap integration. Moving it saves **−468 lines** from the build.

17. **Breadcrumb styles defined nine times** (A3/A11)
    - **Fix:** One `.breadcrumb` in `global.css`; the layouts drop theirs. **About −60 lines.**

**Verdict:** Fix #1 (contrast) first. It's a script-driven pass with the biggest reader-facing effect. Then #2 and #3, which need your wording and verdict calls. Then #4, which removes the most code and makes the other fixes stick.

**Lean: about −2,350 lines (−2,800 if the lab page moves), −3 dependencies possible.**

**Not checked:**
- Article and guide Markdown bodies (out of scope).
- `scripts/` beyond grepping for dependency use.
- The client-side tool logic (motor simulator physics, G-code generators) for correctness.
- Runtime-generated class names: these are taken as used where a template string builds them (`fil-tier-${…}`, `gc-verdict--${…}`, `mod-difficulty--${…}`).
- Visual rendering of every page. Counts are static, and gradients and dividers were checked in source, not screenshots.

---

## Part C — Ranked fix plan

Highest visual impact first. **Effort:** S < 1h, M = half a day, L = a day or more. **Sign-off** means it touches a brand fundamental (voice, verdicts, the homepage look, signature motifs) and needs your yes before it ships.

| # | Fix | Source | Effort | Sign-off |
| --- | --- | --- | --- | --- |
| C1 | Faint on-dark text → `--on-dark-muted` / `--on-dark-soft` across about 50 files (361 declarations) | B1, A9 | M | No. The DESIGN.md rule already exists. |
| C2 | Homepage hero: replace the four gradient slides with solid `--dark-bg` + type, or real images | A12 | S (solid) / M (images) | **Yes.** It's the homepage's first impression. |
| C3 | Cut decorative motifs: three orange seam borders, breathing glow, GlassCard shine, blueprint SVG, Filament hero glow | A12, A14 | S | **Yes.** The seam is a documented brand motif ("M8"). |
| C4 | Remove hands-on-testing claims (`/hardware/` hero, `/press/`) | B2, A14 | S | **Yes.** Brand voice and policy wording. |
| C5 | Eyebrow pruning: "Modern Makes" ×6, "Voron · X" ×17, tool-type ×9, "Legal" ×2, four of five homepage section eyebrows | A2 | S | No (applies your rule). The homepage eyebrows are a light yes, because the homepage voice changes. |
| C6 | Card fallback gradients → TypeCover (news, guides, comparisons, hotends); card fills → `--dark-surface` (Voron ×9, builds, glass band) | A12 | S | No |
| C7 | Badge cleanup: ecosystem "Phase/Launch" badges; guide-card duplicate category + difficulty overlays; mods card down to one row; tool hero chips down to the unit | A1 | S | No |
| C8 | Map Voron "RECOMMENDED / ENTHUSIAST / SITUATIONAL / BUDGET PICK" to the four verdicts, or drop them | B3, A1 | M | **Yes.** Verdict taxonomy, editorial calls per product. |
| C9 | Mono → Barlow on breadcrumbs (one shared `.breadcrumb`), form labels, CTAs, nav descriptions, notes | A3, A11, B17 | M | No (applies your rule) |
| C10 | Toolhead pages → one `[slug].astro` + JSON, inline styles → classes | B4, A9 | L | No |
| C11 | Divider pass: footer double seam + top border, article header and H2 rules, `lg-content` section rules, component prose/related, comp hero | A8 | S | No |
| C12 | Periods in seven headings | A13 | S | **Yes.** The homepage headline voice. |
| C13 | UI italics → upright (footer tagline, homepage subheads, helper text, filament verdict labels) | A5 | S | Light yes: the footer tagline is a brand line. |
| C14 | Voron subsystem shared layout; tool hero component; newsletter capture component; shared `.pa-*` CSS; tab CSS once | B5, B10–B13 | M | No |
| C15 | `/hardware/hotends/` onto `HardwareIndex` | B6 | M | No |
| C16 | Config redirects for the five stub pages | B7 | S | No |
| C17 | Kerning trims (16 rules), triple-container trims (3), lone "01" on the Voron hub, `.step-text` caps | A4, A6, A7, A10 | S | No |
| C18 | Dead CSS, dead data fields, unused deps, `onmouseover`, lab page out of the sitemap | B8, B9, B14–B16 | S | No |
| C19 | Copy trims: sitemap subhead, tools-teaser "No sign-up. No fluff…", toolhead breadcrumb span | A14 | S | Light yes (copy) |

Suggested batching:
- **One sign-off pass:** C2, C3, C4, C8, C12, C13, C19.
- **Two mechanical PR-sized commits:** C1 + C5 + C6 + C7 + C11 + C17 + C18, then C9.
- **The template refactors:** C10, C14, C15, C16 last. C10 and C14 are what stop these issues from coming back.
