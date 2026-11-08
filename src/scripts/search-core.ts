// Search shared by the command palette, /search and the 404: one index loader, one ranking, one row.
// The index is /search-index.json (src/lib/search-index.ts), fetched once per page and cached.
import { syncedLabel } from './synced.js';

type H = { t: string; b?: string; c: string; v?: string; vc?: string; f?: string; p?: number; u: string; k?: string };
type A = { t: string; c: string; d?: string; u: string };
type T = { t: string; c: string; k?: string; u: string };
type Index = { s?: string | null; h: H[]; a: A[]; t: T[] };
export type Group = 'h' | 'a' | 't' | 'x';
export type Row = { g: Group; u: string; t: string; sub: string; hw?: H; title: string; tw: string[]; ws: string[]; hay: string };

const ACTIONS: [string, string, string][] = [
  ['Printers', '/printers', 'Every printer and self-build ecosystem'],
  ['Hardware', '/hardware', 'All hardware categories'],
  ['Tools', '/tools', 'Calculators and calibration'],
  ['Newsletter', '/newsletter', 'Subscribe to Modern Makes'],
];
export const GROUP_LABEL: Record<Group, string> = { h: 'Hardware', a: 'Articles', t: 'Tools', x: 'Actions' };

// ── Text matching ──
export const norm = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const words = (s: string) => norm(s).split(/[^a-z0-9.]+/).map((w) => w.replace(/^\.+|\.+$/g, '')).filter(Boolean);

// Optimal string alignment distance: Levenshtein plus adjacent swaps ("rapdio" → "rapido" is 1).
export function osa(a: string, b: string): number {
  const m = a.length, n = b.length;
  let p2: number[] = [], p1 = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const c = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(p1[j] + 1, c[j - 1] + 1, p1[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, p2[j - 2] + 1);
      c.push(v);
    }
    p2 = p1; p1 = c;
  }
  return p1[n];
}
// A typo'd term is near a word if it is within 1 edit (2 for 7+ letters) of the word or its same-length prefix.
const near = (w: string, x: string) => {
  if (w.length < 4 || x.length < 3) return false;
  const max = w.length >= 7 ? 2 : 1;
  return osa(w, x) <= max || (x.length > w.length && osa(w, x.slice(0, w.length)) <= max);
};

// every: each term has to land somewhere (search). Otherwise terms that miss are skipped (the 404's guess).
export function score(r: Row, q: string, terms: string[], every = true): number {
  let s = !q ? 0 : r.title === q ? 100 : r.title.startsWith(q) ? 50 : 0;
  for (const w of terms) {
    let best = 0;
    for (const x of r.tw) best = Math.max(best, x === w ? 16 : x.startsWith(w) ? 12 : 0);
    if (best < 12) {
      if (r.title.includes(w)) best = Math.max(best, 8);
      if (!best && r.ws.some((x) => x.startsWith(w))) best = 6;
      if (!best && r.hay.includes(w)) best = 4;
      if (!best && r.tw.some((x) => near(w, x))) best = 5;
      if (!best && r.ws.some((x) => near(w, x))) best = 2;
    }
    if (!best && every) return 0;
    s += best;
  }
  return s;
}

// ── Index ──
export let rows: Row[] = [];
export let byUrl = new Map<string, Row>();
export let synced: string | null | undefined;
let loading: Promise<void> | null = null;

const row = (g: Group, u: string, t: string, sub: string, extra: string, hw?: H): Row => ({
  g, u, t, sub, hw, title: norm(t), tw: words(t), ws: words(`${t} ${sub} ${extra}`), hay: norm(`${t} ${sub} ${extra}`),
});
const dot = (...p: (string | undefined)[]) => p.filter(Boolean).join(' · ');

function prepare(ix: Index) {
  rows = [
    ...ix.h.map((x) => row('h', x.u, x.t, dot(x.b, x.c, x.k), dot(x.v, x.f), x)),
    ...ix.a.map((x) => row('a', x.u, x.t, dot(x.c, x.d), '')),
    ...ix.t.map((x) => row('t', x.u, x.t, dot(x.c, x.k), 'tool calculator')),
    ...ACTIONS.map(([t, u, s]) => row('x', u, t, s, '')),
  ];
  byUrl = new Map(rows.map((r) => [r.u, r]));
  synced = ix.s;
}

export const loadIndex = () =>
  (loading ??= fetch('/search-index.json')
    .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
    .then(prepare)
    .catch((e) => { loading = null; throw e; })); // the next call retries

export const freshness = () => syncedLabel(synced) ?? '';

// ── Ranking ──
export type Result = { terms: string[]; groups: [Group, Row[]][]; count: number; closest: Row[] };

export function search(raw: string): Result {
  const q = norm(raw.trim());
  const terms = words(raw);
  const hits = rows
    .map((r) => ({ r, s: score(r, q, terms) }))
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s || x.r.t.length - y.r.t.length);
  const take = (g: Group, max: number) => hits.filter((x) => x.r.g === g).slice(0, max).map((x) => x.r);
  const groups: [Group, Row[]][] = [['h', take('h', 6)], ['a', take('a', 4)], ['t', take('t', 4)], ['x', take('x', 2)]];
  const count = groups.reduce((c, [, rs]) => c + rs.length, 0);
  return { terms, groups, count, closest: count ? [] : closest(q) };
}

// The hardware names closest to what was typed, by edit distance.
export const closest = (q: string, n = 3) =>
  rows
    .filter((r) => r.g === 'h')
    .map((r) => ({ r, d: Math.min(osa(q, r.title), ...r.tw.map((w) => osa(q, w))) }))
    .sort((x, y) => x.d - y.d)
    .slice(0, n)
    .map((x) => x.r);

// Best hardware for loose words (a broken URL): terms that miss are skipped; at least a word-prefix hit.
export const guessHardware = (text: string, n = 3) => {
  const terms = words(text);
  return rows
    .filter((r) => r.g === 'h')
    .map((r) => ({ r, s: score(r, '', terms, false) }))
    .filter((x) => x.s >= 6)
    .sort((x, y) => y.s - x.s || x.r.t.length - y.r.t.length)
    .slice(0, n)
    .map((x) => x.r);
};

// ── Row markup (styles: .cp-* in CommandPalette.astro, global) ──
export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
const price = (p: number) => (Number.isInteger(p) ? usd0 : usd2).format(p);

// Wraps each search term where it starts a word in <mark>. Works on the raw text, escapes the rest.
export function mark(text: string, terms: string[]) {
  const ts = [...new Set(terms)].filter(Boolean).sort((a, b) => b.length - a.length);
  if (!ts.length) return esc(text);
  // A one-character term ("2") only marks a whole word, not the start of "2F" or "2026".
  const alt = ts.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (t.length < 2 ? '(?![a-z0-9])' : '')).join('|');
  const re = new RegExp(`(^|[^a-z0-9])(${alt})`, 'gi');
  let out = '', last = 0;
  for (const m of text.matchAll(re)) {
    const start = m.index! + m[1].length;
    out += esc(text.slice(last, start)) + '<mark>' + esc(m[2]) + '</mark>';
    last = start + m[2].length;
  }
  return out + esc(text.slice(last));
}

// attrs: extra attributes for the <a> (the palette adds its listbox option attributes).
export function rowHtml(r: Row, terms: string[] = [], attrs = '') {
  const h = r.hw;
  const meta = h && (h.v || h.f || h.p)
    ? `<span class="cp-meta">${h.v ? `<span class="verdict ${h.vc} verdict-on-dark">${esc(h.v)}</span>` : ''}${h.f ? `<span class="flow-chip on-dark">${esc(h.f)}</span>` : ''}${h.p ? `<span class="cp-p">${price(h.p)}</span>` : ''}</span>`
    : '';
  return `<a class="cp-row" href="${esc(r.u)}"${attrs}><span class="cp-main"><span class="cp-t">${mark(r.t, terms)}</span><span class="cp-s">${mark(r.sub, terms)}</span></span>${meta}</a>`;
}
