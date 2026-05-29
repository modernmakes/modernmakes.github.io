---
title: "Bambu Lab Launches Chroma Canvas: Turn Images Into Multi-Color Prints"
category: "SOFTWARE"
date: 2026-05-14
readTime: "2 min read"
excerpt: "Bambu Lab has released Chroma Canvas, a new feature that converts images into multi-color filament paintings printable on AMS-equipped machines."
summary:
  - "Converts any image into a multi-color filament print"
  - "Designed for AMS-equipped Bambu Lab printers"
  - "Available via Bambu Studio software update"
  - "Aimed at creative and decorative printing use cases"
  - "Announced May 14, 2026 via Bambu Lab forum"
---

<p class="art-lead">Bambu Lab has released Chroma Canvas, a feature integrated into Bambu Studio that converts raster images into layered multi-color filament prints, designed to be produced on AMS-equipped machines without manual model preparation.</p>

## What Chroma Canvas Does

Chroma Canvas takes a standard image file — JPEG, PNG, or BMP — and converts it into a printable multi-color object by analysing the colours in the image and mapping them to available filament slots in the AMS. The output is a flat relief print where each distinct colour region in the original image is reproduced using the corresponding filament.

The workflow operates entirely within Bambu Studio. Users import an image, select the number of filament colours available in their AMS (up to 4 with a standard AMS, up to 16 with AMS Hub configurations), and Chroma Canvas quantises the image palette to match. The tool then generates the sliced file ready for print without the user needing to create or manipulate a 3D model.

## How the Conversion Works

Internally, Chroma Canvas applies colour quantisation to reduce the source image to the specified number of filament colours, then traces the resulting regions into vector outlines. Those outlines are extruded to a user-defined height — typically 0.4mm to 1.2mm — and assigned to separate extruder slots in the AMS.

The feature includes controls for image resolution (which affects edge sharpness at the cost of file size), background colour assignment, and border frame options. Users can preview the quantised result and adjust colour assignments before committing to a slice.

For images with gradients or photographic content, the quantisation will produce a posterised result at low colour counts. Bambu Lab recommends images with clear, flat-colour regions for the best output, such as logos, icons, and graphic illustrations.

## Supported Printers and AMS Configurations

Chroma Canvas is available on all Bambu Lab printers equipped with an AMS: the X1C, X1E, P1S, and P1P with an AMS attached. It is not available on printers without multi-material capability, including the A-series machines.

A standard single AMS supports 4 filament colours. Chaining AMS units via AMS Hub allows up to 16 colours, which enables higher-fidelity reproductions with more distinct tonal regions. Bambu Lab has published example outputs at 4, 8, and 16 colour configurations to illustrate the quality difference.

## Availability

Chroma Canvas is available in Bambu Studio version 1.10.1 and later, released on May 14, 2026. The update is available through the standard in-app update mechanism in Bambu Studio and as a direct download from the Bambu Lab software page. No firmware update to the printer is required.

The feature is included at no additional cost for all Bambu Lab printer owners. Bambu Lab announced the release via its official forum on May 14, 2026, with a demonstration video showing a logo image being converted and printed in approximately 90 minutes at four colours on an X1C.
