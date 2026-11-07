// Cross-document page motion. Inlined in <head> by Base.astro as a classic script so the
// pagereveal listener exists before the first render. Browsers without cross-document view
// transitions skip all of it and navigate normally.
(() => {
  if (!('onpagereveal' in window)) return;
  const html = document.documentElement;

  // Back = a history traverse to an earlier entry. Everything else pushes forward.
  const isBack = (a) => !!a && a.navigationType === 'traverse' && !!a.from && !!a.entry && a.entry.index < a.from.index;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Card → page zoom ── The tapped card's image and the detail hero share the name
  // `zoom`, one element per page at a time. sessionStorage remembers which index/item pair
  // zoomed so back can land on the same card.
  const KEY = 'mm-zoom';
  const path = (u) => new URL(u, location.href).pathname.replace(/\/$/, '') || '/';
  const onScreen = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight; };
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
  const zoomOn = (vt, el) => {
    if (!el || !onScreen(el)) return;
    name(el);
    vt.types.add('zoom');
  };

  addEventListener('pageswap', (e) => {
    const vt = e.viewTransition;
    if (!vt) return;
    const back = isBack(e.activation);
    vt.types.add(back ? 'back' : 'push');
    if (reduced() || !e.activation) return;
    const here = path(location.href), to = path(e.activation.entry.url);
    if (!back) {
      const media = cardMedia(to);
      try {
        if (media && onScreen(media)) sessionStorage.setItem(KEY, JSON.stringify({ index: here, item: to }));
        else sessionStorage.removeItem(KEY);
      } catch {}
      zoomOn(vt, media);
    } else {
      const z = read();
      if (z && z.item === here && z.index === to) zoomOn(vt, hero());
    }
  });

  addEventListener('pagereveal', (e) => {
    name(null); // a bfcache-restored page still carries the name it set on the way out
    const vt = e.viewTransition;
    if (!vt) return;
    // The nav is a pinned shared element during the transition: don't replay its entrance.
    html.classList.add('vt-arrived');
    const act = window.navigation && navigation.activation;
    const back = isBack(act);
    vt.types.add(back ? 'back' : 'push');
    if (!reduced() && act && act.from) {
      const here = path(location.href), from = path(act.from.url), z = read();
      if (z && !back && z.item === here && z.index === from) zoomOn(vt, hero());
      // Card off screen (or gone): no zoom, the plain back transition runs.
      if (z && back && z.item === from && z.index === here) zoomOn(vt, cardMedia(z.item));
    }
    vt.finished.finally(() => name(null));
  });

  addEventListener('pageshow', (e) => { if (e.persisted) name(null); });
})();
