---
title: "OrcaSlicer 2.3.2 Released: 3MF Security Fix and Wipe Tower Options"
category: "SOFTWARE"
date: 2026-05-08
readTime: "2 min read"
excerpt: "OrcaSlicer 2.3.2 is out as a stable release for Windows, macOS, and Linux, led by a security fix for a 3MF path-traversal vulnerability plus a new configurable wipe-tower setting and Linux/Flatpak fixes."
summary:
  - "Stable release for Windows, macOS, and Linux (not a release candidate)"
  - "Security fix: a crafted .3mf file could write to arbitrary filesystem locations on import"
  - "New printer-level setting to choose the wipe tower type"
  - "Linux/Flatpak fixes (startup black screen, missing translations) and a CLI segfault fix"
  - "Available from the official OrcaSlicer GitHub releases; Linux via Flathub"
---

<p class="art-lead">OrcaSlicer 2.3.2 has shipped as a stable release across Windows, macOS, and Linux. It is primarily a maintenance and security update, headlined by a fix for a 3MF file vulnerability, with a useful new wipe-tower option and a batch of Linux and CLI fixes.</p>

## The Security Fix Is the Reason to Update

The most important change is a security patch: earlier builds had a vulnerability where a **crafted `.3mf` file could write to arbitrary filesystem locations via path traversal during import**. Since 3MF project files are routinely shared on model sites and in communities, opening one from an untrusted source carried real risk. Anyone on an older 2.3.x build should update for this fix alone.

## What Else Changed

- **Wipe tower type setting** — a new printer-level option lets you select the wipe tower type directly, instead of it being determined solely by the printer model.
- **Linux / Flatpak fixes** — resolves a black screen on startup (by skipping Freeze/Thaw during OpenGL loading) and fixes translations not loading in Flatpak builds.
- **CLI segfault fix** — addresses a crash that made command-line mode unusable, where render-data code dereferenced a null plater pointer.
- **UI refinements** — the title bar now expands to use available space, and the main tabs collapse to icon-only mode when the window is too small.

## How to Download

OrcaSlicer 2.3.2 is available from the **official OrcaSlicer GitHub releases page** for all three platforms. Linux users can also install it from Flathub:

```
flatpak install flathub com.orcaslicer.OrcaSlicer
```

Stable releases can be updated through the built-in update checker. As always, prefer the official GitHub releases over third-party mirror sites to be sure you're getting an untampered build — especially relevant given this update is itself a security fix.

## Context

OrcaSlicer remains one of the most widely used open-source slicers, and it sits at the center of the ongoing dispute over Bambu Lab's closed "Authorization Control" firmware, which blocks unofficial software from communicating with current Bambu printers. For users on the open side of that line, keeping OrcaSlicer current — security fixes included — matters more than ever.
