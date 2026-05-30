---
title: "How to Tune Pressure Advance on a Voron Printer"
category: "GUIDE"
date: 2026-05-10
readTime: "45 min read"
excerpt: "Pressure advance corrects for the lag between your extruder motor and the actual filament deposition at the nozzle. This guide walks through the Klipper calibration workflow from scratch."
featured: false
difficulty: "Intermediate"
timeRequired: "45 minutes"
summary:
  - "PA corrects extruder pressure lag — not the same as linear advance in Marlin"
  - "Start with a tower or pattern print, not a guess"
  - "Values differ per filament — save profiles, don't use one PA for everything"
  - "0.04–0.07 is typical for PLA on a CoreXY with a Bowden-free toolhead"
  - "Too high a PA value causes skipped steps and grinding at corners"
tools:
  - "SSH terminal or Klipper web UI (Mainsail or Fluidd)"
  - "Text editor for printer.cfg"
  - "Calipers (optional, for measuring slicer line width)"
  - "Camera or phone for close-up inspection of test prints"
parts:
  - "50–100g of your target filament (PLA recommended for first calibration)"
  - "A clean, freshly leveled bed"
  - "Klipper v0.11.0 or newer (check with FIRMWARE_VERSION command)"
guideCategory: "Calibration"
---

<p class="art-lead">Pressure advance is one of those tuning parameters that sounds complicated but pays back its setup time on the first decent-looking corner. On a well-tuned Voron, it's the difference between rounded blobs at direction changes and crisp, angular walls that look milled rather than printed.</p>

## Understanding Pressure Advance

Before touching any numbers, it's worth understanding what pressure advance actually does — because the mental model matters when you're analyzing your test prints.

When your extruder motor decelerates going into a corner, the molten filament inside the hotend is still under pressure from the previous extrusion. That pressure wants to keep flowing even as the motor stops, resulting in a blob of extra material at the corner. When the motor reverses or changes direction, it takes a moment for fresh pressure to build back up, which causes under-extrusion at the start of the next move.

Pressure advance compensates by **speeding up the extruder motor slightly before it needs to accelerate**, pre-loading pressure into the system, and **backing off slightly before a deceleration**, so the residual pressure is just right by the time the print head finishes the move.

The value you're tuning — the PA constant — represents how much lead/lag correction the firmware applies. A value of 0 means no compensation. A correctly tuned value means clean corners with no blobs or underextrusion.

<div class="callout-note">
<strong>Note:</strong> Klipper calls this <code>pressure_advance</code>. Marlin calls its equivalent parameter <code>linear_advance</code>. They work similarly but are not the same algorithm, and values are not transferable between firmware.
</div>

## Setting Up Your Calibration Print

There are two common approaches to finding your PA value: a **tower print** (prints a single-wall column with PA stepping upward by layer) and a **pattern print** (prints a series of lines at different PA values side by side). The Klipper documentation provides a macro for the pattern method; the CALIB_PA_PATTERN macro in the `klipper_extra` package produces the tower.

For this guide, we'll use the built-in Klipper PA calibration pattern, which is simpler to interpret.

Open your Klipper console (Mainsail → Console, or SSH to your printer and use `klippy.log`) and run:

```
SET_VELOCITY_LIMIT SQUARE_CORNER_VELOCITY=1 ACCEL=500
TUNING_TOWER COMMAND=SET_PRESSURE_ADVANCE PARAMETER=ADVANCE START=0 FACTOR=.005
```

Then start the calibration print. You can use the standard single-wall cube from the Klipper documentation, or generate one at 120×120mm with 0.2mm layer height and 0 top/bottom solid layers. The print speed should be set to your target cruising speed — not a slow safe speed.

<div class="callout-warning">
<strong>Warning:</strong> Do not run the tuning tower at slow speeds. Pressure advance behaves differently at low velocities, and a PA value calibrated at 30mm/s will be completely wrong at 150mm/s. Always calibrate at your intended print speed.
</div>

## Running the Test Pattern

With the tuning tower macro active, start your print. As the print progresses, you'll see the layer quality change:

- **Early layers (low PA):** Corners will look soft and blobby, with slight ooze. Lines at direction changes will be thicker than straight runs.
- **Middle layers (approaching correct PA):** Corners tighten up. The walls start to look consistent between straight runs and corners.
- **Late layers (too high PA):** You'll see gaps or slight under-extrusion at the very start of each line, and corners may look pinched or slightly thin.

Let the print complete fully. Do not stop it once you see "good looking" layers — you want to see the full progression to understand where the quality degrades on both ends.

<div class="callout-tip">
<strong>Pro Tip:</strong> Print this on a freshly-leveled bed. Z-offset errors will mimic PA symptoms (blobs from overextrusion on first layer, gaps from underextrusion) and make the calibration impossible to read accurately.
</div>

## Analyzing the Results

Once the print is done, pick it up and hold it at eye level against a light source. You're looking for the layer band where:

1. Corners are sharp and angular (not rounded or blobbed)
2. The wall thickness is consistent through direction changes
3. There are no gaps at the start of extrusion moves

Measure the height of that optimal layer with calipers or count layers. The corresponding PA value is calculated with:

```
PA = START + (height_mm × FACTOR)
PA = 0 + (layer_height_mm × 0.005)
```

For example: if the best layer is at 12.4mm height on a 0.2mm layer-height print:
```
PA = 0 + (12.4 × 0.005) = 0.062
```

Typical values for direct-drive CoreXY setups:
- **PLA:** 0.035–0.065
- **PETG:** 0.050–0.080  
- **ABS/ASA:** 0.030–0.055

<div class="callout-warning">
<strong>Warning:</strong> Values above 0.120 usually indicate a problem with your extruder (under-torque, skipping, or a binding path) rather than a genuine PA requirement. Investigate before accepting a very high value.
</div>

## Applying Your PA Value

Once you have your value, apply it two ways: a temporary test (`SET_PRESSURE_ADVANCE ADVANCE=0.062`) to confirm it in a real print, then permanently in your `printer.cfg`.

In your `printer.cfg`, find or create the extruder section and add:

```ini
[extruder]
pressure_advance: 0.062
pressure_advance_smooth_time: 0.040
```

The `smooth_time` value of 0.040 (40ms) is the default and works for most direct-drive setups. If you're seeing ringing artifacts on straight walls after applying PA, increase it slightly (try 0.050). If your corners are still slightly blobby, decrease it to 0.030.

Save the file and run `RESTART` or `FIRMWARE_RESTART` from the console. Then print a quick calibration piece — a single-wall box or the XYZ calibration cube — and inspect.

<div class="callout-tip">
<strong>Pro Tip:</strong> Save separate PA values per filament in Klipper using <code>SET_PRESSURE_ADVANCE ADVANCE=value</code> in your filament start G-code in your slicer. This is far more accurate than using one value for all materials.
</div>

## Fine-Tuning with Real Prints

The tuning tower gives you a baseline, but real print geometry will reveal edge cases. After applying your value, print something with:

- 90° inside corners (to check for blobs)
- Long straight runs followed by sharp turns (to check for under-extrusion at line starts)
- Overhanging perimeters (to check that PA isn't fighting your cooling)

Common signs your PA is still not right:

| Symptom | Likely Cause |
|---|---|
| Rounded outside corners | PA too low |
| Blobbing on outside corners | PA too low |
| Thin/missing start of line moves | PA too high |
| Ringing on straight walls | smooth_time too low |
| Skipping sound from extruder | PA far too high |

Adjust in increments of 0.005 and re-print a quick test piece after each change. You should converge on a solid value within 2–3 iterations of this step.

Once you're satisfied with a given filament, record the PA value in your slicer's filament profile. Treat it as part of the filament definition alongside print temperature and fan speed.
