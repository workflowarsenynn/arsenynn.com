// Яндекс Метрика: загружается только после согласия посетителя. Без согласия события никуда не уходят.
type Ym = ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };
const KEY = 'metrics-consent';
const box = document.querySelector<HTMLElement>('[data-consent]');
const id = Number(box?.dataset.consent);

function load() {
  const w = window as unknown as { ym: Ym };
  w.ym = w.ym || Object.assign((...args: unknown[]) => { (w.ym.a = w.ym.a || []).push(args); }, { l: Date.now() });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  document.head.append(script);
  w.ym(id, 'init', { webvisor: true, clickmap: true, trackLinks: true, accurateTrackBounce: true });
  document.addEventListener('site-metric', (event) => {
    const { name, params } = (event as CustomEvent).detail;
    w.ym(id, 'reachGoal', name, params);
  });
}

function choose(value: 'yes' | 'no') {
  localStorage.setItem(KEY, value);
  box!.hidden = true;
  if (value === 'yes') load();
}

if (box) {
  const saved = localStorage.getItem(KEY);
  if (saved === 'yes') load();
  else if (!saved) box.hidden = false;
  box.querySelector('[data-consent-yes]')!.addEventListener('click', () => choose('yes'));
  box.querySelector('[data-consent-no]')!.addEventListener('click', () => choose('no'));
}

const metric = (name: string, params?: Record<string, string>) => {
  document.dispatchEvent(new CustomEvent('site-metric', { detail: { name, params } }));
};

// Нажатия, которые важны как цели. Переходы по внешним ссылкам Метрика считает сама.
document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest?.('a, [data-about-toggle]');
  if (!link) return;
  const href = link.getAttribute('href') ?? '';
  if (href.includes('partyproto_bot')) metric('vpn_trial_click', { source: 'arsenynn.com' });
  else if (href.startsWith('mailto:') || link.closest('#contact')) metric('contact_click', { type: href.startsWith('mailto:') ? 'email' : 'telegram' });
  else if (href === '#contact') metric('contact_open');
  else if (link.hasAttribute('hreflang')) metric('language_switch', { to: link.getAttribute('hreflang')! });
  else if (link.matches('[data-about-toggle]')) metric('about_open');
});

// Отзыв согласия на странице о данных.
document.querySelector('[data-consent-reset]')?.addEventListener('click', (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  localStorage.setItem(KEY, 'no');
  button.disabled = true;
  button.textContent = button.dataset.done!;
});
