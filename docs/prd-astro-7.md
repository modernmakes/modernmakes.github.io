# PRD — Astro 4.15 → 7.4 upgrade

15 Nov 2026 · status: **signed off 15 Nov** (compressHTML: true; run after the modernmakes.org cutover; slug collision fixed separately in Commit 2) · trial run completed in a scratch copy, original repo untouched

## Problem

The site runs Astro 4.15, two majors behind. `npm audit` on the current lockfile: 14 findings (1 critical, 11 high). The output is static so readers are not exposed; the dev server, `sharp`, `vite` and `esbuild` findings are on your machine, and every month on 4.x widens the gap to the next upgrade. Astro 4 also predates the content layer, so each new major makes the collections migration larger, not smaller.

## What the trial found (facts, measured today)

A Sonnet agent copied the repo, ran `npm install astro@latest @astrojs/sitemap@latest` (the `@astrojs/upgrade` CLI rejected its own `--yes` flag), applied the mechanical collection migration, and built.

- **Result:** builds on **Astro 7.4.12** after **4 fix rounds**. 592 HTML files before and after, identical file list; 560 sitemap URLs, identical; `search-index.json` byte-identical.
- **Migration surface:** 4 collections in `src/content/config.ts` → `src/content.config.ts` with `glob()` loaders; 4 `entry.render()` → `render(entry)`; **43** `entry.slug` → `entry.id` across 14 files (list in the appendix); 0 `getEntryBySlug`, 0 `Astro.glob`, 0 remark/rehype config, 0 unclosed tags in 133 `.astro` files.
- **Build errors hit:** (1) unescaped apostrophe inside `is:inline` script strings, `advertise/index.astro:221` and `partners/index.astro:218`; (2) an HTML comment as a sibling of `<Sheet>` inside a JSX conditional, `ComponentLayout.astro:267-281`, needs a fragment; (3) `Astro.site` used inside a `slot="head"` script template in `pages/index.astro:84-89`, hoist to frontmatter. All three are stricter-compiler issues, none are logic.
- **Audit after:** 2 findings, both esbuild dev-server, moderate/high. Down from 14.
- **The real risk is whitespace.** Astro 7 defaults `compressHTML` to `'jsx'`, which strips spaces between inline elements. Counted in the new build vs today's: `</span><span` 9 → 48 and `</a><a` 6 → 28 on `/`; 76 → 164 and 39 → 59 on `/hardware/hotends/`. Chips, breadcrumbs and inline links will visually touch unless `compressHTML: true` is set. Decision below.
- **Markdown:** Astro 7 renders `.md` with Sätteri instead of remark by default; this repo has no remark/rehype plugins, so the 32 articles should render the same, but they need a visual pass (code blocks, tables, footnotes).
- **Pre-existing warning:** `/hardware/hotends/mosquito-magnum` is built twice because "Mosquito Magnum" and "Mosquito Magnum+" both slug to the same URL (`toSlug()` strips `+`), so one page is dropped in every build today. Not caused by the upgrade. Fixed in audit Commit 2 by mapping `+` → `-plus` in `toSlug()` and `printerSlug`; the only collision across all 19 tables.
- **Node:** Astro 6+ requires Node ≥ 22.12. CI runs Node 24. Your Windows machine's Node version is unverified; check `node -v` first.

## Recommendation

**Go straight to 7.4.** Do not stop at 5 or 6: the collection migration is the same work for all three, and 5.x and 6.x only add intermediate deprecation warnings you'd fix twice. Set `compressHTML: true` in the config to keep today's whitespace behaviour, then decide later whether `'jsx'` is worth a site-wide spacing audit (it is not, for a content site).

## Success criteria

- `npm run build` green on Astro 7.4.x; 592 HTML files; sitemap URL list identical to today's (diff = 0 lines).
- `dist/` HTML diff against today's build, after setting `compressHTML: true`: only the `<meta name="generator">` line and known intentional changes. Any other diff is a finding.
- Visual diff (Playwright, 390 and 1440) on the 6 gate pages from `perf-baseline.md` plus one guide, one comparison and one filament page: no unintended change.
- `npm audit`: 0 critical, 0 high outside the dev-only esbuild advisory.
- Lighthouse mobile on the 6 gate pages: LCP/CLS within noise of Phase 2B.
- `claude-seo:seo-schema` and `seo-sitemap` pass (JSON-LD and sitemap unchanged).
- Nightly `fetch-airtable.yml` → `deploy.yml` chain runs green once after merge.

## Scope

In: `package.json`/lockfile, `astro.config.mjs` (`compressHTML`, keep `redirects` and `sitemap` filter), `src/content.config.ts`, the 14 files with `.slug`, the 4 `[slug].astro` pages, the 3 compiler fixes, `.nvmrc` with `22.12.0`, `engines` field. Out: any restyle, the `mosquito-magnum` shadow page (log it unless it is a 5-minute delete), Vite plugin changes (none exist), adopting new Astro 7 features (advanced routing, route caching, Sätteri plugins).

## Constraints

- One branch `chore/astro-7`, one squash-merge, **manual push** (major site change).
- `z` import: keep `from 'astro:content'` (it built); switch to `astro/zod` only if a Zod 4 schema warning appears.
- No `legacy.collectionsBackwardsCompat` flag. Migrate properly; the flag only defers the work.
- Pin `astro` and `@astrojs/sitemap` exact in `package.json` (the repo already pins sitemap); bumps are deliberate.

## Build plan — orchestrated

Opus plans, gates, and owns the config; Sonnet workers do the file edits in parallel (disjoint files); Haiku does inventory and diffs; a fresh Sonnet critic reviews.

| Step | Who | Work |
| --- | --- | --- |
| 0 | Matt | `node -v` on Windows ≥ 22.12; if not, install Node 24 LTS first |
| 1 | Haiku | Re-run the inventory greps on `main` (counts above) and confirm nothing moved since 14 Nov; write `docs/astro-7-inventory.md` |
| 2 | Opus | `npm install astro@7.4.12 @astrojs/sitemap@3.7.5 --save-exact`; `astro.config.mjs`: add `compressHTML: true`; add `.nvmrc`; commit "chore: astro 7 deps + config" |
| 3a | Sonnet A | Collections: move config → `src/content.config.ts`, add `glob()` loaders, drop `type`, `render(entry)` in the 4 `[slug].astro` files |
| 3b | Sonnet B | `.slug` → `.id` in the 10 non-page files (components, lib, sitemap page) — list in appendix; must not touch `toSlug(`, `product.slug`, `dataset.slug`, homepage.json ecosystems |
| 3c | Sonnet C | The 3 compiler fixes (apostrophes, fragment, hoisted `Astro.site`) |
| 4 | Opus | Merge the three worker diffs, `npm run build`, fix anything the merge missed |
| 5 | Haiku | Build today's `main` into `scratch/before/`, the branch into `scratch/after/`; `diff -r` the HTML and report every differing file with a 3-line context sample; count sitemap URLs both sides |
| 6 | Sonnet critic (fresh) | Playwright screenshots 390/1440 on the 9 pages, pixel-diff against `scratch/before/`; Lighthouse on the 6 gate pages; `accesslint:scan`; report only deltas |
| 7 | Opus | `/security-review` on the diff (new deps), `/ponytail-review` (expected: net negative lines, no new abstractions), `claude-seo:seo-schema` + `seo-sitemap`; append results to `docs/perf-baseline.md` as "Astro 7"; squash commit; stop for manual push |

Claude Code kickoff prompt (paste as-is):

```
Repo: modernmakes.github.io. Branch chore/astro-7. Read docs/prd-astro-7.md. Run it with superpowers:subagent-driven-development and dispatching-parallel-agents: you do steps 2, 4 and 7 only. Dispatch Haiku for steps 1 and 5, three Sonnet workers in parallel for 3a/3b/3c (each gets only its file list and must refuse to edit anything else), and a fresh Sonnet critic for step 6 that receives only the success criteria and the scratch/ paths. Stop and report if the build is still red after two rounds of step 4. Final commit message: "chore: upgrade Astro 4.15 → 7.4 (content layer, compressHTML preserved)". Do not push.
```

## Decisions (Matt, 15 Nov)

1. `compressHTML: true` — keep today's spacing.
2. The `mosquito-magnum` warning is a slug collision, not a stray page; fixed in audit Commit 2. Step 4 of this PRD only confirms the warning is gone.
3. Run after the modernmakes.org cutover commit (audit Commit 3) lands.

## Appendix — `.slug` → `.id` file list (from the trial)

`HomeLatestArticles.astro` 26,33,40 · `HomeHero.astro` 12-14 · `HomeBuildYourPrinter.astro` 100 · `lib/search-index.ts` 86-88,92 · `lib/related-content.ts` 48-50 · `pages/sitemap/index.astro` 128,139,150,163(×2) · `comparisons/[slug].astro` 8,53 · `comparisons/index.astro` 69 · `filament/[slug].astro` 10,214,241,252 · `filament/index.astro` 35,36,38,47,127,130,133 · `news/[slug].astro` 8,44 · `news/index.astro` 69 · `guides/[slug].astro` 8 · `guides/index.astro` 132.
Leave alone: `HomeBuildYourPrinter.astro` 15,59,86 · `voron/hotends.astro` 89,94,213 · `guides/index.astro` 274,297.
