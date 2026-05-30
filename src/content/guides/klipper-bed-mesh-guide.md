---
title: "Klipper Bed Mesh: Why You Need It and How to Set It Up"
category: "GUIDE"
date: 2026-05-15
readTime: "25 min read"
excerpt: "No bed is perfectly flat. Bed mesh calibration maps the surface of your bed and compensates for warps and tilts automatically on every print. Here's how to configure it in Klipper."
difficulty: "Beginner"
timeRequired: "25 minutes"
tools:
  - "Klipper console (Mainsail or Fluidd)"
  - "Probe installed and configured (TAP, Klicky, CR Touch, etc.)"
parts: []
summary:
  - "Bed mesh maps surface variation across the full bed area"
  - "Klipper compensates for warps in real time during printing"
  - "More probe points = more accurate mesh but longer calibration time"
  - "Run BED_MESH_CALIBRATE after every significant temperature change"
featured: false
---

<p class="art-lead">A bed that's 0.2mm higher in the back-right corner than the front-left will cause the first layer to fail somewhere, regardless of how perfectly you calibrated your Z offset. Bed mesh solves this by mapping the entire surface and dynamically adjusting the Z height throughout every print. It's not optional on a printer larger than 200mm.</p>

## Why No Bed Is Flat

Every print bed has some variation across its surface. The causes are structural and thermal:

**Manufacturing tolerance**: Even high-quality borosilicate glass and precision-ground aluminum tooling plates have surface variation measured in hundredths of a millimeter. Spring steel PEI sheets add their own variation depending on how evenly they're attached to the magnetic base.

**Thermal expansion**: Aluminum expands approximately 23 micrometers per meter per degree Celsius. A 300mm aluminum bed heating from 20°C to 100°C expands ~1.6mm across its length. But it doesn't expand uniformly — the center heats faster than the edges, causing the bed to bow convex (center rises) or concave (edges rise) depending on the heater distribution and bed material.

**Frame compliance**: On CoreXY printers like the Voron 2.4, the bed is fixed, but the frame itself can flex slightly under thermal load. The Z rails, gantry, and frame extrusions all have some compliance.

The net effect is that your bed surface is a landscape, not a plane. Bed mesh maps that landscape with a probe and lets Klipper ride it throughout the print.

## Prerequisites

Before setting up bed mesh, your printer needs:

1. **A working probe** — TAP, Klicky, Voron TAP, CR Touch, BLTouch, or any probe that Klipper supports. The probe must be calibrated (its Z offset set correctly via `PROBE_CALIBRATE`).
2. **A calibrated Z offset** — bed mesh compensation is applied on top of your base Z offset. If your Z offset is wrong, the mesh makes it consistently wrong across the whole bed.
3. **Bed at print temperature** — always calibrate with the bed heated. A cold mesh is inaccurate at print temperature due to thermal expansion.

<div class="callout-warning">
<strong>Warning:</strong> Do not run BED_MESH_CALIBRATE without first completing PROBE_CALIBRATE and setting your Z offset. The mesh is a correction relative to your base Z offset, not a replacement for it.
</div>

## Configuration in printer.cfg

Add the following section to your `printer.cfg`:

```ini
[bed_mesh]
speed: 120
horizontal_move_z: 5
mesh_min: 30, 30
mesh_max: 270, 270
probe_count: 5, 5
mesh_pps: 2, 2
algorithm: bicubic
bicubic_tension: 0.2
```

Key parameters explained:

| Parameter | What it does |
|---|---|
| `mesh_min` | First probe point, bottom-left (must clear probe offsets from bed edge) |
| `mesh_max` | Last probe point, top-right (must clear probe offsets from bed edge) |
| `probe_count` | Grid size — `5, 5` probes 25 points in a 5×5 grid |
| `algorithm` | `lagrange` for ≤6×6 grids, `bicubic` for larger grids |
| `bicubic_tension` | Higher values follow surface variation more closely (0.2 is a good default) |

**Setting mesh_min and mesh_max**: These must be inset from your bed edges by at least the probe's XY offset from the nozzle. If your probe is 25mm to the right of the nozzle (`x_offset: 25`), then `mesh_min` X must be at least 25mm from the bed's left edge to ensure the probe can reach that point without the nozzle going off-bed.

**Choosing probe_count**: More points give a more accurate mesh at the cost of calibration time.
- `3, 3` (9 points) — fast, adequate for very flat beds
- `5, 5` (25 points) — good balance, recommended for most builds
- `7, 7` (49 points) — thorough, recommended for 300mm+ beds with known warping

## Running BED_MESH_CALIBRATE

With the configuration in place and the bed at printing temperature, home your printer and run the calibration:

```
G28
BED_MESH_CALIBRATE
```

The probe will move to each grid point in sequence, probe the surface, and build a height map. On a 5×5 grid at 120mm/s probe speed, this takes about 3–5 minutes.

When complete, view the mesh in Mainsail or Fluidd's bed mesh visualization. A healthy mesh shows gradual variation with no sharp spikes. What you're looking for:

- **Total variation under 0.5mm**: Normal for most quality beds at print temperature. The mesh will handle this easily.
- **Total variation 0.5–1.5mm**: The mesh will compensate, but you might want to check that your bed is properly seated and that your Z leveling screws are adjusted to minimize coarse tilt.
- **Total variation over 2mm or sharp peaks**: This usually indicates a hardware problem — a screw protruding through the bed, a warp from thermal damage, or an incorrect probe trigger. Investigate before printing.

<div class="callout-tip">
<strong>Tip:</strong> If the visualization shows a consistent tilt across the whole bed (high on one side, low on the other), use your Z leveling screws to correct the coarse tilt first, then re-run BED_MESH_CALIBRATE. The mesh is better at handling complex warps than simple tilts.
</div>

## Saving and Applying the Mesh

After calibration, save the mesh to a named profile:

```
BED_MESH_PROFILE SAVE=default
SAVE_CONFIG
```

To apply this mesh automatically on every print, add the following to your print start macro (in your `printer.cfg` or slicer start G-code):

```ini
[gcode_macro PRINT_START]
gcode:
    G28                              # home all axes
    BED_MESH_CALIBRATE               # probe fresh mesh
    BED_MESH_PROFILE LOAD=default    # or load saved profile
    G1 Z5 F3000
    G1 X5 Y5 F6000
    # ... rest of your start routine
```

For printers where bed mesh rarely changes (a fixed, rigid bed at consistent temperatures), loading a saved profile is faster than recalibrating every print. For printers with significant thermal variation between prints, calibrating fresh each time is more accurate.

## Checking the Mesh is Active

To verify the mesh is loaded and active, run:

```
BED_MESH_OUTPUT
```

This prints the current mesh matrix to the console. If it shows all zeros, no mesh is loaded — run `BED_MESH_PROFILE LOAD=default` to activate your saved profile.

You can also check the live visualization in Mainsail under the "Heightmap" tab, which shows the active mesh overlaid on a 3D representation of your bed surface.

<div class="callout-note">
<strong>Note:</strong> Bed mesh compensation is only applied to Z movements. It does not affect XY accuracy. If your first layer has XY-plane issues — gaps between lines, inconsistent width — those are extrusion or flow rate problems, not mesh problems.
</div>
