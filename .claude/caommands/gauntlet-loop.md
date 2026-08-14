---
description: Fan out sub-agents with blind critics to build or polish a Modern Makes page/component against the locked design system and editorial voice, looping until the bar is met.
argument-hint: <what to build or polish, e.g. "the Voron 2.4 review page hero and verdict card">
---

# Gauntlet loop — Modern Makes

**Task:** $ARGUMENTS

Before doing anything else, read `CLAUDE.md` at the repo root (and `src/lib/hardware.ts` if the task touches verdicts) so the bar below is checked against the actual current rules, not a stale copy of them.

## Build method

Break the task into independent pieces (sections, components, or files). For each piece:

1. Spawn a worker sub-agent to build or revise that piece.
2. Spawn a **separate, blind** critic sub-agent — no shared context with the worker — to score the output against the bar below and name specific, fixable gaps. Don't let the critic invent its own standard.
3. Loop worker → critic on that piece, capping at 3 rounds. If it's still failing after 3, stop and report the specific gap instead of shipping it.

Report briefly after each round what the critic flagged and what changed — don't run silently through the whole loop.

## Bar to hit

Every piece must clear all of these before its critic signs off:

- **Design system, no exceptions.** Electric Orange (`#FF5A1F`) is the only accent — no other hardcoded hex anywhere in components; all brand colors come from CSS variables in `global.css`. Typography is Barlow Condensed + Lora + JetBrains Mono. `<style is:global>` wherever styles interact with JS class toggling. Liquid glass UI is `backdrop-filter` + a fixed background layer — never `liquid-glass-js`.
- **Aesthetic reference is The Verge / Wirecutter** — not maker/workshop textures, not All3DP's SEO-container/spec-sheet voice.
- **Editorial voice** (if the piece includes copy): always "we," never "I." Verdict-first — lead with the conclusion, not backstory. Specific beats vague ("Bambu's AMS Lite," not "a multi-filament system"). Confident, curious, occasionally opinionated, never hype-y. Banned words: game-changer, revolutionary, best-in-class, seamless. No invented metrics, no unconfirmed affiliate partners, no "we tested" language unless Matt has personally evaluated the hardware — verdicts synthesize community consensus (Reddit, Discord, YouTube, CNCKitchen) and should say so.
- **Verdicts route through `resolveVerdict()`** in `src/lib/hardware.ts` — taxonomy is locked to Workhorse / Bleeding Edge / Skip. Never hand-roll verdict logic in a component.
- **Known technical gotchas, checked not assumed:** any frontmatter field not present in every collection file needs `z.string().optional()` in the Astro schema or the build silently drops pages. `toSlug` must be defined separately inside `getStaticPaths` and again in the frontmatter render section. All `public/media/` paths are lowercase, hyphenated, no spaces (GitHub Pages is case-sensitive Linux).
- If the piece would violate the "no invented metrics / no untested hands-on claims" standard, the critic must flag it and stop the loop rather than pass it — don't quietly comply and don't quietly ship it either.

## When every piece clears the bar

Synthesize the final set of changes and summarize what iterated and how many rounds each piece took.

Then run project checks (lint/build as configured) to confirm nothing broke.

**Finish by committing locally** with a clear, conventional commit message describing what changed and why. Do **not** push — pushes are manual from GitHub Desktop only.
