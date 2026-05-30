---
title: "First Layer Calibration: Getting Your Z Offset Right"
category: "GUIDE"
date: 2026-05-18
readTime: "20 min read"
excerpt: "A perfect first layer is the foundation of every successful print. This guide covers Z offset calibration for Klipper printers using paper, live adjustment, and the PROBE_CALIBRATE workflow."
difficulty: "Beginner"
timeRequired: "20 minutes"
tools:
  - "Sheet of standard 80gsm paper"
  - "Klipper console (Mainsail or Fluidd)"
parts: []
summary:
  - "Z offset sets the gap between the nozzle and the bed at the start of a print"
  - "Too high — first layer doesn't stick. Too low — nozzle gouges the bed."
  - "Use PROBE_CALIBRATE in Klipper for probe-equipped printers"
  - "Fine-tune with the live Z adjust during an actual first layer print"
featured: false
---

<p class="art-lead">Every failed print has a first layer problem hidden somewhere in its history. The Z offset — the precise distance between your nozzle and your bed at the start of a print — is the single setting that determines whether that first layer bonds to the surface or peels up an hour into a twelve-hour print. Get it right once, know when to redo it, and you've eliminated the most common cause of print failures.</p>

## What Z Offset Actually Controls

When your printer homes to Z, it moves the nozzle to whatever position the firmware considers Z=0. The actual Z offset is a correction applied on top of that home position — a small negative or positive value that shifts the nozzle down or up by a precise amount before the first layer begins.

A correct Z offset means the first layer is squished slightly into the bed surface: not so hard that the nozzle drags, not so light that the line is round and doesn't bond. You're looking for a flat, slightly wider-than-normal line with good contact area on the bed.

The consequences of getting it wrong are asymmetric. Too high (positive error) means a weak first layer that may print cleanly but peels off. Too low (negative error) means the nozzle is grinding into the bed surface, which can scratch PEI, damage the nozzle, and cause clogs from back-pressure.

<div class="callout-note">
<strong>Note:</strong> Z offset is a property of your specific nozzle, probe, and bed surface combination. If you swap nozzles, replace a probe, or change your build plate, you should recalibrate. A 0.2mm nozzle swap can require a 0.1mm offset correction.
</div>

## The Paper Test (Manual Method)

For printers without a probe, or as a quick sanity check before running PROBE_CALIBRATE, the paper test is the standard manual calibration method.

Home your printer, then use the Klipper console to move the nozzle to the center of the bed:

```
G28
G1 X150 Y150 F6000
```

With the nozzle hot (printing temperature), slide a standard 80gsm sheet of printer paper under the nozzle. Now lower the nozzle in small increments using your web interface's Z controls, or via the console:

```
TESTZ Z=-0.1
```

Keep lowering until you feel slight resistance when moving the paper — the nozzle should drag gently on the paper without tearing it or locking it in place. That drag is the correct Z offset position.

Once you find it, note the position shown in your web interface and set the offset:

```
SET_GCODE_OFFSET Z=0
SAVE_CONFIG
```

<div class="callout-tip">
<strong>Tip:</strong> "80gsm copy paper" is the standard reference because it's exactly 0.1mm thick and consistent across brands. Post-it notes, cardstock, and business cards all have different thickness and will give you a different offset.
</div>

## PROBE_CALIBRATE (Probe-Equipped Printers)

If your printer has a probe — TAP, Klicky, CR Touch, BLTouch, or similar — use `PROBE_CALIBRATE` instead of the paper test. This gives a more repeatable result and automatically accounts for the probe's trigger point.

First, heat the bed and nozzle to printing temperature. This matters: thermal expansion shifts your Z offset by a measurable amount, and calibrating cold will give you an offset that drifts when the printer reaches temperature.

```
G28
PROBE_CALIBRATE
```

Klipper will probe the bed center and then move the nozzle directly above that point. It'll prompt you to adjust Z using the `TESTZ` command. Follow the same paper-drag method:

```
TESTZ Z=-0.1    # lower in 0.1mm steps until near the bed
TESTZ Z=-0.02   # fine steps when close
TESTZ Z=+0.02   # back off slightly if you went too far
```

When the paper drag feels right, accept the position:

```
ACCEPT
SAVE_CONFIG
```

Klipper writes the calibrated offset to the `[probe]` section's `z_offset` value in `printer.cfg`. This is the number you'll see change when you recalibrate.

<div class="callout-warning">
<strong>Warning:</strong> Run PROBE_CALIBRATE with a clean nozzle. Any filament residue on the tip adds height to your reference measurement, giving you an offset that's too low (too close to the bed) when printing. Purge the nozzle and wipe it on a silicone sock or cold pull before calibrating.
</div>

## Live Z Adjust During Printing

The calibrated offset is a starting point — real fine-tuning happens while watching an actual first layer print. Start a single-layer calibration square or a full skirt-only print and watch the lines as they go down.

Signs the offset needs adjustment:

| What you see | What it means | Fix |
|---|---|---|
| Lines round, not squished, bed shows through gaps | Too high | Lower by 0.02–0.05mm |
| Lines flat and wide, surface looks rough/scratched | Too low | Raise by 0.02–0.05mm |
| Lines slightly squished, consistent width, good adhesion | Correct | Save the offset |
| Nozzle dragging, clicking sound, motor skipping | Way too low | Stop print, raise 0.1mm |

In Mainsail or Fluidd, you can adjust the offset live using the Z offset control in the dashboard. In the Klipper console:

```
SET_GCODE_OFFSET Z_ADJUST=-0.02   # lower by 0.02mm
SET_GCODE_OFFSET Z_ADJUST=+0.02   # raise by 0.02mm
```

Once you find the value that gives you a perfect first layer, save it permanently:

```
Z_OFFSET_APPLY_PROBE   # adjusts the stored probe offset
SAVE_CONFIG
```

## When to Recalibrate

Your Z offset will drift in these situations and should be rechecked:

- **After changing nozzles** — different nozzles have slightly different tip-to-collar lengths
- **After changing the build plate** — a new PEI sheet is slightly thicker or thinner than the old one
- **After replacing the probe** — probe trigger force and position vary between units
- **After a firmware update** — occasionally an update changes how probe offsets are applied
- **After a crash or over-travel event** — impacts can shift the probe mount

A quick test print of a single-layer calibration square takes 3 minutes and will immediately tell you if the offset has drifted. Making this part of your pre-print routine on new filament or after any printer change prevents failed prints from calibration drift.

<div class="callout-tip">
<strong>Pro Tip:</strong> Many Voron builders keep a saved Z offset per bed surface. If you swap between a smooth PEI sheet and a textured one, the difference is typically 0.05–0.15mm. Record both values in a note on your printer and apply the right one when switching sheets.
</div>
