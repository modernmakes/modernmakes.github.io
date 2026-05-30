---
title: "PETG"
material: "PETG"
materialFull: "Polyethylene Terephthalate Glycol"
verdict: "RECOMMENDED"
verdictLabel: "The default step up from PLA"
summary: "PETG closes most of the gap between PLA's ease and ABS's toughness. Better heat resistance, better layer adhesion, prints on the same machines. The tradeoff is stringing and a tendency to absorb moisture faster than people expect."
publishedDate: "2026-06-01"
updatedDate: "2026-06-01"

stats:
  nozzleTemp: "230–250°C"
  bedTemp: "70–90°C"
  chamberTemp: "None required"
  coolingFan: "30–50%"
  maxSpeed: "120 mm/s"
  heatDeflection: "~80°C"
  difficulty: "Beginner"

brands:
  - name: "Bambu Lab PETG-HF"
    tier: "TOP"
    price: "$24.99/kg"
    notes: "Tuned for Bambu printers but runs well on anything. High-flow variant pushes past 200mm/s on a capable hotend. Consistent diameter."
    affiliate: true
  - name: "Prusament PETG"
    tier: "TOP"
    price: "$29.99/kg"
    notes: "Best-in-class consistency. Runs exactly at published settings. More colors than most. Worth the price on anything that matters."
    affiliate: true
  - name: "Polymaker PolyLite PETG"
    tier: "MID"
    price: "$19.99/kg"
    notes: "Reliable workhorse. Slightly more stringing than premium options. Fine for functional parts where appearance doesn't matter."
    affiliate: true
  - name: "Hatchbox PETG"
    tier: "MID"
    price: "$22.99/kg"
    notes: "Widely available, consistent, no surprises. Good default if you can't get Prusament. Diameter tolerance is adequate."
    affiliate: true
  - name: "SUNLU PETG"
    tier: "BUDGET"
    price: "$14.99/kg"
    notes: "Works but strings aggressively. Dry it before use without exception. Fine for throw-away prototypes."
    affiliate: false

compatibility:
  - printer: "Bambu X1C / P1S"
    rating: "EXCELLENT"
    notes: "AMS compatible. Use Generic PETG profile."
  - printer: "Bambu A1 / A1 Mini"
    rating: "EXCELLENT"
    notes: "AMS Lite compatible. Runs without enclosure fine."
  - printer: "Voron 2.4"
    rating: "EXCELLENT"
    notes: "Enclosed chamber — vent it or keep temps below 40°C ambient. PETG hates too much heat."
  - printer: "Voron Trident"
    rating: "EXCELLENT"
    notes: "Same as 2.4. Open door or crack enclosure slightly."
  - printer: "RatRig V-Core 3"
    rating: "EXCELLENT"
    notes: "Enclosed — same enclosure warning applies."
  - printer: "Prusa MK4"
    rating: "EXCELLENT"
    notes: "Has a dedicated PETG profile. Textured sheet recommended over smooth for release."
  - printer: "Bambu A1 Mini"
    rating: "GOOD"
    notes: "No enclosure helps with PETG. Good adhesion on textured PEI."

failureModes:
  - issue: "Stringing"
    cause: "Too high temp, too low retraction, or wet filament"
    fix: "Drop temp 5°C. Increase retraction 0.5mm at a time. Dry filament 65°C for 4–6 hours."
  - issue: "Bed adhesion failure"
    cause: "Wrong surface, contaminated PEI, or bed temp too low"
    fix: "Textured PEI sheet at 85°C. Clean with IPA before every print. Avoid smooth PEI — PETG bonds too aggressively and can pull chunks."
  - issue: "Layer delamination"
    cause: "Too much cooling or printing too fast"
    fix: "Reduce fan to 30%. Slow perimeters to 60mm/s. PETG needs heat to bond layers."
  - issue: "Zits and blobs"
    cause: "Pressure imbalance at seams"
    fix: "Enable Seam Painting in OrcaSlicer to hide seams. Tune pressure advance."
  - issue: "Poor overhang performance"
    cause: "PETG sags more than PLA at the same fan speed"
    fix: "Increase fan to 50% on overhangs specifically. Slow overhang speed to 30mm/s."

pros:
  - "Better heat resistance than PLA — functional up to ~80°C vs ~60°C"
  - "Excellent layer adhesion — nearly isotropic strength"
  - "Chemical resistance — handles mild acids, fuels, water"
  - "Flexible enough to avoid brittleness at thin walls"
  - "Food-safe when printed correctly (though layer gaps prevent sterilization)"

cons:
  - "Strings more than PLA — requires tuning"
  - "Absorbs moisture faster than PLA — store sealed"
  - "Bonds permanently to smooth PEI — use textured sheet only"
  - "Enclosed chambers can cause warping if ambient runs hot"
  - "Scratch resistance is poor compared to ABS or ASA"
---

PETG is the filament you reach for when PLA isn't tough enough but you don't want to deal with ABS. Better heat resistance, better impact strength, prints on the same machines with minimal changes. The catch: it strings, it sticks too aggressively to smooth surfaces, and it drinks moisture faster than PLA.

Get a textured PEI sheet if you don't have one. Keep retraction short — PETG doesn't like long pulls. And dry it before any print that matters. Do those three things and PETG is nearly as easy as PLA.

Use it for: tool holders, cable clips, brackets, anything in a car or garage, functional enclosures, parts that need to survive dishwashers.

Don't use it for: outdoor UV exposure (use ASA), high-temp applications above 80°C (use ABS or PA), or anything that needs to be very rigid and thin (use ASA or ABS).
