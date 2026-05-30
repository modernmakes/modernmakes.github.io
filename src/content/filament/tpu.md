---
title: "TPU"
material: "TPU"
materialFull: "Thermoplastic Polyurethane"
verdict: "ESSENTIAL"
verdictLabel: "The only flexible filament that matters"
summary: "TPU is the flexible material category. If you need something that bends, compresses, or absorbs impact, TPU is what you're printing. Comes in hardnesses from 85A (very flexible) to 98A (semi-rigid). Processing depends entirely on your machine — bowden setups range from difficult to impossible at soft TPU grades, while direct drive runs it reliably."
publishedDate: "2026-06-01"
updatedDate: "2026-06-01"

stats:
  nozzleTemp: "220–240°C"
  bedTemp: "30–60°C"
  chamberTemp: "None required"
  coolingFan: "30–50%"
  maxSpeed: "30–50 mm/s"
  heatDeflection: "N/A (flexible)"
  difficulty: "Intermediate"

brands:
  - name: "Bambu Lab TPU 95A"
    tier: "TOP"
    price: "$29.99/kg"
    notes: "AMS compatible — the only TPU to credibly claim this. Requires careful humidity management in AMS. Excellent for Bambu users who want flexible parts without a separate workflow."
    affiliate: true
  - name: "Polymaker PolyFlex TPU95"
    tier: "TOP"
    price: "$27.99/kg"
    notes: "Community favorite. 95A hardness is the best all-around. Prints reliably on direct drive without special tricks. Excellent diameter consistency."
    affiliate: true
  - name: "Ninjatek Armadillo (75D / ~95A)"
    tier: "TOP"
    price: "$49.99/kg"
    notes: "Semi-rigid with excellent abrasion resistance. Industrial-tier consistency. Best for mechanical parts that need some flex but not full rubber behavior. Expensive but worth it for critical parts."
    affiliate: true
  - name: "Ninjatek Cheetah 95A"
    tier: "TOP"
    price: "$39.99/kg"
    notes: "High-speed TPU from Ninjatek. Prints faster than standard TPU. Justified for production volume."
    affiliate: true
  - name: "SUNLU TPU"
    tier: "MID"
    price: "$16.99/kg"
    notes: "Works on direct drive at slow speeds. More variable diameter than premium options. Good for non-critical flexible parts."
    affiliate: false
  - name: "Hatchbox TPU"
    tier: "MID"
    price: "$21.99/kg"
    notes: "Reliable, widely available. Runs at 230°C without issue on direct drive. Acceptable quality for most applications."
    affiliate: true

compatibility:
  - printer: "Bambu X1C / P1S"
    rating: "EXCELLENT"
    notes: "AMS compatible with Bambu TPU specifically. Third-party TPU works in single-spool mode. Textured PEI plate. Use TPU profile."
  - printer: "Bambu A1 / A1 Mini"
    rating: "GOOD"
    notes: "AMS Lite compatible with 95A+ TPU. Softer grades (85A) will jam. Direct spool feed more reliable."
  - printer: "Voron 2.4"
    rating: "EXCELLENT"
    notes: "Direct drive extruder makes TPU easy. Clockwork or Orbiter recommended. Disable pressure advance for TPU."
  - printer: "Voron Trident"
    rating: "EXCELLENT"
    notes: "Same as 2.4."
  - printer: "RatRig V-Core 3"
    rating: "EXCELLENT"
    notes: "Direct drive. Disable pressure advance. Open enclosure door to prevent heat creep on long prints."
  - printer: "Prusa MK4"
    rating: "GOOD"
    notes: "Direct drive. Run at 25–30mm/s for 95A. 85A grades require extra care — reduce speed further and watch for coiling in extruder."

failureModes:
  - issue: "Coiling inside extruder / jams"
    cause: "Too fast, too much retraction, or printing bowden"
    fix: "Max 30mm/s for 95A. Zero or 0.5mm retraction only. Bowden setups: not recommended for 95A, essentially impossible for 85A. Direct drive strongly preferred."
  - issue: "Stringing"
    cause: "TPU strings easily — high temp + long travel"
    fix: "Lower temp to 220°C. Enable Wipe on retract. Minimize travel moves in slicer. Coasting helps on some setups."
  - issue: "Under-extrusion at perimeters"
    cause: "Extruder gears chewing through soft material"
    fix: "Reduce extruder tension slightly. Print slow. Dual-drive extruders (Orbiter, BMG) handle TPU better than single-drive."
  - issue: "Poor bed adhesion"
    cause: "TPU on smooth PEI can be tricky"
    fix: "Textured PEI is better. Clean with IPA. 50°C bed. Glue stick not required but helps on first print with a new surface."
  - issue: "Elephant's foot / spread"
    cause: "TPU flows at lower pressure — first layer squish is hard to control"
    fix: "Back off live Z offset compared to PLA. TPU compresses more. First layer should look slightly underfed compared to PLA targets."

pros:
  - "The only common flexible filament — nothing else provides rubber-like behavior"
  - "Excellent impact absorption — best material for bumpers, grips, pads"
  - "Chemical resistance — handles oils, mild solvents, abrasion"
  - "UV resistant compared to PLA"
  - "Variable hardness options — 85A to 98A covers most use cases"

cons:
  - "Slow — 30–50mm/s is the ceiling for most setups"
  - "Not bowden-compatible at soft grades"
  - "Strings aggressively — requires active management"
  - "Not stiff — cannot be used for structural parts under load"
  - "Poor bridging — flexible material sags more than rigid alternatives"
---

TPU is irreplaceable. If a part needs to flex, grip, absorb impact, or seal against something, TPU is the answer — there's no rigid-filament substitute. Phone cases, cable boots, gaskets, vibration dampeners, TPU flex couplings, gripper pads, protective bumpers — the use cases are everywhere.

The hardness number matters. 95A is the default — flexible enough for most uses, stiff enough to print without constant trouble. 85A prints like soft rubber and requires a very dialed direct-drive setup. 98A is almost rigid and processes more like PETG than rubber.

Disable pressure advance in Klipper when running TPU. The algorithm fights the material's natural compliance and causes under-extrusion artifacts. Same for input shaping — don't run it at TPU speeds.

Use it for: phone cases and grips, cable management and organizers, vibration dampening mounts, flexible hinges, gaskets, protective bumpers, conveyor belt parts, shoe insoles, prosthetic sockets.

Don't use it for: structural parts under tensile or compressive load, anything that needs to be rigid, bowden-drive printers with soft grades.
