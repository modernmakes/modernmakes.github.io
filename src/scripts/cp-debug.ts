// ?cpdebug live readout for the command palette. Loaded only when the session flag is set, so it
// costs ordinary visitors nothing. Returns the function the palette calls when it opens.
import { setSheetDbg, forceKb } from './sheet';

export function initCpDebug(dlg: HTMLDialogElement, list: HTMLElement, input: HTMLInputElement): () => void {
  const vv = window.visualViewport;
  const box = document.createElement('pre');
  box.id = 'cp-debug';
  box.setAttribute('aria-hidden', 'true');
  box.style.cssText = 'position:absolute;left:0;right:0;bottom:0;z-index:2;margin:0;padding:6px 8px;max-height:45%;overflow:hidden;pointer-events:none;font:9px/1.35 ui-monospace,monospace;white-space:pre-wrap;word-break:break-all;background:rgba(0,0,0,.85);color:rgb(170,255,170)';
  dlg.append(box);
  const t0 = performance.now(), evs: string[] = [];
  let last = '', reps = 0;
  // Repeats of one event collapse into a count, so a scroll doesn't push everything else out.
  const log = (ev: string) => {
    const line = `${Math.round(performance.now() - t0)} ${ev}`;
    if (ev === last) evs[evs.length - 1] = `${line} x${++reps + 1}`;
    else { last = ev; reps = 0; evs.push(line); if (evs.length > 10) evs.shift(); }
  };
  setSheetDbg(log);
  (window as any).__cpKb = (px: number | null) => forceKb(px);
  for (const t of ['touchstart', 'touchmove', 'touchend', 'touchcancel']) list.addEventListener(t, () => log(`list ${t}`), { passive: true });
  list.addEventListener('scroll', () => log('list scroll'), { passive: true });
  list.addEventListener('scrollend', () => log('list scrollend'));
  vv?.addEventListener('resize', () => log('vv resize'));
  vv?.addEventListener('scroll', () => log('vv scroll'));
  input.addEventListener('focus', () => log('input focus'));
  input.addEventListener('blur', () => log('input blur'));
  const r = Math.round;
  const name = (e: Element | null) => !e ? '-' : e.tagName.toLowerCase() + (e.id ? `#${e.id}` : '') + (e.classList.length ? `.${[...e.classList].join('.')}` : '');
  const draw = () => {
    if (!dlg.open) return;
    const p = (dlg.querySelector('.cp-panel') as HTMLElement).getBoundingClientRect();
    box.textContent = [
      `cpdebug  vv h=${vv ? r(vv.height) : '-'} top=${vv ? r(vv.offsetTop) : '-'} scale=${vv ? vv.scale.toFixed(2) : '-'}`,
      `dialog h=${getComputedStyle(dlg).height} innerH=${innerHeight} --kb=${dlg.style.getPropertyValue('--kb') || '-'} mode=${dlg.dataset.mode}`,
      `panel top=${r(p.top)} bottom=${r(p.bottom)} h=${r(p.height)}`,
      `list st=${r(list.scrollTop)} sh=${list.scrollHeight} ch=${list.clientHeight} oy=${getComputedStyle(list).overflowY}`,
      `active=${name(document.activeElement)} scrollY=${r(scrollY)}`,
      `html=${document.documentElement.className || '-'}`,
      ...evs,
    ].join('\n');
    requestAnimationFrame(draw);
  };
  return () => { log('open'); requestAnimationFrame(draw); };
}
