---
title: "Voron Phoenix Arrives: 600mm Build Volume, Octopus 10 Max Required"
category: "HARDWARE"
date: 2026-05-02
readTime: "3 min read"
excerpt: "The Voron Phoenix brings a 600mm build volume to the Voron ecosystem, requiring the Octopus 10 Max board as the only controller with enough stepper drivers to run it."
summary:
  - "600mm build volume — largest in the Voron lineup"
  - "Requires Octopus 10 Max — the only board supporting 10 stepper drivers"
  - "Community-designed, open source as with all Voron printers"
  - "Announced May 2, 2026 with 'the wait is over' community post"
  - "Competes with FYSETC Venture XL in the large-format DIY space"
---

<p class="art-lead">The Voron Design team has announced the Voron Phoenix, a new large-format CoreXY printer with a 600mm build volume — the largest in the Voron lineup — and a hard dependency on the Octopus 10 Max controller board, currently the only option with sufficient stepper driver outputs to run it.</p>

## The Announcement

Voron Design published the Phoenix on May 2, 2026, with a community post carrying the phrase "the wait is over" — a reference to long-running speculation that the team was working on a machine beyond the Voron 2.4's 350mm maximum. The release was accompanied by the full BOM, CAD files, and configuration examples in the Voron Design GitHub repository, consistent with the project's open-source model.

The announcement generated immediate discussion across r/voroncorexy and the official Voron Discord server, where the reaction centred primarily on the Octopus 10 Max requirement and the parts cost at 600mm scale.

## Build Volume and Frame

The Phoenix uses a standard CoreXY motion system scaled to 600mm×600mm×600mm. The frame follows the established Voron 2.4 design language — aluminium extrusion, ACM panels, printed ABS structural components — but at a scale that requires longer extrusions and a significantly heavier gantry assembly.

Voron Design recommends the 2020 extrusion profile for the Phoenix rather than the 2040 used in the larger Voron 2.4 variants, citing weight distribution considerations at this scale. The full BOM is available in the GitHub repository with sourcing notes.

## The Octopus 10 Max Requirement

The Voron Phoenix requires the BTT Octopus 10 Max mainboard. The reason is driver count: a 600mm CoreXY at this complexity requires 10 independent stepper motor outputs. The standard Octopus Pro supports 8 drivers, which is sufficient for the Voron 2.4 up to 350mm. The Octopus 10 Max adds two additional driver slots specifically to serve configurations like the Phoenix.

As of the announcement, the Octopus 10 Max is available but not widely stocked. West3D, Fabreeko, and several international suppliers carry it, with pricing around $85–95. Builders planning a Phoenix should factor board availability into their timeline, as supply is constrained relative to standard Octopus variants.

Klipper configuration files for the Phoenix on the Octopus 10 Max have been contributed to the Voron repository alongside the mechanical files.

## Where It Fits in the Voron Ecosystem

The Voron lineup has historically topped out at 350mm with the 2.4 and Trident. The Phoenix fills a gap for builders who need larger print volumes but want to stay within the Voron design philosophy: open source, community-supported, self-sourced, and highly modifiable.

The Phoenix is not a beginner build. At 600mm, parts cost is substantially higher — a rough BOM estimate based on current sourcing puts a complete Phoenix at $900–1,300 depending on component quality, not including tools. Build time is estimated at 25–35 hours for experienced Voron builders.

## Competition

The closest direct competitor in the large-format DIY printer space is the FYSETC Venture XL, which offers a similar CoreXY architecture at 500mm and ships as a partial kit rather than a full self-source build. The Venture XL is generally available for around $600–700 fully kitted. The Phoenix, as a pure self-source design, will likely land at similar or higher all-in cost but with the degree of customisation and community support that Voron builds are known for.

Voron Design has not indicated plans for an official kit vendor programme for the Phoenix, though third-party kit providers that currently supply Voron 2.4 components are expected to add Phoenix kits to their catalogues.
