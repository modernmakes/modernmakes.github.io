// Contact/advertise/partner forms: form[data-contact]. Payload = every named field + { type: data-type, page: data-page },
// POSTed to the same Make.com webhook the inline handlers used. Success only when Make answers 2xx.
// Bots: a filled honeypot (input[data-hp]) or a submit under 3 s after load gets a fake success and no request.
import { buzz } from './haptics';

const HOOK = 'https://hook.us1.make.com/xxkrs4kgfwvgp0d83ve2oylwy6pntes2';
const TIMEOUT = 10_000;
const MIN_MS = 3000;
const FAILED = 'Something went wrong. Email modernmakesco@gmail.com directly.';
const loadedAt = performance.now();

for (const form of document.querySelectorAll<HTMLFormElement>('form[data-contact]')) {
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const msg = form.querySelector<HTMLElement>('.lg-form-msg')!;
  const label = btn.textContent!;
  const email = form.querySelector<HTMLInputElement>('input[type="email"]')!;

  const show = (text: string, color: string) => {
    msg.textContent = text;
    msg.style.color = color;
    msg.style.display = 'block';
  };
  const done = () => {
    form.style.display = 'none';
    show((form.dataset.success || 'Sent.').replace('{email}', () => email.value), 'var(--g1)');
  };

  email.addEventListener('input', () => email.removeAttribute('aria-invalid'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.dataset.state === 'working') return;
    const hp = form.querySelector<HTMLInputElement>('input[data-hp]');
    if ((hp && hp.value) || performance.now() - loadedAt < MIN_MS) { done(); return; }

    const data: Record<string, string> = {};
    for (const [k, v] of new FormData(form)) if (k !== hp?.name) data[k] = String(v);
    data.type = form.dataset.type!;
    data.page = form.dataset.page!;

    form.dataset.state = 'working';
    btn.textContent = 'Sending…';
    btn.disabled = true;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), TIMEOUT);
    let ok = false;
    try {
      const res = await fetch(HOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: ctl.signal,
      });
      ok = res.ok;
    } catch { /* offline, blocked or timed out */ }
    clearTimeout(timer);

    if (ok) { form.dataset.state = 'success'; done(); return; }
    form.dataset.state = 'idle';
    btn.textContent = label;
    btn.disabled = false;
    email.setAttribute('aria-invalid', 'true');
    show(FAILED, 'var(--accent)');
    buzz();
  });
}
