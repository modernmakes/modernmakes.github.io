# Modern Makes — Native-Feel UI/UX PRD

Nov 3, 2026 · @Matt

## Summary

We make modernmakes.github.io behave like a native Apple app — the iOS apps, not apple.com's scroll-choreographed product pages. Six systems do it: instant navigation, a smart top of screen, press physics, sheets and states, a personal Workbench that gives people a reason to return, and an installable app mode with offline tools. A seventh, personalized content and ads, comes last because it runs on the others' data.

**Recommendation:** build in eight gated phases (0–7) on the current Astro 4 static stack, no framework change and no SPA router. Phase 0 is a clickable feel prototype you sign off on before any repo change, because "feel" can't be approved from a document.

**Pushback, up front:** "users come just to interact with it" is only true if every interaction does a job. Your own vault says decorative choreography loses readers (Luke Carter's clarity-first framework). Apple apps are memorable because they're fast, direct and consistent, not because they animate a lot. So the rule here is: motion only where it explains a change, delight only on low-frequency moments.

## What we found

The site already has a strong design system (DESIGN.md, tokens, a shared reveal observer, a scroll-aware glass nav). What it lacks is the connective tissue that makes an app feel like one thing: every click is a full white-flash page load, presses give no physical response, and nothing remembers the reader. Findings from the repo and a rendered snapshot of the 30 Oct build (364 pages):

| Area | Finding | Impact |
| --- | --- | --- |
| Navigation | No view transitions, no prerendering. Every link is a cold load with a blank frame. | The single biggest "website, not app" tell |
| Fonts | Google Fonts loaded via CSS `@import` in global.css: a render-blocking chain (HTML → CSS → font CSS → fonts) | Slower first paint, font swap shift |
| Press feedback | Hover lifts exist; no `:active` press states; hover styles not gated to mouse, so they stick on tap | Taps feel dead on phones |
| Top of screen | Static nav + search field. No collapsing title, no reading progress, no keyboard search | Nothing tells you where you are or what's new |
| Imagery | Latest-article and Voron hub cards render as empty dark boxes (hero images missing) | Polish on empty boxes reads as unfinished |
| Contrast | "On the roadmap" ecosystem rows render at very low white opacity | Likely fails WCAG AA |
| Memory | Only the Voron model choice persists. Tools forget inputs; nothing is saved | No reason to return |
| Honesty | Ticker shows "Voron 2.4 BOM costs down 12% year-on-year" and "Bambu PETG HF 1kg at $19.99 — 20% off this week", both unlinked and unsourced | Breaks the no-invented-metrics rule; fix in Phase 1 regardless |
| Dead code | Base.astro has a `form[data-nl]` handler that shows "Subscribed ✓" without sending anything. No form uses it today | Latent fake-success bug; delete it |

Screenshots were taken with web fonts blocked, so typography looked worse than live. Nothing here was checked on a real iPhone yet.

## North star and principles

**North star: "The Instrument."** DESIGN.md calls the visual system The Workshop Press. This PRD adds its behaviour: the site should feel like a well-machined tool on the bench. Tight tolerances, no slop, every input answered within a frame, and it remembers how you left it. Precision is the feeling people come back for, the same way a good caliper or a tuned printer feels good to use.

Principles, in priority order (a lower one never overrides a higher one):

1. **Speed is the first feature.** An app feels native because it never makes you wait. Every system below must pay for itself in the performance budget (Palmkvist in the vault: beautiful and fast is an architecture problem, not a tradeoff).
2. **Clarity before choreography.** The answer (verdict, spec, price) is readable in five seconds. No scroll-jacking, no hover-to-reveal for essential info, no forced pauses (Luke Carter's clarity-first framework).
3. **Every input gets a response.** Press, hover, focus, success and failure all have a designed state. Silence after a tap is a bug.
4. **Motion explains, never decorates.** Motion shows where something came from, where it went, or that something changed. Frequency decides intensity: what you do 100 times a day is instant; a once-a-visit moment may delight.
5. **Continuity.** Things that persist between pages (nav, the selected printer, an open bench) never flash or re-animate.
6. **Respect the reader.** Reduced motion swaps movement for crossfades, it doesn't strip feedback. AA contrast. Full keyboard. No tracking beyond the planned GA4 setup.
7. **One signature, used sparingly.** Electric Orange stays under 10% of any screen (the Pointer Rule). The one ownable motion moment is the extrusion line (System 1).

What "Apple" means here: SF-style press physics, interruptible springs, sheets that follow your finger, large titles that hand off to the nav bar, state restoration. What it does not mean: copying Apple's visual language, Liquid Glass everywhere (DESIGN.md allows glass only on the nav), or scroll-driven product-page theatre.

## Success criteria

Every target is a lab number we can verify before each push. GA4 is collecting (confirmed 3 Nov 2026) but traffic is still light, so behaviour targets such as returning visitors are set once there are 60 days of meaningful data.

| Measure | Target | How it's checked |
| --- | --- | --- |
| Largest Contentful Paint, mobile, Slow 4G | ≤ 1.8 s on 6 template pages | Lighthouse, before/after each phase |
| Cumulative Layout Shift | ≤ 0.02 (today's Voron page: 0.009) | Lighthouse + Playwright trace |
| Interaction to Next Paint (lab proxy: Total Blocking Time) | INP ≤ 100 ms; TBT ≤ 100 ms | Lighthouse; real-user INP once analytics is live |
| Press-to-feedback latency | First visual response inside 1 frame (≤ 16 ms), CSS only | Playwright trace on buttons and cards |
| Prerendered navigation (Chromium) | New page visible ≤ 100 ms after click on hovered links | `activationStart` in PerformanceNavigationTiming |
| Accessibility | 0 serious or critical issues; full keyboard path through palette, sheets, Workbench | accesslint scan + manual keyboard pass |
| Reduced motion | Every system usable with crossfade-only fallback | Playwright with `reducedMotion: 'reduce'` |
| Interaction quality | Each signature interaction scores ≥ 8/10 from a reviewer that didn't build it | Independent critic pass (gauntlet-loop / review-animations) on recorded video |

## System 1 — Instant navigation

Pages should open the way an app pushes a screen: no white frame, the nav never blinks, and the thing you tapped becomes the thing you're looking at. All of this is native browser behaviour, so it adds almost no JavaScript.

**Prerender on intent.** A speculation-rules block in Base.astro prerenders same-origin links with `moderate` eagerness: on desktop after a 200 ms hover or on pointer-down; on mobile by viewport heuristics. Chrome caps this at 2 concurrent prerenders, so it can't flood GitHub Pages. GA4 already delays page views until a prerendered page is shown. Chrome and Edge only today; Safari has it behind a flag; Firefox navigates normally.

**Native page transitions.** One CSS rule, `@view-transition { navigation: auto; }`, turns every same-origin navigation into an animated hand-off (Chrome/Edge 126+, Safari 18.2+; Firefox gets a normal load, nothing breaks).

- Nav is pinned with its own transition name, so it stays perfectly still while the page underneath changes.
- Forward: the new page fades in while rising 8 px; the old page fades out. 280 ms. Back: reversed, so direction is legible. Direction is set in `pagereveal` from the navigation type.
- Card expansion on the three journeys that matter (hardware, article and ecosystem cards): the tapped card grows into the top of the next page and shrinks back on Back, like iOS's zoom transition. The photo never travels on its own. Names are assigned only to the clicked element at `pageswap` and cleared after, per Chrome's guidance, so 16 cards don't all try to morph.
- Reduced motion: a 150 ms crossfade, no movement.

**The extrusion line (signature moment).** When a navigation isn't prerendered and takes longer than 150 ms, a 2 px Electric Orange line draws left to right under the nav with a brighter point at its head, like a nozzle laying a first-layer line. It decelerates toward 90% and snaps to 100% when the new page reveals. Fast navigations never show it. It's the one piece of motion that is ours alone, and it carries information (something is loading).

**Load the page that's already there.** Self-host the four font families as subset woff2, preload the two above-the-fold weights (Barlow Condensed 800, Lora 400), and give each fallback font matching metrics (`size-adjust`, `ascent-override`) so the swap doesn't shift text. Every image gets width/height; the hero image gets `fetchpriority="high"`.

**Rejected: Astro's `<ViewTransitions />` router.** It turns the site into a single-page app. 75 source files contain scripts that assume a fresh page load, and each would need re-initialising on every navigation. That's a large bug surface for something the browser now does natively.

## System 2 — The top of the screen

The top 80 px answers three questions at all times: where am I, what's here, and what changed. Everything else stays out of it.

| Element | Behaviour | Where |
| --- | --- | --- |
| Large title hand-off | The page H1 sits large under the nav, like iOS. Scrolling past it fades a compact copy of the title into the nav (centre on mobile, left of search on desktop). Built with a CSS scroll-driven animation; an IntersectionObserver class toggle covers Safari and Firefox. On mobile the wordmark sits in the centre at rest; on desktop, scrolling up 56 px brings the links back | Every page with an H1 |
| Reading progress | A 1 px hairline under the nav fills as you read. Muted grey, not orange: orange belongs to the extrusion line and the one CTA | Articles, guides, comparisons |
| Command palette | ⌘K / Ctrl+K or `/` opens it on desktop; the search icon opens it as a full-height sheet on mobile. Searches a build-time JSON index of hardware, articles, guides, tools and spec tokens. Results show the verdict badge and price inline, so many questions are answered without leaving the page. Groups: Hardware, Articles, Tools, Actions (set my printer, open bench, switch units). Recents shown on open. Arrow keys move, Enter opens, ⌘Enter opens a new tab. Highlighting a result prerenders it. /search stays as the no-JS fallback | Global, replaces the expanding search field |
| Freshness | "Hardware data synced 6 h ago", computed from the build time (the nightly Airtable fetch triggers deploy.yml, so every build carries fresh data). Shown in the palette footer and hardware index headers | Palette, /hardware indexes |
| New-since-last-visit dots | A 6 px dot on News, Guides or Hardware when something was published after the reader's last visit. Last-visit time lives only in that browser | Nav (gated with System 5) |
| Browser chrome | `theme-color` matches the nav (#1A1A1A) so mobile Safari and Chrome blend into it; safe-area insets respected | Global |

The palette opens in 120 ms with no staggered result animation: people will use it many times a visit, and Emil Kowalski's frequency rule says high-frequency actions get the least motion.

## System 3 — Touch, press and feedback

Every control responds the instant a finger or cursor lands on it, then settles with a spring when released. This is the detail people feel without naming, and it's pure CSS, so it costs nothing in speed.

| Control | Press (down) | Release | Hover (mouse only) |
| --- | --- | --- | --- |
| Primary button (btn-buy, subscribe) | scale 0.97, 80 ms ease-out, colour to accent-dark | Spring back, 300 ms | Background to accent-dark, 150 ms |
| Card (hardware, article, tool) | scale 0.985, border to border-strong | Spring back, 300 ms | Existing 1 px lift + orange glow; image scales 1.02 inside its frame over 400 ms |
| Chip, filter tab, segmented control | scale 0.96 | Spring back, 250 ms | Border deepens |
| Nav link, text link | No scale; background wash at 6% white | Fade out, 150 ms | Existing wash + 1 px lift |
| Icon button (search, menu, close) | scale 0.92 inside a 44 × 44 px hit area | Spring back, 250 ms | 6% wash circle |

Rules that apply everywhere:

- Hover styles live inside `@media (hover: hover) and (pointer: fine)`, so phones never get stuck hover states.
- The grey tap flash is turned off (`-webkit-tap-highlight-color: transparent`) because our own press state replaces it; `touch-action: manipulation` removes double-tap zoom delay on controls.
- Every hit target is at least 44 × 44 px (Apple HIG), including filter tabs and the mobile nav icons.
- Filter tabs on hardware indexes animate the change: cards glide to their new positions with a same-document view transition instead of the grid jumping. The sliding underline already has tokens (tabs-sliding).
- Copy on tap only where people paste the value somewhere else: part numbers and tool results. Specs are for reading, so they aren't buttons.
- Haptics, honestly: real toggles (mm/in, °C/°F, filters) become native `<input type="checkbox" switch>` controls. Safari on iPhone plays its own system haptic for those, legitimately. Android gets a 10 ms `navigator.vibrate` on add-to-bench and copy. Decided 3 Nov: main actions (menu and sheets opening, sheet detents, filters, add to Workbench, copy, form errors) get a haptic on iPhone through a transparent label over each control wired to a hidden native switch (the ios-haptics technique). It only fires on a real tap, so moments with no tap (a sheet snapping into place, a form error) stay silent on iPhone and vibrate on Android. It's undocumented, but if WebKit removes it the only effect is silence.
- Typography details: `text-wrap: balance` on headings, `pretty` on paragraphs, tabular figures on every spec and price, an orange-tint `::selection`.

## System 4 — Sheets, overlays and states

Overlays behave like iOS sheets on phones and like anchored popovers on desktop. Every action that can take time shows where it is, and nothing ever ends in silence.

**Sheets (mobile, under 768 px).** Filters, where-to-buy, share, the palette and the mobile menu open as bottom sheets built on native `<dialog>`, so focus trapping, Esc and the inert background come free.

- Two detents: medium (half height) and large (92%). A grab handle sits at the top.
- Drag follows the finger 1:1. Release dismisses on a flick (velocity over 0.5 px/ms) or past 40% of the height, otherwise it springs back. Velocity, not just distance, per Emil Kowalski's guidance.
- The page behind dims to 40% and scales to 0.96 with rounded corners, the iOS card-stack cue that you're one level deeper.
- `overscroll-behavior: contain` so scrolling inside a sheet never scrolls the page.
- Moving the mobile menu from a top slide-down to a bottom sheet puts every link in thumb reach. This changes existing behaviour, so it's called out for sign-off.

**Popovers (desktop).** The Printers dropdown and any menu scale in from 0.96 at the trigger's position (origin-aware), 180 ms; modals scale from centre. Built on the Popover API where it fits.

**Every async action has five states.** Idle, pressed, working, success, failure. Applied first to newsletter subscribe:

1. Pressed: the press physics from System 3.
2. Working: the button keeps its width and the label crossfades to a small spinner, so nothing reflows.
3. Success: a check draws in 300 ms and the copy changes to "You're in. First issue lands Tuesday."
4. Failure: a 3-cycle, 2 px horizontal shake over 240 ms (the macOS wrong-password cue) and an inline message saying what to do.

**Toasts.** Bottom centre, one at a time, 2.4 s, swipe to dismiss, announced with `aria-live="polite"`.

**No empty boxes.** Cards without a hero image get a designed typographic cover (category eyebrow, headline set large in Barlow Condensed on the dark tonal plane, mono date) instead of a blank rectangle. Product images fade in over 200 ms on decode against `--surface-media`, so they never pop.

**Empty and error states in our voice.** The 404 says "This page didn't stick to the bed" and opens the palette. A search with no hits suggests the three closest hardware names.

## System 5 — The Workbench

Polish earns a second visit; utility earns the tenth. The Workbench makes Modern Makes the place where a reader's build lives, so they come back to check on it. Everything is stored in their browser only: no accounts, no cookies, no server.

| Feature | What the reader sees | Why they return |
| --- | --- | --- |
| My printer | Pick ecosystem, model and size once (e.g. Voron 2.4, 350 mm). A chip in the context row shows it. Hardware cards gain "Fits your printer" or "Check adapter" labels from the existing compatibility engine (configurator-engine.ts). Indexes can sort fits-first. The existing `voron-model` key folds into this | Every hardware page now answers "will it fit mine?" |
| Bench | A + control (a check once added) on every hardware card and detail page, never a bookmark or bag icon, which read as a store. A one-time tip points at the first + on a reader's first visit. Saving fills the icon and ticks a counter on the nav bench icon with a spring. The bench sheet lists parts by subsystem with a running estimated total from listed prices (labelled "est., listed prices") and where-to-buy links | Their parts list lives here; it's the affiliate path |
| Share a bench | The bench encodes into a URL. Opening one shows a read-only bench with "Copy to my bench". Also hands off to the configurator's build planner | Builders send BOMs to friends and Discord |
| Tools remember | Each calculator keeps its last inputs and units. Results show "last run 3 days ago" | The bench-side tools become a habit |
| Pick up where you left off | Articles and guides remember scroll position; on return a pill offers to jump back | Long guides get finished |
| Recently viewed | Last 8 pages and tools appear when the palette opens | Fast return to what they were comparing |
| Clear my data | One control in the footer wipes everything | Trust |

**Conflict to resolve before building:** the September war council parked Phase 2 personalization (inferred, cookie-based affinity tracking) until ad slots are live and a GA4 return-visitor baseline exists. The Workbench is explicit and reader-initiated, nothing is inferred and nothing leaves the browser, so we treat it as separate. One boundary keeps it that way: My printer filters hardware pages only and never reorders the homepage. Homepage reordering arrives with System 7, once its gates pass. See Open questions.

## System 5b — Workbench page and builds (plan, 3 Nov)

The quick Workbench sheet stays as it is. A full Workbench page holds **builds**: a build is one printer plus the parts chosen for it, and a reader can run several side by side (a Voron 2.4 and a Voron V0.2, say). The decisions below each settle a tension found while planning it. Signed off 4 Nov 2026: + goes to the active build, progress tracking is in v1, and exports are CSV, text, PDF and share link.

| Question | Decision | Why |
| --- | --- | --- |
| Where does + put a part? | Into the active build. The toast says "Added to Voron 2.4 · Change". With no build yet, parts land in an Unsorted tray | Asking every time adds friction to the most-used action; a default plus one-tap change is how Apple Music's Add works |
| My printer vs builds | Merged. The active build's printer drives every "Fits your…" label; the chip becomes "Building: Voron 2.4 350" | Two printer settings would contradict each other |
| Which printers | From the ecosystem data: Voron 2.4, Trident, V0.2, RatRig V-Core 3/4, VzBot, HevORT, each with build size, plus Other | The current small Voron is the V0.2; the V0.1 is a legacy kit |
| What a build shows | Parts grouped by subsystem (hotend, extruder, probe, toolboard…), each with quantity, estimated price, fit against the build's printer, retailer links, Move to and Remove. Empty subsystems show as prompts ("No probe yet") | Turns a list into a checklist |
| Progress | Each part is Planned, Ordered or Installed | Builds take weeks; tracking progress is the reason to come back |
| Totals | Per build: estimated total and "left to buy", at listed prices in USD | Matches the data we hold |
| Voron configurator | Its build planner gets "Save as build"; builds live only in the Workbench | No second planner to maintain |
| Export | CSV (opens in Excel, Google Sheets, Numbers), Copy as text (a table for Discord or Reddit), Print or Save as PDF, Share link (read-only view with "Copy to my Workbench") | Writing straight into Google Docs or Sheets needs Google sign-in and a server; importing a CSV into Sheets takes two clicks |
| Storage | Browser only, with a versioned data format. The share link doubles as backup and restore, and as the way to move builds to another device or the new domain | No accounts in v1 |
| Money | Retailer links are labelled affiliate links; "Open all at Fabreeko" per build comes later | The Workbench is the natural affiliate surface |

**Page layout:** a row of build cards at the top (name, printer, part count, total) with New build; the selected build's header with editable name, printer picker and notes; then the Unsorted tray if it has parts ("Assign to…"); then the subsystem groups; a sticky footer with total, left to buy and Export. Entry points: "Open full Workbench" in the quick sheet, the menu and search.

**Not in v1:** accounts and sync, price-drop alerts (a strong v2 reason to return, built on the nightly data), drag-and-drop between builds (Move to covers it), comparing prices across retailers.

## Verdict taxonomy v2 (draft for BRAND.md)

Decided 3 Nov: four verdicts, judged within a hotend's flow class, one Benchmark per class, 12 months as the proven line. Written into BRAND.md section 5 on 4 Nov (repo and project copy).

| Verdict | Meaning | Test |
| --- | --- | --- |
| Benchmark | The one we'd point a friend to in its flow class | Community default for the class, mounts on the major toolheads, no unresolved widespread failures. One per flow class |
| Workhorse | Proven and safe, just not the pick | Shipping 12+ months with a broad base of documented builds and no failure pattern; loses to the Benchmark on price, performance or support |
| Bleeding Edge | Newest or most experimental; buy it if you'll tune it | Shipping under 12 months, or too few documented builds to call it proven |
| Skip | Don't | Something in the same class does the job better for similar money, or there's a recurring failure pattern |

Flow class: Standard under 50 mm³/s, High 50–79, Extreme 80 and up, from listed max flow. Setup needs (water cooling, PT1000 firmware changes, custom mounts) are listed on the part, not built into the verdict, so a hotend like the Goliath graduates from Bleeding Edge once it has years of documented builds. Every verdict cites its consensus sources, and a class is re-checked when a new hotend enters it. Other hardware categories need their own class axis before they adopt this.

## System 6 — App mode

The literal version of "functions like an app": Modern Makes installs to a phone's home screen or a desktop dock and its tools work with no signal, which matters in a garage or basement workshop.

- **Manifest.** Name, lettermark icons (192, 512, maskable), `display: standalone`, dark theme colour, and home-screen shortcuts to Tools, My bench and Search.
- **Service worker.** HTML is network-first with a cached fallback, so readers never get stale articles when online. Hashed CSS, JS and fonts are cache-first. Calculator pages and the reader's last 20 visited pages are available offline. A cache version tied to each build, plus a kill-switch file, guards against a bad worker.
- **Updates.** When a new build is live, a toast offers "New version ready, refresh" instead of swapping content under the reader.
- **Standalone details.** iOS standalone apps have no browser back button, so the nav shows a back chevron on inner pages when `display-mode: standalone`. Safe-area padding for the notch and home indicator. A voice-matched offline page ("No signal on the bench. Your tools still work.").
- **Install prompt, earned.** Never on first visit. Android/Chrome: our own quiet prompt after the second visit and a Workbench action. iOS has no prompt API, so the bench sheet carries a one-time "Add to Home Screen" tip.

## System 7 — Personalized content and ads

This is the September war council's "Phase 2": the site shows each returning reader the content and sponsor placements closest to what they actually read. It's built last because it runs on data the earlier systems create, and its gates from September still apply.

**Interest profile, kept in the browser.** Each page already knows its ecosystem (Voron, RatRig, VzBot, HevORT) and category (hotends, extruders, filament and so on). Reads are tallied per ecosystem and category, older reads fade over 30 days, and My printer from the Workbench always outranks anything inferred. Nothing leaves the browser.

**Visible and editable.** The palette and footer show "Tuned for: Voron · hotends" with Change and Reset. Readers can see why the site looks the way it does, which is the Apple way and keeps trust intact.

**Content.** The lead story stays the editor's pick for everyone (BRAND.md: editorial choice over algorithm). Below it, the ecosystem hubs, featured hardware category and latest articles reorder by interest, and articles gain a "Because you read" rail. The order is decided before first paint by a small synchronous script, the same fix that removed the Voron flash in September, so nothing jumps.

**Ads they're more likely to click.** ads.json changes from one creative per slot to several, each tagged with an ecosystem and category. The page picks the creative that best matches the reader's profile, with a default for new readers. No third-party targeting and no data shared with sponsors. This also creates a sellable product: "reach Voron builders" placements.

**Honest measurement.** 10% of readers always see the default order and creative. Comparing click-through on personalized versus default is the only way to know it works, and it needs GA4.

**Gates before building:** the custom domain is live; GA4 has 60 days of data; at least one ad slot is live with two or more real creatives (today both slots are off and hold example.com placeholders); the Workbench has shipped. Google AdSense, if added later, does its own personalization and brings its own consent requirements; that's outside this system.

## Motion and interaction tokens

One vocabulary in global.css, beside the colour tokens, so every component moves the same way. No component sets its own duration or curve. These extend the existing transitions-dev tokens rather than replacing them.

| Token | Value | Used for |
| --- | --- | --- |
| `--dur-press` | 80 ms | Press-down response |
| `--dur-fast` | 150 ms | Colour, hover, reduced-motion crossfades |
| `--dur-base` | 220 ms | Popovers, toasts, tab indicator |
| `--dur-page` | 280 ms | Cross-page transitions |
| `--dur-sheet` | 400 ms | Sheet open; dismiss is velocity-driven |
| `--ease-out` | cubic-bezier(0.22, 1, 0.36, 1) | Anything entering or responding (same curve as today's stagger-ease) |
| `--ease-move` | cubic-bezier(0.65, 0, 0.35, 1) | Elements moving between two on-screen positions |
| `--spring-snap` | `linear()` spring, \~300 ms, no visible overshoot; falls back to `--ease-out` | Press release, chips, counters |
| `--spring-sheet` | `linear()` spring, \~450 ms, slight settle; falls back to `--ease-out` | Sheets, bench counter |
| `--scale-press` | 0.97 button · 0.985 card · 0.96 chip · 0.92 icon | Press states |
| `--scale-enter` | 0.96 (never from 0) | Popovers, toasts |
| `--stagger` | 40 ms, max 6 items, then all at once | Low-frequency lists only (homepage sections), never search results |

Hard rules: no `ease-in` anywhere (it delays the start, which is exactly when people are watching). Animate only `transform`, `opacity`, `filter` and `clip-path`. UI motion stays under 300 ms except sheets and page transitions. With reduced motion, movement and scale drop out while opacity and colour changes stay, so feedback survives.

## Scope, non-goals and constraints

**In scope:** Base.astro, Nav.astro, Footer.astro, global.css tokens, the shared card components, hardware indexes and detail pages, article and guide layouts, the tools, the 404, plus new components (palette, sheet, toast, bench) and the manifest and service worker.

**Not in scope:**

- New content, hero image production, or the RatRig/VzBot/HevORT hub builds.
- Any change to colours, type families or the verdict taxonomy. This is behaviour, not a rebrand.
- Sound, WebGL or 3D heroes, scroll-driven storytelling sections.
- Accounts, sync across devices, comments.
- An Astro 5 upgrade or a framework (React, Svelte) for islands.
- Selling and launching ad inventory (a business step; System 7 only builds the delivery).

**Constraints:**

- Static GitHub Pages: no server, no custom headers, so caching control happens in the service worker.
- Astro 4.x conventions from CLAUDE.md: no hardcoded hex in components, `<style is:global>` wherever JS toggles classes, lowercase hyphenated media paths.
- JavaScript budget: at most 15 KB gzipped of new script per page. The palette's search index loads on first open, not with the page.
- Firefox gets no page transitions or prerendering; it must still feel complete (press physics, sheets, palette all work).
- You push major site changes from GitHub Desktop; each phase ends with a local commit and a push checklist for you.

## Build plan

Eight phases, each small enough for one working session, each ending in a gate. Nothing moves to the next phase until its gate passes. Phases 1–2 alone deliver most of the "feels like an app" effect.

| Phase | Ships | Skills used | Gate to pass |
| --- | --- | --- | --- |
| 0. Feel prototype + baseline | A clickable prototype on Modern Makes tokens: press physics, extrusion line, palette, sheet with drag-dismiss, large-title hand-off, add-to-bench. Lighthouse and screenshot baseline of 6 templates | frontend-design, emil-design-eng | You try it on your iPhone and desktop and sign off the feel. No repo change |
| 1. Foundation | Motion tokens, self-hosted fonts with metric fallbacks, press system, hover gating, typography details, theme-color, typographic image covers, contrast fix, ticker honesty fix, dead handler removed | impeccable (audit), emil-design-eng, accesslint | No template slower than baseline; CLS ≤ 0.02; 0 serious accessibility issues |
| 2. Instant navigation | Speculation rules, cross-document transitions, pinned nav, three shared-element morphs, back direction, extrusion line | transitions-dev, review-animations, agent-browser | Recorded videos score ≥ 8/10 from an independent critic; Firefox and Safari fallbacks checked |
| 3. Top of screen | Large-title hand-off, reading progress, ⌘K palette with build-time index, freshness label | hallmark (new components), emil-design-eng | Palette opens ≤ 120 ms; index ≤ 60 KB gzipped; full keyboard path |
| 4. Sheets and states | Sheet and popover components, mobile menu sheet, toasts, subscribe states, filter-tab glide, copy-on-tap, native switches, new 404 | review-animations, accesslint | Real-iPhone checklist passes (you run it, steps provided); 0 serious accessibility issues |
| 5. Workbench | My printer, bench with estimated total, share URL, tools memory, resume reading, recently viewed, clear data | superpowers TDD for the storage layer, gauntlet-loop | Custom domain live first (see Open questions); storage layer tests pass |
| 6. App mode | Manifest, service worker, update toast, earned install prompt, standalone back button, offline page | agent-browser, accesslint | Offline test passes; kill-switch tested; Lighthouse installability passes |
| 7. Personalized content and ads | Local interest profile, Tuned-for control, homepage reorder below the lead story, Because-you-read rail, tagged multi-creative ad slots, 10% holdout | war-council (re-run on real data), superpowers TDD, agent-browser (CLS) | Domain live, 60 days of GA4 data, one ad slot live with real creatives; CLS unchanged; personalized click-through beats the holdout |

Each phase ends with a local commit and a push checklist; you push from GitHub Desktop because these are major site changes. Each session logs its decisions to the Agent Activity Log and the vault.

## Test plan

Feel can't be verified from code, so testing combines numbers, recordings a reviewer watches, and your own hands on a real phone.

1. **Baseline first.** Before Phase 1, record Lighthouse (mobile, Slow 4G) and full-page screenshots at 390, 768 and 1440 px for six templates: home, hardware index, hardware detail, article, Voron hub, a tool.
2. **Visual regression.** After each phase, Playwright re-shoots the same set and diffs it. Any unintended change is fixed before the gate.
3. **Motion recordings.** Playwright records video of each signature interaction (press, page push and back, shared morph, extrusion line, palette, sheet drag). Videos, not descriptions, go to review, because an effect described in words gets misread (Samnang Aing's method in the vault).
4. **Independent critic.** A fresh agent that built nothing scores each recording out of 10 against the tokens and principles here; below 8 goes back. This is the vault's gauntlet-loop pattern.
5. **Reduced motion and Firefox.** The same flows run with `reducedMotion: 'reduce'` and in Firefox, checking the fallbacks work and nothing is missing.
6. **Accessibility.** accesslint scan on all six templates, plus a manual keyboard-only pass through palette, sheets and bench.
7. **Performance gate.** Lighthouse after each phase; no template may regress past baseline.
8. **Real-device pass (you).** A short checklist for your iPhone: press feel, sheet drag, switch haptics, page transitions in Safari, Add to Home Screen, airplane-mode tools. Step-by-step instructions come with each phase.

## Open questions

Questions 1–4 were decided on 3 Nov 2026; 5 and 6 are still open and can be answered at their phase.

1. **Is the Workbench separate from the parked Phase 2 personalization?** Decided: separate. It's reader-initiated and local-only, and My printer never touches the homepage.
2. **Where does implementation run?** Decided: Phase 0 prototype built here; Phases 1–6 as Claude Code prompts (model and effort stated before each), because emil-design-eng, review-animations, impeccable, accesslint and agent-browser live there, along with your local Node and Playwright. Alternative: we edit the repo directly over the computer link.
3. **Mobile menu becomes a bottom sheet?** Decided: yes, for thumb reach. It replaces today's top slide-down panel.
4. **Ticker honesty fix.** Decided: remove the two unsourced items in Phase 1 and making the ticker accept only items that link to our own article.
5. **Analytics and the domain.** Decided: GA4 is collecting (confirmed 3 Nov 2026) with light traffic so far; behaviour targets wait for 60 days of data. Still open: buy the domain before Phase 5. Bench data, My printer, saved tool inputs and an installed app all belong to the site's address, so anything readers save on modernmakes.github.io is lost when the site moves. Phases 0–4 aren't affected. The GA4 property carries over to the new domain; add the new address to its web data stream when the site moves.
6. **Bench totals.** Recommend showing an estimated total from listed prices, labelled as such. If you'd rather avoid any money figure that could go stale, we show part count only.

## Sources

External:

- [Cross-document view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) (Chrome for Developers): support in Chrome 126+ and Safari 18.2+, none in Firefox; `pageswap` / `pagereveal`; assigning names only to the elements involved.
- [Prerender pages for instant navigations](https://developer.chrome.com/docs/web-platform/prerender-pages) (Chrome for Developers): speculation rules, `moderate` eagerness, 2-prerender limit, GA4 delaying until activation.
- [Physics-based easing](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/physics-based-easing) (Chrome for Developers): `linear()` springs and the ease-out fallback pattern.
- [emil-design-eng skill](https://open-design.ai/skills/emil-design-eng/): press scale 0.95–0.98, no ease-in, UI motion under 300 ms, hover gated to fine pointers, origin-aware popovers, velocity-based dismiss.
- [iOS Safari web haptics](https://azukiazusa.dev/en/blog/ios-safari-web-haptics): why the hidden-switch haptic trick is a hack we avoid.
- [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion): purposeful, brief, interruptible motion; reduce-motion support.

Internal: DESIGN.md, PRODUCT.md, BRAND.md and src/ in the modernmakes.github.io repo; vault pages principles.md, clarity-first-design-framework, anti-slop-web-design-workflow, taste-as-defensible-moat-framework, flat-to-3d-scroll-reveal-technique, css-scroll-driven-animations, and the capabilities registry; session summary v13 (war council on personalization).
