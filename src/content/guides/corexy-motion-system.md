---
title: "CoreXY Motion System — How It Works"
category: "GUIDE"
date: 2026-05-30
readTime: "10 min read"
excerpt: "A complete reference on CoreXY motion system geometry, belt routing, and how it compares to other printer architectures."
difficulty: "Beginner"
timeRequired: "10 minutes"
guideCategory: "Hardware Setup"
summary:
  - "CoreXY uses two fixed motors to drive a toolhead through crossed belts"
  - "Moving mass is minimal — only the toolhead travels, not the motors"
  - "Belt tension and gantry squaring are critical for print quality"
  - "Input shaper calibration compensates for resonance at high accelerations"
---

CoreXY is the kinematic architecture behind most high-performance desktop 3D printers. Two stationary motors drive a single shared toolhead through a crossed-belt arrangement that decouples XY motion from the Z axis.

**Type:** Cartesian XY gantry · **Motors:** 2× NEMA17 (stationary) · **Notable for:** Speed & acceleration

## How It Works

CoreXY kinematics use two fixed motors — labelled A and B — to drive a single toolhead across the XY plane. Both motors run simultaneously for every XY move. When the toolhead moves in pure X, both motors turn in opposite directions. For pure Y, both turn the same direction. For diagonal moves, one motor runs faster than the other. The belt arrangement combines their outputs at the toolhead carriage.

The engineering advantage is that the two heaviest moving components — the stepper motors — are mounted stationary on the frame. Only the toolhead, its carriage, and a short run of belt travel with each XY move. This dramatically reduces the effective moving mass compared to a bed-slinger design, which is why CoreXY printers can achieve several times higher acceleration without ringing artifacts.

### Belt Routing

Each belt originates at one motor, wraps around a series of idlers on the gantry perimeter, and connects to one side of the toolhead carriage. The two belts cross each other in the middle of the gantry — this crossing pattern ensures the vector sum of both motors maps correctly to XY toolhead motion.

Getting this routing exactly right — both belts at equal tension and perfectly parallel at shared idler points — is the primary assembly challenge. Unequal tension causes different resonant frequencies on A and B axes, which shows up as asymmetric ringing even after input shaper compensation.

### Tuning

CoreXY printers benefit significantly from input shaper calibration, which measures the actual resonant frequencies of the assembled machine and compensates in firmware. On Klipper, run `SHAPER_CALIBRATE` with an ADXL345 accelerometer after the belt tension is set. Belt frequency target is typically 110 Hz on both A and B axes, within 5 Hz of each other.

## Advantages

- **Stationary motors** — only the toolhead mass moves on XY; no motor inertia on the gantry
- **High achievable acceleration** — no moving-bed resonance problems
- **Symmetrical X/Y kinematics** — equal performance in both axes
- **No bed inertia** — Z is the only dimension the bed moves
- **Scales to large build volumes** — works well with proper frame rigidity
- **Largest community** — the most documented motion system in desktop 3D printing

## Limitations

- **Complex belt routing** — two motors share responsibility for both axes simultaneously
- **Gantry squaring is critical** — asymmetry produces visible print artifacts
- **Tension sensitivity** — any motor, belt, or pulley imbalance causes axis skew
- **Input shaper required** — needed to get clean output at high speeds
- **Enclosure complexity** — stationary motors at gantry corners complicate panel design
- **Higher part count** — more components than cartesian bed-slinger or delta designs

## Printers That Use CoreXY

CoreXY is used across a wide range of self-build and production printers:

- Voron 2.4
- Voron Trident
- RatRig V-Core 4
- VCore 3.1
- HevORT
- K3
- Bambu X1 Carbon
- Bambu P1S
- Creality K1 Max
- Sovol SV08
- Prusa CORE One
- AnkerMake M5C

## Looking for Gantry Mods?

Browse community AWD conversions, gantry replacement kits, and motion system upgrades on the [Motion Mods](/hardware/motion) page — documented and linked back to their creators.
