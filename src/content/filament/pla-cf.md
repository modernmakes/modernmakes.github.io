---
title: "PLA-CF"
material: "PLA-CF"
materialFull: "Carbon Fibre Reinforced PLA"
verdict: "RECOMMENDED"
verdictLabel: "Stiffest easy-to-print material"
summary: "PLA-CF combines PLA's ease of printing with dramatically improved stiffness and a premium matte finish. The carbon fibre reinforcement makes parts feel substantially more rigid. Trade-offs: abrasive (hardened nozzle required), matte only, and more brittle than unfilled PLA."
publishedDate: "2026-05-31"
updatedDate: "2026-05-31"

stats:
  nozzleTemp: "200–230°C"
  bedTemp: "25–60°C"
  chamberTemp: "None required"
  coolingFan: "100%"
  maxSpeed: "150 mm/s"
  heatDeflection: "~60°C"
  difficulty: "Beginner"

brands:
  - name: "Bambu Lab PLA-CF"
    tier: "TOP"
    price: "$29.99/kg"
    notes: "Most accessible PLA-CF. AMS compatible with hardened nozzle. Consistent diameter, excellent surface finish."
    affiliate: true
  - name: "PolyMaker PolyMax PLA-CF"
    tier: "TOP"
    price: "$34.99/kg"
    notes: "Best stiffness in category. Tight diameter tolerance. First choice for structural PLA-CF parts."
    affiliate: true
  - name: "Prusament PLA Carbon Fibre"
    tier: "MID"
    price: "$29.99/kg"
    notes: "Prusa quality consistency. Slightly less CF loading than Polymaker but prints more easily."
    affiliate: true

compatibility:
  - printer: "Bambu X1C / P1S"
    rating: "EXCELLENT"
    notes: "AMS compatible with hardened nozzle installed. Use PLA-CF profile."
  - printer: "Voron 2.4"
    rating: "EXCELLENT"
    notes: "Hardened nozzle required. Open enclosure. Same setup as standard PLA."
  - printer: "Prusa MK4"
    rating: "EXCELLENT"
    notes: "Upgrade to hardened nozzle first. Otherwise identical settings to PLA."
  - printer: "Bambu A1 / A1 Mini"
    rating: "GOOD"
    notes: "AMS Lite compatible with hardened nozzle. Works well on smaller parts."

failureModes:
  - issue: "Nozzle wear"
    cause: "CF particles are highly abrasive on brass nozzles"
    fix: "Hardened steel nozzle mandatory. Replace brass after even a partial spool of CF material."
  - issue: "Poor layer adhesion"
    cause: "CF particles reduce inter-layer bonding vs unfilled PLA"
    fix: "Slow perimeter speeds. Reduce fan slightly to 80%. Increase temperature 5–10°C above standard PLA."
  - issue: "Brittle at thin walls"
    cause: "CF improves stiffness but reduces impact resistance vs unfilled PLA"
    fix: "Increase wall count to minimum 3. Avoid thin snap-fit features — use PETG for those."

pros:
  - "Dramatically stiffer than unfilled PLA at same weight"
  - "Premium matte finish straight off the printer"
  - "Easy to print — same settings as standard PLA"
  - "No enclosure required"
  - "Great for technical/functional aesthetic parts"

cons:
  - "Hardened nozzle mandatory — no exceptions"
  - "More brittle than unfilled PLA"
  - "Matte finish only — no glossy option"
  - "More expensive than standard PLA"
  - "Same heat resistance as PLA — still fails above 60°C"
---

PLA-CF is what you reach for when standard PLA feels plasticky and you want something that holds its shape under load and looks the part. The short carbon fibre strands mixed into the PLA matrix significantly increase stiffness — not strength in the impact-resistance sense, but rigidity. Parts deflect less. Tolerances hold better. The surface comes out looking like brushed carbon, matte and premium.

The setup requirements are minimal. No enclosure. No chamber heater. Print temperatures are the same as standard PLA or a few degrees higher. The only non-negotiable is the nozzle: brass won't survive CF materials, full stop. Fit a hardened steel nozzle before you load the first metre.

Use it for: tool handles, duct brackets, camera mounts, anything where you'd normally reach for PLA but want it stiffer and better-looking. Don't use it for: snap fits, living hinges, or any part that needs to flex — the CF makes it brittle. Don't use it for anything above 60°C — it's still PLA under the hood.
