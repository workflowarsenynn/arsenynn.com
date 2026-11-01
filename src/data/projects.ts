import type { Project } from './types';

// Единственный источник проектов, текстов и внешних ссылок.
// Тексты v2 от 2026-11-01, ждут утверждения владельца.
// Проверка ссылок и открытые вопросы: docs/project_registry.md.

const PORTFOLIO_VIDEO = 'https://portfolio.arsenynn.com/video-production/';

export const projects: Project[] = [
  {
    id: 'arsenynn',
    order: 1,
    slug: 'arsenynn',
    title: '@arsenynn',
    tags: ['concept', 'chapters', 'identity'],
    shortDescription: 'Фильмы, которые складываются в главы. Отсюда растёт всё остальное.',
    longDescription: [
      'Не блог и не портфолио. Места, люди, мысли и кадры собираются в главы медленно, как книга.',
      'Каждая глава это попытка понять что-то одно.',
    ],
    status: 'active',
    links: [{ label: 'Telegram', url: 'https://t.me/arsenynn', type: 'telegram', primary: true }],
    detailPageEnabled: false,
  },
  {
    id: 'workflow',
    order: 2,
    slug: 'workflow',
    title: 'workflow@arsenynn',
    tags: ['production', 'promo', 'events', 'commercial video'],
    shortDescription: 'Кино на заказ: для брендов, событий и людей, которым есть что показать.',
    longDescription: [
      'Сценарий, съёмка, монтаж, цвет. Промо, event-видео, ролики для брендов.',
      'Один взгляд на всю историю, от задачи до последнего кадра.',
    ],
    status: 'active',
    links: [
      { label: 'Portfolio', url: PORTFOLIO_VIDEO, type: 'portfolio', primary: true },
      { label: 'Telegram', url: 'https://t.me/ww_arsenynn', type: 'telegram' },
    ],
    detailPageEnabled: false,
  },
  {
    id: 'bessmyslennost',
    order: 3,
    slug: 'bessmyslennost',
    title: 'Бессмысленность и скоротечность',
    tags: ['philosophy', 'impermanence', 'dialogue', 'memory'],
    shortDescription: 'Разговор, в котором ничего не исчезает. Внутри живёт ann.',
    longDescription: [
      'Канал как среда. Бот ann участвует в разговоре, помнит контекст и возвращает старые записи обратно в поток.',
      'Некоторые вещи становятся понятны только через год. Здесь им дают вернуться.',
    ],
    status: 'active',
    links: [{ label: 'Telegram', url: 'https://t.me/bessmislennost', type: 'telegram', primary: true }],
    mark: { src: '/logos/nn.svg', width: 3398, height: 1881 },
    detailPageEnabled: false,
  },
  {
    id: 'without-streaming',
    order: 4,
    slug: 'without-streaming',
    title: 'Without Streaming',
    tags: ['radio', 'music', 'archives', 'fragments'],
    shortDescription: 'Радио без алгоритмов. Эфир, который идёт, даже когда его никто не слушает.',
    longDescription: [
      'Личная медиатека, превращённая в эфир: музыка, архивы и визуальные фрагменты в одном потоке.',
      'Нажмите Listen. Эфир уже идёт.',
    ],
    status: 'active',
    links: [
      { label: 'Listen', url: 'https://radio.arsenynn.quest', type: 'listen', primary: true },
      { label: 'Telegram', url: 'https://t.me/without_streaming', type: 'telegram' },
    ],
    mark: { src: '/logos/without-streaming.svg', width: 718, height: 529 },
    detailPageEnabled: false,
  },
  {
    id: 'annflow',
    order: 5,
    slug: 'annflow',
    title: 'annFlow',
    tags: ['automation', 'AI', 'systems', 'agents', 'workflows'],
    shortDescription: 'Машинное отделение. Агенты и системы, на которых держится всё остальное.',
    longDescription: [
      'Операционная сторона @arsenynn: LLM, агенты, автоматизация macOS, собственные сервисы.',
      'Эксперименты вокруг реальных задач, а не обзоры технологий.',
    ],
    status: 'active',
    links: [{ label: 'Telegram', url: 'https://t.me/annsflow', type: 'telegram', primary: true }],
    logo: { src: '/logos/annflow.webp', width: 600, height: 231 },
    detailPageEnabled: false,
  },
  {
    id: 'party-protocol',
    order: 6,
    slug: 'party-protocol',
    title: 'Party Protocol',
    tags: ['VPN', 'privacy', 'secure access'],
    shortDescription: 'Свой VPN на своей инфраструктуре. Тихо, быстро, без посредников.',
    longDescription: ['Независимый сервис со своими серверами, сайтом и Telegram-ботом.'],
    status: 'active',
    links: [
      { label: 'Website', url: 'https://partyprotocol.arsenynn.quest', type: 'website', primary: true },
      { label: 'Telegram', url: 'https://t.me/partyprotocol', type: 'telegram' },
    ],
    mark: { src: '/logos/party-protocol.svg', width: 1392, height: 546 },
    detailPageEnabled: false,
  },
  {
    id: 'travel-log',
    order: 7,
    slug: 'travel-log',
    title: 'Travel Log',
    tags: ['places', 'stories', 'memory', 'literature'],
    shortDescription: 'Места, книги о них и то, что остаётся после дороги.',
    status: 'coming-soon',
    statusLabel: 'Coming soon',
    links: [],
    detailPageEnabled: false,
  },
];

export const sortedProjects = [...projects].sort((a, b) => a.order - b.order);
