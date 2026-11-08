// Shared engine for every <dialog class="sheet"> on the site (Sheet.astro and the command palette).
//
// Under 768px a sheet is an iOS-style bottom sheet:
//  - detents: medium (about 50% of the visual viewport) and large (92%); a sheet that lists only
//    `large` in data-detents (the palette) has one;
//  - it follows the finger 1:1 (pointer events on the handle and header, touch events on the
//    content), then on release dismisses on a flick (> 0.5 px/ms down) or past 40% of the visible
//    height, and otherwise springs to the nearest detent (--spring-sheet);
//  - the content only hands a downward drag to the sheet once it is scrolled to the top;
//  - the page behind dims (scrim), scales to 0.96 and rounds its top corners (the card-stack cue);
//  - the page cannot scroll: html is overflow:hidden, a drag that has nothing to scroll is
//    cancelled, any drift of scrollY is put straight back and closing restores it exactly;
//  - the sheet is sized to window.visualViewport through one rAF-batched write, with no CSS
//    transition on height, so an on-screen keyboard never covers it and never fights the animation.
// From 768px up a sheet is a centred modal (data-desktop="modal", the default), an anchored popover
// (data-desktop="popover": non-modal, light dismiss, scales in from the trigger) or "plain" (the
// palette: modal, no animation). Reduced motion removes the slide, spring and scale; dragging works.
// Opening or closing never changes scrollY.
// Triggers with data-haptic get a tap on iPhone (haptics.ts arms them) and a 10ms vibration on Android.
import { armAll, buzz } from './haptics';

type Mode = 'sheet' | 'modal' | 'popover' | 'plain';
type Sample = { y: number; t: number };
interface Cur {
  dlg: HTMLDialogElement; mode: Mode; opener: HTMLElement | null;
  panel: HTMLElement; scrim: HTMLElement;
  lockY: number; H: number; yM: number; y: number;
  detent: 'medium' | 'large'; two: boolean; fx: boolean; closing: boolean; dragging: boolean;
  clip?: (r: number) => string; timer?: number;
}

const html = document.documentElement;
const phone = matchMedia('(max-width: 767px)');
const reduceMq = matchMedia('(prefers-reduced-motion: reduce)');
const vv = window.visualViewport;
let cur: Cur | null = null;

const page = () => document.getElementById('page');
const restY = (c: Cur) => (c.two && c.detent === 'medium' ? c.yM : 0);
const pivot = (c: Cur) => (c.two ? c.yM : 0);
// 1 at every detent, falling to 0 as the sheet is pulled down to nothing.
const prog = (c: Cur, y: number) => (y <= pivot(c) ? 1 : Math.max(0, 1 - (y - pivot(c)) / Math.max(1, c.H - pivot(c))));
const currentY = (c: Cur) => new DOMMatrix(getComputedStyle(c.panel).transform).m42;
const velocity = (s: Sample[]) => {
  const a = s[Math.max(0, s.length - 4)], b = s[s.length - 1];
  return b.t > a.t ? (b.y - a.y) / (b.t - a.t) : 0;
};

// At the medium detent the lower part of the panel is below the screen. Pad the scroll area by that much
// so the last row can still be scrolled into view (the variable is read by .sheet-body's padding).
const hide = (c: Cur) => c.panel.style.setProperty('--hide', `${Math.round(restY(c))}px`);

function setY(c: Cur, y: number, animate: boolean) {
  c.y = y;
  const p = prog(c, y);
  const tr = animate ? '' : 'none';
  c.panel.style.transition = tr;
  c.scrim.style.transition = tr;
  c.panel.style.transform = `translateY(${y}px)`;
  c.scrim.style.opacity = String(p);
  const pg = page();
  if (c.fx && pg && c.clip) {
    pg.style.transition = tr;
    pg.style.transform = `scale(${1 - 0.04 * p})`;
    pg.style.clipPath = c.clip(14 * p);
  }
}

// ── visual viewport ──
let fitRaf = 0, fitTop = '', fitH = '';
function fit() {
  fitRaf = 0;
  const c = cur;
  if (!c || c.mode !== 'sheet' || !vv) return;
  const top = `${vv.offsetTop}px`, h = `${vv.height}px`;
  if (top !== fitTop) c.dlg.style.top = fitTop = top; // skip unchanged writes: each one is a relayout
  if (h !== fitH) c.dlg.style.height = fitH = h;
  c.H = c.panel.offsetHeight;
  c.yM = Math.max(0, c.H - 0.5 * vv.height);
  // Resting at a detent whose position moved with the viewport: follow it without animating.
  if (!c.dragging && !c.closing && c.y !== restY(c)) setY(c, restY(c), false);
  hide(c);
}
const queueFit = () => { if (!fitRaf && cur?.mode === 'sheet') fitRaf = requestAnimationFrame(fit); };
vv?.addEventListener('resize', queueFit);
vv?.addEventListener('scroll', queueFit);

// ── page behind (phone only) ──
function pageIn(c: Cur) {
  const pg = page();
  if (!pg || reduceMq.matches) return;
  const nav = document.getElementById('site-nav');
  const navB = nav && !nav.classList.contains('nav-transparent') ? nav.getBoundingClientRect().bottom : 0;
  const top = Math.round(scrollY + Math.max(0, navB));
  const vh = html.clientHeight;
  const bottom = Math.max(0, Math.round(pg.offsetHeight - scrollY - vh));
  // The scaled page needs its own background: the canvas turns dark so the gutters read as depth.
  pg.style.backgroundColor = getComputedStyle(document.body).backgroundColor;
  pg.style.transformOrigin = `50% ${Math.round(scrollY + vh / 2)}px`;
  pg.style.transition = 'none';
  c.clip = (r) => `inset(${top}px 0 ${bottom}px 0 round ${r}px)`;
  pg.style.clipPath = c.clip(0);
  pg.style.transform = 'scale(1)';
  html.classList.add('sheet-fx');
  c.fx = true;
}

// ── open ──
export function openSheet(target: string | HTMLDialogElement, opener?: HTMLElement | null, viaKeyboard = false) {
  const dlg = typeof target === 'string' ? (document.getElementById(target) as HTMLDialogElement | null) : target;
  if (!dlg || cur || dlg.open) return;
  const mode: Mode = phone.matches ? 'sheet' : ((dlg.dataset.desktop as Mode) || 'modal');
  const c: Cur = {
    dlg, mode, opener: opener ?? (document.activeElement as HTMLElement | null),
    panel: dlg.querySelector<HTMLElement>('.sheet-panel')!, scrim: dlg.querySelector<HTMLElement>('.sheet-scrim')!,
    lockY: scrollY, H: 0, yM: 0, y: 0,
    detent: dlg.dataset.detent === 'large' ? 'large' : 'medium',
    two: (dlg.dataset.detents ?? 'medium large').includes('medium'),
    fx: false, closing: false, dragging: false,
  };
  cur = c;
  dlg.dataset.mode = mode;
  if (c.opener?.hasAttribute('aria-expanded')) c.opener.setAttribute('aria-expanded', 'true');

  if (mode === 'popover') {
    document.body.append(dlg); // out of any stacking context on the page
    dlg.show();
    place(c);
    void c.panel.offsetHeight;
    dlg.classList.add('is-open');
  } else {
    if (mode === 'sheet') { pageIn(c); }
    dlg.showModal();
    html.classList.add('sheet-open');
    if (mode === 'sheet') {
      fit();
      hide(c);
      setY(c, c.H + 24, false); // start below the screen
      void c.panel.offsetHeight;
      dlg.classList.add('is-open');
      setY(c, restY(c), true);
    } else {
      void c.panel.offsetHeight;
      dlg.classList.add('is-open');
    }
  }
  if (!dlg.hasAttribute('data-sheet-nofocus')) {
    // Keyboard open: straight to the first item. Pointer open: the panel itself, so no focus ring lands
    // on a row nobody aimed at. Never scroll the page to it.
    const first = dlg.querySelector<HTMLElement>('.sheet-body a[href], .sheet-body button, .sheet-body input') ?? dlg.querySelector<HTMLElement>('.sheet-x');
    (viaKeyboard ? first : c.panel)?.focus({ preventScroll: true });
  }
}

// Anchors a popover under (or over) its trigger and scales it in from there. It takes the side with
// more room and, if it still doesn't fit, shrinks (the body scrolls) instead of covering the trigger.
function place(c: Cur) {
  const d = c.dlg, o = c.opener;
  const r = o ? o.getBoundingClientRect() : new DOMRect(innerWidth / 2, innerHeight / 3, 0, 0);
  const w = d.offsetWidth, h = d.offsetHeight, m = 12;
  let left = r.left + r.width / 2 < innerWidth / 2 ? r.left : r.right - w;
  left = Math.min(Math.max(m, left), innerWidth - w - m);
  const below = innerHeight - r.bottom - 8 - m, above = r.top - 8 - m;
  const useBelow = h <= below || below >= above;
  const ph = Math.min(h, Math.max(160, useBelow ? below : above));
  if (ph < h) c.panel.style.maxHeight = `${ph}px`;
  d.style.left = `${left}px`;
  d.style.top = `${useBelow ? r.bottom + 8 : r.top - 8 - ph}px`;
  c.panel.style.transformOrigin = `${Math.round(r.left + r.width / 2 - left)}px ${useBelow ? -8 : ph + 8}px`;
}

// ── close ──
export function closeSheet(target?: HTMLDialogElement | string, instant = false) {
  const c = cur;
  if (!c || c.closing) return;
  if (target && (typeof target === 'string' ? c.dlg.id !== target : c.dlg !== target)) return;
  c.closing = true;
  if (instant || c.mode === 'plain' || (c.mode === 'sheet' && reduceMq.matches)) return finish(c);
  html.classList.add('sheet-closing'); // closing is faster than opening
  if (c.mode === 'sheet') setY(c, c.H + 24, true);
  else c.dlg.classList.remove('is-open');
  c.timer = window.setTimeout(() => finish(c), c.mode === 'sheet' ? 240 : 170);
}

function finish(c: Cur) {
  clearTimeout(c.timer);
  c.dlg.close();
  c.dlg.classList.remove('is-open');
  c.dlg.removeAttribute('style');
  c.panel.removeAttribute('style');
  c.scrim.removeAttribute('style');
  page()?.removeAttribute('style');
  html.classList.remove('sheet-open', 'sheet-fx', 'sheet-closing');
  if (c.mode !== 'popover' && scrollY !== c.lockY) scrollTo({ top: c.lockY, behavior: 'instant' });
  if (c.opener?.hasAttribute('aria-expanded')) c.opener.setAttribute('aria-expanded', 'false');
  c.opener?.focus({ preventScroll: true }); // recorded explicitly: WebKit doesn't focus tapped links
  fitTop = fitH = '';
  cur = null;
}

// ── dragging the handle / header (pointer events; those regions are touch-action: none) ──
let drag: { id: number; y0: number; base: number; s: Sample[] } | null = null;
document.addEventListener('pointerdown', (e) => {
  const c = cur, t = e.target as Element;
  if (!c || c.mode !== 'sheet' || e.button || !c.dlg.contains(t)) return;
  const h = t.closest('[data-sheet-drag]');
  if (!h || t.closest('button, a, input')) return;
  if (e.pointerType === 'mouse') e.preventDefault(); // no text selection / native drag-and-drop under the pointer
  c.dragging = true;
  const y = currentY(c); // interrupts a spring mid-flight without a jump
  setY(c, y, false);
  drag = { id: e.pointerId, y0: e.clientY, base: y, s: [{ y: e.clientY, t: e.timeStamp }] };
  h.setPointerCapture?.(e.pointerId);
});
document.addEventListener('pointermove', (e) => {
  const c = cur;
  if (!drag || !c || e.pointerId !== drag.id) return;
  let y = drag.base + (e.clientY - drag.y0);
  if (y < 0) y = -Math.pow(-y, 0.65); // friction past the top, not a wall
  setY(c, y, false);
  drag.s.push({ y: e.clientY, t: e.timeStamp });
  if (drag.s.length > 6) drag.s.shift();
});
const dragEnd = (e: PointerEvent) => {
  const c = cur;
  if (!drag || !c || e.pointerId !== drag.id) return;
  const v = velocity(drag.s);
  drag = null;
  release(c, v);
};
document.addEventListener('pointerup', dragEnd);
document.addEventListener('pointercancel', dragEnd);

// ── dragging from the content (touch events: they can be cancelled, so native scroll can be refused) ──
let tc: { y0: number; last: number; base: number; mode: 0 | 1 | 2; sc: HTMLElement; s: Sample[] } | null = null;
const onTouchStart = (e: TouchEvent) => {
  const c = cur;
  tc = null;
  if (!c || c.mode !== 'sheet' || !c.dlg.contains(e.target as Node)) return;
  const sc = (e.target as Element).closest<HTMLElement>('[data-sheet-scroll]');
  const y = e.touches[0].clientY;
  if (sc) tc = { y0: y, last: y, base: currentY(c), mode: 0, sc, s: [{ y, t: e.timeStamp }] };
};
const onTouchMove = (e: TouchEvent) => {
  const c = cur;
  if (!c || c.mode !== 'sheet' || !c.dlg.contains(e.target as Node)) return;
  const y = e.touches[0].clientY, t = tc;
  if (!t) {
    // Handle, header, footer: nothing to scroll, so a drag must never reach the page. (Text inputs
    // keep their caret loupe.)
    if (!(e.target as Element).closest('input, textarea')) e.preventDefault();
    return;
  }
  if (t.mode === 0) {
    if (Math.abs(y - t.y0) < 3) return; // wait for intent
    const down = y > t.y0;
    // 1 = move the sheet, 2 = let the content scroll. Down only moves the sheet from the top of
    // the content; up moves it back if it was pulled below its top detent.
    t.mode = (down && t.sc.scrollTop <= 0) || (!down && c.y > 0.5) ? 1 : 2;
    if (t.mode === 1) { c.dragging = true; setY(c, t.base, false); }
  }
  if (t.mode === 1) {
    e.preventDefault();
    let ny = t.base + (y - t.y0);
    if (ny < 0) ny = -Math.pow(-ny, 0.65);
    setY(c, ny, false);
    t.s.push({ y, t: e.timeStamp });
    if (t.s.length > 6) t.s.shift();
  } else if (t.sc.scrollHeight <= t.sc.clientHeight) {
    e.preventDefault(); // nothing to scroll here: keep the page still
  }
  t.last = y;
};
const onTouchEnd = () => {
  const t = tc, c = cur;
  tc = null;
  if (t?.mode === 1 && c) release(c, velocity(t.s));
};
// Bound to the dialogs, not the document: a non-passive touchmove listener on the document would slow
// touch scrolling on every page, open sheet or not.
for (const d of document.querySelectorAll<HTMLDialogElement>('dialog.sheet')) {
  d.addEventListener('touchstart', onTouchStart, { passive: true });
  d.addEventListener('touchmove', onTouchMove, { passive: false });
  d.addEventListener('touchend', onTouchEnd, { passive: true });
  d.addEventListener('touchcancel', onTouchEnd, { passive: true });
}

function release(c: Cur, v: number) {
  c.dragging = false;
  const rest = restY(c), d = c.y - rest;
  if (v > 0.5 || d > 0.4 * (c.H - rest)) return closeSheet(c.dlg);
  let to = rest;
  if (c.two) {
    if (c.detent === 'medium' && (d < -20 || v < -0.35)) to = 0; // up from medium goes to large
    else if (c.detent === 'large' && c.y > c.yM / 2) to = c.yM; // far enough down from large: medium
    c.detent = to === 0 ? 'large' : 'medium';
  }
  hide(c);
  setY(c, to, true);
}

// ── events ──
// Esc: animated close instead of the instant native one. (`cancel` doesn't bubble: capture it.)
document.addEventListener('cancel', (e) => {
  const d = e.target;
  if (d instanceof HTMLDialogElement && d.classList.contains('sheet')) { e.preventDefault(); closeSheet(d); }
}, true);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cur?.mode === 'popover') { e.preventDefault(); closeSheet(cur.dlg); }
}, true);

document.addEventListener('click', (e) => {
  const t = e.target as Element;
  const trig = t.closest<HTMLElement>('[data-sheet]');
  if (trig) {
    if (trig.hasAttribute('data-haptic')) buzz();
    if (cur?.dlg.id === trig.dataset.sheet) closeSheet();
    else openSheet(trig.dataset.sheet!, trig, (e as MouseEvent).detail === 0); // detail 0: opened from the keyboard
    return;
  }
  const c = cur;
  if (!c) return;
  if (t.closest('[data-sheet-close]') && c.dlg.contains(t)) return closeSheet(c.dlg);
  // A link that leaves the page: close first (instantly, so the page transition sees a clean page).
  const a = t.closest<HTMLAnchorElement>('a[href]');
  if (a && c.dlg.contains(a) && !a.target && !a.hasAttribute('download') && !(e as MouseEvent).metaKey && !(e as MouseEvent).ctrlKey && !(e as MouseEvent).shiftKey) closeSheet(c.dlg, true);
});

// Popover light dismiss: a press or focus anywhere outside it.
document.addEventListener('pointerdown', (e) => {
  const c = cur, t = e.target as Node;
  if (c?.mode === 'popover' && !c.dlg.contains(t) && !c.opener?.contains(t)) closeSheet(c.dlg);
}, true);
document.addEventListener('focusin', (e) => {
  const c = cur, t = e.target as Node;
  if (c?.mode === 'popover' && !c.dlg.contains(t) && !c.opener?.contains(t)) closeSheet(c.dlg, true);
});

addEventListener('scroll', () => {
  const c = cur;
  if (!c) return;
  if (c.mode === 'popover') closeSheet(c.dlg, true);
  else if (scrollY !== c.lockY) scrollTo({ top: c.lockY, behavior: 'instant' }); // iOS scrolls the page on focus
}, { passive: true });
phone.addEventListener('change', () => { if (cur) closeSheet(cur.dlg, true); });
addEventListener('pagehide', () => { if (cur) closeSheet(cur.dlg, true); }); // never return from bfcache with one open

armAll();
