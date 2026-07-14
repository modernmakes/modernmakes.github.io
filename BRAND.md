# BRAND.md — Modern Makes

> Canonical brand reference. Lives at the repo root alongside CLAUDE.md.
> Read this before writing, editing, or reviewing any user-facing copy, design, or verdict logic.
> Edit in place as the brand evolves — don't fork into vN copies. If this file changes meaningfully, re-upload it to the Claude.ai Project knowledge so chat-based strategy work stays in sync.

---

## 1. What Modern Makes Is

Modern Makes is an editorial publication covering the prosumer FDM self-build ecosystem — Voron, RatRig, VzBot, and HevORT — plus the broader consumer 3D printing market that feeds into it.

It is not a tutorial channel, not a personal maker journal, and not a broad DIY publication. It's the enthusiast's trusted editorial layer over a market that moves fast and is full of noise — the publication you wish existed when you first got into the hobby.

**Mission:** Surface the best of consumer 3D printing for people who love the hobby.

**Positioning statement:** Modern Makes is the editorial voice of the modern 3D printing enthusiast — covering the printers, materials, accessories, and culture that matter, without the fluff.

**What we are:**
- An editorial publication (not a personal channel)
- A buying-signal resource ("is this worth it?")
- A discovery engine for gear, mods, and accessories
- A newsletter-first media brand with organic search as the acquisition engine

**What we are not:**
- A beginner how-to resource
- A YouTube-first video channel
- A personal maker journal ("watch me print things")
- A broad DIY / general making publication

---

## 2. Audience

**Primary — The Enthusiast:** owns 1–2 printers, comfortable in OrcaSlicer/Bambu Studio, follows launches like tech enthusiasts follow Apple. 25–45, majority male, concentrated in US/UK/Germany/Australia. Treats printing as a hobby identity, not just a tool.

**High-value — The Builder/Prosumer:** Voron Discord, BOM spreadsheets, sources from LDO and West3D. High tolerance for technical depth, high willingness to spend. A single Voron BOM runs $800–$2,000 in parts — outsized affiliate ROI from a small, committed segment. Wants component deep-dives, high-temp guides, honest build-cost reality checks. Treat as a premium audience, not a niche afterthought.

**Secondary — The Curious Newcomer:** just bought their first printer, exploring the landscape. Content should be accessible to them but never watered down at the expense of the primary reader.

---

## 3. Competitive Differentiation

**All3DP** is the dominant SEO-first publication — strong on volume, authority, and news speed, weak on voice and warmth. It reads like a content operation, not a publication written by someone who cares.

**Our gap to fill:** no dominant newsletter-first, SEO-strong, editorially-voiced publication exists in this space with a real subscriber business. Where All3DP covers everything, we have a point of view.

---

## 4. Editorial Voice

**Enthusiast-first, editorial-grade.** We write as insiders who love this stuff — not as a company, not as a faceless website.

**Core rules — apply to every piece of written content:**
- Always "we," never "I." This is a publication, not a person's blog.
- Verdict-first: lead with the conclusion or the interesting thing, not the backstory.
- Specific beats vague — "Bambu's AMS Lite," not "a multi-filament system."
- Confident, curious, occasionally opinionated, never hype-y.
- **Banned words:** "game-changer," "revolutionary," "best-in-class," "seamless."
- Headlines are opinionated editorial takes, not SEO containers.
- Balanced coverage of open-source community controversies — no picking sides on drama.

**Voice characteristics:** confident without condescension, enthusiastic without hype, opinionated without contrarianism, accessible without being basic, informative without being dry.

**Tone by content type:**
| Content type | Tone |
|---|---|
| News & launches | Fast, punchy, direct |
| Reviews & roundups | Considered, specific, verdict-driven |
| Newsletter | Warm, conversational, slightly irreverent |
| Buying guides | Structured, clear, trust-building |
| Social / Shorts | High energy, hook-first |

**What we don't sound like:** a press release, a spec sheet, a Reddit argument, a beginner tutorial.

**Hard editorial standard:** No invented metrics. No unconfirmed affiliate partners. No "we tested" language for hardware not personally evaluated. Verdicts come from synthesizing community consensus (Reddit, Discord, YouTube, CNCKitchen data) — cite the synthesis, don't fabricate firsthand testing. Flag any request that would violate this rather than complying quietly.

---

## 5. Verdict Taxonomy

Locked: **Workhorse / Bleeding Edge / Skip**

All verdict logic routes through `resolveVerdict()` in `src/lib/hardware.ts`. Never invent new verdict labels. Never use the word "review" in titles, labels, or badges for hardware pages — use "specs," "verdict," "where to buy" instead.

---

## 6. Visual Identity

Not a maker-aesthetic brand — no kraft paper, no workshop textures, no circuit-board patterns. A clean, editorial-grade publication that happens to cover making. Reference aesthetic: The Verge or Wirecutter.

**Colors:**
| Token | Hex | Use |
|---|---|---|
| `--accent` | `#FF5A1F` | CTAs, prices, links, logo mark, verdict pills, active nav, affiliate links |
| `--accent-dark` | `#C93B08` | Accent hover/pressed states |
| `--accent-tint` | `#FFE9E1` | Accent backgrounds |
| `--text-primary` | `#1A1A1A` | Body/headline text |
| `--text-secondary` | `#5A5A5A` | Secondary text |
| `--text-meta` | `#8C8C8C` | Meta/muted text |
| `--border` | `#E2E2E0` | Dividers, borders |
| `--bg` | `#F7F6F3` | Page background |
| `--surface` | `#FFFFFF` | Card/panel surface |

One primary accent — everything else neutral. Never stretch, rotate, recolor, or add effects to logos. Never place the wrong colorway on the wrong background. Never use the wordmark under 120px wide. Use the lettermark alone for avatars, favicons, and tight spaces.

**Typography:**
- `--fd` Barlow Condensed 700/800 — display/headlines
- `--fb` Lora 400/500 — body prose
- `--fu` Barlow 400/500/600 — UI
- `--fm` JetBrains Mono 400/500 — specs/code

**Design principles:**
- Editorial choice over algorithm — every card placement should feel decided, not generated
- Voice in the design, not just the copy — layout should be as opinionated as the copy
- Newsletter as a product, not a widget — real estate on homepage, in articles, in nav
- Trust through restraint — no banner ads, no sidebar clutter, no 5-second pop-ups
- Verdict UI is a first-class design system component, not an afterthought
- Prosumer content gets its own visual lane — denser, more technical, darker — without alienating the mainstream reader

Design system rules: all brand colors as CSS variables in `global.css`, no hardcoded hex in components. `<style is:global>` required wherever styles interact with JS class toggling. Use the `impeccable` skill for design audits, `hallmark` on new page creation, `transitions.dev` on interactive/animated components.

---

## 7. Site Tagline (rotating)

Footer tagline rotates from a fixed pool every 4 hours (same tagline shown site-wide within a given window — deterministic by time bucket, not random per pageload). Implementation lives in `src/components/Footer.astro`.

**Anchor line:** "Never stop tinkering."

**Current pool (14):**
1. Never stop tinkering.
2. Still calibrating. Always will be.
3. We read the changelogs so you don't have to.
4. Chasing the next 0.1mm.
5. Built for people who never call a print "finished."
6. For people who read Discord before bed.
7. Always one upgrade away from done.
8. Never satisfied with stock firmware.
9. The build is never actually finished.
10. Made for people with too many nozzles.
11. Print first, sleep later.
12. Still tuning. Still tinkering.
13. For the ones who source their own BOM.
14. Obsessed with the details nobody else covers.

`Footer.astro` is the single source of truth for the actual strings — this list is documentation, keep it in sync manually if the pool changes.

---

## 8. Monetization & Growth Priorities

- Organic search + email list are the primary acquisition engines
- Revenue: affiliate (Fabreeko, West3D, KB3D, Amazon, Micro Swiss, Mellow3D), direct sponsorships, programmatic
- Content pillar priority: printer reviews/roundups, materials, buying guides, prosumer build content > software/slicers > news
- Voron builder segment is high-value (single BOM = $800–2,000) — technical depth here has outsized affiliate ROI

---

## 9. Change Log

| Date | Change |
|---|---|
| 2026-07-14 | Consolidated brand-guide_1.md, brand-guidelines.html voice/color/type sections, and footer tagline decision into this single canonical file |
