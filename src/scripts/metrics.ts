// События для Umami. Счётчика может не быть: тогда window.umami пуст и ничего не уходит.
type Params = Record<string, string>;
const track = (name: string, params?: Params) => {
  (window as unknown as { umami?: { track: (n: string, p?: Params) => void } }).umami?.track(name, params);
};

// Блоки видео, радио и плеер сообщают о своих событиях сами.
document.addEventListener('site-metric', (event) => {
  const { name, params } = (event as CustomEvent).detail;
  track(name, params);
});

document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest?.('a, [data-about-toggle]');
  if (!link) return;
  const href = link.getAttribute('href') ?? '';
  if (href.includes('partyproto_bot')) track('vpn_trial_click', { source: 'arsenynn.com' });
  else if (link.closest('#contact')) track('contact_click', { type: href.startsWith('mailto:') ? 'email' : 'telegram' });
  else if (href === '#contact') track('contact_open');
  else if (link.hasAttribute('hreflang')) track('language_switch', { to: link.getAttribute('hreflang')! });
  else if (link.matches('[data-about-toggle]')) track('about_open');
  else if (href.startsWith('http')) track('outbound_click', { url: href });
});
