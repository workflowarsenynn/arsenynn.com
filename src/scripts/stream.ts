// Случайные посты. Список грузится, когда блок подходит к экрану. Смена идёт только на экране:
// вне экрана видео и таймер стоят. При reduced motion и экономии трафика сама не запускается.
// Листать можно свайпом: кадр идёт за пальцем, следующий выезжает с края.
type Post = {
  post: number;
  kind: 'video' | 'image' | 'audio' | 'text';
  text: string;
  date: string;
  src?: string;
  poster?: string;
  w?: number;
  h?: number;
};

const HOLD_MS = 9000;
const SWIPE_START = 10;
const SWIPE_SHARE = 0.2;
const SWIPE_SPEED = 0.45;
const SEEN_KEY = 'stream-swiped';

function setup(root: HTMLElement) {
  const q = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-stream-${name}]`)!;
  const stage = q('stage');
  const text = q('text');
  const date = q('date');
  const link = q<HTMLAnchorElement>('link');
  const count = q('count');
  const hint = q('hint');
  const toggle = q<HTMLButtonElement>('toggle');
  const sound = q<HTMLButtonElement>('sound');
  const soundLabel = q('sound-label');
  // Стрелок две пары: на кадре для мыши и под кадром для телефона.
  const nexts = root.querySelectorAll<HTMLButtonElement>('[data-stream-next]');
  const prevs = root.querySelectorAll<HTMLButtonElement>('[data-stream-prev]');
  const { stream, base, channel, pause, play, soundOn, soundOff, order: mode } = root.dataset;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const calm = still || Boolean(saveData);

  let posts: Post[] = [];
  // Порядок растёт новыми перемешанными кругами, поэтому назад можно вернуться к уже виденному.
  let order: Post[] = [];
  let failures = 0;
  let pos = -1;
  let paused = calm;
  let visible = false;
  let muted = true;
  let timer = 0;
  let media: HTMLMediaElement | null = null;
  let swiped = false;

  // Один элемент на все ролики: iOS разрешает звук тому видео, которое включили нажатием.
  const video = document.createElement('video');
  video.playsInline = true;
  video.muted = true;
  video.preload = 'metadata';
  video.addEventListener('ended', () => go(1));
  video.addEventListener('playing', () => { failures = 0; });
  // Несколько сбоев подряд: файлы недоступны, крутить список бесполезно.
  video.addEventListener('error', () => {
    failures += 1;
    if (media === video && failures < 3) go(1);
  });

  const url = (path: string) => (path.startsWith('http') ? path : `${base}${path.replace(/^\//, '')}`);
  const frameOf = (post?: Post) => post?.poster ?? (post?.kind === 'image' ? post.src : undefined);

  // Главы идут по порядку, посты вперемешку.
  function shuffled(list: Post[]) {
    const out = [...list];
    if (mode === 'sequence') return out;
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function hold() {
    clearTimeout(timer);
    if (!paused && visible && !(media && !media.paused)) timer = window.setTimeout(() => go(1), HOLD_MS);
  }

  // Видео идёт до конца, картинка и текст держатся несколько секунд.
  function resume() {
    clearTimeout(timer);
    if (media === video && !paused && visible) {
      video.muted = muted;
      video.play().catch((error) => {
        if (error.name !== 'NotAllowedError') return;
        if (muted) { hold(); return; }
        setMuted(true);
        video.play().catch(hold);
      });
    } else {
      hold();
    }
  }

  function halt() {
    clearTimeout(timer);
    if (media === video) video.pause();
  }

  // На паузе у видео своя панель со звуком: наша кнопка наехала бы на неё.
  function syncSound() {
    sound.hidden = media !== video || paused;
  }

  function setMuted(value: boolean) {
    muted = value;
    video.muted = muted;
    soundLabel.textContent = muted ? soundOn! : soundOff!;
    sound.toggleAttribute('data-on', !muted);
  }

  // Нажатие включает звук и, если браузер не дал видео стартовать само, запускает его.
  function toggleSound() {
    setMuted(!muted);
    if (media === video && video.paused && !paused) resume();
  }

  function show(post: Post, instant = false) {
    halt();
    media = null;
    let el: HTMLElement;
    if (post.kind === 'video') {
      video.src = url(post.src!);
      video.poster = url(post.poster!);
      video.controls = paused;
      media = video;
      el = video;
    } else if (post.kind === 'audio') {
      const audio = document.createElement('audio');
      audio.src = url(post.src!);
      audio.controls = true;
      audio.preload = 'none';
      audio.addEventListener('play', () => clearTimeout(timer));
      audio.addEventListener('ended', () => go(1));
      media = audio;
      el = audio;
    } else if (post.kind === 'image') {
      const img = new Image(post.w, post.h);
      img.src = url(post.src!);
      img.alt = '';
      img.decoding = 'async';
      img.draggable = false;
      el = img;
    } else {
      el = document.createElement('p');
      el.className = 'stream__quote';
      el.textContent = post.text;
    }
    el.style.transform = '';
    el.style.animation = instant ? 'none' : '';
    stage.replaceChildren(el);
    text.textContent = post.kind === 'text' ? '' : post.text;
    date.textContent = post.date;
    link.href = `${channel}/${post.post}`;
    count.textContent = `${(pos % posts.length) + 1} / ${posts.length}`;
    syncSound();
    prevs.forEach((button) => { button.disabled = pos === 0; });
    resume();
    // Кадры соседей заранее: при свайпе край не пустой.
    const image = frameOf(peek(1));
    if (image) new Image().src = url(image);
  }

  function peek(step: number) {
    if (pos + step >= order.length) order.push(...shuffled(posts));
    return order[pos + step];
  }

  function go(step: number, instant = false) {
    const post = peek(step);
    if (!post) return;
    pos += step;
    show(post, instant);
  }

  function learned() {
    hint.hidden = true;
    localStorage.setItem(SEEN_KEY, '1');
  }

  function setPaused(value: boolean) {
    paused = value;
    toggle.textContent = paused ? play! : pause!;
    toggle.setAttribute('aria-pressed', String(paused));
    video.controls = paused;
    syncSound();
    if (paused) halt();
    else resume();
  }

  // Соседний кадр рядом с текущим: едет вместе с ним во время свайпа.
  function neighbour(step: number) {
    const post = peek(step);
    const el = document.createElement('div');
    el.className = 'stream__ghost';
    el.setAttribute('aria-hidden', 'true');
    const image = frameOf(post);
    if (image) el.style.backgroundImage = `url("${url(image)}")`;
    stage.append(el);
    return el;
  }

  function swipeable() {
    let start: { x: number; y: number; t: number; id: number } | null = null;
    let dragging = false;
    let dx = 0;
    let step = 0;
    let ghost: HTMLElement | null = null;

    const place = (x: number) => {
      const current = stage.firstElementChild as HTMLElement;
      current.style.animation = 'none';
      current.style.transform = `translateX(${x}px)`;
      if (ghost) ghost.style.transform = `translateX(${x + step * stage.clientWidth}px)`;
    };

    function setStep(value: number) {
      if (value === step) return;
      ghost?.remove();
      step = value;
      ghost = step && peek(step) ? neighbour(step) : null;
    }

    function reset() {
      start = null;
      dragging = false;
      step = 0;
      dx = 0;
      ghost?.remove();
      ghost = null;
    }

    stage.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (!posts.length) return;
      // Низ кадра на паузе занят панелью видео: там палец двигает перемотку.
      const bottom = stage.getBoundingClientRect().bottom;
      if (paused && media === video && bottom - event.clientY < 72) return;
      start = { x: event.clientX, y: event.clientY, t: event.timeStamp, id: event.pointerId };
    });

    stage.addEventListener('pointermove', (event) => {
      if (!start || event.pointerId !== start.id) return;
      dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (!dragging) {
        if (Math.abs(dx) < SWIPE_START || Math.abs(dx) < Math.abs(dy)) return;
        dragging = true;
        stage.setPointerCapture(start.id);
        clearTimeout(timer);
      }
      setStep(dx < 0 ? 1 : -1);
      // У самого первого поста назад некуда: кадр только упруго тянется.
      place(ghost ? dx : dx * 0.25);
    });

    async function finish(event: PointerEvent) {
      if (!start || event.pointerId !== start.id) return;
      if (!dragging) { start = null; return; }
      swiped = true;
      const width = stage.clientWidth;
      const speed = Math.abs(dx) / Math.max(1, event.timeStamp - start.t);
      const commit = event.type === 'pointerup' && ghost && (Math.abs(dx) > width * SWIPE_SHARE || speed > SWIPE_SPEED);
      const to = commit ? -step * width : 0;
      const current = stage.firstElementChild as HTMLElement;
      const moved = [[current, dx, to], ...(ghost ? [[ghost, dx + step * width, to + step * width]] : [])] as [HTMLElement, number, number][];
      const direction = step;
      start = null;
      await Promise.all(moved.map(([el, from, end]) => el.animate(
        [{ transform: `translateX(${from}px)` }, { transform: `translateX(${end}px)` }],
        { duration: still ? 0 : 200, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'forwards' },
      ).finished));
      moved.forEach(([el]) => el.getAnimations().forEach((a) => a.cancel()));
      if (commit) {
        reset();
        learned();
        go(direction, true);
      } else {
        current.style.transform = '';
        reset();
        resume();
      }
      setTimeout(() => { swiped = false; }, 0);
    }

    stage.addEventListener('pointerup', finish);
    stage.addEventListener('pointercancel', finish);
  }

  toggle.addEventListener('click', () => setPaused(!paused));
  nexts.forEach((button) => button.addEventListener('click', () => { learned(); go(1); }));
  prevs.forEach((button) => button.addEventListener('click', () => { if (pos > 0) go(-1); }));
  sound.addEventListener('click', toggleSound);
  // Нажатие по самому кадру тоже включает звук, как в сторис. На паузе кадром управляет панель видео.
  stage.addEventListener('click', () => { if (!swiped && media === video && !paused) toggleSound(); });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') go(1);
    else if (event.key === 'ArrowLeft' && pos > 0) go(-1);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) halt();
    else if (visible) resume();
  });

  swipeable();
  setPaused(paused);

  async function load() {
    if (posts.length) return;
    posts = await fetch(stream!).then((r) => r.json());
    order = shuffled(posts);
  }

  // Глава из ленты играет здесь же, со звуком: человек сам её выбрал.
  root.closest('.project')?.querySelectorAll<HTMLAnchorElement>('[data-chapter]').forEach((card) => {
    card.addEventListener('click', async (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      setMuted(false);
      await load();
      visible = true;
      stage.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' });
      const index = order.findIndex((post) => post.post === Number(card.dataset.chapter));
      if (index < 0) return;
      pos = index;
      show(order[pos]);
    });
  });

  new IntersectionObserver(async ([entry]) => {
    if (entry.isIntersecting && !posts.length) {
      await load();
      visible = true;
      if (pos < 0) go(1);
      hint.hidden = Boolean(localStorage.getItem(SEEN_KEY));
      return;
    }
    if (!posts.length) return;
    visible = entry.isIntersecting;
    if (visible) resume();
    else halt();
  }, { threshold: 0.4 }).observe(stage);
}

document.querySelectorAll<HTMLElement>('[data-stream]').forEach(setup);
