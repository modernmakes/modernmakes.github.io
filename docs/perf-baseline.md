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
