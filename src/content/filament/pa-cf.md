---
title: "PA-CF"
material: "PA-CF"
materialFull: "Carbon Fibre Reinforced Nylon (Polyamide)"
verdict: "ENTHUSIAST"
verdictLabel: "For structural parts that need to be as light as possible"
summary: "PA-CF is what you reach for when PETG or ASA isn't stiff enough and weight matters. The carbon fibre reinforcement dramatically improves rigidity and lowers weight-to-strength ratio. The tradeoff: it eats brass nozzles, requires a hardened steel hotend, and is among the most moisture-sensitive materials you'll run. High effort, high reward."
publishedDate: "2026-06-01"
updatedDate: "2026-06-01"

stats:
  nozzleTemp: "260–280°C"
  bedTemp: "70–90°C"
  chamberTemp: "50–60°C recommended"
  coolingFan: "20–40%"
  maxSpeed: "60 mm/s"
  heatDeflection: "~180°C"
  difficulty: "Advanced"

brands:
  - name: "Bambu Lab PA-CF"
    tier: "TOP"
    price: "$39.99/kg"
    notes: "Most beginner-accessible PA-CF. Tuned profiles for X1C. AMS Lite compatible (not standard AMS). Best starting point for Bambu users."
    affiliate: true
  - name: "Polymaker PA6-CF"
    tier: "TOP"
    price: "$44.99/kg"
    notes: "PA6 base runs at lower temps than PA12, easier to process. Excellent rigidity. Consistent diameter. Community-validated settings widely available."
    affiliate: true
  - name: "Prusament PA11 CF"
    tier: "TOP"
    price: "$59.99/kg"
    notes: "PA11 bio-based — less moisture absorption than PA6 or PA12. Most forgiving nylon base. Expensive but justified for demanding applications."
    affiliate: true
  - name: "Fiberon PA-CF"
    tier: "MID"
    price: "$34.99/kg"
    notes: "Solid value. Less consistent than premium options. Good for prototyping before running expensive material."
    affiliate: false
  - name: "SUNLU PA-CF"
    tier: "BUDGET"
    price: "$24.99/kg"
    notes: "Functional but moisture management is critical. Diameter inconsistency occasionally causes clogs. Acceptable for non-critical parts."
    affiliate: false

compatibility:
  - printer: "Bambu X1C"
    rating: "EXCELLENT"
    notes: "Hardened nozzle pre-installed. AMS Lite compatible (not standard AMS — CF particles jam the hub). Best Bambu platform for PA-CF."
  - printer: "Bambu P1S"
    rating: "EXCELLENT"
    notes: "Same as X1C. P1S enclosed chamber is critical for PA-CF."
  - printer: "Voron 2.4"
    rating: "EXCELLENT"
    notes: "Hardened steel nozzle required — Tungsten Carbide or Bondtech CHT in hardened steel. Nevermore filter recommended."
  - printer: "Voron Trident"
    rating: "EXCELLENT"
    notes: "Same as 2.4."
  - printer: "RatRig V-Core 3"
    rating: "EXCELLENT"
    notes: "Enclosed with chamber heat. Hardened nozzle required."
  - printer: "Bambu A1 / A1 Mini"
    rating: "POOR"
    notes: "No enclosure. PA-CF will warp without a sealed hot chamber. Not recommended."
  - printer: "Prusa MK4"
    rating: "POOR"
    notes: "Open frame. Hardened nozzle upgrade available but warping without enclosure makes PA-CF impractical."

failureModes:
  - issue: "Nozzle wear / clogging"
    cause: "Running CF through a brass nozzle"
    fix: "Hardened steel nozzle is mandatory. Replace after every ~500g through non-hardened nozzles if you've already run it through one. CF is abrasive — no exceptions."
  - issue: "Moisture-related failures (popping, bubbling, rough layers)"
    cause: "PA absorbs moisture faster and more aggressively than any common filament"
    fix: "Dry at 70–80°C for 8–12 hours before use. Print from a dry box or active dryer. PA-CF stored open overnight can be unprintable by morning."
  - issue: "Warping"
    cause: "Nylon base has significant shrinkage"
    fix: "Enclosed chamber at 55°C minimum. Garolite (FR4) bed surface is the best adhesion surface for PA-CF. PEI requires glue stick. Large brim on any part with flat geometry."
  - issue: "Layer delamination"
    cause: "CF particles reduce inter-layer bonding vs unfilled nylon"
    fix: "Slow perimeter speeds. Increase layer overlap. Avoid fan on structural walls."
  - issue: "Under-extrusion at speed"
    cause: "PA-CF requires more melt time than PLA — high speeds at stock flow rates cause gaps"
    fix: "Tune max volumetric flow specifically for your hotend. PA-CF flow typically caps 20–30% below equivalent PLA speeds."

pros:
  - "Exceptional stiffness-to-weight ratio — significantly stiffer than PETG at same weight"
  - "Heat resistant to ~180°C — survives environments that would destroy PETG and ABS"
  - "Excellent fatigue resistance — holds up under repeated stress cycles"
  - "Low-friction surface — self-lubricating properties for mechanical parts"
  - "Matte, technical surface finish — looks premium straight off the printer"

cons:
  - "Hardened nozzle mandatory — abrasive CF will destroy brass in a single spool"
  - "Extreme moisture sensitivity — must be printed from an active dryer"
  - "Enclosure required — nylon base warps in open-air conditions"
  - "Expensive — 2–3× cost of PLA or PETG"
  - "Brittle compared to unfilled nylon — CF improves stiffness but reduces impact resistance"
---

PA-CF is a genuinely impressive material when processed correctly. Parts that feel close to injection-molded nylon, dramatically lighter than equivalent PETG parts, with heat resistance that makes ABS look modest. The engineering tradeoffs are significant but they're all manageable with the right setup.

The non-negotiables: hardened steel nozzle, active drying, enclosed chamber. Everything else is tuning.

The CF in PA-CF trades some of nylon's inherent flexibility for stiffness. Pure PA12 or PA11 is more impact-resistant. PA-CF is stiffer. For brackets, tool holders, and load-bearing structural parts that need to be lightweight, PA-CF is the right call. For parts that need to flex and survive drops, consider unfilled PA12 instead.

Use it for: drone frames and mounts, automotive structural brackets, tooling fixtures, anything where PLA or PETG flex too much under load, robotics structural components.

Don't use it for: parts that need to survive impact (use unfilled nylon), flexible parts (use TPU), parts where surface finish is critical (CF gives matte only), anything where brass nozzle output is unavoidable.
