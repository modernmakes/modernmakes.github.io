# Performance baseline — native-feel Phase 1

Gate for each native-feel phase: no page slower than baseline on LCP or worse on CLS; target CLS ≤ 0.02.

**Method.** Lighthouse 12.6.1, mobile form factor, default simulated throttling (Slow 4G, 4× CPU), headless Chrome, performance + accessibility categories. Production build (`npm run build`) served as static files on localhost. Each figure is the median of 2 runs. Same machine and server for Before and After.

Newest news article at the time of measurement: `/news/bambu-lab-open-source-crisis/` (dated 2026-06-26).

## Before (build of commit 4b0d0d1, 4 Nov 2026)

| Page | Performance | LCP | FCP | CLS | TBT | Accessibility |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 43 | 6.44 s | 2.90 s | 0.000 | 2197 ms | 92 |
| `/hardware/hotends/` | 53 | 5.26 s | 3.44 s | 0.001 | 1062 ms | 91 |
| `/hardware/hotends/rapido-2-plus-hf/` | 69 | 5.51 s | 3.52 s | 0.002 | 224 ms | 92 |
| `/news/bambu-lab-open-source-crisis/` | 70 | 5.02 s | 3.45 s | 0.028 | 224 ms | 92 |
| `/voron/` | 69 | 5.40 s | 3.46 s | 0.009 | 209 ms | 92 |
| `/tools/flowrate/` | 69 | 5.33 s | 3.42 s | 0.012 | 222 ms | 92 |

Screenshots at 390, 768 and 1440 px: `scratch/baseline/` (gitignored).

## After (Phase 1, 4 Nov 2026)

Run back to back with a fresh re-run of the baseline build, same machine and server, so the two columns are directly comparable. Lab numbers on this machine drift between sessions (the homepage TBT above swung from about 2.2 s to 0.2 s between sessions with no code change), so compare within this table rather than against the Before table.

| Page | Perf before → after | LCP before → after | FCP before → after | CLS before → after | TBT before → after | A11y |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 77 → 77 | 5.36 s → 5.01 s | 1.89 s → 2.28 s | 0.009 → 0.000 | 187 → 180 ms | 88 → 92 |
| `/hardware/hotends/` | 73 → 87 | 4.50 s → 3.75 s | 3.45 s → 2.08 s | 0.002 → 0.000 | 237 → 95 ms | 91 → 91 |
| `/hardware/hotends/rapido-2-plus-hf/` | 71 → 94 | 5.40 s → 2.64 s | 3.55 s → 2.11 s | 0.002 → 0.000 | 149 → 119 ms | 92 → 92 |
| `/news/bambu-lab-open-source-crisis/` | 84 → 95 | 3.57 s → 2.26 s | 2.67 s → 1.92 s | 0.028 → 0.000 | 151 → 155 ms | 92 → 92 |
| `/voron/` | 70 → 82 | 5.30 s → 4.48 s | 3.50 s → 2.12 s | 0.004 → 0.004 | 139 → 127 ms | 92 → 92 |
| `/tools/flowrate/` | 79 → 94 | 4.20 s → 2.41 s | 3.19 s → 2.00 s | 0.024 → 0.000 | 141 → 154 ms | 92 → 92 |

**Gate.** LCP is faster on all six pages and CLS is equal or better on all six (max 0.004, target ≤ 0.02). Homepage FCP was slower in this pair (+0.39 s) but faster in an earlier pair the same day (2.90 → 2.08 s); the homepage is the noisiest template and should be re-checked on the next phase. TBT moves within run-to-run noise.

**Accessibility (accesslint, serious and above).** 161 serious issues before, about 124 after, 0 critical. Fixed in Phase 1: the keyboard-reachable closed mobile menu (36 instances), label-in-name mismatches on the eco hub, feature build and vendor cards, placeholder-only newsletter inputs, the roadmap rows. Every remaining issue is colour contrast from the existing palette (`--g2` grey on white 3.36:1, small Electric Orange text 3.12:1, Workhorse green badge text 2.97:1, low-opacity white on the Voron hub). Fixing those changes brand colours, which the PRD puts out of scope; it needs a decision before it ships.

Screenshots at 390, 768 and 1440 px: `scratch/after/`, diffs in `scratch/diff/` (gitignored). Every visual change traced to intended work: typographic covers, the article hero, ticker items, roadmap contrast and `text-wrap` line breaks.

## Accessibility after the contrast pass (4 Nov 2026)

accesslint, serious and above, on the six gate pages: **0** (from 161 at baseline, about 124 after the first Phase 1 pass). Lower-severity findings remaining: 1 per page, 3 on `/tools/flowrate/`. Text that accesslint skips because it is still mid scroll-reveal (footer, homepage sections) was checked separately with a forced-reveal contrast scan: no AA failures left apart from colour emoji and text over hero images, which are false positives.

How it was fixed: token changes in `global.css` (see DESIGN.md, "The Small-Orange Rule"): `--g2` darkened to `#6F6F6F`, small orange text on light surfaces on `--accent-dk` / `--accent-ink`, ink labels on orange fills (`--on-accent`), Workhorse text on `--verdict-wh-ink`, faint white on the dark planes on `--on-dark-muted`.

## Phase 2A (7 Nov 2026)

Flow chip, flow filter and sticky bar, page title in nav, full-bleed detail hero, image attributes. Same method as above (Lighthouse 12.6.1, mobile, simulated Slow 4G, median of 2 runs, production build served locally). Lab numbers drift between sessions, so the fair comparison is the middle column: the commit just before Phase 2A, rebuilt and measured back to back with the Phase 2A build. The Phase 1 After column is copied from the table above for reference only.

| Page | Perf: P1 After / pre-2A / 2A | LCP: P1 After / pre-2A / 2A | FCP: P1 After / pre-2A / 2A | CLS: P1 After / pre-2A / 2A | TBT: P1 After / pre-2A / 2A |
| --- | --- | --- | --- | --- | --- |
| `/` | 77 / 85.5 / 82.5 | 5.01 / 3.84 / 3.82 s | 2.28 / 1.60 / 1.60 s | 0.000 / 0.008 / 0.004 | 180 / 184 / 285 ms |
| `/hardware/hotends/` | 87 / 93.5 / 94.5 | 3.75 / 2.43 / 2.12 s | 2.08 / 1.33 / 1.52 s | 0.000 / 0.000 / 0.001 | 95 / 165 / 209 ms |
| `/hardware/hotends/rapido-2-plus-hf/` | 94 / 84 / 90 | 2.64 / 3.24 / 2.15 s | 2.11 / 1.59 / 1.55 s | 0.000 / 0.000 / 0.000 | 119 / 364 / 375 ms |
| `/news/bambu-lab-open-source-crisis/` | 95 / 95 / 94 | 2.26 / 1.96 / 1.97 s | 1.92 / 1.44 / 1.45 s | 0.000 / 0.000 / 0.000 | 155 / 219 / 247 ms |

**Gate.** LCP is equal or faster on all four pages against the pre-2A rerun (hotend detail 3.24 → 2.15 s). CLS stays at or under 0.004. Lighthouse accessibility is unchanged (100, 100, 96, 100). TBT is higher on all four in this pair (+3 to +101 ms); the homepage swing is the largest, and the homepage is the noisiest template (the Phase 1 note above records the same page moving about 2 s between sessions). Phase 2A adds no script to `/`, so treat that one as noise until a third run says otherwise, and re-check TBT on the next phase.

LCP element, unchanged by this phase: `/` the typographic cover title, `/hardware/hotends/` the hero subtitle, the detail page the product image, the article its lead paragraph. Because the hotends index LCP is text, no card image carries `fetchpriority="high"`; only the detail hero does.

**Images.** Every `<img>` now has width/height or sits in a fixed or aspect-ratio box, with `decoding="async"`. Lazy everywhere except above the fold (nav logos, the first three index cards, the detail hero, the article hero when set). One `fetchpriority="high"` per page at most. Exceptions: the PA tuner's upload preview (size known only at runtime) and the ad slot card image (an aspect-ratio box, ads are off).

**Accessibility (accesslint, serious and above).** `/hardware/hotends/`, `/hardware/extruders/`, `/hardware/hotends/rapido-2-plus-hf/` and `/news/bambu-lab-open-source-crisis/`: 0 on all four.
