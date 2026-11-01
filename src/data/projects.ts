import type { Project } from './types';

// Единственный источник проектов, текстов и внешних ссылок.
// Тексты черновые (docs/brief.md раздел 53), About ждут утверждения владельца.
// Проверка ссылок и открытые вопросы: docs/project_registry.md.

const PORTFOLIO_VIDEO = 'https://portfolio.arsenynn.com/video-production/';

export const projects: Project[] = [
  {
    id: 'arsenynn',
    order: 1,
    slug: 'arsenynn',
    title: '@arsenynn',
    tags: ['concept', 'chapters', 'identity'],
    shortDescription:
      'Основной авторский канал. Фильмы, главы, наблюдения и фрагменты, из которых постепенно складывается более крупная история.',
    longDescription: [
      'Центральная авторская линия. Не lifestyle-канал, не портфолио и не блог в привычном смысле.',
      'Видео, места, люди, мысли и визуальные фрагменты делятся на главы и со временем складываются в одну большую структуру.',
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
    shortDescription:
      'Коммерческие видео, production и проекты для клиентов. Съёмка, монтаж, режиссура и работа с визуальными историями.',
    longDescription: [
      'Профессиональная сторона видеопроизводства: ролики для брендов, промо, event-видео, съёмка, монтаж, режиссура и продюсирование.',
      'Если нужен проект под задачу, начните с портфолио или напишите в Telegram.',
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
    shortDescription:
      'Пространство разговора, памяти и вещей, которые могут возвращаться спустя время вместо того, чтобы исчезать после публикации.',
    longDescription: [
      'Не просто канал, а среда для разговора. Внутри работает бот ann: он участвует в беседе, помнит контекст и возвращает старые материалы обратно в поток.',
      'Некоторые вещи становятся понятны спустя месяцы или годы, поэтому здесь ничто не обязано исчезать после публикации.',
    ],
    status: 'active',
    links: [{ label: 'Telegram', url: 'https://t.me/bessmislennost', type: 'telegram', primary: true }],
    detailPageEnabled: false,
  },
  {
    id: 'without-streaming',
    order: 4,
    slug: 'without-streaming',
    title: 'Without Streaming',
    tags: ['radio', 'music', 'archives', 'fragments'],
    shortDescription: 'Личная музыкальная медиатека, превращённая в постоянно существующий эфир.',
    longDescription: [
      'Интернет-радио, выросшее из канала с музыкой и визуальными материалами. Не плейлист, а эфир, который идёт всегда.',
      'Музыка, архив, визуальные фрагменты и личный вкус соединяются в один поток.',
    ],
    status: 'active',
    links: [
      { label: 'Listen', url: 'https://radio.arsenynn.quest', type: 'listen', primary: true },
      { label: 'Telegram', url: 'https://t.me/without_streaming', type: 'telegram' },
    ],
    detailPageEnabled: false,
  },
  {
    id: 'annflow',
    order: 5,
    slug: 'annflow',
    title: 'annFlow',
    tags: ['automation', 'AI', 'systems', 'agents', 'workflows'],
    shortDescription:
      'AI, автоматизация, собственные системы и проекты, которые превращают идеи и повседневные процессы в работающую инфраструктуру.',
    longDescription: [
      'Операционная сторона всего @arsenynn: как всё это строится и работает.',
      'Агенты, LLM, автоматизация macOS, собственные сервисы и инфраструктура. Эксперименты и проекты вокруг реальных задач, а не обзоры технологий.',
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
    shortDescription: 'Независимый VPN-проект про приватность, устойчивый доступ и собственную инфраструктуру.',
    longDescription: [
      'Отдельный продукт со своей инфраструктурой, сайтом и Telegram-ботом.',
    ],
    status: 'active',
    links: [
      { label: 'Website', url: 'https://partyprotocol.arsenynn.quest', type: 'website', primary: true },
      { label: 'Telegram', url: 'https://t.me/partyprotocol', type: 'telegram' },
    ],
    detailPageEnabled: false,
  },
  {
    id: 'travel-log',
    order: 7,
    slug: 'travel-log',
    title: 'Travel Log',
    tags: ['places', 'stories', 'memory', 'literature'],
    shortDescription: 'Путешествия, места, фотография, кино, литература и память.',
    status: 'coming-soon',
    statusLabel: 'Coming soon',
    links: [],
    detailPageEnabled: false,
  },
];

export const sortedProjects = [...projects].sort((a, b) => a.order - b.order);
