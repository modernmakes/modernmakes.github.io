---
title: "TPE"
material: "TPE"
materialFull: "Thermoplastic Elastomer"
verdict: "SITUATIONAL"
verdictLabel: "Softer and more rubber-like than TPU"
summary: "TPE is softer and more elastic than TPU — think 85A and below. It's closer to rubber than plastic. Use it for grips, gaskets, and vibration dampeners where TPU is too stiff. Requires direct drive and very slow speeds. Not for beginners."
publishedDate: "2026-05-31"
updatedDate: "2026-05-31"

stats:
  nozzleTemp: "210–230°C"
  bedTemp: "30–50°C"
  chamberTemp: "None required"
  coolingFan: "20–40%"
  maxSpeed: "20 mm/s"
  heatDeflection: "N/A (flexible)"
  difficulty: "Advanced"

brands:
  - name: "Ninjatek Eel (90A)"
    tier: "TOP"
    price: "$44.99/kg"
    notes: "Most printable TPE. 90A hardness — very flexible but not quite rubber. Ninjatek quality consistency is excellent."
    affiliate: true
  - name: "Recreus FilaFlex 82A"
    tier: "TOP"
    price: "$49.99/kg"
    notes: "82A — genuinely rubber-like. Spanish manufacturer, excellent quality. Best for gaskets and grips."
    affiliate: true
  - name: "SUNLU TPE"
    tier: "MID"
    price: "$18.99/kg"
    notes: "Works at very slow speeds. Quality inconsistent. Fine for non-critical decorative parts."
    affiliate: false

compatibility:
  - printer: "Voron 2.4"
    rating: "EXCELLENT"
    notes: "Direct drive. Clockwork or Orbiter extruder. Very slow speeds. Disable pressure advance."
  - printer: "Bambu X1C / P1S"
    rating: "GOOD"
    notes: "Works but AMS not recommended for soft TPE. Direct spool feed only."
  - printer: "Prusa MK4"
    rating: "GOOD"
    notes: "Direct drive handles TPE well at 20mm/s."
  - printer: "Ender 3 (Bowden)"
    rating: "NOT RECOMMENDED"
    notes: "Bowden tube makes soft TPE essentially impossible to print reliably."

failureModes:
  - issue: "Coiling in extruder"
    cause: "Any speed above 25mm/s or bowden setup"
    fix: "Max 20mm/s absolute. Direct drive only. Zero retraction or minimal 0.5mm. TPE is less forgiving than TPU."
  - issue: "Stringing"
    cause: "TPE strings aggressively at normal temperatures"
    fix: "Minimise travel moves. Enable wipe on retract. Lower temp to 215°C."
  - issue: "Inconsistent extrusion"
    cause: "Extruder grip pressure too high — soft material deforms under the hobbed gear"
    fix: "Reduce extruder idler tension. Dual-drive extruders (Orbiter, Sherpa) handle TPE better than single-drive."

pros:
  - "More rubber-like than TPU — better for true gaskets and seals"
  - "Excellent grip and vibration damping characteristics"
  - "Good UV and mild chemical resistance"
  - "Bonds well to many substrates and over-moulded parts"

cons:
  - "Direct drive only — no bowden setup will work reliably"
  - "Very slow — 20mm/s hard ceiling"
  - "More difficult to print than TPU"
  - "Limited brand options compared to the TPU market"
  - "Not suitable for any structural purpose"
---

TPE is the material you reach for when TPU is still too stiff. Where 95A TPU feels springy and firm, 82–90A TPE is genuinely soft and rubber-like. The applications are specific: tool grips that conform to hand pressure, vibration dampening feet under heavy equipment, gaskets that need to compress and seal. For those uses, nothing else gets as close to real rubber while still being printable.

The difficulty level is real. TPE is far less forgiving than TPU. It requires direct drive — no bowden printer will feed it reliably. Speed must stay at or below 20mm/s or the material coils and jams before it reaches the nozzle. Zero retraction or near-zero, because pulling back on TPE just causes it to fold inside the extruder. Pressure advance must be disabled entirely.

If you've printed TPU successfully before, TPE is the next logical step for softer applications. If you haven't printed flexible materials before, start with 95A TPU to understand the process, then work down in hardness once you're confident in your setup. The softer you go, the less margin for error.
