import type { Project } from './types';

// Единственный источник проектов, текстов и внешних ссылок.
// Короткие тексты v3 по advisory (docs/Advisory/), About ждут утверждения владельца.
// Проверка ссылок и открытые вопросы: docs/project_registry.md.

const PORTFOLIO_VIDEO = 'https://portfolio.arsenynn.com/video-production/';

export const projects: Project[] = [
  {
    id: 'arsenynn',
    order: 1,
    slug: 'arsenynn',
    title: '@arsenynn',
    tags: ['concept', 'chapters', 'identity'],
    shortDescription: 'Фильмы, главы и вещи, которые со временем складываются во что-то большее.',
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
    shortDescription: 'Видео на заказ — от первой мысли до последнего кадра.',
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
    shortDescription: 'Разговор и память. Некоторые вещи возвращаются позже.',
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
    shortDescription: 'Личное радио. Эфир уже идёт.',
    longDescription: [
      'Личная медиатека, превращённая в эфир: музыка, архивы и визуальные фрагменты в одном потоке.',
      'Нажмите Listen. Эфир уже идёт.',
    ],
    status: 'active',
    links: [
      { label: 'Listen', url: 'https://radio.arsenynn.quest', type: 'listen', primary: true },
      { label: 'Telegram', url: 'https://t.me/without_streaming', type: 'telegram' },
    ],
    mark: { src: '/logos/without-streaming.svg', srcLight: '/logos/without-streaming-light.svg', width: 718, height: 529 },
    detailPageEnabled: false,
  },
  {
    id: 'annflow',
    order: 5,
    slug: 'annflow',
    title: 'annFlow',
    tags: ['automation', 'AI', 'systems', 'agents', 'workflows'],
    shortDescription: 'Системы, агенты и автоматизация для вещей, которые должны работать.',
    longDescription: [
      'Операционная сторона @arsenynn: LLM, агенты, автоматизация macOS, собственные сервисы.',
      'Эксперименты вокруг реальных задач, а не обзоры технологий.',
    ],
    status: 'active',
    links: [{ label: 'Telegram', url: 'https://t.me/annsflow', type: 'telegram', primary: true }],
    logo: { src: '/logos/annflow.webp', srcLight: '/logos/annflow-light.webp', width: 600, height: 231 },
    detailPageEnabled: false,
  },
  {
    id: 'party-protocol',
    order: 6,
    slug: 'party-protocol',
    title: 'Party Protocol',
    tags: ['VPN', 'privacy', 'secure access'],
    shortDescription: 'Независимый доступ через собственную инфраструктуру.',
    longDescription: ['Независимый сервис со своими серверами, сайтом и Telegram-ботом.'],
    status: 'active',
    links: [
      { label: 'Website', url: 'https://partyprotocol.arsenynn.quest', type: 'website', primary: true },
      { label: 'Telegram', url: 'https://t.me/partyprotocol', type: 'telegram' },
    ],
    mark: { src: '/logos/party-protocol.svg', srcLight: '/logos/party-protocol-light.svg', width: 1392, height: 546 },
    detailPageEnabled: false,
  },
  {
    id: 'travel-log',
    order: 7,
    slug: 'travel-log',
    title: 'Travel Log',
    tags: ['places', 'stories', 'memory', 'literature'],
    shortDescription: 'Места, истории и то, что остаётся после дороги.',
    status: 'coming-soon',
    statusLabel: 'Coming soon',
    links: [],
    detailPageEnabled: false,
  },
];

export const sortedProjects = [...projects].sort((a, b) => a.order - b.order);
