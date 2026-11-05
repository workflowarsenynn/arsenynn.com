// Случайные посты. Список грузится, когда блок подходит к экрану. Смена идёт только на экране:
// вне экрана видео и таймер стоят. При reduced motion и экономии трафика сама не запускается.
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
const root = document.querySelector<HTMLElement>('[data-stream]');

if (root) {
  const q = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-stream-${name}]`)!;
  const stage = q('stage');
  const text = q('text');
  const date = q('date');
  const link = q<HTMLAnchorElement>('link');
  const toggle = q<HTMLButtonElement>('toggle');
  const sound = q<HTMLButtonElement>('sound');
  const soundLabel = q('sound-label');
  const next = q<HTMLButtonElement>('next');
  const { stream, base, channel, pause, play, soundOn, soundOff } = root.dataset;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || Boolean(saveData);

  let queue: Post[] = [];
  let posts: Post[] = [];
  let paused = calm;
  let visible = false;
  let muted = true;
  let timer = 0;
  let media: HTMLMediaElement | null = null;

  // Один элемент на все ролики: iOS разрешает звук тому видео, которое включили нажатием.
  const video = document.createElement('video');
  video.playsInline = true;
  video.muted = true;
  video.preload = 'metadata';
  video.addEventListener('ended', () => advance());
  video.addEventListener('error', () => { if (media === video) advance(); });

  const url = (path: string) => `${base}${path.replace(/^\//, '')}`;

  function shuffled(list: Post[]) {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function hold() {
    clearTimeout(timer);
    if (!paused && visible && !(media && !media.paused)) timer = window.setTimeout(advance, HOLD_MS);
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

  function show(post: Post) {
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
      audio.addEventListener('ended', advance);
      media = audio;
      el = audio;
    } else if (post.kind === 'image') {
      const img = new Image(post.w, post.h);
      img.src = url(post.src!);
      img.alt = '';
      img.decoding = 'async';
      el = img;
    } else {
      el = document.createElement('p');
      el.className = 'stream__quote';
      el.textContent = post.text;
    }
    stage.replaceChildren(el);
    text.textContent = post.kind === 'text' ? '' : post.text;
    date.textContent = post.date;
    link.href = `${channel}/${post.post}`;
    sound.hidden = post.kind !== 'video';
    resume();
    // Постер следующего поста заранее: смена без пустого кадра.
    const upcoming = queue.at(-1);
    const image = upcoming?.poster ?? (upcoming?.kind === 'image' ? upcoming.src : undefined);
    if (image) new Image().src = url(image);
  }

  function advance() {
    if (!queue.length) queue = shuffled(posts);
    show(queue.pop()!);
  }

  function setPaused(value: boolean) {
    paused = value;
    toggle.textContent = paused ? play! : pause!;
    toggle.setAttribute('aria-pressed', String(paused));
    video.controls = paused;
    if (paused) halt();
    else resume();
  }

  toggle.addEventListener('click', () => setPaused(!paused));
  next.addEventListener('click', advance);
  sound.addEventListener('click', toggleSound);
  // Нажатие по самому кадру тоже включает звук, как в сторис. На паузе кадром управляет панель видео.
  stage.addEventListener('click', () => { if (media === video && !paused) toggleSound(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) halt();
    else if (visible) resume();
  });

  setPaused(paused);

  new IntersectionObserver(async ([entry]) => {
    if (entry.isIntersecting && !posts.length) {
      posts = await fetch(stream!).then((r) => r.json());
      queue = shuffled(posts);
      visible = true;
      advance();
      return;
    }
    if (!posts.length) return;
    visible = entry.isIntersecting;
    if (visible) resume();
    else halt();
  }, { threshold: 0.4 }).observe(stage);
}
