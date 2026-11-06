// Плеер глав. Без JS глава остаётся ссылкой на Telegram, скрипт только перехватывает нажатие.
const dialog = document.querySelector<HTMLDialogElement>('[data-player]');

if (dialog && typeof dialog.showModal === 'function') {
  const el = <T extends HTMLElement>(name: string) => dialog.querySelector<T>(`[data-player-${name}]`)!;
  const frame = el('frame');
  const meta = el('meta');
  const title = el('title');
  const closeButton = el<HTMLButtonElement>('close');
  const prev = el<HTMLButtonElement>('prev');
  const next = el<HTMLButtonElement>('next');
  const telegram = el<HTMLAnchorElement>('telegram');
  const youtube = el<HTMLAnchorElement>('youtube');
  const { embed, watch } = dialog.dataset;

  let chapters: HTMLAnchorElement[] = [];
  let index = 0;

  function show(link: HTMLAnchorElement) {
    const list = link.closest<HTMLElement>('[data-part]')!;
    chapters = [...list.querySelectorAll<HTMLAnchorElement>('[data-video]')];
    index = chapters.indexOf(link);
    const id = link.dataset.video!;
    const name = link.querySelector('.chapter__title, .contents__title')!.textContent!;

    meta.textContent = `${list.dataset.part} · ${link.querySelector('.chapter__num')!.textContent}`;
    title.textContent = name;
    title.classList.toggle('player__title--accent', link.classList.contains('chapter--accent'));
    telegram.href = link.href;
    youtube.href = `${watch}${id}`;
    prev.disabled = index === 0;
    next.disabled = index === chapters.length - 1;
    if (document.activeElement instanceof HTMLButtonElement && document.activeElement.disabled) closeButton.focus();

    const iframe = document.createElement('iframe');
    iframe.src = `${embed}${id}?autoplay=1&playsinline=1&rel=0&iv_load_policy=3`;
    iframe.title = name;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.addEventListener('load', () => iframe.toggleAttribute('data-ready', true));

    const thumb = link.querySelector('img');
    if (thumb) {
      const poster = new Image();
      poster.src = thumb.currentSrc || thumb.src;
      poster.alt = '';
      frame.replaceChildren(poster, iframe);
    } else {
      frame.replaceChildren(iframe);
    }
  }

  // Плавный уход работает и там, где браузер не умеет анимировать закрытие <dialog>.
  async function close() {
    if (dialog!.hasAttribute('data-closing')) return;
    dialog!.toggleAttribute('data-closing', true);
    await Promise.race([
      Promise.allSettled(dialog!.getAnimations().map((a) => a.finished)),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ]);
    dialog!.removeAttribute('data-closing');
    dialog!.close();
  }

  document.querySelectorAll<HTMLAnchorElement>('[data-video]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      show(link);
      dialog.showModal();
      document.dispatchEvent(new CustomEvent('site-sound', { detail: dialog }));
      document.dispatchEvent(new CustomEvent('site-metric', { detail: { name: 'podcast_open' } }));
    });
  });

  prev.addEventListener('click', () => show(chapters[index - 1]));
  next.addEventListener('click', () => show(chapters[index + 1]));
  closeButton.addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });
  // Удаление iframe останавливает звук.
  dialog.addEventListener('close', () => frame.replaceChildren());
}
