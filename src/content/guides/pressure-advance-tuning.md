---
title: "Pressure Advance Tuning — Reading the Test and Applying Your Value"
category: "GUIDE"
date: 2026-05-31
readTime: "12 min read"
excerpt: "How to read a pressure advance test pattern, identify the correct value, and apply it in Klipper, Marlin, or RepRapFirmware."
difficulty: "Intermediate"
timeRequired: "20 minutes"
tools:
  - "Modern Makes Pressure Advance Calibration Tool"
  - "Klipper console (Mainsail or Fluidd), or Marlin terminal"
parts: []
guideCategory: "Calibration"
summary:
  - "Pressure advance compensates for filament elasticity — fixing bulging corners and over-extrusion at direction changes"
  - "Generate a corner-test pattern using the PA calibration tool, then find the cleanest column"
  - "Apply your value in printer.cfg (Klipper), EEPROM (Marlin), or config.g (RRF)"
  - "Fine-tune with real parts — the test pattern is a starting point, not the final word"
featured: false
---

<p class="art-lead">Pressure advance is one of those calibrations that makes an immediate, visible difference. Before it: bulging corners, thick blobs at direction changes, lines that vary in width. After it: sharp corners, consistent extrusion, cleaner overhangs. This guide covers how to generate the test, read it correctly, and apply the result.</p>

## What is Pressure Advance?

Pressure advance (PA) — called Linear Advance in Marlin, and using the `M572` command in RepRapFirmware — compensates for the elasticity in your filament and hotend. When your printer accelerates, filament compresses slightly in the melt zone. When it decelerates, that pressure releases and over-extrudes. The result: bulging corners, thick lines at direction changes, and thin lines after corners.

PA works by applying a small amount of extra retraction before decelerations and extra extrusion before accelerations, counteracting the pressure buildup. The value that works for your specific hotend, filament, and temperature is your PA value.

## Generating the Test Pattern

Use the Modern Makes [Pressure Advance Calibration Tool](/tools/pressure-advance) to generate your test G-code. Configure your printer settings, set a PA range (start: 0, end: 0.08 for most direct-drive setups; start: 0, end: 0.8 for Bowden), and download the file.

**Print it directly** — do not slice it through your slicer. Load it directly in Mainsail, Fluidd, OctoPrint, or from SD card.

## Reading the Test Pattern

The test prints a series of corner patterns, left to right, each at a different PA value. Your display shows the current PA value during printing.

**What you're looking for:**

**Too low (PA undercompensated):**
- Corners bulge outward — a rounded blob where a sharp corner should be
- Lines are thicker at direction changes
- Overall: corners look like they have too much plastic

**Too high (PA overcompensated):**
- Corners have gaps or notches — pulled inward
- Lines thin out before corners
- Ringing or artifacts on the straight sections after corners
- Overall: corners look starved

**Correct:**
- Corners are sharp and consistent
- Line width is uniform through the straight sections and around the corner
- No bulging, no gaps

Find the column that looks cleanest. Count from the left: your PA value is `start + (column_index × increment)`. The index starts at 0 for the leftmost column.

## Applying Your Value

### Klipper

Add to your `printer.cfg` in the `[extruder]` section:

```ini
[extruder]
pressure_advance: 0.045
pressure_advance_smooth_time: 0.040
```

Reload config with `FIRMWARE_RESTART`. You can also set it live during a print for testing:

```
SET_PRESSURE_ADVANCE ADVANCE=0.045
```

### Marlin

Send via terminal:

```
M900 K0.045
M500
```

`M500` saves to EEPROM. To make it permanent, set `DEFAULT_LINEAR_ADVANCE_K` in `Configuration_adv.h` and reflash.

### RepRapFirmware

In your config.g or via console:

```
M572 D0 S0.045
```

Add to `config.g` to make permanent.

## Fine-Tuning

One test print gives you a starting point. Fine-tune by:

1. **Printing a single-walled cube or perimeter-only box** at your normal print speed with your chosen PA value applied
2. **Looking at corners** on a real part — they should be sharp with no bulging
3. **Adjusting in small increments** — ±0.005 for direct drive, ±0.05 for Bowden
4. **Retesting after filament changes** — PA is specific to filament type and temperature

## Common Mistakes

**Not printing fast enough:** PA only matters at speed. If your test is printed at 30mm/s, the corners will look fine at any value. Use your actual print speed.

**Wrong PA range for your setup:**
- Direct drive Klipper/Voron: 0–0.08 typical range
- Bowden Klipper: 0–0.8 typical range
- Marlin K factor: different scale than Klipper — test 0–2.0

**Testing with wet filament:** Moisture causes inconsistent extrusion that masks PA artifacts. Dry your filament first.

**Printing into a hot enclosure:** Heat affects flow consistency. Print at your normal operating temperature and conditions.

## PA Values by Setup (Starting Points)

These are community starting points; always verify with your own test:

| Setup | Typical PA Range |
|---|---|
| Voron 2.4 / Trident — direct drive | 0.03–0.06 |
| Bambu X1C / P1S | 0.01–0.04 |
| Prusa MK4 — direct drive | 0.04–0.07 |
| Ender 3 — stock Bowden | 0.4–0.8 |
| RatRig V-Core — direct drive | 0.03–0.06 |

Use the [Pressure Advance Calibration Tool](/tools/pressure-advance) to generate your test pattern.
