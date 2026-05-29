---
title: "OrcaSlicer v2.3.2 RC2 Released for Linux"
category: "SOFTWARE"
date: 2026-05-08
readTime: "2 min read"
excerpt: "OrcaSlicer has released version 2.3.2 Release Candidate 2 for Linux, continuing the march toward a stable 2.3.2 release with bug fixes and stability improvements."
summary:
  - "Release Candidate 2 — one step from stable release"
  - "Linux build released May 8, 2026"
  - "Part of the ongoing 2.3.x series improvements"
  - "Available at orca-slicer.com/download"
  - "Windows and macOS builds expected to follow"
---

<p class="art-lead">OrcaSlicer has published version 2.3.2 Release Candidate 2, a Linux-targeted build that moves the 2.3.x branch one step closer to a stable release, with bug fixes accumulated since RC1 and improvements to print profile handling.</p>

## Release Candidate Status

A release candidate is a build that the development team considers feature-complete and stable enough for broad testing before a general release. RC2 indicates that issues found in RC1 have been addressed and no further significant bugs are known. If RC2 passes community testing without surfacing critical regressions, it will be promoted to the stable 2.3.2 release with no further code changes.

The Linux build was published on May 8, 2026 via the OrcaSlicer GitHub releases page. Windows and macOS builds for RC2 are expected to follow within days, following the project's standard practice of staggering platform releases to allow platform-specific testing time.

## What the 2.3.x Series Brings

The 2.3.x release series represents a sustained improvement phase for OrcaSlicer following the 2.2 stable release. Key additions across the 2.3.x cycle include updated Arachne wall generation settings, expanded multi-material calibration tooling, revised bed mesh compensation handling, and a reworked print statistics panel.

The 2.3.2 point release specifically addresses stability issues reported in 2.3.1, with the most-cited fix being a crash condition that occurred when importing certain multi-part 3MF files. A secondary fix resolves an issue with support interface layer parameters not being applied correctly in some tree support configurations.

The full changelog for 2.3.2 RC2 relative to RC1 is available on the OrcaSlicer GitHub releases page and lists 11 commits since RC1, all classified as bug fixes with no new features introduced.

## How to Download

RC2 is available at [orca-slicer.com/download](https://orca-slicer.com/download) and directly from the OrcaSlicer GitHub releases page. The Linux build is distributed as an AppImage, which runs on most modern distributions without installation. Users on Ubuntu, Fedora, and Arch Linux have confirmed successful runs of RC2 in initial community reports.

Users already running RC1 can update by downloading the RC2 AppImage and replacing the previous version. There is no in-app update mechanism for release candidate builds — stable releases can be updated via the built-in update checker, but RC builds require a manual download.

## What to Expect From the Stable Release

If no critical issues are found in RC2, OrcaSlicer 2.3.2 stable is expected to ship within one to two weeks of the RC2 publication date. The stable release will be the recommended version for all platforms and will be distributed through the main download page alongside updated printer profiles.

Users running OrcaSlicer 2.3.1 stable who do not want to test a release candidate can wait for the stable 2.3.2 release, at which point the in-app update notification will appear automatically.
