// Cross-document page motion. Inlined in <head> by Base.astro as a classic script so the
// pagereveal listener exists before the first render. Browsers without cross-document view
// transitions skip the transition parts and navigate normally.
(() => {
  const html = document.documentElement;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasReveal = 'onpagereveal' in window;

  // ── ?vtdebug ── Opt-in on-screen log of the transition events, for devices I can't attach
  // to. ?vtdebug sets a sessionStorage flag, ?vtdebug=off clears it. Without the flag every
  // dbg() is a no-op and nothing is read or drawn.
  const FLAG = 'mm-vtdebug', LOG = 'mm-vtlog';
  let DBG = false;
  try {
    const q = new URLSearchParams(location.search).get('vtdebug');
    if (q === 'off') { sessionStorage.removeItem(FLAG); sessionStorage.removeItem(LOG); }
    else if (q !== null) sessionStorage.setItem(FLAG, '1');
    DBG = sessionStorage.getItem(FLAG) === '1';
  } catch {}
  const dd = {}; // pair / card facts the handlers note for the next dbg() line
  const lines = () => { try { return JSON.parse(sessionStorage.getItem(LOG) || '[]'); } catch { return []; } };
  const show = () => {
    if (!document.body) return addEventListener('DOMContentLoaded', show, { once: true });
    let box = document.getElementById('mm-vtdebug');
    if (!box) {
      box = document.createElement('pre');
      box.id = 'mm-vtdebug';
      box.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483647;margin:0;padding:6px 8px calc(6px + env(safe-area-inset-bottom));max-height:34vh;overflow:auto;font:9px/1.35 ui-monospace,monospace;white-space:pre-wrap;word-break:break-all;background:rgba(0,0,0,.88);color:rgb(170,255,170);user-select:none;-webkit-user-select:none;touch-action:manipulation';
      box.onclick = async () => {
        const txt = lines().join('\n');
        let ok = false;
        try { await navigator.clipboard.writeText(txt); ok = true; } catch {
          try { const r = document.createRange(), s = getSelection(); r.selectNodeContents(box); s.removeAllRanges(); s.addRange(r); ok = document.execCommand('copy'); s.removeAllRanges(); } catch {}
        }
        box.textContent = (ok ? 'copied' : 'copy failed') + '\n' + txt;
        setTimeout(show, 1200);
      };
      document.body.append(box);
    }
    box.textContent = 'vtdebug (tap to copy)\n' + lines().join('\n');
  };
  const dbg = !DBG ? () => {} : (n, e, vt) => {
    const sw = n === 'swap', rv = n === 'reveal';
    const a = sw ? e.activation : rv ? window.navigation && navigation.activation : null;
    const p = (u) => { try { return u ? new URL(u, location.href).pathname : '-'; } catch { return '?'; } };
    let types = '-';
    try { types = [...vt.types].join('+') || '-'; } catch {}
    const line = [n, e && 'persisted' in e && 'persisted=' + e.persisted, (sw || rv) && 'vt=' + (vt ? 'Y' : 'N'), vt && 'types=' + types,
      a && 'nav=' + a.navigationType, a && p(sw ? location.href : a.from && a.from.url) + '>' + p(sw ? a.entry && a.entry.url : location.href),
      dd.pair && 'pair=' + dd.pair, dd.card && 'card=' + dd.card,
      dd.y0 != null && 'y0=' + dd.y0, dd.sy != null && 'saved=' + dd.sy, dd.ay != null && 'applied=' + dd.ay, 'y=' + Math.round(scrollY)].filter(Boolean).join(' ');
    dd.pair = dd.card = dd.y0 = dd.sy = dd.ay = undefined;
    try { sessionStorage.setItem(LOG, JSON.stringify([...lines(), line].slice(-12))); } catch {}
    show();
  };
  if (DBG) {
    addEventListener('pageshow', (e) => dbg('show', e));
    if (!hasReveal) dbg('no-pagereveal');
    show();
  }

  // ── Extrusion line ── A 2px accent line under the nav, only when a navigation is still
  // waiting after 150ms (so never on a prerendered, instant one). The outgoing page starts
  // it; the incoming page completes and fades it. sessionStorage carries it across.
  const EXT = 'mm-ext';
  let extTimer = 0, extReset = 0;
  const extEl = () => document.querySelector('.nav-ext');
  const extStop = () => {
    clearTimeout(extTimer); clearTimeout(extReset);
    extEl()?.classList.remove('run', 'done');
  };
  addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || reduced()) return;
    const a = e.target instanceof Element && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
    clearTimeout(extTimer);
    extTimer = setTimeout(() => {
      const el = extEl();
      if (!el) return;
      el.classList.add('run');
      try { sessionStorage.setItem(EXT, '1'); } catch {}
      // Download, 204 or a stopped load: don't leave it hanging.
      extReset = setTimeout(() => { extStop(); try { sessionStorage.removeItem(EXT); } catch {} }, 10000);
    }, 150);
  });
  addEventListener('pageswap', () => clearTimeout(extTimer)); // committed before 150ms: no line
  addEventListener('pagehide', () => clearTimeout(extTimer));
  const extFinish = () => {
    let on = null;
    try { on = sessionStorage.getItem(EXT); sessionStorage.removeItem(EXT); } catch {}
    if (!on || reduced()) return;
    const go = () => {
      const el = extEl();
      if (!el) return;
      el.style.transition = 'none';
      el.classList.add('run'); // jump to where the old page's line had got to
      void el.offsetWidth;
      el.style.transition = '';
      el.classList.add('done');
      setTimeout(() => el.classList.remove('run', 'done'), 500);
    };
    extEl() ? go() : addEventListener('DOMContentLoaded', go, { once: true });
  };
  addEventListener('pageshow', (e) => { if (e.persisted) extStop(); });
  if (!hasReveal) { extFinish(); return; }

  // Back = a history traverse to an earlier entry. Everything else pushes forward.
  const isBack = (a) => !!a && a.navigationType === 'traverse' && !!a.from && !!a.entry && a.entry.index < a.from.index;

  // ── Card → page zoom ── The tapped card's image and the detail hero share the name
  // `zoom`, one element per page at a time. sessionStorage remembers which index/item pair
  // zoomed so back can land on the same card.
  const KEY = 'mm-zoom';
  const path = (u) => new URL(u, location.href).pathname.replace(/\/$/, '') || '/';
  // dy shifts the measurement to where the page will be once its saved scroll is applied.
  const onScreen = (el, dy = 0) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom + dy > 0 && r.top + dy < innerHeight; };
  const cardMedia = (item) => {
    for (const a of document.querySelectorAll('a.gf-card')) if (path(a.href) === item) return a.querySelector('.card-img');
    return null;
  };
  const hero = () => document.querySelector('.comp-hero-media');
  const read = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { return null; } };
  let named = null;
  const name = (el) => {
    if (named) named.style.viewTransitionName = '';
    named = el;
    if (el) el.style.viewTransitionName = 'zoom';
  };
  // Zoom only between the remembered pair, and only if this end is visible.
  const zoomOn = (vt, el, dy = 0) => {
    if (DBG) dd.card = !el ? 'none' : onScreen(el, dy) ? 'on' : 'off';
    if (!el || !onScreen(el, dy)) return;
    name(el);
    vt.types.add('zoom');
  };

  addEventListener('pageswap', (e) => {
    const vt = e.viewTransition;
    try {
      if (!vt) return;
      const back = isBack(e.activation);
      vt.types.add(back ? 'back' : 'push');
      if (reduced() || !e.activation) return;
      const here = path(location.href), to = path(e.activation.entry.url);
      if (!back) {
        const media = cardMedia(to);
        const keep = !!media && onScreen(media);
        try {
          if (keep) {
            const r = media.getBoundingClientRect();
            // y/top/h: Safari restores scroll after pagereveal, so back needs them (see pagereveal).
            sessionStorage.setItem(KEY, JSON.stringify({ index: here, item: to, y: Math.round(scrollY), top: Math.round(r.top + scrollY), h: Math.round(r.height) }));
          }
          else sessionStorage.removeItem(KEY);
        } catch {}
        if (DBG) { dd.pair = keep ? 'set' : 'cleared'; dd.sy = Math.round(scrollY); }
        zoomOn(vt, media);
      } else {
        const z = read();
        const ok = !!z && z.item === here && z.index === to;
        if (DBG) dd.pair = ok ? 'match' : z ? 'mismatch' : 'none';
        // The card was on screen at tap time; skip the hero if the saved geometry says it won't be.
        const vis = !ok || typeof z.y !== 'number' || (z.top - z.y < innerHeight && z.top + z.h - z.y > 0);
        if (DBG && ok) dd.sy = z.y;
        if (ok && vis) zoomOn(vt, hero());
      }
    } finally { dbg('swap', e, vt); }
  });

  addEventListener('pagereveal', (e) => {
    name(null); // a bfcache-restored page still carries the name it set on the way out
    extFinish();
    const vt = e.viewTransition;
    try {
      if (!vt) return;
      // The nav is a pinned shared element during the transition: don't replay its entrance.
      html.classList.add('vt-arrived');
      const act = window.navigation && navigation.activation;
      const back = isBack(act);
      vt.types.add(back ? 'back' : 'push');
      if (!reduced() && act && act.from) {
        const here = path(location.href), from = path(act.from.url), z = read();
        const ok = !!z && (back ? z.item === from && z.index === here : z.item === here && z.index === from);
        if (DBG) { dd.pair = ok ? 'match' : z ? 'mismatch' : 'none'; dd.y0 = Math.round(scrollY); }
        // Safari (bfcache) restores scroll after pagereveal, so the card would measure off
        // screen. Apply the saved scroll first; if it won't take, measure against it instead.
        let dy = 0;
        if (ok && back && typeof z.y === 'number') {
          if (Math.abs(scrollY - z.y) > 1) scrollTo({ top: z.y, behavior: 'instant' });
          dy = scrollY - z.y;
          if (Math.abs(dy) <= 1) dy = 0;
          if (DBG) { dd.sy = z.y; dd.ay = Math.round(scrollY); }
        }
        // Card off screen (or gone): no zoom, the plain back transition runs.
        if (ok) zoomOn(vt, back ? cardMedia(z.item) : hero(), dy);
      }
      vt.finished.finally(() => name(null));
    } finally { dbg('reveal', e, vt); }
  });

  addEventListener('pageshow', (e) => { if (e.persisted) name(null); });
})();
