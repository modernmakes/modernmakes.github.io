# Hotend verdict proposal (not live)

**Status:** proposal for review, 2026-11-18. Nothing here has been applied. Airtable, `src/data` and site code are untouched.
**Taxonomy:** BRAND.md §5 (Benchmark / Value Pick / Contender / Skip, judged within flow class).
**Classes:** from the listed `Max Flow (mm³/s)` in `src/data/hardware/hotends.json`: Standard under 50, High 50–79, Extreme 80 and up, No class where the field is empty. Where research disputes a listed figure, the hotend stays in its listed class and the dispute goes in Data problems.

## How this was made

Four research passes ran in parallel, one per group. Each looked at community sources (r/VORONDesign threads and mirrors, the Voron forum, Duet forum, Printables, retailer reviews, VzBoT docs, trade press) and returned a note, links and a suggested verdict per hotend. I then checked the calls against each other and against the definitions, and overrode several (listed below).

**Confidence is low to moderate across the board.** Reddit couldn't be opened directly (search snippets and mirrors only), the Phaetus, Slice, Fabreeko, Mellow and BRS sites rate-limited or blocked most fetches, and almost no independent flow tests exist for these parts. Most flow figures in this file are manufacturer claims. No YouTube flow tests were checked. Treat every verdict as a starting point for your own call.

### Rules as applied

- **Benchmark:** one per class at most, and only for the best overall balance (flow, price, support, reliability), not the highest number.
- **Value Pick:** measured against the class Benchmark. No Benchmark means no Value Pick. It needs a real trade-off: most of what the Benchmark gives for roughly 25% less.
- **Skip:** needs positive evidence. That means superseded or end-of-life, a known failure pattern, or a same-job sibling that does more for less. Thin evidence alone stays Contender and is flagged "thin evidence" below.
- **Variants** (cooling options, Plus/Fiber versions) are judged one by one, but the same logic is applied across families.
- **Proposed labels** carry no numbers, so no unverified spec can leak into the published label. They avoid em dashes and hype words, and say what the part is best for.

### Where I overrode the research

| Hotend | Research suggested | Proposed | Why |
|---|---|---|---|
| Rapido 2 UHF | Contender | **Benchmark** (High) | Same logic as Standard, where the plain Rapido 2 HF beat the Plus HF. The High agent only preferred the Plus because our listed price for the plain UHF ($129.43) is above the Plus ($109.20); retail evidence puts the plain UHF at about $99. PT1000 misread complaints also attach mostly to Plus variants. |
| Rapido 2 Plus UHF | Benchmark | Contender | See above. |
| Rapido X | Value Pick | Contender | Extreme has no Benchmark to measure a Value Pick against. |
| Dragon HF | Contender (borderline Skip) | **Skip** | Known heat-creep pattern, and Phaetus's own Dragon UHF and Rapido 2 do the job better. |
| Tricorn Air, Tricorn Conduction | Skip | Contender | No negative evidence, only thin evidence, and the real price ($180–210) is below our listed $230. |
| HE20, HE50 | Skip | Contender | Thin evidence, and a different job (crash-resistant large-format) that has no cheaper same-job rival in the list. |
| DualVelo Air Lite | Skip | Contender | Thin evidence, not negative. Flagged as possibly outside the category. |

## Summary

| | Benchmark | Value Pick | Contender | Skip |
|---|---|---|---|---|
| Standard (18) | Rapido 2 HF | none | 14 | Chimera, Lite6, V6 |
| High (8) | Rapido 2 UHF | none | 6 | Dragon HF |
| Extreme (11) | none | none | 11 | none |
| No class (3) | n/a | n/a | 2 (hold) | XG |

Two Benchmarks, no Value Picks, five Skips. Every row in "Current verdict" below is a legacy value and renders as Contender today.

---

## Standard (under 50 mm³/s)

| Hotend | Brand | ~Price | Max flow | Current verdict | Proposed verdict | One-line reason | Proposed Verdict Label |
|---|---|---|---|---|---|---|---|
| Rapido 2 HF | Phaetus | $89 | 45 | Workhorse | **Benchmark** | Best balance of flow, price and mount support; the most-named standard-flow hotend in current Voron threads. | The default upgrade for standard-flow V6-footprint toolheads. |
| Rapido 2 Plus HF | Phaetus | $99 | 45 | Workhorse | Contender | Same hotend as the Benchmark plus PT1000 and higher temperature; only worth it for engineering filaments. | Worth the premium only if you print PA, PC or fiber-filled filament. |
| Rapido 2F | Phaetus | $104.96 | 36 | Bleeding Edge | Contender | Compact and abrasive-ready, but priced above its faster siblings. | Best for compact toolheads printing abrasive filament. |
| Revo Voron | E3D | $79.99 | 14 | Bleeding Edge | Contender | Wins on cold nozzle swaps and weight, loses on flow. | Best for frequent nozzle swaps on a StealthBurner. |
| Mosquito Magnum | Slice Engineering | $129.99 | 40 | Workhorse | Contender | Runner-up: excellent build quality and temperature headroom, but more money for less claimed flow than the Benchmark. | Best for Slice build quality with more flow than the original Mosquito. |
| Mosquito | Slice Engineering | $104.99 | 35 | Workhorse | Contender | Proven and well made, priced above the Benchmark for less flow. | Best for builders who value build quality and one-handed nozzle changes over flow. |
| Mosquito Liquid | Slice Engineering | $189.99 | 35 | Workhorse | Contender | Heated-chamber tool; little community feedback. | Best for heated chambers that already run a coolant loop. |
| Mosquito Conduct | Slice Engineering | $199.99 | 35 | Bleeding Edge | Contender | Fan-free niche part; thin evidence. | Best for enclosed industrial printers where a heat sink fan can't survive. |
| Dragon UHF | Phaetus | $74.99 | 45 | Workhorse | Contender | Decent and temperature-capable, but the community prefers the Rapido and it isn't cheap enough to be a Value Pick. | Best when a V6-mount build needs high-temperature headroom. |
| Dragon ST | Phaetus | $56.23 | 15 | Workhorse | Contender | Cheap all-metal hotend, but about a third of the Benchmark's flow, so it fails the Value Pick test. | A low-cost all-metal Dragon for builds that don't need high flow. |
| NexG (neXt G) | Phaetus | $99.99 | 45 | Workhorse | Contender | Quick-change design; thin evidence. | Best for quick nozzle changes on a Dragon-footprint mount. |
| neXt G Fiber | Phaetus | $99.99 | 45 | Workhorse | Contender | Fiber-ready neXt G; thin evidence. | The neXt G set up for carbon- and glass-filled filament. |
| Copperhead | Slice Engineering | $69.99 | 33 | Workhorse | Contender | Fair price, mixed fit and install feedback. | Best for adapting an all-metal hot side to an unusual printer. |
| HE20 | Takoto | $160 | 30 | Bleeding Edge | Contender | Crash-resistant large-format niche; thin evidence (research suggested Skip). | Built for large-format machines where crash resistance matters more than weight. |
| HeatCore 4 | Mellow 3D | — | 40 | Workhorse | Contender (hold) | No price and no community evidence; hold at the default until data exists. | A high-flow hotend kit with built-in nozzle probing for Voron-style builds. |
| V6 | E3D | $89.21 | 15 | Workhorse | **Skip** | Superseded: lowest flow tier, kits marked discontinued at several retailers. | The design most hotends copied, now outclassed by newer drop-ins. |
| Chimera | E3D | $126.60 | 11 | Workhorse | **Skip** | End-of-life signs, and dual extrusion has moved to toolchangers and multi-material units. | Dual extrusion is better served by toolchangers and multi-material units now. |
| Lite6 | E3D | $37.98 | 11 | Workhorse | **Skip** | Marked end-of-life by retailers, PTFE-lined with a low temperature ceiling. | An end-of-life PTFE-lined budget hotend; any all-metal option here is the better buy. |

**Why the Benchmark won.** The Rapido 2 HF has the best balance in the class: the top flow claim (tied with four others) at $89, the widest toolhead mount support, and the most mentions in current r/VORONDesign build threads. Its weak spots are mixed QC reports and vendor flow figures that disagree (45 vs 52). The Mosquito Magnum is the runner-up on build quality and temperature, at $41 more for a lower flow claim. The Revo Voron wins if nozzle-change ease matters more than flow.

**Why there's no Value Pick.** Nothing cheaper delivers most of what the Rapido 2 HF does. The Dragon UHF is about 16% cheaper with the same claimed flow, which isn't meaningfully less money, and the community prefers the Rapido. The Dragon ST is 37% cheaper but gives about a third of the flow. The Copperhead is 21% cheaper with mixed feedback.

**Close calls to look at:**
1. **Benchmark: Rapido 2 HF or Mosquito Magnum.** Choosing the Magnum would make the Rapido 2 HF a clean Value Pick: 32% cheaper with a higher flow claim.
2. **V6: Skip or Contender.** It's still the compatibility reference for nozzles and mounts. Skip rests on retailer discontinuation and a flow tier everything else beats. Its current label calls it the hotend "every other hotend is measured against", which is the Benchmark definition and has to change whichever way you go.
3. **Chimera: Skip or Contender.** The discontinuation notice found was for the Chimera+ (1.75 mm 12 V) at MatterHackers; E3D's own stock wasn't confirmed. It's also a different job (dual nozzle), so flow comparisons don't really apply.
4. **Thin evidence:** HeatCore 4, HE20, the neXt G pair, Mosquito Conduct and Mosquito Liquid. All are Contender by default, not on merit.

---

## High (50–79 mm³/s)

| Hotend | Brand | ~Price | Max flow | Current verdict | Proposed verdict | One-line reason | Proposed Verdict Label |
|---|---|---|---|---|---|---|---|
| Rapido 2 UHF | Phaetus | $129.43 listed, ~$99 seen | 75 | Workhorse | **Benchmark** | The standard high-flow recommendation in Voron threads, low heat-creep reports, broad toolhead support. | The default high-flow upgrade for CoreXY builds. |
| Rapido 2 Plus UHF | Phaetus | $109.20 | 75 | Workhorse | Contender | Same flow as the Benchmark, plus PT1000 and higher temperature; only worth it for engineering filaments. | Worth the small premium only if you print PA, PC or fiber-filled filament. |
| Goliath Air | Mellow 3D | $129.99 | 60 | Bleeding Edge | Contender | Credible VzBoT design and well supported in that world; no independent flow data. | Best for VzBoT-style builds with the fan ducting to feed it. |
| Chube Compact | Luke's Lab | $170 | 50 | Bleeding Edge | Contender | Light and temperature-capable; flow not independently confirmed. | Best for weight-sensitive toolheads that still need high-temperature headroom. |
| Tricorn Air | Tricorn | $230 listed, $180–210 seen | 70 | Workhorse | Contender | Open-source, temperature-capable design; thin evidence and availability unconfirmed (research suggested Skip). | An open-source high-flow hotend for builders who want to own the design. |
| Tricorn Conduction | Tricorn | $230 listed, $180–210 seen | 70 | Bleeding Edge | Contender | Same hotend as Tricorn Air with conduction cooling; same verdict. | Best for hot, enclosed builds that can sink heat through the toolhead. |
| HE50 | Takoto | $210 | 50 | Bleeding Edge | Contender | Long-melt-zone HE20 for crash-resistant large-format work; thin evidence (research suggested Skip). | The long-melt-zone Takoto for large-format machines that need crash resistance. |
| Dragon HF | Phaetus | $54.37 | 62.51 | Workhorse | **Skip** | Known heat-creep reputation, and its listed flow is a converted vendor figure; Phaetus's own Dragon UHF and Rapido 2 do the job better. | Prone to heat creep; the Dragon UHF or Rapido 2 UHF is the better buy. |

**Why the Benchmark won.** The Rapido 2 UHF is the hotend r/VORONDesign "Rapido vs Dragon" threads keep landing on. Commenters describe heat creep as close to impossible on it, and toolhead mount support is broad. It does this at about $99 at retail. The Plus UHF has the same flow and adds PT1000 and 350°C for engineering filaments. That's the same trade-off we called Contender in Standard, so the plain UHF takes the class here too. **This depends on fixing the listed price.** At the $129.43 in our data it would look worse value than its own Plus sibling.

**Why there's no Value Pick.** The only meaningfully cheaper part is the Dragon HF. It's 45% below a $99 Benchmark, but its heater is sold separately on some listings, it has a heat-creep reputation, and its flow figure doesn't hold up. It fails "most of what the Benchmark gives".

**Close calls to look at:**
1. **Rapido 2 UHF or Plus UHF as Benchmark.** If retail prices land at parity, the Plus gives more for the same money and could take it. Check both prices first (see Data problems).
2. **Dragon HF: Skip or Contender.** It's still sold and cheap. Skip rests on forum heat-creep reports and on Phaetus's own better options.
3. **Tricorn and Takoto: Contender or Skip.** The research leaned Skip on value: about twice the Benchmark's price with no independent validation. I kept them Contender because the evidence is missing rather than bad. Your call.
4. **Boundary parts.** HE50 and Chube Compact sit at exactly 50. If Dragon HF's real flow is below 50 it moves to Standard, where Skip still holds.

---

## Extreme (80+ mm³/s)

| Hotend | Brand | ~Price | Max flow | Current verdict | Proposed verdict | One-line reason | Proposed Verdict Label |
|---|---|---|---|---|---|---|---|
| Mosquito Prime Air | Slice Engineering | $1,571.99 | 116 | Bleeding Edge | Contender | The flow ceiling of the market, but about five times the next-priciest rival is not "best overall balance". | Industrial flow at an industrial price, for production machines rather than hobby builds. |
| Mosquito Prime Liquid | Slice Engineering | $1,571.99 | 116 | Bleeding Edge | Contender | Same as Prime Air with liquid cooling. | The Prime for heated chambers already running liquid cooling. |
| Mosquito Prime Conduction | Slice Engineering | $1,571.99 | 116 | Bleeding Edge | Contender | Same as Prime Air with conduction cooling. | The Prime for enclosed machines that can sink heat through the frame. |
| Mosquito Prime LGX ACE | Slice Engineering | $1,571.99 | 116 | Bleeding Edge | Contender | Same melt zone on Bondtech's short-path cold block. | The Prime on Bondtech's short-path cold block, best for flexible filament. |
| Chube Conduction | Luke's Lab | $320 | 120 | Bleeding Edge | Contender | Users praise the flow for its size; no independent test of the listed figure. | Best for high-flow builds that want to drop the heat sink fan. |
| Chube Air | Luke's Lab | $260 | 80 | Bleeding Edge | Contender | Same family, air cooled; flow figure unsourced. | A V6-compatible long-melt-zone hotend for chasing flow on a familiar mount. |
| Goliath Water | Mellow 3D | $152.94 | 100 | Bleeding Edge | Contender | VzBoT pedigree at a low price; flow is a manufacturer figure. | Best for VzBoT builds that already run a liquid loop. |
| Mosquito Magnum+ | Slice Engineering | $249.99 | 90 | Workhorse | Contender | Proven and widely stocked; listed flow conflicts with Slice's own published figures. | Slice's long-melt-zone Mosquito for large nozzles and production work. |
| Rapido X | Phaetus | $93.45 | 103 | Bleeding Edge | Contender | Cheapest credible part in the class and shipping now; 103 is a peak claim and it needs its own mount. | Phaetus's new high-flow platform, best for builds designed around its mount. |
| CHC XL | Triangle Lab | $83.99 | 100 | Workhorse | Contender | Cheap and widely sold; flow is a manufacturer claim and the temperature ceiling is low for the class. | A low-cost Volcano-format hotend for large nozzles. |
| DualVelo Air Lite | Mellow 3D | $276 | 100 | Bleeding Edge | Contender | A combined hotend and extruder with no community evidence and a price conflict (research suggested Skip). | An all-in-one hotend and extruder for large-format printers. |

**Why there's no Benchmark.** Nothing in this class has enough community evidence to be the part everything else gets compared to. The Mosquito Prime is the reference on flow and build, but at $1,572 it isn't the best overall balance. The Chube Conduction is the strongest balance candidate ($320, highest listed flow, positive user comments), but nobody has tested its flow independently.

**Why there's no Value Pick.** Value Pick is measured against the Benchmark, and there isn't one.

**Close calls to look at:**
1. **Name a Benchmark anyway?** If you make the Chube Conduction the Benchmark, Rapido X ($93, about 70% cheaper) is the obvious Value Pick candidate, with the caveat that Phaetus is quoted at about 65 mm³/s sustained against the 103 peak. If you make the Prime Air the Benchmark, both the Chube Conduction and Rapido X become Value Pick candidates. I'd hold until there's flow data.
2. **Rapido X class.** On sustained flow (~65) it belongs in High, where at $93 it would challenge the Rapido 2 UHF Benchmark. Its new mount isn't compatible with Rapido 2 mounts.
3. **Mosquito Magnum+ class.** If Slice's own figures (about 34–40 mm³/s, source unconfirmed for Magnum+ specifically) are right, it belongs in Standard.
4. **DualVelo Air Lite.** It may not belong in hotends at all. Skip or Contender only matters if it stays.

---

## No class (no flow figure)

These can't be judged within a class until a flow figure exists. Verdicts are provisional.

| Hotend | Brand | ~Price | Max flow | Current verdict | Proposed verdict | One-line reason | Proposed Verdict Label |
|---|---|---|---|---|---|---|---|
| XG | Phaetus | $82.95 | — | Bleeding Edge | **Skip** | Phaetus's neXt G is the evident successor, with a heater that's easier to service, Dragon compatibility and a stated flow figure. | Superseded by Phaetus's own neXt G. |
| V9.2 | V9 Hotend | $220 | — | Bleeding Edge | Contender (hold) | Sold out, no flow figure and no community evidence; hold at the default. | A boutique water-cooled hotend sold direct in small batches. |
| Dragon Ultra CF | BRS Engineering | $239.53 | — | Bleeding Edge | Contender (hold) | No temperature, flow or community evidence found; hold at the default. | A Dragon rebuilt by BRS Engineering for carbon-fiber filament. |

**Close calls:**
1. **XG: Skip or Contender.** It turns on one phaetus.com check. No source says XG is discontinued, and its parts are still stocked.
2. **V9.2 and Dragon Ultra CF.** Neither has enough to judge. Consider leaving them out of the verdict tabs until a flow figure lands.

---

## Internal notes (for review only, never published)

Condensed from the research passes. Flow and price figures in these notes are what sources claimed. None of this is hands-on, and nothing here goes on the site.

### Standard

**Rapido 2 HF (Phaetus)**
Probably the most commonly named high-flow V6-footprint hotend in r/VORONDesign threads. One user who owned a Revo, a Dragon and a Rapido said the Rapido performed like the Revo, and ranked the Dragon last. Praised for fast heat-up, its ceramic ring heater and value. Some recent comments say to avoid the Rapido 2 and cite PT1000 misreads (mostly Plus variants) and QC variance. Widely sold at about $89. Vendor flow claims disagree (45 vs 52). One user reported about 22–25 mm³/s on PETG with the UHF on the Bambu forum (not a controlled test). No Rapido 3 found.
- https://forum.vorondesign.com/threads/thinking-about-switching-from-revo-to-a-dragon-or-rapido
- https://red.bismuth.it/r/VORONDesign/comments/1g4bjq6/rapido_2_vs_dragon_which_would_you_choose (mirror, results only)
- https://www.goodprints3d.com/blogs/reviews/phaetus-dragon-hf-vs-rapido-2-uhf-which-voron-hotend-makes-more-sense-for-fast-abs-and-asa-printing (retailer blog, weak)
- https://www.3djake.com/phaetus/rapido-hotend-2-hf

**Rapido 2 Plus HF (Phaetus)**
Same body as the Rapido 2 HF, with PT1000 and 350°C. The PT1000 misread complaints in recent threads attach mostly to this variant. About $10 more buys 60°C of headroom and no extra flow.
- https://www.3djake.com/phaetus/rapido-plus-hotend-2-hf
- https://west3d.com/products/rapido-hot-end-high-flow-tl-phaetus

**Rapido 2F (Phaetus)**
Fiber/abrasive-oriented revision of the Rapido 2: compact, light, 350°C, lower flow. No community threads or independent flow tests found. Listed above the faster HF and Plus HF.
- https://fabreeko.com/products/rapido-2f-fiber-hot-end-by-phaetus-pre-order (results only)
- https://www.onetwo3d.co.uk/product/phaetus-rapido-2f/

**Chimera (E3D)**
Dual-nozzle hotend, so it doesn't compare on flow. Known for fiddly nozzle-height alignment, ooze from the idle nozzle, and bulk for fast CoreXY. A MatterHackers listing shows the Chimera+ (1.75 mm, 12 V) under a discontinuation notice at $128.49. Dual extrusion has largely moved to toolchangers and multi-material units.
- https://www.matterhackers.com/store/l/e3d-chimera-liquid-cooled-dual-extrusion-hotend-175-12/sk/MZULTXFJ
- https://e3d-online.com/products/chimera

**Dragon ST (Phaetus)**
Standard-flow Dragon: V6-compatible, 500°C, about $56. Voron recommendations have drifted to Rapido and Revo. Forum-reported US availability complaints (unverified) and some clog reports, mainly on HF/CHT combos. No ST-specific threads found.
- https://forum.vorondesign.com/threads/thinking-about-switching-from-revo-to-a-dragon-or-rapido
- https://www.phaetus.com/products/dragon-hotend-st (rate-limited)

**HE20 (Takoto)**
Dual-cartridge, crash-proof large-format hotend with titanium mounts, 320°C claimed. Only vendor listings found: no independent review, no measured flow, no mm³/s on retailer pages.
- https://www.matterhackers.com/store/l/takoto-he20-hotend-bmg-m-mount/sk/MA1UYKDZ
- https://www.sliceengineering.com/blogs/news/understanding-hotend-flow-rate (context on why vendor flow numbers don't compare)

**Revo Voron (E3D)**
Strong reputation for cold nozzle changes, leak-free design and about 25 g on StealthBurner. One forum user found it matched the Rapido on quality once slicer limits were equalised. Complaints: lower ceiling, heat creep on the Micro variant, nozzle cost and lock-in. Threads sum it up as "Revo for easier nozzle changes, Rapido for higher flow". About $80.
- https://forum.vorondesign.com/threads/thinking-about-switching-from-revo-to-a-dragon-or-rapido
- https://e3d-online.com/pages/revo-support-volumetric-flow-rates
- https://www.filastruder.com/products/revo-voron-kit

**Lite6 (E3D)**
Budget PTFE-lined hotend capped at 240°C. Printed Solid lists it as "Budget Hot End Kit (EOL)" at a $19.90 sale price. Not relevant to Voron-class builds.
- https://www.printedsolid.com/products/lite6
- https://makezine.com/article/digital-fabrication/3d-printing-workshop/e3d-announces-lite6-a-low-cost-hot-end

**Copperhead (Slice Engineering)**
Slice's modular all-metal design. Slice claims 60% less heat across the heat break. Retailer reviews are mixed: fit problems with non-Copperhead heatsinks, a finicky install, some heat-creep and clog complaints, alongside users calling it a major upgrade. No Voron-specific push found.
- https://www.hackster.io/news/the-copperhead-hot-end-promises-to-eliminate-heat-creep-d129616d8e4e
- https://www.sliceengineering.com/blogs/news/understanding-hotend-flow-rate
- https://www.3djake.com/reviews/bondtech/copperhead-heat-break

**HeatCore 4 (Mellow 3D)**
No reviews or independent mentions found, and the 3D Mellow page was blocked. The record is a "UHF Lite + ALPS nozzle-leveling" kit, not a bare hotend. Price, type and reputation couldn't be confirmed.
- https://3dmellow.com/products/heatcore-4-uhf-lite-alps-smart-leveling-hotend-upgrade-replacement-parts-kit (blocked)

**Mosquito Conduct (Slice Engineering)**
Fan-free, conduction-cooled Mosquito for enclosed or heated-chamber printers, 500°C. No community discussion found. One snippet showed $179.99 against our $199.99.
- https://www.sliceengineering.com/en-ca/products/mosquito-conduct
- https://top3dshop.com/product/slice-engineering-mosquito-conduct-hotend

**Mosquito (Slice Engineering)**
Long-standing reference for build quality and reliability: 500°C, 37 g, easy nozzle swaps. Praised on the Duet and Voron forums for QC. Cons are price, proprietary parts, and clone parts disappointing buyers.
- https://www.sliceengineering.com/blogs/news/evolution-of-the-mosquito
- https://forum.duet3d.com/post/166058?page=3
- https://top3dshop.com/product/slice-engineering-mosquito-hotend

**V6 (E3D)**
The original all-metal design that defined the footprint, and still the compatibility baseline for nozzles and mounts. Several retailers mark V6 kits discontinued or on clearance (MatterHackers, DREMC). Its flow ceiling is below nearly everything else in the class. Prices seen were $34–76.
- https://www.matterhackers.com/store/printer-accessories/e3d-all-metal-v6-hotend-fully-assembled-3.00mm-bowden-12v
- https://store.dremc.com.au/products/e3d-v6-all-metal-hotend-1-75mm-24v-fully-assembled

**Mosquito Magnum (Slice Engineering)**
Same body as the Mosquito with higher flow; Slice lists 40. Praised for build quality and reliability. Cons are price and the proprietary ecosystem. Still current and widely sold.
- https://www.sliceengineering.com/products/mosquito-magnum-hotend
- https://forum.duet3d.com/post/166058?page=3
- https://www.3djake.com/slice-engineering/mosquito-magnum

**Dragon UHF (Phaetus)**
Ultra-high-flow Dragon: V6-compatible, 500°C. Reddit owners report about 25–30 mm³/s in practice. Many prefer the Rapido UHF for its ceramic heater over the Dragon's cartridge. Some clog reports on HF/CHT combos, plus US sourcing complaints.
- https://red.bismuth.it/r/VORONDesign/comments/1g4bjq6/rapido_2_vs_dragon_which_would_you_choose
- https://west3d.com/products/phaetus-dragon-uhf-hot-end
- https://www.3djake.com/phaetus/dragon-hotend-uhf

**NexG / neXt G (Phaetus)**
Dragon-footprint "extreme gradient" hotend with V6-style nozzles. Retailers write neXt G or neXtG, and 3DJake lists it under DropEffect at about $94. The red version uses a 104NT thermistor (280°C) and is described as limited for CF/GF. The 45 mm³/s claim needs the UHF nut adapter. One one-star review on 3DJake; nothing independent.
- https://spool3d.ca/phaetus-nextg-hotend/
- https://www.3djake.com/dropeffect/nextg-hotend
- https://west3d.com/products/phaetus-next-g-extreme-gradient-drop-effect-hotend-nexg

**Mosquito Liquid (Slice Engineering)**
Liquid-cooled Mosquito for heated chambers, 74 g, about $190. Little community discussion found.
- https://www.sliceengineering.com/en-ca/products/mosquito-liquid
- https://top3dshop.com/product/slice-engineering-mosquito-liquid-hotend

**neXt G Fiber (Phaetus)**
Black PT1000 variant with hardened nozzles and an RCC-coated heat break, 320°C, about $94–100. No independent reviews or flow data found. Parts don't interchange with the 104NT standard version.
- https://www.3djake.com/dropeffect/nextg-fiber-hotend
- https://west3d.com/products/phaetus-nextg-fiber-extreme-gradient-drop-effect-hotend-next-g-nexg
- https://www.fabreeko.com/products/dropeffect-next-g-fiber-extreme-gradient-hotend-by-phaetus

### High

**Dragon HF (Phaetus)**
Has a heat-creep reputation on r/VORONDesign ("prone to heat creep and needs a lot of airflow"). One user moved from the Dragon HF to the Rapido 2 Plus UHF and reported no clogs. The 62.51 figure is Triangle Lab's conversion of "1560 mm/min", not a measurement, and Phaetus's own Dragon copy is more conservative. A UK retailer lists it at £68.90 inc. VAT. $54.37 looks like a sale price or one with the heater excluded.
- https://www.goodprints3d.com/blogs/reviews/phaetus-dragon-hf-vs-rapido-2-uhf-which-voron-hotend-makes-more-sense-for-fast-abs-and-asa-printing
- https://redlib.cypherpunktools.com/r/VORONDesign/comments/1iza3kr/dragon_hf_and_pla_nightmare (mirror)
- https://www.3djake.ch/de-CH/phaetus/dragon-high-flow-hotend
- https://www.matterhackers.com/store/l/phaetus-dragon-hotend/sk/M5Q37FLY

**Rapido 2 Plus UHF (Phaetus)**
Widely used on Voron builds. Longer melt zone and higher temperature than the plain UHF. Retail is about $100–105 (3DJake $102.47 ex VAT; West3D PT1000 variant $104.99). MatterHackers listings now show unavailable. 75 is Phaetus's claim; no independent measurement found.
- https://www.3djake.com/phaetus/rapido-plus-hotend-2-uhf
- https://forum.vorondesign.com/threads/thinking-about-switching-from-revo-to-a-dragon-or-rapido.242
- https://www.goodprints3d.com/blogs/reviews/best-high-flow-hotend-for-voron-and-faster-abs-asa-printing-why-the-phaetus-rapido-2-uhf-is-the-smartest-serious-upgrade

**Rapido 2 UHF (Phaetus)**
The standard recommendation in r/VORONDesign Rapido-vs-Dragon threads, with low heat-creep reports. MatterHackers started at $99 (listing now unavailable); 123-3D lists £93.50 inc. VAT. Not shown as discontinued. Rapido X and Rapido 2 Fiber are newer. No "Rapido 3" found.
- https://www.3djake.ch/en-CH/phaetus/rapido-hotend-uhf
- https://red.bismuth.it/r/VORONDesign/comments/1g4bjq6/rapido_2_vs_dragon_which_would_you_choose
- https://www.teamfdm.com/forums/topic/2680-voron-24-rapido-2-uhf-upgrade/

**Goliath Air (Mellow 3D)**
A VzBoT-team design manufactured by Mellow: 50 mm melt zone, 100 W heater, bi-material copper-zirconia heat break. The air version needs a fan duct and a 2510 fan, and ships without fans. Mellow lists 550°C, resellers 500°C. Used on VzBoT builds and West3D's Tri-Zero. No independent flow test found. Still sold, about $130.
- https://github.com/VzBoT3D/Goliath
- https://docs.vzbot.org/goliath
- https://west3d.com/products/goliath-hot-end-by-mellow-and-vzbot-air-or-water-cooled

**Tricorn Air (Tricorn)**
Open-source (GitHub), in long and short versions, with 3×40 W heaters on the long one. Fabreeko lists $199.99 and "from $179.99", and a community spreadsheet has $180. Fabreeko's page read as a preorder. No independent reviews or flow tests found.
- https://www.fabreeko.com/products/tricorn-high-flow-open-source-hotend
- https://github.com/tricornhotend/tricornhotend.com
- https://excit3d.shop/shop/tricorn-hotend

**Tricorn Conduction (Tricorn)**
The same hotend with plate cooling instead of a fan, with the same evidence gaps. It undercuts the Chube Conduction ($320) on the prices found.
- https://github.com/tricornhotend/tricornhotend.com
- https://www.fabreeko.com/products/tricorn-high-flow-open-source-hotend

**HE50 (Takoto)**
The HE20 with a melt zone three times longer, sold by Advanced 3D Printing and HartSmart. No review or flow test found. The "50" looks like ">50" rounded down. The HartSmart price may be for the bare BMG-M/LGX-mount version.
- https://advanced3dprinting.com/products/takoto-he50
- https://hartsmartproducts.com/collections/3d-printer-parts/products/takoto-he50-bmg-m-lgx-mount-bare

**Chube Compact (Luke's Lab)**
Smaller, lighter, V6-compatible Chube for weight-sensitive toolheads. One Printables user reported 64 mm³/s on the Compact (Extreme research pass). 3DO shows it as a preorder, so availability may be patchy.
- https://www.lukeslabonline.com/products/chube-compact
- https://www.fabreeko.com/products/chube-compact-high-performance-hotend-for-3d-printers
- https://www.printables.com/model/1420367-calamity-toolhead-chube-compact-integration-cpap

### Extreme

**Mosquito Prime Air / Liquid / Conduction / LGX ACE (Slice Engineering)**
Launched in 2023 at about $1,000 (All3DP: "Would you pay $1,000 for this hot end?"). A later Slice listing showed $1,631.99 for a 2.85 mm LGX ACE variant, so about $1,570 for 1.75 mm is plausible as the real price. Slice claims 116 mm³/s with PLA and 64 with TPU, from a 150 W dual-heater setup. No Reddit threads or independent tests found. Still sold and supported. The variants differ only on the cold side.
- https://all3dp.com/4/would-you-pay-one-thousand-dollars-for-this-hotend/
- https://www.fabbaloo.com/news/enhancing-3d-print-flow-rates-meet-the-mosquito-prime-by-slice-engineering
- https://3dprintingindustry.com/news/slice-engineering-mosquito-prime-hotend-targets-speed-and-reliability-in-3d-printing-222315/

**Chube Air / Chube Conduction (Luke's Lab)**
V6-compatible hotends with a long melt zone (42 or 52 mm). Air is 69 g; Conduction is 74 g and needs no fan. Luke's Lab copy gives no volumetric figures. West3D buyers call the flow "crazy for its size". No independent test of 80 or 120 found. One listing showed Conduction backordered.
- https://west3d.com/products/chube-hotend
- https://www.fabbaloo.com/news/chube-hot-ends-deliver-enhanced-heating-performance-for-v6-compatible-3d-printers
- https://www.fabreeko.com/products/chube-high-performance-hot-end-for-3d-printers

**Goliath Water (Mellow 3D)**
The same VzBoT/Mellow hot side as the Goliath Air, with a water block. Needs a pump and radiator or an AIO loop. The only user feedback found was one five-star German reseller review. No independent flow test. About $150, sold widely including on AliExpress.
- https://github.com/VzBoT3D/Goliath
- https://docs.vzbot.org/goliath
- https://www.dhm-online.com/en/vz-hotend/12855-goliath-water-hotend-hotend-for-liquid-cooled-vzbot.html

**Mosquito Magnum+ (Slice Engineering)**
Long-standing Slice part for large nozzles, widely stocked. Slice's support page rates the original Magnum at about 40 mm³/s. A search snippet quoted a revised Magnum+ maximum of 34 mm³/s at 220°C and 40 at 280°C with a 0.8 mm nozzle (not opened, unconfirmed). That is far below our 90. No community flow tests found.
- https://support.sliceengineering.com/portal/en/kb/articles/what-are-the-max-flow-rates-for-the-mosquito-mosquito-magnum
- https://www.sliceengineering.com/products/mosquito-magnum-plus
- https://www.sliceengineering.com/blogs/news/understanding-hotend-flow-rate

**DualVelo Air Lite (Mellow 3D)**
A combined large-format hotend and extruder. No reviews or flow tests found, and the Mellow page was blocked. The 100 figure is unverified for an integrated unit.
- https://3dmellow.com/products/mellow-dualvelo-air-lite-all-metal-hotend-extruder-for-large-format-3d-printers-%E2%80%94-high-speed-diy-3d-printing (blocked)

**CHC XL (Triangle Lab)**
Wear-resistant hotend with a ceramic heater, air- or water-cooled, about $84–90. "Ceramic" refers to the heating element. West3D markets it as "extreme high flow". No independent flow test found, so 100 is a manufacturer claim. 300°C is low for the class.
- https://west3d.com/products/chc-xl-extreme-high-flow-hot-end-wear-resistant-air-or-water-cooled
- https://shop.thevirtualfoundry.com/products/chc-xl-extreme-high-flow-hot-end-wear-resistant-air-or-water-cooled

**Rapido X (Phaetus)**
New high-flow Rapido with the "Liber" module, a 120 W heater, PT1000 and 360°C. In stock at 3DJake (about €74.58 ex VAT) and sold by Phaetus, West3D, OneTwo3D and DigMach. Retailers claim over 100 mm³/s, while another retailer quotes Phaetus at about 65 sustained. The mount is not compatible with Rapido/Rapido 2. One rating, no English reviews, no independent tests.
- https://www.3djake.com/phaetus/rapido-x-hotend
- https://west3d.com/products/phaetus-rapido-x-high-flow-hotend-with-liber-technology
- https://www.onetwo3d.co.uk/product/rapido-x-hotend-with-liber-high-flow-module/

### No class

**V9.2 (V9 Hotend)**
Niche direct-sale water-cooled hotend from a solo designer. v9hotend.com lists 550°C and $220, shows SOLD OUT, and says the V9 "is back" next to an undated "21 are available" line. No flow figure from any source, and no thread, video or review found. The page shows only "V9", so "V9.2" may be a revision label.
- https://www.v9hotend.com/

**XG (Phaetus)**
Launched in 2022 under the DropEffect sub-brand: 300°C, one-handed nozzle changes, ceramic ring heater. No flow figure found anywhere. Replacement parts are still stocked. The neXt G is the evident successor (Dragon-compatible, easier-to-service ceramic plate heater), but no source says the XG is discontinued.
- https://all3dp.com/4/phaetus-launches-new-xg-hot-end/
- https://west3d.com/products/phaetus-dropeffect-xg-hot-end-thermistor-replacement

**Dragon Ultra CF (BRS Engineering)**
BRS-branded Dragon variant with a ceramic composite heat break and PT1000, aimed at PA-CF. The BRS page was rate-limited, and nothing else was found under this name: no spec, review, thread or video.
- https://store.brs-engineering.com/en/products/brs-edition-dragon-ultra-cf (rate-limited)
- https://voron3d-wiki.pages.dev/printhead/hotends/phaetus-dragon (family context)

---

## Data problems noticed (not fixed)

**Flow figures**
1. **Dragon UHF.** Flow is 45 but the label says 70.5 mm³/s. No source for 70.5 was found, and owners report about 25–30 in practice.
2. **Dragon HF.** The 62.51 is Triangle Lab's conversion of 1560 mm/min, not a Phaetus figure. It puts the HF above the UHF (45), which is backwards. It probably belongs in Standard.
3. **Mosquito Magnum+.** 90 conflicts with Slice's own published figures (about 34–40, unconfirmed whether those are for the Magnum or the Magnum+). If Slice's figure holds, it belongs in Standard.
4. **Rapido X.** 103 is a peak claim; Phaetus is quoted at about 65 sustained. It may belong in High.
5. **Goliath Air (60) vs Goliath Water (100).** It's the same hot side with different cooling, so a 40-point gap that splits the family across classes needs a source. Max temp also conflicts (500 vs 550).
6. **Chube Air 80, Chube Conduction 120, CHC XL 100, DualVelo 100, Tricorn 70.** All are manufacturer or unsourced figures.
7. **Chube Compact (50).** One user reported 64.
8. **HE50 (50).** Probably a ">50" claim, at the class boundary.
9. **HE20 (30).** Unsourced.
10. **Revo Voron (14).** Looks low against E3D's published Revo flow tables (not opened).
11. **Missing flow:** V9.2, XG, Dragon Ultra CF. Dragon Ultra CF is also missing max temp.

**Prices**
12. **Rapido 2 UHF.** Listed at $129.43, above the Plus UHF ($109.20). Retail is about $99 vs about $100–105. This one drives the High Benchmark.
13. **Rapido 2F.** $104.96 is above its faster siblings (HF $89, Plus HF $99).
14. **V6.** $89.21 against $34–76 seen.
15. **Lite6.** $37.98 against a $19.90 EOL sale price.
16. **Mosquito Conduct.** $199.99 against $179.99 seen.
17. **Tricorn Air and Tricorn Conduction.** $230 against $180–210 seen.
18. **Dragon HF.** $54.37 may exclude the heater; not comparable to heater-included rivals.
19. **DualVelo Air Lite.** $276 in the price field, but the label says $129.
20. **neXt G and neXt G Fiber.** Both $99.99, which looks like a placeholder (about $94 seen).
21. **HeatCore 4.** No price.
22. **Mosquito Prime ×4.** $1,571.99 looks like the real list price (launched about $1,000; a 2.85 mm LGX ACE listing showed $1,631.99). Confirm on Slice.
23. **Dragon Ultra CF.** $239.53 is high for a Dragon-family part; recheck on BRS.

**Availability / discontinued**
24. **Lite6.** End-of-life at retailers.
25. **V6.** Kits marked discontinued or clearance at several retailers.
26. **Chimera.** The Chimera+ variant has a discontinuation notice at MatterHackers; E3D stock unconfirmed.
27. **XG.** Probably superseded by neXt G; unconfirmed.
28. **V9.2.** Sold out on the vendor page.
29. **Tricorn.** Fabreeko listing reads as a preorder.
30. **Chube Compact.** Preorder at 3DO.
31. **Chube Conduction.** Backordered at one retailer.
32. **Rapido 2 UHF and Plus UHF.** MatterHackers listings show unavailable.

**Names, duplicates, category**
33. **NexG.** Retailers and Phaetus write "neXt G" (DropEffect brand). The record name doesn't match its own sibling "neXt G Fiber".
34. **Tricorn Air and Tricorn Conduction.** One product in two rows, with different stored verdicts (Workhorse vs Bleeding Edge).
35. **Mosquito Prime.** Four rows that differ only in the cold side.
36. **V9.2.** The vendor sells "V9"; the version suffix is unconfirmed.
37. **DualVelo Air Lite.** A hotend plus extruder unit, so arguably not a hotend record.
38. **HeatCore 4.** A kit with nozzle probing, not a bare hotend. Type field missing.
39. **Dragon Ultra CF.** Possibly a BRS-branded Phaetus part; check for overlap with the Dragon UHF.

**Vendor links**
40. **Mosquito.** The Fabreeko URL slug is `copy-of-slice-engineering-50w-heater-cartridge-24v`, almost certainly a heater cartridge page (fetch rate-limited, unconfirmed).
41. **Goliath Air and Goliath Water.** AliExpress and Alibaba links are weak vendor sources.
42. **HeatCore 4.** Fruugo link.

**Copy (labels and descriptions, which would be replaced anyway by the proposed labels)**
43. **Mosquito Prime Air.** The label says "The world's highest-flow hotend". That's a manufacturer claim, and our own data contradicts it: Chube Conduction is listed at 120.
44. **V6.** The label says "every other hotend is measured against", which is the Benchmark definition on a part proposed as Skip.
45. **Old-taxonomy and hype wording.** Rapido 2 HF ("proven workhorse"), Rapido 2 Plus UHF ("no-compromise"), Chube Air ("genuinely original", a banned hedge word), Goliath Air ("unmatched").
46. **V9.2.** The label is a price and a stock note ("$220 USD | currently sold out | water cooling required"), not a descriptor.
47. **DualVelo Air Lite.** The label states a price ($129) that conflicts with the price field.
48. **CHC XL.** The label says "ceramic"; the ceramic part is the heater.
49. **Goliath Air.** The label says "extreme-flow", but by our own number it's in the High class.
50. **Revo Voron.** The description copies E3D's first-person marketing ("the smallest heatsink we've produced"), which reads as Modern Makes claiming E3D's work.
