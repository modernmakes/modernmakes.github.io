// Haptics for the controls that open sheets (menu, where-to-buy, share).
//
// Android: the Vibration API, any time.
// iPhone: Safari has no haptics API, but toggling a native <input type="checkbox" switch> plays the
// system tap, and only for a real (trusted) tap. So the control gets a transparent <label> laid over
// it, wired to a hidden switch: the finger lands on the label, Safari toggles the switch and taps, and
// the click still bubbles to the control. Technique from the MIT-licensed ios-haptics library (v3.3),
// as proven in docs/prototype. If WebKit ever removes it, the only effect is silence.
//
// Rules for anyone touching a haptic control:
//  - never preventDefault on the label's click (that is what makes the switch toggle);
//  - never replace the control's innerHTML (it would delete the label): change an inner text span only.

export const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const buzz = () => { try { navigator.vibrate?.(10); } catch {} };

export function arm(el: HTMLElement) {
  if (!isIOS || el.querySelector(':scope > [data-haptic-trigger]')) return;
  const label = document.createElement('label');
  label.setAttribute('data-haptic-trigger', '');
  label.setAttribute('aria-hidden', 'true');
  label.style.cssText = 'position:absolute;inset:0;z-index:1;touch-action:manipulation;-webkit-tap-highlight-color:transparent;border-radius:inherit;';
  const sw = document.createElement('input');
  sw.type = 'checkbox';
  sw.setAttribute('switch', '');
  sw.tabIndex = -1;
  sw.style.cssText = 'position:absolute;width:1px;height:1px;margin:0;visibility:hidden;';
  // The label re-dispatches a click on the switch; keep that second click away from the control.
  sw.addEventListener('click', (e) => e.stopPropagation());
  sw.addEventListener('change', (e) => e.stopPropagation());
  label.append(sw);
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.append(label);
}

export const armAll = (root: ParentNode = document) => root.querySelectorAll<HTMLElement>('[data-haptic]').forEach(arm);
