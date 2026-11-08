// Subscribe states (System 4) for every newsletter form: form[data-subscribe] (BeehiivEmbed, HomeNewsletterCTA).
// idle → pressed (press system) → working → success | failure. Client-side only: the webhook URL, headers and
// payload are exactly what the forms sent before (same keys, same order, email.value untouched).
//
// What a 2xx proves: Make.com accepted the request. Its Webhook Response module may answer before (or
// regardless of whether) the Beehiiv module succeeds, so success here means "handed to Make", not
// "subscribed in Beehiiv". Confirm a real signup in Beehiiv's subscriber list.
import { buzz } from './haptics';

const HOOK = 'https://hook.us1.make.com/rb9wcdyixxygfhoihhr0mnjpm1k61hu4';
const TIMEOUT = 10_000;
const MSG = {
  invalid: 'That address doesn’t look right.',
  failed: 'That didn’t go through. Try again in a moment.',
  done: 'You’re in. Watch your inbox for the next issue.',
};
// type=email accepts "a@b"; ask for a dot in the domain too.
const looksValid = (input: HTMLInputElement) => input.validity.valid && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());

// The campaign the form used before: homepage_cta, or <page type>__<path slug>.
function campaign(form: HTMLFormElement) {
  if (form.dataset.campaign) return form.dataset.campaign;
  const slug = location.pathname.replace(/\//g, '-').replace(/^-|-$/g, '') || 'unknown';
  const pageType = location.pathname.includes('/guides/') ? 'guide_footer' : 'article_footer';
  return pageType + '__' + slug;
}

for (const form of document.querySelectorAll<HTMLFormElement>('form[data-subscribe]')) {
  const input = form.querySelector<HTMLInputElement>('input[type="email"]')!;
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const msg = form.parentElement!.querySelector<HTMLElement>('[data-subscribe-msg]')!;
  form.noValidate = true; // our message replaces the browser bubble

  const fail = (text: string) => {
    form.dataset.state = 'idle';
    btn.style.width = '';
    input.setAttribute('aria-invalid', 'true');
    msg.dataset.state = 'error';
    msg.textContent = text;
    input.classList.remove('sub-shake');
    void input.offsetWidth; // replay the shake on a second failure
    input.classList.add('sub-shake');
    buzz(); // Android; no tap is in flight on iPhone, so it stays silent there
  };

  input.addEventListener('animationend', () => input.classList.remove('sub-shake'));
  input.addEventListener('input', () => {
    if (msg.dataset.state !== 'error') return;
    input.removeAttribute('aria-invalid');
    msg.dataset.state = '';
    msg.textContent = '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.dataset.state === 'working') return;
    if (!looksValid(input)) { fail(MSG.invalid); input.focus(); return; }

    btn.style.width = `${btn.getBoundingClientRect().width}px`; // the spinner never changes the button's size
    form.dataset.state = 'working';
    msg.dataset.state = '';
    msg.textContent = '';
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), TIMEOUT);
    let ok = false;
    try {
      const res = await fetch(HOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: input.value,
          utm_source: 'website',
          utm_medium: 'subscribe_form',
          utm_campaign: campaign(form),
        }),
        signal: ctl.signal,
      });
      ok = res.ok;
    } catch { /* offline, blocked or timed out */ }
    clearTimeout(timer);
    if (!ok) { fail(MSG.failed); return; }

    // Success: the form's line becomes the confirmation, with a check that draws in.
    const hadFocus = form.contains(document.activeElement);
    form.dataset.state = 'success';
    form.hidden = true;
    msg.dataset.state = 'success';
    msg.innerHTML = '<svg class="sub-check" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" pathLength="1" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span></span>';
    msg.querySelector('span')!.textContent = MSG.done;
    // The focused button just disappeared: hand focus to the confirmation instead of dropping it on <body>.
    if (hadFocus) { msg.tabIndex = -1; msg.focus({ preventScroll: true }); }
  });
}
