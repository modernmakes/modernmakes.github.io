---
title: "ASA"
material: "ASA"
materialFull: "Acrylonitrile Styrene Acrylate"
verdict: "RECOMMENDED"
verdictLabel: "The outdoor-rated ABS replacement"
summary: "ASA is what ABS should have been. Same heat resistance, better UV stability, less warping, cleaner surface finish. If you're printing anything that lives outside, ASA is the correct answer. It's not easy — you need an enclosure — but it's the most capable material you can run on a standard CoreXY."
publishedDate: "2026-06-01"
updatedDate: "2026-06-01"

stats:
  nozzleTemp: "240–260°C"
  bedTemp: "90–110°C"
  chamberTemp: "45–55°C recommended"
  coolingFan: "10–20% max"
  maxSpeed: "80 mm/s"
  heatDeflection: "~98°C"
  difficulty: "Intermediate"

brands:
  - name: "Polymaker PolyLite ASA"
    tier: "TOP"
    price: "$24.99/kg"
    notes: "Best mainstream ASA. Warps less than average, good UV resistance, wide color range. First choice for most applications."
    affiliate: true
  - name: "Prusament ASA"
    tier: "TOP"
    price: "$32.99/kg"
    notes: "Tight diameter tolerance. Runs exactly at spec. Premium price justified on structural parts where material consistency matters."
    affiliate: true
  - name: "Bambu Lab ASA"
    tier: "TOP"
    price: "$26.99/kg"
    notes: "AMS compatible with caveats — keep humidity below 30% in AMS for best results. Excellent finish quality."
    affiliate: true
  - name: "SUNLU ASA"
    tier: "MID"
    price: "$18.99/kg"
    notes: "More warping than premium options. Seal the enclosure completely. Functional parts only."
    affiliate: false
  - name: "Hatchbox ASA"
    tier: "MID"
    price: "$21.99/kg"
    notes: "Consistent but prone to warping on large flat parts. Use brim aggressively."
    affiliate: true

compatibility:
  - printer: "Bambu X1C / P1S"
    rating: "EXCELLENT"
    notes: "AMS compatible. Use ASA profile. Keep AMS door closed. Monitor humidity in AMS hub."
  - printer: "Voron 2.4"
    rating: "EXCELLENT"
    notes: "Enclosed chamber with heater is ideal. Target 50°C chamber before first layer."
  - printer: "Voron Trident"
    rating: "EXCELLENT"
    notes: "Same as 2.4. Nevermore filter recommended to manage styrene fumes."
  - printer: "RatRig V-Core 3"
    rating: "EXCELLENT"
    notes: "Full enclosure required. Pairs well with the V-Core's large bed for big ASA parts."
  - printer: "Bambu A1 / A1 Mini"
    rating: "POOR"
    notes: "No enclosure. Warping will ruin most prints larger than 50mm. Not recommended."
  - printer: "Prusa MK4"
    rating: "POOR"
    notes: "No enclosure means consistent warping. Possible with a DIY enclosure box. Stock machine is not suitable."

failureModes:
  - issue: "Warping / part lifting"
    cause: "Cold chamber, draft, or insufficient first layer adhesion"
    fix: "Enclosure required. Target 50°C chamber. Glue stick on smooth PEI. Eliminate all drafts. Use brim on any flat part over 40mm."
  - issue: "Layer splitting / delamination"
    cause: "Too much cooling fan or chamber too cold"
    fix: "Fan off or maximum 15%. Ensure chamber is up to temp before printing starts. Slow perimeter speeds."
  - issue: "Fumes / smell"
    cause: "Styrene off-gassing — characteristic ASA/ABS smell"
    fix: "Nevermore filter inside enclosure. HEPA exhaust. Print in ventilated space. Don't leave prints unattended in living areas."
  - issue: "Elephant's foot / first layer spread"
    cause: "Bed too hot or squish too aggressive"
    fix: "Drop bed to 90°C for first layer if using 100°C for prints. Calibrate Z offset precisely."
  - issue: "Surface cratering / rough texture"
    cause: "Wet filament"
    fix: "Dry at 65–70°C for 4–6 hours. ASA absorbs moisture and shows it in surface quality before it shows in print failures."

pros:
  - "UV stable — maintains color and strength after years of outdoor exposure"
  - "Heat resistant to ~98°C — safe in cars, outdoor fixtures, engine bays"
  - "Better surface finish than ABS straight off the printer"
  - "Can be acetone-smoothed like ABS"
  - "Less warping than ABS at equivalent settings"

cons:
  - "Enclosure required — no exceptions"
  - "Fumes — ventilation is not optional"
  - "Brittle compared to PETG and nylons"
  - "AMS/multi-material use is tricky — humidity sensitive"
  - "Slower than PLA/PETG — high temps demand deliberate speeds"
---

ASA is the correct material for anything living outside. UV stability that actually holds up, heat resistance that survives dashboards and window sills, and better surface quality than ABS right off the printer. The tradeoff is that it requires a sealed enclosure and produces fumes that demand ventilation.

The Nevermore filter is not optional if you're running a Voron or any enclosed machine with ASA regularly. Styrene off-gassing is real and the enclosed environment concentrates it.

Chamber temp matters more than people think. Get it to 45–50°C before the print starts, not during. Most warping failures trace back to printing into a cold chamber.

Use it for: outdoor brackets, garden tools, automotive parts, anything mounted in a car or truck, exterior-facing enclosures, signs and labels.

Don't use it for: flexible parts (use TPU), extreme heat above 100°C (use PA or PC), or anything where brittleness is a failure mode in impact scenarios.
