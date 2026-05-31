---
title: "PC"
material: "PC"
materialFull: "Polycarbonate"
verdict: "ENTHUSIAST"
verdictLabel: "Maximum heat resistance for advanced builders"
summary: "Polycarbonate has the highest heat resistance of any common desktop filament — 110–130°C depending on grade. It's impact tough, optically clear in natural form, and genuinely difficult to process. Requires 300°C+ hotend, sealed enclosure at 60–70°C chamber, and an all-metal hotend. Not for beginners."
publishedDate: "2026-05-31"
updatedDate: "2026-05-31"

stats:
  nozzleTemp: "290–320°C"
  bedTemp: "100–120°C"
  chamberTemp: "60–70°C required"
  coolingFan: "0–10%"
  maxSpeed: "50 mm/s"
  heatDeflection: "~115°C"
  difficulty: "Advanced"

brands:
  - name: "Polymaker PolyMax PC"
    tier: "TOP"
    price: "$44.99/kg"
    notes: "Most printable PC on the market. Lower warp than standard PC. First choice for builders new to polycarbonate."
    affiliate: true
  - name: "Prusament PC Blend"
    tier: "TOP"
    price: "$49.99/kg"
    notes: "PC/ABS blend — easier than pure PC, retains most heat resistance. Best for Prusa users."
    affiliate: true
  - name: "Polymaker PC-PBT"
    tier: "MID"
    price: "$54.99/kg"
    notes: "Better chemical resistance than standard PC. Harder to print but worth it for demanding environments."
    affiliate: true

compatibility:
  - printer: "Voron 2.4"
    rating: "EXCELLENT"
    notes: "Ideal platform. 300°C+ capable hotend required (Rapido UHF, Dragon HF). Chamber heater essential."
  - printer: "Bambu X1C"
    rating: "GOOD"
    notes: "Hardened nozzle + high-temp hotend variant. Chamber heats to ~45°C — marginal for pure PC. PC blends work better."
  - printer: "Voron Trident"
    rating: "EXCELLENT"
    notes: "Same as 2.4. Chamber heater required."
  - printer: "Prusa MK4"
    rating: "POOR"
    notes: "Open frame, no chamber. PC-ABS blends possible with enclosure mod. Pure PC not suitable."
  - printer: "Bambu A1 / A1 Mini"
    rating: "NOT RECOMMENDED"
    notes: "No enclosure. Not suitable for PC."

failureModes:
  - issue: "Warping / delamination"
    cause: "Cold chamber or insufficient bed temp"
    fix: "Chamber must reach 65°C before print starts. Bed at 110°C minimum. Garolite or PEI with glue stick. Large brim on any flat geometry."
  - issue: "Moisture issues (bubbling, rough surface)"
    cause: "PC absorbs moisture aggressively"
    fix: "Dry at 80°C for 8–12 hours. Print from active dryer. PC stored overnight can be unprintable."
  - issue: "Hotend jams"
    cause: "Hotend not rated for 300°C+"
    fix: "All-metal hotend required. PTFE-lined hotends will degrade at PC temperatures."
  - issue: "Poor layer bonding"
    cause: "Chamber too cold or printing too fast"
    fix: "Zero fan. Slow perimeter to 30mm/s. Increase overlap percentage."

pros:
  - "Highest heat resistance of common desktop filaments (~115°C)"
  - "Exceptional impact strength — extremely difficult to shatter"
  - "Optically clear in natural form"
  - "Chemical resistance to many solvents"
  - "Bonds with IPS cement for post-processing"

cons:
  - "Requires 300°C+ hotend and all-metal hotend"
  - "Enclosed chamber with active heating essential"
  - "Extreme moisture sensitivity"
  - "Significant warping without proper setup"
  - "Not beginner-friendly under any conditions"
---

Polycarbonate is the end of the road for heat resistance on a desktop printer. Nothing you can print on a standard CoreXY will survive higher sustained temperatures — 115°C before deflection, 130°C on some grades. If you're printing parts that live inside an enclosure, near electronics, or in any environment that would destroy PETG or ASA, PC is the answer.

The processing requirements are real. You need a hotend that can sustain 300–320°C without degrading — all-metal only, no PTFE lining. You need a chamber that actively heats to 65–70°C before the print starts, or you'll get delamination on tall parts. Bed adhesion requires either Garolite sheet or PEI with a thin layer of glue stick. Skip any of these and you'll spend a day watching parts warp and peel.

Moisture is the silent killer. PC absorbs water faster than nylon and produces far worse results — bubbling, rough surfaces, catastrophic layer failure. Dry every spool at 80°C for 8–12 hours before a print. Print from an active dryer. Never leave an open spool overnight in a humid environment. Do those things and PC is a reliable, repeatable material on the right machine.
