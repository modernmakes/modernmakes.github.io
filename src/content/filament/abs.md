---
title: "ABS"
material: "ABS"
materialFull: "Acrylonitrile Butadiene Styrene"
verdict: "SITUATIONAL"
verdictLabel: "Only when acetone smoothing or legacy compatibility demands it"
summary: "ABS built the FDM industry. It's machinable, acetone-weldable, and impact tough. It's also the most unforgiving filament you'll commonly run — warps aggressively, fumes significantly, and has been largely supplanted by ASA for new designs. Run it when you need acetone smoothing, legacy fitment, or ABS-specific post-processing. Otherwise, use ASA."
publishedDate: "2026-06-01"
updatedDate: "2026-06-01"

stats:
  nozzleTemp: "230–250°C"
  bedTemp: "100–110°C"
  chamberTemp: "45–55°C required"
  coolingFan: "0–10%"
  maxSpeed: "80 mm/s"
  heatDeflection: "~98°C"
  difficulty: "Intermediate"

brands:
  - name: "Polymaker PolyLite ABS"
    tier: "TOP"
    price: "$19.99/kg"
    notes: "Least warpy mainstream ABS. Low-warp formula makes a genuine difference. First choice if you must print ABS."
    affiliate: true
  - name: "Prusament ABS"
    tier: "TOP"
    price: "$28.99/kg"
    notes: "Consistent diameter, color-accurate, runs exactly at spec. Best for parts where tolerances matter."
    affiliate: true
  - name: "Bambu Lab ABS"
    tier: "MID"
    price: "$22.99/kg"
    notes: "AMS compatible. Works well on Bambu printers specifically. Less tested on third-party machines."
    affiliate: true
  - name: "SUNLU ABS"
    tier: "MID"
    price: "$14.99/kg"
    notes: "Works. Warps more than premium options. Dry before use. Acceptable for functional prototypes."
    affiliate: false
  - name: "Hatchbox ABS"
    tier: "MID"
    price: "$18.99/kg"
    notes: "Long-standing community standard. Reliable, not exceptional. Good for first ABS attempts."
    affiliate: true

compatibility:
  - printer: "Bambu X1C / P1S"
    rating: "EXCELLENT"
    notes: "AMS compatible. Enclosed chamber with active heating is ideal. Use ABS profile."
  - printer: "Voron 2.4"
    rating: "EXCELLENT"
    notes: "Ideal platform for ABS. Nevermore filter strongly recommended. Target 50°C chamber."
  - printer: "Voron Trident"
    rating: "EXCELLENT"
    notes: "Same as 2.4. Slightly smaller chamber volume — heats up faster."
  - printer: "RatRig V-Core 3"
    rating: "GOOD"
    notes: "Enclosed — works well. Chamber heater required or print into pre-warmed chamber."
  - printer: "Bambu A1 / A1 Mini"
    rating: "NOT RECOMMENDED"
    notes: "No enclosure. Warping will ruin nearly every print. Do not attempt without enclosure mod."
  - printer: "Prusa MK4"
    rating: "NOT RECOMMENDED"
    notes: "Open-frame machine. Only possible with an aftermarket enclosure box and draft elimination."

failureModes:
  - issue: "Warping"
    cause: "Cold chamber, drafts, or large flat part footprints"
    fix: "Sealed enclosure at 50°C before print starts. Glue stick on smooth PEI or garolite sheet. Brim on flat parts. Eliminate any air movement."
  - issue: "Layer cracking / delamination"
    cause: "Printing too fast or chamber temp dropped during print"
    fix: "Slow perimeter speeds. Monitor chamber temp. Insulate the enclosure if it's losing heat."
  - issue: "Elephant's foot"
    cause: "First layer bed too hot or too much squish"
    fix: "Start bed at 105°C, drop to 100°C after layer 3. Calibrate Z precisely."
  - issue: "Fumes"
    cause: "Styrene off-gassing is inherent to ABS chemistry"
    fix: "Nevermore inside enclosure. HEPA exhaust to outside. Never print ABS in unventilated spaces. This is not optional."
  - issue: "Splitting at seams"
    cause: "Cold seam junction or too much retraction"
    fix: "Reduce retraction to 0.5mm. Seal seams with acetone. Increase perimeter overlap."

pros:
  - "Acetone welding and smoothing — unique capability among common filaments"
  - "High impact resistance — bounces rather than shatters"
  - "Heat resistant to ~98°C"
  - "Machinable — drills, taps, and sands cleanly"
  - "Legacy design compatibility — enormous community library of ABS-native designs"

cons:
  - "Warps aggressively — enclosed chamber is mandatory"
  - "Fumes — ventilation is not optional"
  - "UV degradation — not for outdoor use (use ASA instead)"
  - "Absorbed moisture shows as rough layers and popping"
  - "More dimensional variation than PETG or PLA at equivalent settings"
---

ABS has a narrower use case than it used to. ASA replaced it for outdoor work. PETG replaced it for functional parts that don't need acetone post-processing. What ABS still owns: acetone smoothing for watertight or cosmetic parts, acetone welding for joining printed sections, and the vast library of designs made before ASA became widely available.

If you're printing Voron parts, note that many spec ABS — the thermal properties are part of the design. Follow spec.

If you're designing new parts and ABS isn't specified, choose ASA instead. Better UV stability, less warping, functionally identical heat resistance.

Ventilation is not negotiable. Styrene is a probable carcinogen. A Nevermore filter inside the enclosure plus HEPA exhaust is the correct setup. Don't run ABS unattended in living spaces.
