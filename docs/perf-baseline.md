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
