// Cross-document page motion. Inlined in <head> by Base.astro as a classic script so the
// pagereveal listener exists before the first render. Browsers without cross-document view
// transitions skip all of it and navigate normally.
(() => {
  if (!('onpagereveal' in window)) return;
  const html = document.documentElement;

  // Back = a history traverse to an earlier entry. Everything else pushes forward.
  const isBack = (a) => !!a && a.navigationType === 'traverse' && !!a.from && !!a.entry && a.entry.index < a.from.index;

  addEventListener('pageswap', (e) => {
    if (e.viewTransition) e.viewTransition.types.add(isBack(e.activation) ? 'back' : 'push');
  });

  addEventListener('pagereveal', (e) => {
    if (!e.viewTransition) return;
    // The nav is a pinned shared element during the transition: don't replay its entrance.
    html.classList.add('vt-arrived');
    e.viewTransition.types.add(isBack(window.navigation && navigation.activation) ? 'back' : 'push');
  });
})();
