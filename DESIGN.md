---
name: Modern Makes
description: A faceless editorial curation publication for prosumer FDM 3D printing — dark-first, electric-orange, printed for the workbench.
colors:
  accent: "#FF5A1F"
  accent-deep: "#C93B08"
  accent-mid: "#FF7A45"
  accent-tint: "#FFE9E1"
  ink: "#1A1A1A"
  body-grey: "#5A5A5A"
  muted-grey: "#8C8C8C"
  page-bg: "#F7F6F3"
  surface: "#FFFFFF"
  border: "#E2E2E0"
  border-strong: "#C8C8C5"
  dark-bg: "#1A1A1A"
  dark-surface: "#222222"
  verdict-buy: "#16A34A"
  verdict-skip: "#E65100"
  verdict-updated: "#3B82F6"
  verdict-community: "#7C3AED"
typography:
  display:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "clamp(2rem, 5vw, 2.5rem)"
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: "-0.5px"
  headline:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.2px"
  title:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "17px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "normal"
  body:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
  ui:
    fontFamily: "Barlow, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.12em"
rounded:
  xs: "3px"
  sm: "4px"
  field: "5px"
  md: "8px"
  lg: "10px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "6px 14px"
    typography: "{typography.ui}"
  button-primary-hover:
    backgroundColor: "{colors.accent-deep}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "6px 14px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
  spec-chip:
    backgroundColor: "{colors.page-bg}"
    textColor: "{colors.body-grey}"
    rounded: "{rounded.xs}"
    padding: "2px 7px"
    typography: "{typography.label}"
  verdict-buy:
    backgroundColor: "#E8F8EE"
    textColor: "{colors.verdict-buy}"
    rounded: "{rounded.xs}"
    padding: "2px 8px"
---

# Design System: Modern Makes

## 1. Overview

**Creative North Star: "The Workshop Press"**

Modern Makes is an editorial publication printed *for the workbench*. It carries the authority of a print magazine and the precision of a component datasheet, fused into one voice. The condensed poster headline (Barlow Condensed 800) is the masthead; Lora serif sets the prose like a feature article; JetBrains Mono annotates the specs like a label on a parts bin. Everything sits on a dark-first stage where a single Electric Orange (`#FF5A1F`) behaves like machine-safety paint — used to point, never to decorate.

The system is **flat by default**. Depth comes from hairline borders and tonal layering (off-white page → white surface → near-black dark section), not from drop shadows. When something does lift, it lifts one pixel and tints orange — a deliberate, earned response to the cursor, not ambient decoration. Density is editorial: information-rich without clutter, every spec chip and verdict badge pulling its weight. This is built for a technical reader mid-project who trusts dense, honest pages.

What it explicitly rejects: the **affiliate review-farm** (star ratings, listicle clutter, fabricated "we tested" claims), the **hobbyist forum** (default-Bootstrap grey, amateur layout, no point of view), and the **marketplace** (buy-buttons-everywhere, product-grid-as-homepage). Commerce serves the reader here; the editorial leads.

**Key Characteristics:**
- Dark-first stage, one electric-orange accent used as a pointer (≤10% of any screen)
- Three-voice type system: condensed display + serif prose + mono spec labels
- Flat surfaces, hairline borders, tonal layering for depth — shadows are rare and purposeful
- Editorial density: dense but never cluttered, honest over hyped
- The word "review" is forbidden; "specs / verdict / where to buy" instead

## 2. Colors

A restrained near-monochrome stage (warm off-white in light, near-black in dark) with one decisive orange and a small set of semantic verdict colors that appear only on badges.

### Primary
- **Electric Orange** (`#FF5A1F`): The single brand voice. CTAs (`btn-buy`), active nav underlines, eyebrows, links on hover, the "BUY/BEST" verdict, focus rings, the orange-tinted hover glow. It points the reader at the next action or the key fact.
- **Orange Deep** (`#C93B08`): The pressed/hover state of every orange surface. Never used at rest.
- **Orange Mid** (`#FF7A45`): Secondary orange for gradients and lighter accents on dark.
- **Orange Tint** (`#FFE9E1`): The wash behind `callout-orange` blocks; orange at whisper volume.

### Neutral (light register)
- **Ink** (`#1A1A1A`): Headlines and primary text on light surfaces. Also the dark-section background — the same value does double duty.
- **Body Grey** (`#5A5A5A`): Serif body prose. This is the floor for body text; never go lighter than this on the off-white page (contrast discipline).
- **Muted Grey** (`#8C8C8C`): Timestamps, meta, mono dates, secondary labels only. Never body copy.
- **Page BG** (`#F7F6F3`): The warm off-white canvas. A true near-neutral — its warmth is barely there, carried by type and accent instead.
- **Surface** (`#FFFFFF`): Cards, panels, inputs — the article "paper" lifted off the page.
- **Border** (`#E2E2E0`) / **Border Strong** (`#C8C8C5`): Hairline dividers and card outlines; border-strong is the rest→hover deepening.

### Neutral (dark register)
- **Dark BG** (`#1A1A1A`) / **Dark Surface** (`#222222`): The builder/prosumer dark sections, hero headers (`pg-hero`), and the glass nav. White text sits at 50–85% opacity, never pure white for body.
- **Dark Border** (`rgba(255,255,255,0.08)`): Hairline separators on dark.

### Tertiary — Verdict Semantics (badges only)
- **Verdict Buy / Recommended** (`#16A34A` on `rgba(34,197,94,.12)`): green.
- **Verdict Skip** (`#E65100` on `#FFF3E0`): burnt orange-amber.
- **Verdict Updated** (`#3B82F6` on `rgba(59,130,246,.12)`): blue.
- **Verdict Community** (`#7C3AED` on `rgba(139,92,246,.12)`): violet, for community-mod content.

### Named Rules
**The Pointer Rule.** Electric Orange is a pointer, not a paint. It appears on ≤10% of any screen — one CTA, one active state, one verdict. Its scarcity is what makes it read as "look here." A page where orange covers a third of the surface has lost the plot.

**The Body-Grey Floor.** Body prose never goes lighter than Body Grey (`#5A5A5A`) on the off-white page. "Elegant light grey" is the single fastest way to fail AA contrast; if it's close, push toward Ink.

## 3. Typography

**Display Font:** Barlow Condensed (800) — the condensed poster headline; the masthead voice.
**Body Font:** Lora (400, with italic) — humanist serif for article prose, set generously at 1.8 line-height.
**UI Font:** Barlow (400/500/600) — the workhorse for nav, buttons, chrome.
**Label/Mono Font:** JetBrains Mono (400/500) — specs, dates, prices, eyebrow labels, breadcrumbs.

**Character:** A three-axis pairing that can't be mistaken for a single-family page. Condensed grotesque shouts the headline, a warm serif carries the read, and a mono labels the data — newspaper masthead, magazine feature, and parts-bin sticker in one system. The contrast between the three IS the voice.

### Hierarchy
- **Display** (Barlow Condensed 800, `clamp(2rem, 5vw, 2.5rem)`, line-height 1.0, `-0.5px`): Page H1s and `lg-title`. Tight, condensed, decisive.
- **Headline** (Barlow Condensed 800, 22px, line-height 1.1, `-0.2px`): Section heads (`section-head-label`), `lg-content h2`.
- **Title** (Barlow Condensed 800, 17px, line-height 1.1): Card titles (`card-title`, `product-card-name`).
- **Body** (Lora 400, 15px, line-height 1.8, color Body Grey): Article prose. Cap measure at 65–75ch (`--article-w: 720px` enforces this).
- **UI** (Barlow 600, 13px): Nav links, button labels, interface text.
- **Label** (JetBrains Mono 700, 10px, `0.12em`, UPPERCASE, color accent): The eyebrow. Also mono meta at 9–11px (dates, breadcrumbs, prices) — these stay sentence/normal case.

### Named Rules
**The Three-Voice Rule.** Every type decision belongs to one of three jobs: Barlow Condensed *announces* (headlines), Lora *narrates* (prose), JetBrains Mono *labels* (data). Don't set prose in the condensed face or data in the serif. Mixing the jobs flattens the voice.

**The Mono-Is-Data Rule.** JetBrains Mono is reserved for specs, prices, dates, part numbers, and the orange eyebrow. It is never decorative "tech costume" — if the text isn't data or a system label, it's not mono.

## 4. Elevation

The system is **flat by default**. Depth is built from three tonal planes — warm off-white page (`#F7F6F3`) → white surface (`#FFFFFF`) → near-black dark section (`#1A1A1A`) — separated by hairline 1px borders, not shadows. Most surfaces have no shadow at rest. Shadows appear only as a *response*: a hover lift on an interactive card, or to float an element above the page (dropdown panel, search overlay).

### Shadow Vocabulary
- **Hover Glow** (`box-shadow: 0 8px 24px rgba(255,90,31,.08)`): The orange-tinted lift on interactive cards (hardware, tools, filament index cards) on `:hover`, paired with `translateY(-1px)` and an accent border. Signals "this is clickable."
- **Floating Panel** (`box-shadow: 0 8px 24px rgba(0,0,0,0.4)`): Nav dropdown panel and search overlay box on dark — lifts true overlays off the page.
- **Dark Lift** (`box-shadow: 0 12px 40px rgba(0,0,0,.4)`): Reserved for elevated cards on dark backgrounds (ecosystem hub cards).

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat at rest — border + tonal plane only. A shadow is always a reaction to state (hover, float, focus), never an ambient default. If a card has a drop shadow doing nothing, delete it.

**The Hairline Rule.** Dividers and card outlines are 1px (`--border`). The hover state deepens the border (`--border-strong`) or switches it to accent — it never thickens it into a stripe.

## 5. Components

The component feel is **precise & confident**: flat surfaces, hairline borders, mono labels, and decisive orange CTAs that respond with a snappy 1px lift. The tool does its job without fuss, but commits when it speaks.

### Buttons
- **Shape:** Gently squared (4px radius, `--radius-sm`). Never pill-rounded.
- **Primary** (`btn-buy`): Electric Orange background, white text, Barlow 700, `6px 14px` padding. The "where to buy" / action button.
- **Hover / Focus:** Background deepens to Orange Deep (`#C93B08`), 150ms. Focus-visible ring is `2px solid var(--accent)` at `2px` offset (global).
- **Secondary (Printables)** (`btn-printables`): Community-green fill (`#E8F5E9` / `#2E7D32` / border `#A5D6A7`) for "download STL" actions — the one place green leads.
- **Submit** (`lg-form-submit`): Barlow Condensed 800 uppercase, orange, larger `13px 28px`; the editorial form CTA.

### Chips
- **Spec Chip** (`spec-chip`): JetBrains Mono 10px on page-bg fill, 1px border, 3px radius, `2px 7px`. Tabular spec tokens on product cards.
- **Verdict Badge** (`verdict`): Pill, 10px 700, semantic color-on-tint (see Colors). Carries the BUY/CONSIDER/SKIP/UPDATED judgment. The word "review" never appears.

### Cards / Containers
- **Corner Style:** 10px radius (`--radius-lg`).
- **Background:** White surface on the off-white page; `overflow: hidden` so imagery bleeds to the edge.
- **Shadow Strategy:** Flat at rest (see Elevation). `card` hover = border deepens + `translateY(-1px)`. `product-card` hover = border turns accent + lift. Index cards add the orange Hover Glow.
- **Border:** 1px `--border`. Community-mod variant uses a *dashed* border to signal user-contributed content.
- **Internal Padding:** `14px 16px` (`card-body`).

### Inputs / Fields
- **Style** (`lg-form-input`): White surface, 1px `--border`, 5px radius, Barlow 14px. Dark-register inputs (`nl-input`, nav search) use translucent white fills on the dark stage.
- **Focus:** Border shifts to Electric Orange (`#FF5A1F`); on dark, a 50%-opacity orange border with a brightened fill. Caret is accent-colored.
- **Disabled:** `opacity: .5`, `cursor: not-allowed` (submit buttons).

### Navigation
- **Style:** Fixed top, dark glass at rest (`rgba(20,20,20,0.85)` + `blur(20px)`), Barlow 600 13px links at 50% white opacity.
- **States:** Hover → full white + faint white wash + 1px lift. Active → white with a 2px Electric Orange bottom border. Dropdown chevron rotates 180° on open.
- **Scroll behavior:** Solidifies to opaque `#1A1A1A` and shrinks 80px→56px at 80px scroll, restores below 60px (hysteresis kills flicker). On hero pages, starts fully transparent and transitions to glass after 50px.
- **Mobile:** Collapses to a hamburger slide-down panel (staggered link entrance) below 1024px; wordmark swaps to lettermark below 768px. Search becomes a centered overlay dialog.

### Signature Component — Verdict Badge
The verdict badge is the editorial spine of the hardware section. It encodes the publication's judgment (BUY / CONSIDER / SKIP / UPDATED, plus COMMUNITY) as a small semantic-colored pill, and it is the mechanism that lets Modern Makes have a strong opinion *without* ever calling itself a review. Filter tabs on index pages mirror these same values with count badges.

## 6. Do's and Don'ts

### Do:
- **Do** keep Electric Orange (`#FF5A1F`) under ~10% of any screen — one CTA, one active state, one verdict. The Pointer Rule.
- **Do** set body prose in Lora at Body Grey (`#5A5A5A`) or darker on the off-white page, line-height 1.8, measure capped at 65–75ch.
- **Do** assign type by job: Barlow Condensed announces, Lora narrates, JetBrains Mono labels data. The Three-Voice Rule.
- **Do** keep surfaces flat at rest; let shadows be a reaction to hover/float/focus only.
- **Do** use 1px hairline borders that deepen or turn accent on hover — never thicken into a stripe.
- **Do** label hardware judgments with verdict badges ("BUY", "SKIP") and the words "specs / verdict / where to buy".
- **Do** honor `prefers-reduced-motion` on every hover lift, nav transition, and staggered reveal (crossfade or instant fallback).

### Don't:
- **Don't** build the **affiliate review-farm**: no star ratings, no "Top 10 Best Hotend 2026" listicle clutter, no comparison-table soup, and never the word "review" in a title, label, or badge.
- **Don't** drift toward the **hobbyist forum**: no default-Bootstrap grey, no amateur layout, no page without an editorial point of view.
- **Don't** become a **marketplace**: no buy-buttons-everywhere, no product-grid-as-homepage, no transactional framing ahead of the editorial.
- **Don't** use `border-left`/`border-right` greater than 1px as a colored accent stripe on cards, callouts, or list items. Use full hairline borders or background tints. (The legacy `lg-callout` 3px accent border is a known exception, not a pattern to copy.)
- **Don't** lighten body text "for elegance" below Body Grey — it fails AA on the off-white bg.
- **Don't** set prose in Barlow Condensed or data in Lora; don't use JetBrains Mono as decorative "tech costume" for non-data text.
- **Don't** add ambient drop shadows to resting cards, or glassmorphism anywhere except the established nav glass.
- **Don't** fabricate audience metrics or hands-on test claims — "Audience metrics available on request," and verdicts synthesize community consensus.
