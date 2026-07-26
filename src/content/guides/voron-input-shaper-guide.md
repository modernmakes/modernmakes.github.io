---
title: "How to Run Input Shaper Calibration on a Voron Printer"
category: "GUIDE"
date: 2026-05-22
readTime: "30 min read"
excerpt: "Input shaper calibration eliminates ringing and ghosting artifacts at high speed. This guide walks through ADXL345 wiring, SHAPER_CALIBRATE, and interpreting the results."
difficulty: "Intermediate"
timeRequired: "30 minutes"
tools:
  - "ADXL345 accelerometer (or equivalent)"
  - "USB cable for accelerometer"
  - "Klipper-connected printer"
parts:
  - "ADXL345 module"
  - "Dupont wires or JST connector"
guideCategory: "Calibration"
summary:
  - "Requires ADXL345 accelerometer connected to the toolhead or bed"
  - "Run SHAPER_CALIBRATE from the Klipper console"
  - "Results show recommended shaper type and frequency per axis"
  - "Reduces ringing artifacts at accelerations above 3000mm/s²"
featured: false
---

<p class="art-lead">Ringing — the wavy artifact that shadows every sharp edge at high print speeds — is a mechanical resonance problem, not a slicer setting. Input shaper is Klipper's compensation algorithm for it. Done correctly, it lets you push acceleration well past what was previously usable while keeping walls sharp. Done sloppily, it barely helps. This guide does it correctly.</p>

## What Resonance Actually Is

When your toolhead reverses direction — at a corner, at the start of a line, at any sharp deceleration — the mechanical mass of the carriage and toolhead continues moving under its own inertia. The belts, the frame, the printed parts all have some compliance, and that compliance means the toolhead oscillates for a brief time after each direction change.

Those oscillations show up as echo lines parallel to wall faces. You've seen them. The pattern repeats at a frequency that depends on the stiffness and mass of the affected axis. A typical Voron 2.4 with a Stealthburner toolhead resonates somewhere in the 40–70 Hz range on X and a lower 30–50 Hz range on Y.

Input shaper works by adding a compensating pre-filter to the motion commands: it predicts when the toolhead will oscillate and issues tiny counter-moves that cancel the oscillation before it starts. The mathematical filter (EI, MZV, 2HUMP_EI, ZV, etc.) is chosen based on how aggressive the cancellation needs to be versus how much acceleration you're willing to sacrifice.

<div class="callout-note">
<strong>Note:</strong> Input shaper is not the same as reducing acceleration. It allows you to print at <em>higher</em> accelerations cleanly. If you've been running 2000mm/s² to avoid ringing, a properly tuned input shaper might let you run 6000–8000mm/s² with better results.
</div>

## Hardware Setup: Wiring the ADXL345

The most common accelerometer for Klipper input shaper calibration is the ADXL345, which communicates over SPI. You can connect it directly to a Raspberry Pi (or Pi-compatible SBC) or to a dedicated MCU board like an EBB36/EBB42 toolhead PCB.

**Connecting to a Raspberry Pi:**

| ADXL345 Pin | Raspberry Pi GPIO | Physical Pin |
|-------------|-------------------|--------------|
| VCC (3.3V)  | 3.3V              | Pin 1        |
| GND         | Ground            | Pin 6        |
| SCL (CLK)   | BCM11 (SPI CLK)   | Pin 23       |
| SDA (MOSI)  | BCM10 (SPI MOSI)  | Pin 19       |
| SDO (MISO)  | BCM9  (SPI MISO)  | Pin 21       |
| CS          | BCM8  (SPI CE0)   | Pin 24       |

Mount the accelerometer securely to your toolhead for X-axis measurement. The mounting must be rigid; any flex between the accelerometer and the toolhead introduces error. A printed mount with an M3 screw directly into the carriage is typical for Stealthburner builds.

For Y-axis calibration, you'll need to remount the accelerometer to the bed carriage (on a bed-slinger) or to a static bed point (on a Voron 2.4 with a fixed bed). On a Voron 2.4, X and Y calibration both happen at the toolhead since the bed doesn't move in XY.

<div class="callout-tip">
<strong>Tip:</strong> Many toolhead PCBs (EBB36, KNOMI, Mellow SHT36) have an onboard ADXL345 or LIS2DW accelerometer. If yours does, you don't need external wiring, just enable the accelerometer section in your Klipper config.
</div>

## Klipper Configuration

Add the following to your `printer.cfg` to enable the ADXL345:

```ini
[mcu rpi]
serial: /tmp/klipper_host_mcu

[adxl345]
cs_pin: rpi:None
spi_speed: 5000000
spi_bus: spidev0.0

[resonance_tester]
accel_chip: adxl345
probe_points:
    150, 150, 20  # Center of your bed, 20mm above
```

If you're connecting via an EBB36 or similar CAN toolhead board, the configuration differs; consult your board's documentation for the correct `cs_pin` and SPI bus values.

After adding the config, run `RESTART` from the Klipper console to load the changes. Verify the accelerometer is working with:

```
ACCELEROMETER_QUERY
```

You should see three rapidly changing acceleration values (X, Y, Z in mm/s²). If the command returns an error, check your wiring and SPI configuration before proceeding.

## Running SHAPER_CALIBRATE

With the accelerometer verified, home your printer and move the toolhead to the center of the build volume. Then run:

```
SHAPER_CALIBRATE
```

Klipper will now drive the toolhead through a series of resonance-probing moves at increasing frequencies on each axis. This takes 2–3 minutes per axis. You'll hear the motion sound unusual. That's normal. The printer is deliberately driving frequencies to measure the response.

When complete, the console will show output like:

```
Fitted shaper 'zv' frequency = 52.4 Hz (vibrations = 8.2%, smoothing ~= 0.058)
Fitted shaper 'mzv' frequency = 48.6 Hz (vibrations = 2.1%, smoothing ~= 0.074)
Fitted shaper 'ei' frequency = 55.0 Hz (vibrations = 1.9%, smoothing ~= 0.073)
Fitted shaper '2hump_ei' frequency = 66.2 Hz (vibrations = 0.2%, smoothing ~= 0.096)
Fitted shaper '3hump_ei' frequency = 77.5 Hz (vibrations = 0.1%, smoothing ~= 0.121)
Recommended shaper_type_x = mzv, shaper_freq_x = 48.6 Hz
```

Klipper will also automatically write the recommended values to your config if you run `SAVE_CONFIG` at the end.

## Reading the Results

The output shows several candidate shaper types with three metrics:

- **Vibrations (%)**: How much residual resonance the shaper leaves. Lower is better. Below 5% is generally invisible in prints.
- **Smoothing**: How much the shaper rounds corners. Higher smoothing = softer corners at high acceleration.
- **Frequency (Hz)**: The resonant frequency Klipper will compensate for.

Klipper's recommendation balances low vibrations against acceptable smoothing. The recommendation is almost always correct. The cases where you might override it:

- If you're printing very fine detail and want lower smoothing, choose a shaper type with lower smoothing even if vibrations% is slightly higher (stay under 5%)
- If your maximum acceleration is limited by other factors, the shaper choice matters less — just take the recommendation

<div class="callout-warning">
<strong>Warning:</strong> If the recommended frequency is below 25 Hz, your printer likely has a mechanical issue: loose belts, loose pulleys, flex in the frame, or an improperly seated carriage. Fix the mechanical issue before tuning shaper values. Input shaper cannot fully compensate for structural problems.
</div>

## Applying Your Settings

Run `SAVE_CONFIG` after the calibration completes. Klipper writes the recommended values to the bottom of `printer.cfg` under a `#*# <---------------------- SAVE_CONFIG ---------------------->` section.

The resulting config entries look like:

```ini
[input_shaper]
shaper_type_x = mzv
shaper_freq_x = 48.6
shaper_type_y = ei
shaper_freq_y = 39.2
```

After `SAVE_CONFIG` and restart, run a test print with your normal acceleration settings. The ringing you saw before should be gone or dramatically reduced. If faint ringing remains on one axis, try reducing `shaper_freq_*` by 2–3 Hz on that axis — real-world resonance can shift slightly from the calibrated value as the printer heats up to operating temperature.

<div class="callout-tip">
<strong>Pro Tip:</strong> Calibrate with the printer at print temperature. Cold belts behave differently than warm ones. Run a 30-minute warmup print before calibrating if your printer runs an enclosed build chamber.
</div>

## Setting Maximum Acceleration

After applying input shaper, Klipper's recommended maximum acceleration will typically increase significantly. The `SHAPER_CALIBRATE` output includes a suggested max accel value. You can apply it in your `printer.cfg`:

```ini
[printer]
max_accel: 6000
```

Start conservatively — push to the suggested value in increments of 1000mm/s² while printing test objects. The right number is the highest acceleration that keeps your prints clean without introducing new artifacts or causing the extruder to skip.
