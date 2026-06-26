---
title: "Bambu Lab A1 Fire Hazard: The AC-Board NTC Defect, Explained"
category: "SAFETY"
date: 2026-06-26
readTime: "4 min read"
heroImage: "/Media/articles/2026/05/bambu-lab-fire-safety/hero.webp"
excerpt: "A defective NTC thermistor on the AC board of early Bambu Lab A1 and A1 Mini printers can overheat and, in multiple reported cases, cause melting and fire. Units built before the Q3 2025 board redesign are the ones at risk — here's how to check and what to do."
featured: true
summary:
  - "Affects A1-series printers (A1, A1 Mini) made roughly June 2024–Q2 2025, before the Q3 2025 board redesign"
  - "Root cause: an under-spec NTC thermistor on the AC board that limits heated-bed inrush current"
  - "It can overheat to ~140°C (160°C on damaged units), melting nearby plastic; several fires reported"
  - "Bambu redesigned the board in Q3 2025 to remove the part — later units are not affected by this defect"
  - "No CPSC recall for this issue; Bambu offers AC-board replacement — confirm eligibility with your serial number via support"
---

<p class="art-lead">A defective component on the AC power board of early Bambu Lab A1-series printers can overheat badly enough to melt the chassis and, in multiple reported cases, start a fire. The issue is confined to units built before a Q3 2025 board redesign. If you own an A1 or A1 Mini from that window, it's worth acting on.</p>

## What's Affected

The defect involves the **Bambu Lab A1 and A1 Mini** (including A1 Combo bundles). The at-risk units were manufactured roughly **June 2024 through Q2 2025** — that is, *before* the Q3 2025 board revision. Bambu removed the offending component in the redesigned board, so A1-series printers produced after that change are not affected, and other Bambu models are not part of this specific issue.

This is the key point that early coverage often got backwards: **Q3 2025 is when the problem was fixed, not when affected units shipped.**

## The Defect

The culprit is an **NTC (negative-temperature-coefficient) thermistor on the AC distribution board**, whose job is to limit inrush current to the heated bed. According to community teardown reporting, Bambu used an under-spec NTC that didn't meet requirements. In affected units the component can overheat to roughly **140°C** by independent measurement — and Bambu has acknowledged that damaged parts can reach about **160°C**, hot enough to soften and melt surrounding plastic and wiring. Reports include real, sustained flames, not just discoloration.

For context, this is a *different* problem from the June 2024 heatbed-cable recall (CPSC 24-264, ~12,800 units). The AC-board NTC defect has **not** been the subject of a formal CPSC recall.

## Timeline and Bambu's Response

- Reports of melting AC boards surfaced in late 2025.
- Tom's Hardware published an investigation on **January 2, 2026**.
- Bambu **acknowledged the defect on January 5, 2026**, attributing failures to abnormal power surges and overvoltage events (such as lightning) and to regional voltage differences, and stated a failure rate "well below 0.1%."
- Incident reports nonetheless continued through 2026, and some owners described friction obtaining remedies — including offers of store credit rather than cash refunds.

We'd flag the gap between Bambu's "well below 0.1%" framing and the steady stream of community incident reports. Treat the low figure as the company's stated rate, not an independently verified one.

## How to Check Whether You're Affected

<div class="art-affected-box">
  <div class="art-affected-box-label">Are you affected?</div>
  <p>There is <strong>no public "read a specific character of your serial number" shortcut</strong> — ignore any such claim. Confirm eligibility properly:</p>
  <ol>
    <li>Do you own an <strong>A1 or A1 Mini</strong>? Other Bambu models are not part of this defect.</li>
    <li>Was it manufactured <strong>before the Q3 2025 board redesign</strong> (roughly June 2024–Q2 2025)? Those are the at-risk units.</li>
    <li>To confirm definitively, give <strong>Bambu support your serial number</strong> — they can tell you whether your printer has the affected board revision.</li>
  </ol>
  <p class="art-affected-example">Watch for warning signs: a hot-plastic or burning smell, or discoloration and heat damage near the power board.</p>
</div>

## What To Do

If your unit falls in the affected window, the cautious course is to **stop running unattended prints** until the board is addressed — an overheating AC board is a fire risk, and these printers are often left running for hours.

To request the remedy:

1. Confirm your model and production timing using the checks above.
2. Open a support ticket through the [Bambu Lab support portal](https://support.bambulab.com) with your serial number, and ask about the AC-board replacement for the A1.
3. Bambu publishes an official A1 AC-board replacement procedure on its wiki; support can direct you to it or arrange the repair.

## Bottom Line

This is a real, documented fire hazard on early A1-series printers — not a theoretical one. But it is narrower than some coverage implies: it's the **A1 line, built before the Q3 2025 redesign**, and the remedy is a board replacement. Later A1 printers and other Bambu models are not affected by this defect. For the most current guidance and region-specific contacts, check [Bambu Lab's official support page](https://support.bambulab.com) directly.
