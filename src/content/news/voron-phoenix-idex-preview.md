---
title: "Voron Phoenix: The 600mm IDEX Voron Is Coming — But It's Not Released Yet"
category: "HARDWARE"
date: 2026-06-25
readTime: "3 min read"
excerpt: "The Voron Phoenix is a large-format IDEX CoreXY machine that's been shown at SMRRF and runs as an internal beta — but as of mid-2026 there's still no public CAD, BOM, or manual. Here's what the community development threads actually show."
summary:
  - "Large-format IDEX CoreXY — Voron's first dual-independent-extruder design"
  - "Roughly 600 × 600 × 550 mm build volume, with four separate heated beds"
  - "Still in internal beta — no public CAD, BOM, or manual as of mid-2026"
  - "Shown publicly at SMRRF; release is 'done when it's done'"
  - "Specs are community-preview and not finalized"
---

<p class="art-lead">The Voron Phoenix is the most ambitious machine the Voron community has previewed: a large-format CoreXY printer with independent dual extrusion (IDEX) and a build volume well beyond the 350mm ceiling of the Voron 2.4. It has been shown publicly and is running as an internal beta, but as of mid-2026 it has not been officially released, and there is no public CAD, BOM, or manual yet.</p>

## Status: Beta, Not Released

We want to be clear up front, because there's been confusion in the community: the Phoenix is **not** a finished, downloadable Voron design. Development threads on the official VORON forum and Team FDM describe an internal beta with a handful of operational units, a manual that is still being written, and a BOM still being error-checked. The team's public framing has been the familiar open-hardware line — "done when it's done" — with no committed release date.

The Phoenix was originally floated for late 2023 / early 2024 and has slipped repeatedly. It has appeared at events like SMRRF, which is where most of the photos and video circulating online come from. What does not yet exist is the thing that actually makes a Voron buildable: published CAD files, a finalized bill of materials, and a build manual.

> Treat everything below as community-preview information. Specifications for an unreleased machine change, and nothing here is final until Voron Design publishes the files.

## What the Previews Show

Based on the public showings and community development threads, the Phoenix is shaping up as a very different machine from the rest of the Voron lineup:

- **IDEX** — independent dual extruders, a first for an official Voron design. This is the headline feature, enabling true dual-material and mirror/copy modes at scale.
- **Large format** — roughly 600 × 600 mm in X/Y, with about 550 mm of Z travel.
- **Four separate heated beds** — the print area is split into independently heated zones rather than one monolithic plate.
- **CANBUS on the toolhead** and **Nema 23 motors** to move the heavier large-format gantry.
- A **revised Tap** using two cross-roller rails instead of a single MGN9 for more stable probing, paired with an updated toolhead, and cable chains rather than umbilicals for rigidity.
- **Dual filament runout sensors** — one at the toolhead, one at the spool entry.

As with every Voron, the project is open source and self-sourced: when the files land, builders will assemble from a published BOM rather than buy a single sealed product.

## Where It Fits in the Voron Ecosystem

The Voron lineup has historically topped out around 350mm with the 2.4 and Trident. The Phoenix targets builders who need substantially more volume — and, with IDEX, more multi-material capability — while staying inside the Voron philosophy: open source, community-supported, self-sourced, and highly modifiable.

It is emphatically not a first build. Large-format IDEX adds mechanical complexity, cost, and tuning surface on top of an already advanced platform, and the absence of a finished manual means early adopters will be doing real engineering, not following a guide.

## What We Don't Know Yet

Plenty remains open: the release date, the finalized BOM and realistic all-in cost, the recommended control electronics, and whether the established Voron kit vendors will offer Phoenix kits. We're not going to put numbers on those until Voron Design does.

When the files are published, we'll cover the real build. Until then, the Phoenix is a preview: an exciting one, but a preview.
