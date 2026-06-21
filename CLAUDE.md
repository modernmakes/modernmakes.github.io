\## Wiki Knowledge Base

Path: C:\\Users\\matty\\claude-obsidian

At the start of every session, silently read:

1\. C:\\Users\\matty\\claude-obsidian\\wiki\\principles.md — universal decision-making lens

2\. C:\\Users\\matty\\claude-obsidian\\wiki\\hot.md — recent context



When you need deeper context:

3\. Read C:\\Users\\matty\\claude-obsidian\\wiki\\index.md

4\. For domain specifics, read C:\\Users\\matty\\claude-obsidian\\wiki\\<domain>\\\_index.md



Do NOT read the wiki for general coding questions or things already in this project.

\---



\# CLAUDE.md — Modern Makes



Complete context for Claude Code. Read this before touching anything.



\---



\## Commands



```bash

npm run dev          # Dev server at http://localhost:4321

npm run build        # Production build → dist/

npm run preview      # Preview production build

npm run fetch-data   # Pull Airtable → src/data/hardware/ JSON files

```



No lint or test commands. The PostToolUse build hook runs `npm run build` automatically after every file edit — watch for build errors in the output before proceeding.



\*\*Git workflow:\*\* All commits are made via Claude Code (`git add` + `git commit`). Matt pushes from GitHub Desktop only — never run `git push` from terminal.



\---



\## Project Identity



\*\*Modern Makes\*\* — faceless prosumer FDM 3D printing editorial publication.

\*\*Live site:\*\* modernmakes.github.io

\*\*Stack:\*\* Astro 4.x, static output, GitHub Pages

\*\*Deploy:\*\* Every push to `main` triggers `.github/workflows/deploy.yml` → `astro build` → deploys `dist/`

\*\*Pages:\*\* \~100 pages, zero errors required at build

\*\*GA4:\*\* `G-CGR4N532H6`

\*\*Contact:\*\* `modernmakesco@gmail.com`



\---



\## Brand \& Voice



\- \*\*Colors:\*\* Electric Orange `#FF5A1F` (`--accent`), dark-first aesthetic

\- \*\*Typography:\*\* Barlow Condensed 800 (display `--fd`), Lora 400 (body `--fb`), JetBrains Mono (`--fm`), Barlow UI (`--fu`)

\- \*\*Voice:\*\* Opinionated enthusiast, editorial "we tested" framing — never "I tested"

\- \*\*Content rule:\*\* No opinions on products the team hasn't used. Factual framing only.

\- \*\*These are NOT reviews\*\* — never use the word "review" in titles, labels, or badges for hardware pages. Use "specs", "verdict", "where to buy" instead.



\---



\## Design System



\*\*No Tailwind\*\* — the package is installed but unused. Use CSS custom properties from `src/styles/global.css`.



Key tokens:

```css

\\--accent: #FF5A1F       /\\\* electric orange \\\*/

\\--black: #1A1A1A

\\--bg: #F7F6F3           /\\\* off-white \\\*/

\\--surface: #FFFFFF

\\--border: #E2E2E0

\\--g1, --g2              /\\\* grey scale \\\*/

\\--dark-bg, --dark-surface, --dark-border

\\--fd                    /\\\* Barlow Condensed — display \\\*/

\\--fb                    /\\\* Lora — body prose \\\*/

\\--fu                    /\\\* Barlow — UI \\\*/

\\--fm                    /\\\* JetBrains Mono — specs/code \\\*/

\\--max-w: 1200px

\\--article-w: 720px

```



Pre-built utility classes — use before writing new CSS:

`.container`, `.section`, `.section-lg`, `.section-head`, `.card`, `.product-card`, `.spec-chip`, `.btn-buy`, `.verdict`, `.grid-2/3/4`, `.eyebrow`, `.dark-section`, `.callout-orange`



Component styles live in `<style>` blocks within `.astro` files.

\*\*Critical:\*\* Components that interact with JS-toggled classes (like `.scrolled`) need `<style is:global>` — Astro's default scoping breaks them.



\---



\## File Structure

src/



layouts/



Base.astro              — wraps every page. hasPageH1, hasHero, heroPage props



ArticleLayout.astro     — news articles. currentPath prop for nav highlight



GuideLayout.astro       — how-to guides with steps, tools, parts



ComparisonLayout.astro  — VS articles with score bars



FilamentLayout.astro    — filament material pages



ComponentLayout.astro   — hardware component pages (hotends etc)



&#x20;   MotionSystemLayout.astro — gantry/motion mod pages



pages/



index.astro             — homepage (data-driven from homepage.json)



voron/



index.astro           — Voron hub (model selector, subsystem grid)



mods/index.astro      — 18 community mods with category/model filter



toolheads/            — 5 toolhead pages (stealthburner, xol, etc)



origin.astro          — Voron history editorial page



\[subsystem pages]     — extruders, motion-system, electronics, etc



ratrig/, vzbot/, hevort/ — ecosystem hubs + origin.astro pages



&#x20;   hardware/



index.astro           — hardware category grid (dynamic counts from JSON)



hotends/



index.astro         — hotend card grid, verdict filter tabs



\[slug].astro        — dynamic route, one page per Airtable record



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



&#x20; toolboards.json       — empty



part-cooling.json     — 1 record (Wonsmart WS9290)



motors.json           — 1 record (SLM NEMA17 Water Cooler)



&#x20;\[other tables]        — empty



&#x20;styles/



global.css              — entire design system



components/



Nav.astro, Footer.astro, AdSlot.astro, \[homepage section components]

