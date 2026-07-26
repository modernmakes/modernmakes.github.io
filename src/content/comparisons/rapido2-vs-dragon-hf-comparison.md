---
title: "Phaetus Rapido 2 UHF vs Dragon HF: Which High-Flow Hotend Should You Build With?"
category: "COMPARISON"
date: 2026-05-20
readTime: "9 min read"
excerpt: "Both hotends carry the Phaetus name but they target completely different build goals. Here's the full breakdown of flow rates, quality, value, and which one belongs in your next build."
featured: false
summary:
  - "Rapido 2 UHF achieves 60 mm³/s — nearly double the Dragon HF"
  - "Dragon HF costs ~$30 less and is significantly lighter"
  - "Both reach 500°C with the right thermistor"
  - "Rapido 2 UHF is the clear winner for speed builds at 150mm/s+"
  - "Dragon HF is the better value for standard-speed CoreXY builds"
items:
  - "Rapido 2 UHF"
  - "Dragon HF"
verdict: "Rapido 2 UHF"
verdictText: "The Rapido 2 UHF wins on every flow-related metric, making it the clear choice for high-speed CoreXY printers running 150mm/s or faster. The Dragon HF is not a bad hotend — it is lighter, cheaper, and simpler to source — but it cannot match the UHF's thermal mass. If flow rate is your primary constraint, the Rapido 2 UHF is worth every dollar of the price difference."
specs:
  - label: "Max Flow Rate"
    key: true
    a: "60 mm³/s"
    b: "35 mm³/s"
    winner: "a"
  - label: "Max Temperature"
    key: true
    a: "500°C"
    b: "500°C"
    winner: "draw"
  - label: "Heater Block Style"
    a: "Volcano (UHF)"
    b: "Standard V6"
  - label: "Heater Wattage"
    a: "60W"
    b: "40W"
    winner: "a"
  - label: "Heat Break"
    a: "Bi-metal (Ti/Cu alloy)"
    b: "Titanium alloy"
  - label: "Nozzle Thread"
    a: "M6 Volcano"
    b: "M6 standard"
  - label: "Weight (with fan)"
    a: "62g"
    b: "34g"
    winner: "b"
  - label: "Price (USD, approx)"
    a: "~$89"
    b: "~$59"
    winner: "b"
  - label: "Phaetus Part Number"
    a: "RA2-UHF"
    b: "DR-HF"
scores:
  - category: "Flow Performance"
    a: 9.5
    b: 7.0
  - category: "Build Quality"
    a: 8.5
    b: 8.5
  - category: "Value for Money"
    a: 7.0
    b: 9.0
  - category: "Ease of Installation"
    a: 7.5
    b: 8.5
  - category: "High-Temp Stability"
    a: 9.0
    b: 8.5
  - category: "Parts Availability"
    a: 8.0
    b: 8.5
---

<p class="art-lead">Phaetus builds both of these hotends, which makes this an unusual comparison: you're not choosing between brands but between a company's two distinct product philosophies. The Dragon HF is a refined standard-format hotend. The Rapido 2 UHF is a dedicated high-speed machine built around an extended melt zone that simply does not exist in standard-format designs.</p>

## Why These Two?

The Dragon HF and Rapido 2 UHF sit at an interesting price crossover in 2026. Both are Phaetus products, both ship to US and Canadian customers without painful import delays, and both are commonly specified in Voron 2.4 and Trident BOM variants. The difference is that they serve different printers, or more precisely, different *speeds*.

If you're building a Voron 2.4 and plan to print at 100mm/s or under, the Dragon HF does everything you need at a meaningfully lower price. If you're targeting 200mm/s+ with 0.4mm nozzles, only the Rapido 2 UHF will keep up with your motion system.

## Flow Rate: The Core Difference

The number that defines this comparison is 60 versus 35 mm³/s. At those values, the Rapido 2 UHF delivers 71% more melt capacity than the Dragon HF. In practice, this means:

- With a 0.4mm nozzle at 0.2mm layer height and 0.45mm line width, **60 mm³/s supports print speeds of roughly 370mm/s** before the hotend becomes the bottleneck.
- The Dragon HF at 35 mm³/s caps out around **215mm/s** under the same conditions.

For context, most tuned Voron 2.4 builds run between 200–300mm/s on perimeters with input shaping. The Dragon HF is adequate for many of those builds. The Rapido 2 UHF has headroom to spare.

The Rapido 2 achieves this through a combination of the Volcano-style UHF heater block (roughly 2× the melt zone length of a standard V6 block) and the 60W heater cartridge. The Dragon HF uses a standard V6 block with a 40W heater. At identical temperatures, the larger melt zone keeps more filament in a molten, ready-to-extrude state.

## Build Quality and Materials

<div class="callout-note" style="margin: 24px 0; padding: 16px 20px; background: var(--surface); border: 1.5px solid var(--border); border-left: 4px solid var(--g2); border-radius: var(--radius-md);">
<strong>Note:</strong> Both hotends are manufactured by Phaetus in Shenzhen under the same quality standards. The material differences between them are intentional design choices, not quality shortcuts.
</div>

The Dragon HF uses a titanium alloy heat break that provides good thermal separation and survives the occasional over-temperature event. The Rapido 2 UHF uses a bi-metal heat break — titanium near the cold end, copper alloy near the hot end — which improves heat transfer into the melt zone for better flow performance at the cost of slightly reduced thermal break efficiency.

In day-to-day printing, both are reliable. Neither is prone to heat creep at rated conditions. The Rapido 2's bi-metal heat break is more forgiving when printing at the top of its temperature range because it manages heat distribution more actively.

Both hotends use machined brass heater blocks with stainless steel set screws. Assembly quality on recent production runs of both is consistent.

## Temperature Capability

Both hotends are rated to 500°C with a compatible high-temperature thermistor. In stock configuration with a standard NTC thermistor, both are effectively limited to 300°C. For engineering filaments — specifically high-temp nylons, PEEK, and PEI — you need to swap in a PT100 or PT1000 thermistor on either hotend.

At 300°C and below, both hotends are straightforward to use and do not require special tuning beyond standard PID calibration.

## Weight and Toolhead Balance

The weight difference matters more than the numbers suggest. The Rapido 2 UHF at 62g versus the Dragon HF at 34g is a 28g difference, all of which sits at the far end of your cantilevered toolhead. On a Stealthburner toolhead running NEMA17 motors, this affects your achievable ringing frequency. Input shaper measurements on a Voron 2.4 with a Stealthburner show the UHF configuration resonating approximately 5–8 Hz lower than the Dragon HF configuration at identical belt tensions. This is correctable with input shaper and does not meaningfully limit print quality, but it is a real physical difference.

If you are already weight-conscious about your toolhead — for example, running an LGX Lite or Orbiter 2 to save mass on the extruder side — factoring in the hotend weight is worth doing before committing to the UHF.

## Value and Availability

The Dragon HF at roughly $59 USD versus the Rapido 2 UHF at $89 USD is a $30 difference. For a single build, this is not a significant budget consideration. For a printer farm or a multi-extruder setup, it adds up.

Both are readily available from West3D, Printed Solid, and Fabreeko in the US. Canadian builders can source both from Printed Solid (which ships to Canada) or through Triangle Lab's AliExpress store, which stocks Phaetus products and typically delivers in 2–3 weeks.

Nozzle ecosystem is worth considering: the Dragon HF uses standard M6 V6-thread nozzles, which are among the most widely available nozzle formats on the market. The Rapido 2 UHF requires Volcano-thread M6 nozzles — also widely available and compatible with the Slice Engineering Vanadium, E3D Volcano, and Phaetus' own UHF nozzles, but a narrower selection than V6-thread.

## When to Choose Each

**Choose the Rapido 2 UHF if:**
- Your target print speed exceeds 180mm/s on perimeters
- You're running a Voron 2.4, Trident, or RatRig V-Core 4 with a well-tuned motion system
- You're planning to run 0.6mm or 0.8mm nozzles for draft/functional printing
- Maximizing throughput on infill at 300+mm/s matters to you

**Choose the Dragon HF if:**
- Your build targets 100–160mm/s and you want to leave headroom without paying for UHF capacity you won't use
- Toolhead weight is a priority (lighter toolhead = higher resonant frequency = better input shaper results)
- You're building on a tighter budget and the $30 difference matters
- You prefer the wider V6 nozzle ecosystem
