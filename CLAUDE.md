# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server at http://localhost:4321
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

There are no lint or test commands configured.

## Architecture

**Modern Makes** is a static Astro site (output: `static`) published to GitHub Pages at `modernmakes.github.io`. Every push to `main` triggers `.github/workflows/deploy.yml` which runs `astro build` and deploys `dist/`.

### Layout

`src/layouts/Base.astro` is the single layout used by all pages. Key props:
- `title` — injected into `<title>` and OG tags
- `description` — defaults to the site tagline
- `heroPage={true}` — removes the `padding-top: 80px` from `<main>` (used on the homepage so the hero bleeds under the fixed nav)

Pages slot in `<Nav slot="nav" currentPath={currentPath} />` and `<Footer slot="footer" />`.

### Routing

`src/pages/` maps 1:1 to URL routes. The Voron ecosystem lives under `src/pages/voron/` and is the only fully-built ecosystem. Other printer hubs (`ratrig/`, `vzbot/`, `bambu/`, etc.) are placeholder pages.

### Data

All content is static JSON in `src/data/`:
- `homepage.json` — drives every homepage section (hero slides, ticker items, latest articles, tools teaser, ecosystem hubs)
- `products/hotends.json`, `products/voron-variants.json` — product data consumed by ecosystem pages
- `ads.json` — ad slot config; a slot only renders when `"active": true`

To update homepage content, edit `homepage.json`. To add a product, edit the relevant file in `products/`.

### Design system

All styles live in `src/styles/global.css` — **there is no Tailwind in use** (the package is installed but unused). Use the CSS custom properties defined in `:root` rather than hardcoding values:

- Colors: `--accent` (#FF5A1F), `--black`, `--bg`, `--surface`, `--border`, `--g1`, `--g2`
- Dark sections: `--dark-bg`, `--dark-surface`, `--dark-border`
- Type families: `--fd` (Barlow Condensed, display), `--fb` (Lora, body prose), `--fu` (Barlow, UI), `--fm` (JetBrains Mono)
- Spacing: `--sp-xs` through `--sp-2xl`
- Layout: `--max-w` (1200px), `--article-w` (720px)

Pre-built utility classes to use before writing new CSS: `.container`, `.section`, `.section-lg`, `.section-head`, `.card`, `.product-card`, `.spec-chip`, `.btn-buy`, `.verdict`, `.grid-2/3/4`, `.eyebrow`, `.dark-section`, `.callout-orange`.

Component styles live in `<style>` (or `<style is:global>`) blocks within their `.astro` file, not in `global.css`.

### Nav active state

`Nav.astro` accepts `currentPath` and applies `.active` classes via `currentPath.startsWith('/section')`. Pass the correct `currentPath` when adding new pages.

### Newsletter forms

Any `<form data-nl>` on any page gets wired up automatically by inline JS in `Base.astro`. No additional JS needed — just add the attribute and include `<input type="email">` and `<button type="submit">`.

### AdSlot component

`<AdSlot slotName="slot-name" />` renders nothing when the slot is inactive. To activate: set `"active": true` on the slot in `src/data/ads.json`. Supported formats: `banner`, `text`, `card`, `programmatic`.
