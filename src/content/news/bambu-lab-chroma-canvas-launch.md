---
title: "Bambu Lab Chroma Canvas: Turn Images Into Multi-Color Prints"
category: "SOFTWARE"
date: 2026-05-14
readTime: "2 min read"
excerpt: "Chroma Canvas is Bambu Lab's MakerWorld tool for turning images into multi-color filament 'paintings' on AMS-equipped printers — a HueForge-style approach aimed at being much easier to use."
summary:
  - "Converts an image into a multi-color filament 'painting'"
  - "Runs on MakerWorld (Bambu's MakerLab) — not inside Bambu Studio"
  - "Inspired by the commercial HueForge tool, aimed at being easier"
  - "Prints on AMS-equipped Bambu Lab machines; more AMS colors = higher fidelity"
  - "Ran a limited beta from September 2025 before opening more widely"
---

<p class="art-lead">Chroma Canvas is Bambu Lab's tool for turning ordinary images into multi-color filament "paintings" — flat relief prints that reproduce a picture using the filament loaded in an AMS. It runs as a MakerWorld tool, not as a feature inside Bambu Studio, and is openly modeled on the established HueForge workflow.</p>

## What Chroma Canvas Does

Chroma Canvas takes an image and converts it into a printable multi-color object by mapping the image's colors onto pre-set filament palettes. Users can isolate and recolor specific details — applying different palettes to a subject and its background — and preview the result before printing. The output is a flat relief where each color region is reproduced with the corresponding filament, with no need to model anything in 3D.

The pitch is accessibility. Community reactions have framed it as "much, much easier than HueForge" — likely more limited, but far quicker to get a usable result from. Bambu Lab has explicitly credited HueForge as the inspiration.

## Where It Runs

Chroma Canvas lives on **MakerWorld** (Bambu's MakerLab), as a browser-based tool — it is not bundled into a specific Bambu Studio version. You generate the colorized model in Chroma Canvas, then print it on a multi-material Bambu machine.

## What You Need

Color output depends on an **AMS** (Automatic Material System). A single AMS provides four filament colors; chaining AMS units increases the count, which yields higher-fidelity reproductions with more tonal regions. Because the result is a quantized, posterized relief, the tool does best with clean, flat-color images — logos, icons, and graphic illustrations — rather than photographic gradients at low color counts.

## Availability

Chroma Canvas ran as a **limited beta from around September 2025**, with testers registering through an application form, before opening to a wider audience. It is free for Bambu Lab users via MakerWorld. As always with a young tool, expect iteration on palette handling and output quality over time.
