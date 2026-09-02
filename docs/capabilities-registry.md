# Capabilities Registry — Matt's Claude Setup

**Last updated:** 2026-09-02 · **Maintained by:** whichever session (Claude Code or Cowork) installs something new

---

## How to use this file

Two separate surfaces exist, each with its own installed skills/plugins:

- **Claude Code** (VS Code, local, per-repo) — Part 2 below
- **Cowork / claude.ai chat** (this kind of session) — Part 3 below
- **MCP connectors** — mostly shared across both (same claude.ai account), Part 1

Before assuming a task needs custom work or that "there's no tool for this," check this file first. When you install a new skill, plugin, or MCP connector on either surface, add one line here before ending that session — this file only stays useful if it's kept current. It replaced `skills-catalog.md`, which went stale (last updated June 23, missing `gauntlet-loop`) because nothing enforced updates. Don't repeat that.

---

## Part 1 — MCP Connectors (mostly available on both surfaces)

| Connector | Tools | What it's for | When to reach for it (Modern Makes) | Gotchas |
|---|---|---|---|---|
| **Airtable** | 43 | Read/write Hardware DB (`appt6uoXxkQJEe3Rp`) + Editorial DB (`appjJWszZBOS13e0i`) | Any hardware spec lookup, editorial status, bulk record work | Always `typecast: true`; `performUpsert` needs field **ID** not name; Claude Code currently has two Airtable entries connected (harmless duplicate, low priority to clean up) |
| **Beehiiv** | 160 | Newsletter platform API (`pub_1e077e...`) | Drafting/scheduling issues, checking subscriber/segment/automation data | Native embed widget fails (shadow DOM CSS) — use HTML form → Make.com webhook → API instead |
| **Make** | 97 | Automation scenario builder/debugger | Building or debugging Make.com scenarios (newsletter scaffold, stale-content alerts) | Free plan = 2 active scenario slots max; blueprint imports need header keys re-entered manually; Watch Records trigger needs a timestamp field + 1 existing record before its dropdown populates |
| **Ahrefs** | 134 | Keyword research, backlinks, competitor/rank data, GSC | New-article keyword targeting, competitor content-gap analysis, rank tracking on Voron/RatRig/VzBot/HevORT terms | Monetary values are in USD cents — divide by 100 |
| **Semrush** | 14 | SEO/traffic/competitive research | Cross-check against Ahrefs, traffic overview reports | Default database "us" if unspecified |
| **Canva** | 32 | Design asset generation | Thumbnails, social graphics, using brand templates | — |
| **Gmail** | 27 | Email | Drafting/sending as `modernmakesco@gmail.com` | — |
| **Google Drive** | 11 | File storage/search | Shared docs; also feeds the separate YouTube-portfolio transcript pipeline (`drive-pull` skill) | — |
| **Notion** | 28 | Notes/wiki | If/when notes live there | — |
| **Higgsfield** | 85 | AI image/video/audio generation | Alternative to the `fal-hardware-images` skill for hero images, or for video content | — |
| **playwright** *(Claude Code only)* | 24 | Browser automation via generated Playwright code, click-driven | One-off interactive browser tasks while coding | Superseded for *repeatable* tasks by the `webwright` plugin (see Part 2) |
| **webwright** *(Claude Code plugin, not MCP)* | — | Code-writing browser agent — writes/runs/refines actual Playwright scripts, self-verifies with screenshots | `/webwright:craft` for reusable vendor/price monitors (Fabreeko, West3D, KB3D, Amazon, Micro Swiss, Mellow3D); `/webwright:run` for one-shot scrapes | Uses Claude Code's own model via the plugin — if it ever prompts for a separate OpenAI/Anthropic/OpenRouter API key, that means it fell back to standalone mode; don't paste a key into chat or terminal |
| **context7** *(Claude Code only)* | 2 | Live library/framework documentation lookup | Astro/npm API questions while coding | — |
| **perplexity-docs** *(Claude Code only)* | 3 | Perplexity API docs | — | — |
| **claude-in-chrome** *(Cowork only)* | 22 | Browser automation in this session | Cowork's equivalent of playwright/webwright for one-off browsing | — |
| **remote-devices** *(Cowork only)* | — | Bridge to Matt's local machine when desktop app is connected | File transfer, local screenshots, reading files on his computer | Requires desktop app open; no folder connected by default until granted |
| **visualize** *(Cowork only)* | — | Render data widgets in Cowork UI | — | — |

---

## Part 2 — Claude Code Skills & Plugins (VS Code, local, 149 total)

**Design & Frontend UI:** `impeccable` (full design system: craft/audit/polish/animate/etc, invoke `/impeccable <subcommand> <target>`) · `hallmark` (anti-AI-slop greenfield/redesign) · `emil-design-eng` + `review-animations` (opinionated UI/motion taste) · `ui-ux-pro-max` (50+ styles/161 palettes/57 font pairings) · `frontend-design` · `image-to-code-skill` · `extract-design-system` (pull tokens from a URL) · `ckm-design-system` · `ckm-ui-styling` (shadcn/Radix/Tailwind) · `transitions-dev` (production CSS transitions — use for "add a transition/animate the dropdown") · `brand-guidelines` · `web-design-guidelines` (accessibility/UI review)

**Images & Video Generation:** `banana` (Nano Banana image gen/edit) · `kling-ai` (image→video) · `higgsfield-prompt` · `video-prompting-skill` · `youtube-thumbnail-design` (CTR-optimized thumbnails) · `youtube-downloader`

**Writing & Content Quality:** `humanizer` (strip AI-writing tells) · `writing-guidelines` · `soul-md`

**Marketing** (`marketing-skills:` plugin, invoke `/marketing-skills:<name>`) — Copy: `copywriting` `copy-editing` `content-strategy` `social-content` `product-marketing-context`. SEO: `seo-audit` `ai-seo` `schema-markup` `programmatic-seo` `site-architecture` `competitor-alternatives`. Email: `email-sequence` `cold-email` `sales-enablement`. CRO: `page-cro` `popup-cro` `form-cro` `onboarding-cro` `paywall-upgrade-cro` `signup-flow-cro`. Growth: `ab-test-setup` `analytics-tracking` `churn-prevention` `pricing-strategy` `referral-program` `lead-magnets` `launch-strategy` `customer-research` `marketing-psychology` `marketing-ideas` `free-tool-strategy` `revops`. Ads/App: `ad-creative` `paid-ads` `aso-audit`

**Paid Ads** (`claude-ads:` plugin) — `ads` `ads-plan` `ads-create` `ads-generate` `ads-dna` `ads-math` `ads-budget` `ads-test` `ads-competitor` `ads-landing` `ads-creative` `ads-photoshoot` `ads-audit` (multi-platform health score) — per-platform: `ads-google` `ads-meta` `ads-tiktok` `ads-linkedin` `ads-microsoft` `ads-youtube` `ads-apple`

**Blogging** (`claude-blog:` plugin) — `blog` (orchestrator) `blog-write` `blog-rewrite` `blog-outline` `blog-brief` `blog-strategy` `blog-calendar` `blog-taxonomy` `blog-persona` `blog-audit` `blog-analyze` `blog-seo-check` `blog-geo` `blog-google` `blog-schema` `blog-factcheck` `blog-cannibalization` `blog-image` `blog-chart` `blog-audio` `blog-repurpose` `blog-notebooklm`

**Knowledge Base / Obsidian** (`claude-obsidian:` plugin) — `wiki` (bootstrap vault) · `wiki-ingest` · `wiki-lint` · `wiki-query` · `autoresearch` · `save` · `canvas` · `defuddle`/`obsidian-bases`/`obsidian-markdown`. **This is where Matt's `wiki/principles.md` and `wiki/hot.md` cross-project context lives** — check at session start per project convention.

**Research & External Data:** `notebooklm` (full NotebookLM API) · `notebooklm-skill` (query existing notebooks)

**Automation, Deploy & Performance:** `agent-browser` (browser automation CLI) · `deploy-to-vercel` · `vercel-optimize` · `vercel-react-best-practices` · `elevenlabs-tts:` (setup/config/start/stop/status)

**Accessibility** (`accesslint:` plugin) — `scan` `audit` `diff`

**YouTube Pipeline** (custom, also used by the separate YouTube-portfolio business) — `playlist-pull` · `youtube-capture` · `drive-pull` · `airtable-push` · `humanizer`

**Claude Code Setup & Meta:** `using-superpowers` (bootstraps skill discovery at session start) · `find-skills` · `skill-creator` · `claude-code-setup:claude-automation-recommender` · `update-config` · `keybindings-help` · `fewer-permission-prompts`

**Built-in Workflow Commands:** `init` `run` `verify` `code-review` `simplify` `review` `security-review` `loop` `schedule` `claude-api`

**Recently added (previously missing from the catalog):**
- `gauntlet-loop` — fans out worker + critic subagents, loops until a concrete quality bar is met. Trigger: "gauntlet this," "polish until it's great," iterating thumbnails/scripts/hooks/copy/landing pages to a real bar.
- `webwright` — see Part 1.
- `ponytail` — marketplace: `DietrichGebert/ponytail`. Enforces minimal/lazy code via a decision ladder (does this need to exist? → already in codebase? → standard library? → native platform feature? → installed dependency? → one-line fix? → only then write new code) before adding anything. Installed 2026-09-01. Relevant to every Astro/component change in this repo.
- `war-council` — source: `zapier/wade-skills`, installed manually (just this one skill, not the full marketplace), global at `~/.claude/skills/war-council/SKILL.md` — available in every Claude Code project. Decision-stress-test: state a decision + stakes, it assembles 4 fixed personas (Ruthless CFO, Contrarian Board Member, Customer Obsessive, Wartime Operator) plus 2-3 experts generated for the specific problem, each forced to take a position and place a real-dollar bet with a confidence level. Installed 2026-09-02.

> Most skills fire from natural phrasing — exact slash-command form is rarely required. `find-skills` locates/installs new ones; `skill-creator` builds custom ones.

---

## Part 3 — Cowork Skills & Plugins (claude.ai / this kind of session)

Different installed set from Claude Code — do not assume overlap. Some serve Modern Makes; many serve Matt's separate YouTube channel-portfolio business (flagged below).

**Modern Makes-relevant:**
| Skill | What it does |
|---|---|
| `dataviz` | Design-system-agnostic charting/dashboard guidance — read before building any chart |
| `humanizer` / `structural-humanizer` | Strip AI-writing tells, word-level then structural pass |
| `gauntlet-loop` | Same as Claude Code version — worker/critic subagent loop until quality bar met |
| `fal-hardware-images` | Modern Makes hardware card + hero image generation via fal.ai |
| `drive-pull` / `playlist-pull` / `youtube-capture` | Pull transcripts (Drive folder / YouTube playlist / single video) into `.raw/research/` |
| `docx` / `pptx` / `xlsx` / `pdf` | Output-format skills — read the relevant SKILL.md *after* research, before building the file |
| `airtable:*` (`airtable-cli`, `airtable-filters`, `airtable-overview`, `show-airtable-link`, `product-ops`, `marketing-ops`, `sales-ops`, `agent-activity-log`) | Airtable workflow scaffolding beyond raw MCP calls |
| `marketing:*` (`brand-review`, `campaign-plan`, `competitive-brief`, `content-creation`, `draft-content`, `email-sequence`, `performance-report`, `seo-audit`) | Full marketing-ops toolkit |
| `enterprise-search:*` | Cross-source search/digest/synthesis if more connectors get added |
| `claude-in-chrome` | Browser automation (see Part 1) |
| `skill-creator` | Build new Cowork skills |
| `cowork-plugin` / `cowork-plugin-management:*` | Create/customize Cowork plugins |
| `explain-usage` / `setup-cowork` | Meta/onboarding |

**YouTube-portfolio-specific (separate business, not Modern Makes):**
| Skill | What it does |
|---|---|
| `small-business:smb-onboard` / `smb-router` | Portfolio operator onboarding and routing |
| `15-cowork-skills:budget-dashboard` | ARR tracker toward $1M, RPM calculator |
| `15-cowork-skills:morning-briefing` | Daily niche scan, hook/thumbnail ideas ranked by virality/CPM |
| `15-cowork-skills:workflow-visualizer` | Visualize content pipelines/SOPs |
| `15-cowork-skills:quick-research` | Niche scorecard (CPM, search volume, competition, faceless-production ease) |
| `15-cowork-skills:*` (remaining) | `animated-website` `contract-reviewer` `customize` `difficult-conversation-prep` `email-drafter` `explainer-graphic` `invoice-generator` `learning-path-generator` `receipt-scanner` `slide-deck-builder` `visual-page-builder` |

**General-purpose (either business):**
`finance:*` (audit-support, close-management, financial-statements, journal-entry(-prep), reconciliation, sox-testing, variance-analysis) · `product-management:*` (brainstorm, competitive-brief, metrics-review, product-brainstorming, roadmap-update, sprint-planning, stakeholder-update, synthesize-research, write-spec) · `productivity:*` (memory-management, start, task-management, update)

---

## Part 4 — Maintenance Rule

This file replaces `skills-catalog.md` (now marked deprecated with a pointer here). It has one job: never go stale.

**Rule:** any session — Claude Code or Cowork — that installs a new skill, plugin, or MCP connector adds one row/line to the relevant Part above before calling that task done. If it's a Claude Code install, also update the mirrored copy at `docs/capabilities-registry.md` in the repo (and vice versa — Cowork installs get added here, and optionally noted in the repo copy if relevant to the codebase).

Repo copy: `docs/capabilities-registry.md`, referenced by a one-line pointer in `CLAUDE.md`.
Cowork copy: this doc, referenced by a pointer paragraph in the Project's custom instructions.
