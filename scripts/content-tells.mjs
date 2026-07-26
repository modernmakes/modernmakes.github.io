#!/usr/bin/env node
// content-tells.mjs — deterministic AI-writing-tell scanner for Modern Makes articles.
//
// Catches the pattern-matchable slice the humanizer / structural-humanizer passes fix.
// It does NOT replace judgment work — cadence, over-explanation, and shape convergence
// are only visible to a human reader. This is the cheap gate before ship.
//
// Usage:
//   npm run tells          report only (exit 0)
//   npm run tells:strict   exit 1 if any file trips a threshold (pre-commit / CI)
//
// Scope: markdown in src/content. Frontmatter and fenced code blocks are ignored —
// only body prose is scanned, never the data.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CONTENT_DIR = join(ROOT, "src", "content");
const STRICT = process.argv.includes("--strict");

// ── thresholds (tune here) ─────────────────────────────────────────────
const LONE_DASH_MAX = 2; // flag if more than this many lone/dramatic em dashes in prose
const BANNED = [
  "genuinely", "game-changer", "game changer",
  "revolutionary", "best-in-class", "seamless",
];
// "not X — Y, it's/but Z": the classic dash-antithesis closer
const ANTITHESIS =
  /\b(is not|isn'?t|are not|aren'?t|not)\b[^.\n—]{0,70}—[^.\n]{0,70}\b(it'?s|it is|they'?re|but)\b/gi;

// ── helpers ────────────────────────────────────────────────────────────
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if ([".md", ".mdx"].includes(extname(p))) out.push(p);
  }
  return out;
}

function body(raw) {
  let t = raw;
  if (t.startsWith("---")) {
    const end = t.indexOf("\n---", 3);
    if (end !== -1) t = t.slice(t.indexOf("\n", end + 1) + 1);
  }
  return t.replace(/```[\s\S]*?```/g, ""); // drop fenced code blocks
}

// Prose only: drop list items, table rows, headings, blockquotes. Bullet lead-in
// dashes and table dashes are legit formatting, not the dramatic-pause tell.
function proseLines(text) {
  return text.split(/\n/).filter((line) => {
    const t = line.trim();
    if (!t) return false;
    if (/^([-*+]|\d+\.)\s/.test(t)) return false; // list items
    if (/^#{1,6}\s/.test(t)) return false;        // headings
    if (/^>/.test(t)) return false;               // blockquotes
    if (t.includes("|")) return false;            // table rows / any pipe line
    return true;
  });
}

function scan(file) {
  const text = body(readFileSync(file, "utf8"));

  // Lone em dash = a single dramatic-pause dash. Appositive pairs (— … —) come in
  // twos and cancel out; a stray odd one is the tell we humanize away.
  let loneDashes = 0;
  for (const line of proseLines(text)) {
    loneDashes += (line.match(/—/g) || []).length % 2;
  }

  const banned = [];
  for (const w of BANNED) {
    const re = new RegExp(`\\b${w.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "gi");
    const m = text.match(re);
    if (m) banned.push(...m);
  }
  const antithesis = (text.match(ANTITHESIS) || []).map((s) => s.replace(/\s+/g, " ").trim());

  const flags = [];
  if (loneDashes > LONE_DASH_MAX)
    flags.push(`lone dramatic em dashes: ${loneDashes} in prose (limit ${LONE_DASH_MAX}) — consider periods/colons`);
  if (banned.length)
    flags.push(`banned/hedge words: ${[...new Set(banned.map((b) => b.toLowerCase()))].join(", ")}`);
  for (const a of antithesis) flags.push(`antithesis closer: "…${a.slice(0, 90)}…"`);

  return { file, flags };
}

// ── run ────────────────────────────────────────────────────────────────
const results = walk(CONTENT_DIR).map(scan).sort((a, b) => b.flags.length - a.flags.length);
const flagged = results.filter((r) => r.flags.length);

console.log(`\nContent tells — scanned ${results.length} files in src/content\n`);
for (const r of flagged) {
  console.log(`  ! ${relative(ROOT, r.file)}`);
  for (const f of r.flags) console.log(`      - ${f}`);
}
if (!flagged.length) console.log("  OK - no mechanical tells over threshold.\n");
else
  console.log(
    `\n  ${flagged.length} of ${results.length} files flagged. Grep-able tells only — still read for over-explanation, moralized closers, and shape.\n`
  );

if (STRICT && flagged.length) process.exit(1);
