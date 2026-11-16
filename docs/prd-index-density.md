# PRD — Hardware index density on phones

15 Nov 2026 · status: **layout C signed off 15 Nov**; three open questions below still need answers · applies to every `HardwareIndex`-rendered page (17 categories + `/printers`), measured on `/hardware/hotends/`

## Problem

On a 390 px phone the hotends index is **19,903 px tall**: one card per screen, 40 screens to reach the end. The reader's job on this page is to compare verdict, flow class and price across many hotends; the layout shows one at a time. The PRD's own rule is "the answer is readable in five seconds." Measured today (Playwright, 390×844, built `dist`):

| Layout | Page height | Cards above fold | Cards after one scroll | First card |
| --- | --- | --- | --- | --- |
| A. Current (1-up, 4:3 media) | 19,903 px | 1 | 3 | 456 px |
| B. 2-up grid, square media, excerpt hidden | 7,472 px | 4 | 6 | 309 px |
| C. List rows, 96 px square thumb, excerpt hidden | 6,247 px | 3 | 8 | 133 px |

Also measured: 24 of 40 hotend cards have no product image and show the TypeCover fallback, so the big media box is empty dark space on 60% of cards. The sticky filter bar is 100 px tall under a 48 px nav, so 148 px of every scrolled viewport is chrome.

## Recommendation

**Ship C (list rows) at ≤ 480 px. Keep the card grid at ≥ 481 px.** Reasons: it is the densest layout that still shows the verdict badge, flow chip and price per row; it matches the command palette's row style, so a reader who searches then browses sees the same shape; and it makes the missing-image problem small instead of large (a 96 px cover vs a 350 px one). B is a weaker middle: 4 above the fold but each card still spends 150 px on media that is empty 60% of the time, and two-up titles wrap badly ("Rapido 2 Plus UHF").

Not a toggle. No "grid/list" switch on phones: it adds state, a control and a decision the reader doesn't want. Desktop stays as is.

## Success criteria

- `/hardware/hotends/` at 390 px: page height ≤ 6,500 px, ≥ 3 cards above the fold, ≥ 8 cards per 844 px scroll (today: 19,903 / 1 / 3).
- Each row still shows brand, name, verdict badge, flow chip (hotends) and price without horizontal scroll at 360 px.
- Title appears once per row (closes audit item B3 for these pages).
- Lighthouse mobile: LCP and CLS equal or better than the Phase 2B figures in `docs/perf-baseline.md` (2.11 s / 0.001); CLS ≤ 0.02 while filtering.
- Filter view transitions and the sliding tab underline still work; `accesslint:audit` serious+critical = 0 on hotends, extruders, probes and `/printers`.
- All 18 index pages render the row layout with no per-page CSS.

## Scope

In: `src/components/HardwareIndex.astro` markup/CSS; a `TypeCover` compact variant (eyebrow + brand monogram, no title) for the 96 px thumb; `global.css` tokens only if a row-height token is needed. Out: desktop layout, the sticky bar height, Voron subsystem pages, guides/news indexes (different card component), images for the 24 image-less hotends (data work, separate).

## Constraints

- Design system: tokens only, no hex; `<style is:global>` where JS toggles classes; Electric Orange only on the active tab.
- Press states and `view-transition-class: card` stay on the rows.
- No new JS. This is CSS plus one conditional in the template (title suppression when `TypeCover` compact is shown).
- Images: `loading="lazy"` beyond the first three rows is already set; keep the `fetchpriority` rule (none on index pages).

## Build plan — orchestrated

Opus plans and reviews; Sonnet does the edits; Haiku does lookups. One branch `feat/index-density`, one PR-sized commit, manual push (site change).

| Step | Who | Work |
| --- | --- | --- |
| 1 | Opus | Read `HardwareIndex.astro` 160–215 and `global.css` `.card*`/`.grid-3`; write the exact selector list and the row spec (thumb 96 px square, body padding 10/12, title 16 px, excerpt hidden, chips one line with overflow hidden) into the task brief |
| 2 | Sonnet worker | Apply the ≤ 480 px rules inside `HardwareIndex.astro`'s `<style is:global>`; add `TypeCover` `compact` prop (eyebrow + 2-letter brand monogram); add the title-suppression conditional; run `npm run build` |
| 3 | Haiku worker | Run `/tmp`-style Playwright measurement (same script as the baseline, three numbers per page) on hotends, extruders, probes, printers at 390 px; report the table |
| 4 | Sonnet critic (fresh, has not seen step 2) | Screenshot review at 360/390/430 px against the success criteria; `accesslint:audit` on the four pages; `review-animations` on the filter transition |
| 5 | Opus | `/ponytail-review` the diff (expected delta: ~40 CSS lines added, 0 JS); gate on steps 3–4; commit |

Claude Code kickoff prompt (paste as-is):

```
Repo: modernmakes.github.io. Branch feat/index-density. Read docs/prd-index-density.md. Run it with superpowers:subagent-driven-development: you plan and gate; dispatch a Sonnet subagent for step 2, a Haiku subagent for step 3, a fresh Sonnet subagent for step 4 that only receives the success-criteria table and the four URLs. Do not do steps 2–4 yourself. After step 5 commit on the branch with message "feat(hardware): list rows on phones for every hardware index" and stop; Matt pushes.
```

## Open questions (answer before step 1)

1. Flow chip on non-hotend rows: today only hotends have a flow class. Rows for other categories get verdict + price only. Fine?
2. The 96 px thumb for image-less records: brand monogram (e.g. "PH" for Phaetus) on `--surface-media`, or the eyebrow word only? Recommendation: monogram; it gives 24 identical dark squares some identity.
3. Sort: rows make "Benchmark first, then Workhorse, Bleeding Edge, Skip" visible as grouping. Add group headers on phones, or keep Airtable order? Recommendation: keep order for this PR; grouping is a data question tied to the zero-Benchmark problem (audit B2).

## Sign-off

Layout C on phones: approved by Matt, 15 Nov 2026.
