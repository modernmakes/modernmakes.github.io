---
title: "Filament Drying: When You Need It and How to Do It Right"
category: "GUIDE"
date: 2026-05-12
readTime: "20 min read"
excerpt: "Wet filament causes stringing, bubbling, and weak layer adhesion. This guide covers which materials need drying, at what temperatures, and which dryers are worth buying."
difficulty: "Beginner"
timeRequired: "20 minutes to read — drying takes 4–12 hours"
tools:
  - "Filament dryer or food dehydrator"
  - "Airtight storage containers"
  - "Silica gel desiccant packets"
parts:
  - "Filament dryer (recommended: Sunlu S2, Bambu AMS dryer, or Creality Filament Dryer Pro)"
guideCategory: "Filament"
summary:
  - "Nylon, PA-CF, and TPU absorb moisture fastest — must be dried before printing"
  - "PLA and PETG degrade slowly — drying helps after prolonged exposure"
  - "ASA and ABS absorb moisture moderately — dry if stored in humid conditions"
  - "Standard drying temp: 45–65°C depending on material"
featured: false
---

<p class="art-lead">Wet filament isn't a minor inconvenience. It's a print-ruining condition. Moisture trapped in hygroscopic filament converts to steam inside the hotend, causing bubbling, hissing, random stringing, and weak layer adhesion that looks like underextrusion but doesn't respond to flow rate adjustments. The fix is straightforward. The mistake is not recognizing the problem until you've wasted hours of print time on it.</p>

## How Moisture Gets into Filament

Most common 3D printing filaments are made from hygroscopic polymers: materials that absorb water vapor from ambient air at the molecular level. This is not surface moisture that you can wipe off. The water bonds into the polymer chains themselves.

The rate of absorption depends on three factors: the material's inherent affinity for water, the relative humidity of the storage environment, and the exposure time. A spool of nylon left open at 60% relative humidity for 24 hours can absorb enough moisture to cause visible print problems. PLA at the same conditions might take two weeks to show obvious symptoms.

Once absorbed, moisture doesn't leave on its own at room temperature. You need elevated heat to drive it back out, which is what a filament dryer does.

## Which Materials Are Most at Risk

Not all filaments absorb moisture equally. Here's the practical ranking from most to least hygroscopic:

| Material | Absorption Rate | Drying Need |
|---|---|---|
| Nylon (PA6, PA12) | Very fast — hours | Essential before every print |
| PA-CF, PA-GF | Very fast | Essential before every print |
| TPU, TPE | Fast | Dry if stored >48h open |
| PVA (support) | Very fast | Keep in dryer during use |
| PETG | Moderate | Dry after weeks of open storage |
| ASA | Moderate | Dry if stored in humid conditions |
| ABS | Moderate | Dry if stored in humid conditions |
| PLA | Slow | Dry after months of open storage |
| PLA+ | Slow | Dry after months of open storage |
| PETG-CF | Moderate | Dry after weeks of open storage |

The symptoms get worse as humidity or exposure time increases. A spool that "prints fine" at moderate humidity can become unprintable in a week of high-humidity summer storage.

## Signs Your Filament Is Wet

The most obvious sign is audible: wet filament pops and crackles inside the hotend as the moisture flashes to steam. You'll hear a rapid series of small clicks or hisses during printing.

Visible signs in the print:

- **Random stringing** that doesn't respond to retraction tuning or temperature changes
- **Bubbling or foaming** on the surface of extruded lines
- **Inconsistent diameter** in the deposited bead — alternating thick and thin sections
- **Poor layer adhesion** — layers that peel apart with less force than expected
- **Brown or degraded appearance** in normally-clear or light-colored materials (nylon especially)

<div class="callout-tip">
<strong>Quick test:</strong> Extrude 10cm of filament manually into the air while watching closely. Dry filament extrudes smoothly with a clean, consistent surface. Wet filament will show bubbles, irregular diameter, or a rough surface texture. Listen for crackling as it comes out.
</div>

## Drying Temperatures and Times

The goal is to heat the filament above the boiling point of water (100°C) at the polymer surface level, but below the glass transition temperature of the material, which would cause the spool to deform or layers to fuse together.

| Material | Drying Temp | Minimum Time | Optimal Time |
|---|---|---|---|
| PLA | 45–50°C | 4 hours | 6 hours |
| PLA+ | 45–50°C | 4 hours | 6 hours |
| PETG | 55–65°C | 4 hours | 6 hours |
| ABS | 65–70°C | 4 hours | 6 hours |
| ASA | 65–70°C | 4 hours | 6 hours |
| TPU | 45–55°C | 6 hours | 8 hours |
| Nylon (PA6) | 70–80°C | 8 hours | 12 hours |
| PA-CF | 80–85°C | 8 hours | 12 hours |
| PVA | 45°C | 4 hours | 8 hours |

<div class="callout-warning">
<strong>Warning:</strong> Do not dry PLA above 50°C. Most PLA has a glass transition temperature around 55–60°C, and drying too hot will cause the spool layers to stick together, deforming the spool and potentially causing tangles. If your dryer runs hot, verify the actual temperature with a separate thermometer — dryer thermostats are often inaccurate.
</div>

## Choosing a Dryer

**Dedicated filament dryers** are the most convenient option. They hold one or two spools, maintain precise temperatures, and often allow printing directly from the dryer (keeping the filament warm and dry during a long print).

Recommended models in 2026:
- **Sunlu S2** — reliable thermostat, good build quality, fits most spool sizes, ~$35
- **Bambu Lab Filament Hub** — integrates with Bambu printers' AMS, excellent temperature control
- **Creality Filament Dryer Pro** — faster heat-up, better airflow, ~$45
- **ESUN eBOX** — older design but proven reliability, doubles as a storage solution

**Food dehydrators** are a popular DIY alternative. A basic 5-tray dehydrator at 50°C works well for PLA and PETG. The limitation is temperature accuracy: many food dehydrators run hotter than their thermostat indicates, which is problematic for PLA. Verify your dehydrator's actual temperature with a thermometer before using it.

**Kitchen ovens** can work but are generally impractical. Most home ovens are inaccurate at low temperatures and cycle significantly above and below their set point, risking spool damage. Use only if nothing else is available, and monitor closely.

## Drying Mid-Spool

You don't need to dry from a full spool. If you have 200g left on a spool that's been sitting open, you can dry what remains. The drying time is the same — moisture penetrates through the wound filament layers, and air circulation around the spool is more important than spool weight.

For best results:
1. Place the spool in the dryer with the filament path free (not tangled or wound too tight)
2. Ensure the dryer has airflow around the spool — not just radiant heat from below
3. If the spool is on a sealed bearing hub, loosen or remove the hub to allow airflow through the center

## Storing Filament After Drying

A dried spool reabsorbs moisture within hours in normal ambient air. Storage matters as much as drying.

The practical hierarchy:
1. **Vacuum-sealed bags with desiccant** — best option for long-term storage. Removes essentially all air and moisture.
2. **Airtight containers with desiccant** — very good for 3–6 month storage. Recharge the desiccant every few months.
3. **Zipper bags with desiccant** — reasonable for 1–4 week storage. Not truly airtight.
4. **Filament dryer on standby mode** — keeps filament continuously dry during extended print campaigns.

Use indicating silica gel desiccant (the kind that changes color when saturated). Blue indicates dry, pink indicates saturated. Recharge saturated silica gel by heating it at 150–200°C in an oven for 1–2 hours.

<div class="callout-tip">
<strong>Pro Tip:</strong> Label your sealed bags with the date they were sealed. A well-sealed bag with fresh desiccant is good for 12+ months. After that, dry and reseal.
</div>
