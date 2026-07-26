---
title: "Someone Built a Full Klipper Conversion for the Bambu P1 — and Documented Every Step"
excerpt: "ChazMakes' Bambu Klipper Conversion project gives P1 owners a documented exit ramp from the cloud — swapping the stock mainboard for a BTT Manta M5P and running full Klipper locally."
category: "NEWS"
date: "2026-06-25"
readTime: "4 min read"
currentPath: "/news"
---

The Bambu Lab cloud controversy shook loose a lot of frustration from P1 and X1 owners earlier this year. Most of that energy went into forum posts. ChazMakes turned it into a build project, then wrote full documentation for it.

The [Bambu Klipper Conversion](https://docs.chazmakes.com/) is a community project that replaces the P1's stock mainboard with a BigTreeTech Manta M5P running Klipper, removing the cloud dependency entirely. The documentation covers the full conversion: requirements, bill of materials, disassembly, assembly, wiring for both the mainboard and toolhead, and commissioning. Piezoelectric sensor support is documented separately.

## What the Conversion Actually Involves

This isn't a firmware flash. It's a hardware swap. The stock P1 mainboard comes out; a BTT Manta M5P with a CB1 or CB2 compute module goes in. A custom-printed electronics enclosure houses the new board. The toolhead gets a new 5015 part cooling fan and probe, plus a new printed cover to match.

Total BOM cost for the original build configuration runs roughly $160–180 USD in electronics alone: Manta M5P ($71.53), BIQU MicroProbe ($11.91), a 230V Mornsun PSU ($29.83), X1C heater and thermistor set ($5.24), Delta 2510 fan ($11.16), and two GDStime 5015 fans ($12.87). Hardware consumables (heat set inserts, JST connectors, wire, screws) add another $35 or so. The printed parts — electronics box, lid, toolhead cover — come from the project's GitHub.

The conversion requires soldering and crimping. ChazMakes includes tutorial video links in the documentation for builders who haven't done either before. It's a practical touch that signals the project is aimed at P1 owners crossing into DIY territory for the first time, not just experienced Klipper users.

## Why This Matters

The Bambu cloud changes earlier this year made clear that P1 and X1 owners don't own their workflow the way Voron or RatRig builders do. ChazMakes' project is one of the more complete community responses so far: a documented conversion path a committed P1 owner can actually follow.

Beyond cloud independence, the conversion gets you full Klipper flexibility, slicer choice, input shaping, the ability to push the bed to 110°C, and the entire ecosystem of Klipper macros and toolhead mods the self-build community has built over the past five years. The P1's motion system and frame stay intact — only the electronics change.

Support for the LDO Leviathan and additional boards is noted as coming soon in the documentation. The project has an active Discord server and accepts support via Ko-Fi.

The GitHub repo lives at [github.com/ChazLayyd/Bambu-Lab-Klipper-Conversion](https://github.com/ChazLayyd/Bambu-Lab-Klipper-Conversion). The documentation was last updated May 5, 2025.
