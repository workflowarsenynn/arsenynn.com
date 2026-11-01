// About accordion. Без JS тексты About видны сразу.
// С JS панели свёрнуты через CSS (html.js), скрипт синхронизирует кнопки.
const toggles = document.querySelectorAll<HTMLButtonElement>('[data-about-toggle]');

function setOpen(button: HTMLButtonElement, open: boolean) {
  const panel = document.getElementById(button.getAttribute('aria-controls') ?? '');
  if (!panel) return;
  button.setAttribute('aria-expanded', String(open));
  const sign = button.querySelector('[data-sign]');
  if (sign) sign.textContent = open ? '−' : '+';
  panel.toggleAttribute('data-open', open);
}

toggles.forEach((button) => {
  setOpen(button, false);
  button.addEventListener('click', () => {
    setOpen(button, button.getAttribute('aria-expanded') !== 'true');
  });
});

requestAnimationFrame(() => document.documentElement.classList.add('about-ready'));
