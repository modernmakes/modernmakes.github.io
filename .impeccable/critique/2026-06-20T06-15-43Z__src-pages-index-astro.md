---
target: src/pages/index.astro (homepage)
total_score: 32
p0_count: 0
p1_count: 0
timestamp: 2026-06-20T06-15-43Z
slug: src-pages-index-astro
---
## Design Health Score

_Re-critique after the homepage P1 fix pass (commit `00f03a9`). Previous run: 30/40._

| # | Heuristic | Score | Δ | Key Issue |
|---|-----------|-------|---|-----------|
| 1 | Visibility of System Status | 3 | — | Newsletter states solid; ticker is now honest (2 real links, 3 informational). |
| 2 | Match System / Real World | 4 | ▲ | "Review" contradiction gone; now speaks the brand's own vocabulary consistently. |
| 3 | User Control and Freedom | 3 | — | Reduced-motion now stops the ticker; touch users still can't pause it without that preference. |
| 4 | Consistency and Standards | 3 | ▲ | Side-stripes + "Review" + off-scale radii resolved; eyebrow-on-every-section keeps it from 4. |
| 5 | Error Prevention | 3 | — | Newsletter type=email + required; few error surfaces. |
| 6 | Recognition Rather Than Recall | 4 | — | Everything visible and labeled. |
| 7 | Flexibility and Efficiency | 3 | — | Nav search with Enter-to-go. |
| 8 | Aesthetic and Minimalist Design | 3 | — | Cleaner now (dead carousel CSS gone); eyebrow cadence is the remaining noise. |
| 9 | Error Recovery | 3 | — | Newsletter catch resets button; browser-default validation. |
| 10 | Help and Documentation | 3 | — | Tool cards self-describe. |
| **Total** | | **32/40** | **▲2** | **Good — all P1s cleared; one deferred P2 holds the ceiling** |

## Anti-Patterns Verdict

**Does this look AI-generated?** Less so than last pass. The two structural tells (side-stripe borders) are gone; one cadence tell (eyebrow on every section) remains by choice.

**LLM assessment:** The brand-integrity and design-system breaches that undercut the last version are resolved — no "Review" label, no side-stripes, no phantom 400mm Voron variant, no off-scale radii. The composition was already strong; it now reads as more deliberately *this* system. The single remaining AI-grammar signal is the tiny uppercase tracked orange eyebrow leading nearly every section ("Printer Ecosystems", "Free Weekly Newsletter", "Free Tools", "Builds & Prosumer", "Latest") — deliberately deferred this round.

**Deterministic scan:** `detect.mjs` exit 2, but **0 warnings** — both `side-tab` hits cleared, both `5px`/`9px` radius advisories cleared. The 8 remaining are all **advisory** `design-system-color`: decorative dark gradient stops in `HomeBuilds` (image-area fallback fills) and one `rgba(34,197,94,.12)` verdict-green in `HomeLatestArticles` that IS documented (detector can't match the rgba form to the hex token). All pre-existing and intentional; none are defects.

**Visual overlays:** Not run this pass. Source + deterministic review only, consistent with the prior run.

## Overall Impression

The fix pass did what it set out to: every P1 is closed and the page now honors the publication's own rules. It moved from "good homepage with integrity holes" to "good homepage that's unmistakably this brand." The remaining gap to a mid-30s score is almost entirely the **eyebrow cadence** — a single, contained, deliberately-deferred change.

## What's Working

1. **Resilience is now real.** The reveal sections (`.la-card`, `.eco-container`, `.nlcta-container`) are visible by default and only hide under `html.js` + `prefers-reduced-motion: no-preference`, with observer failsafes. No-JS, crawlers, and reduced-motion users can't get a blank section anymore — important for an SEO-dependent publication.
2. **Motion now respects the user.** Hero ken-burns and the 40s ticker both have `prefers-reduced-motion: reduce` fallbacks; the hero correctly restores `opacity:1` so it can never ship blank.
3. **The page is honest.** Dead ticker links became real `/news/` routes or plain text; the misattributed "Prusa CORE One INDX" is corrected to "Bondtech INDX"; the phantom 400mm Voron variant is gone. Accuracy is the brand's moat and it now holds.

## Priority Issues

- **[P2] Eyebrow above nearly every section.** "Printer Ecosystems", "Free Weekly Newsletter", "Free Tools", "Builds & Prosumer", plus "Latest" — the tiny-uppercase-tracked-kicker cadence on consecutive sections.
  - **Why it matters:** It's the last remaining AI-grammar signal on the page and the main thing keeping Consistency/Aesthetic at 3 instead of 4.
  - **Fix:** Vary the cadence — open one or two sections cold on the condensed headline, or convert the kicker into a deliberate named brand device. Don't repeat the same treatment section after section.
  - **Suggested command:** /impeccable typeset

- **[P3] Ticker can't be paused on touch without a motion preference.** The 40s scroll pauses on `:hover` only; a mobile user who hasn't set reduced-motion has no way to stop it to read or tap.
  - **Why it matters:** Minor readability friction for the distracted mobile reader (Casey).
  - **Fix:** Pause on `:focus-within`/tap as well, or add a small pause affordance. Low urgency.
  - **Suggested command:** /impeccable adapt

## Persona Red Flags

**Jordan (First-Timer):** Previously landed back on the homepage from a dead ticker link — now the two linked items go to real articles and the other three are plainly non-interactive text. No false affordance. Resolved.

**Riley (Stress Tester):** JS-off / slow-3G no longer hides the Latest grid, ecosystem block, or newsletter (visible-by-default + failsafe). The 400mm Voron error is gone. Residual: may wonder why three ticker items aren't clickable, but they read as a news strip, not broken links. Largely resolved.

**Casey (Mobile):** Reduced-motion now stops the ticker. Residual [P3]: without that preference set, the ticker still only pauses on hover, which is awkward one-handed.

## Minor Observations

- **Visible hero headline is an `<h2>`** while the document H1 is sr-only — unchanged, still a defensible editorial-homepage choice.
- **Advisory gradient colors** in `HomeBuilds` are undocumented decorative fills. If you want a clean `detect.mjs` exit, either add them to the sidecar as named gradient tokens or persist value-specific ignores; otherwise they're harmless.
- **Schema URLs hardcode `modernmakes.com`** (pending-domain item) — out of scope here, but worth fixing alongside the domain move.

## Questions to Consider

- If you varied the eyebrow cadence on just two sections, would the page cross from "good landing page" into "clearly a publication"?
- The ticker is now half-linked, half-text — is a news ticker that's *mostly* non-clickable the right pattern, or should it become fully informational (no links) or fully sourced (every item linked)?
