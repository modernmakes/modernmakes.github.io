// Toast (System 4): toast(message). Bottom centre, one at a time (a new one replaces the current one),
// 2.4 s, swipe down or sideways to dismiss. Styles: TOAST in global.css.
//
// The pill is aria-hidden and never takes focus; screen readers hear it through one persistent
// aria-live="polite" region. While a modal sheet is open, both live inside that <dialog>: everything
// outside a modal dialog is inert (no taps, not in the accessibility tree), and being inside it keeps
// the toast above the sheet. Otherwise they live in <body> (z-index above the desktop popover sheets).

const LIFE = 2400;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

const live = document.createElement('div');
live.className = 'sr-only';
live.dataset.toast = '';
live.setAttribute('role', 'status');
live.setAttribute('aria-live', 'polite');
const el = document.createElement('div');
el.className = 'toast';
el.dataset.toast = '';
el.setAttribute('aria-hidden', 'true');
document.body.append(live, el);

let timer = 0, sayT = 0, hideT = 0, left = LIFE, since = 0;

const modal = () => { try { return document.querySelector<HTMLDialogElement>('dialog[open]:modal'); } catch { return null; } };

function arm(ms: number) { clearTimeout(timer); left = ms; since = performance.now(); timer = window.setTimeout(dismiss, ms); }
function pause() { clearTimeout(timer); left = Math.max(600, left - (performance.now() - since)); }

export function toast(message: string) {
  const home = modal() ?? document.body;
  if (el.parentElement !== home) home.append(live, el);
  clearTimeout(hideT);
  el.style.transition = 'none';
  el.style.transform = '';
  el.style.opacity = '';
  el.textContent = message;
  el.dataset.state = 'enter';
  void el.offsetWidth; // start from the entry pose even when replacing a visible toast
  el.style.transition = '';
  el.dataset.state = 'shown';
  // Clear, then write: a repeated message ("Copied" twice) is announced again.
  live.textContent = '';
  clearTimeout(sayT);
  sayT = window.setTimeout(() => { live.textContent = message; }, 60);
  arm(LIFE);
}

function dismiss() {
  clearTimeout(timer);
  if (el.dataset.state !== 'shown') return;
  el.dataset.state = 'leave';
  hideT = window.setTimeout(() => { el.dataset.state = ''; el.style.transform = ''; el.style.opacity = ''; live.textContent = ''; }, 200);
}

// Pause while the tab is hidden, so a toast isn't missed.
document.addEventListener('visibilitychange', () => {
  if (el.dataset.state !== 'shown') return;
  document.hidden ? pause() : arm(left);
});

// ── Swipe: follows the finger; dismisses past 40 px or on a flick (> 0.5 px/ms). Passive listeners only.
let id = -1, x0 = 0, y0 = 0, dx = 0, dy = 0, samples: { d: number; t: number }[] = [];
el.addEventListener('pointerdown', (e) => {
  if (id !== -1 || el.dataset.state !== 'shown') return; // one finger only
  id = e.pointerId; x0 = e.clientX; y0 = e.clientY; dx = dy = 0; samples = [{ d: 0, t: e.timeStamp }];
  el.setPointerCapture(id);
  el.style.transition = 'none';
  pause();
}, { passive: true });
el.addEventListener('pointermove', (e) => {
  if (e.pointerId !== id) return;
  dx = e.clientX - x0;
  const rawY = e.clientY - y0;
  dy = rawY > 0 ? rawY : rawY / 6; // upward has friction: there is nowhere to go
  el.style.transform = `translate(calc(-50% + ${dx}px), ${dy}px)`;
  samples.push({ d: Math.hypot(dx, Math.max(0, dy)), t: e.timeStamp });
  if (samples.length > 5) samples.shift();
}, { passive: true });
function release(e: PointerEvent) {
  if (e.pointerId !== id) return;
  id = -1;
  const a = samples[0], b = samples[samples.length - 1];
  const v = b.t > a.t ? (b.d - a.d) / (b.t - a.t) : 0;
  const dist = Math.hypot(dx, Math.max(0, dy));
  el.style.transition = '';
  if (dist > 40 || v > 0.5) {
    // Keep going the way it was thrown, fading out.
    const k = dist ? 80 / dist : 0;
    el.style.transform = reduce.matches ? '' : `translate(calc(-50% + ${dx + dx * k}px), ${Math.max(0, dy) * (1 + k)}px)`;
    el.style.opacity = '0';
    dismiss();
  } else {
    el.style.transform = '';
    arm(left);
  }
}
el.addEventListener('pointerup', release, { passive: true });
el.addEventListener('pointercancel', release, { passive: true });
