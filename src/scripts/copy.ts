// Copy on tap (System 4). Only for values people paste somewhere else: tool results and part numbers.
// A copy control is a button with data-haptic and an inner <span data-copy-label>. Per haptics.ts,
// only that span's text changes, never the button's innerHTML (it holds the iPhone haptic label).
// Static values: <button data-copy-text="R2P-HF-PT1000">; tools with live results call copy() themselves.
import { buzz } from './haptics';
import { toast } from './toast';

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch {}
  // Older WebKit, or a context without clipboard permission.
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px'; // 16px: no iOS zoom
  (document.querySelector('dialog[open]') ?? document.body).append(ta);
  ta.select();
  ta.setSelectionRange(0, text.length);
  let ok = false;
  try { ok = document.execCommand('copy'); } catch {}
  ta.remove();
  return ok;
}

const timers = new WeakMap<HTMLElement, number>();

export async function copy(btn: HTMLElement, text: string) {
  buzz(); // Android; on iPhone the label inside the button does the tap
  const ok = !!text && (await copyText(text));
  toast(ok ? 'Copied' : 'Couldn’t copy. Long-press to select instead.');
  const label = btn.querySelector<HTMLElement>('[data-copy-label]');
  if (!ok || !label) return;
  label.dataset.idle ??= label.textContent ?? '';
  btn.style.minWidth = `${btn.offsetWidth}px`; // the button keeps its width while it shows the check
  label.textContent = '✓';
  btn.classList.add('copied');
  clearTimeout(timers.get(btn));
  timers.set(btn, window.setTimeout(() => {
    label.textContent = label.dataset.idle!;
    btn.classList.remove('copied');
    btn.style.minWidth = '';
  }, 1200));
}

document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest<HTMLElement>('[data-copy-text]');
  if (btn) copy(btn, btn.dataset.copyText!);
});
