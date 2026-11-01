// Тексты и ссылки сайта вне проектов. Черновой copy, меняется здесь.

export const site = {
  name: '@arsenynn',
  url: 'https://arsenynn.com',
  lang: 'ru',
  title: '@arsenynn — index',
  description:
    'Индекс проектов @arsenynn: авторское кино, коммерческое видео, философия, радио, AI-системы, VPN и путешествия.',
  themeColor: '#0a0a0a',
  ogImage: '/og.png',

  hero: {
    title: '@arsenynn',
    logo: { src: '/logos/arsenynn.svg', width: 1235, height: 491 },
    // Главный логотип хаба: портрет в красном свете, единственное изображение сайта.
    portrait: { src: '/portrait.webp', width: 800, height: 800 },
    // Одна строка вместо трёх слоёв объяснения (advisory: reduce explanation, increase identity).
    line: 'семь параллельных вещей одного автора',
  },

  // Портфолио-хаб для сотрудничества и HR: IT / AI, продажи и события, видео.
  header: {
    link: { label: 'Portfolio', url: 'https://portfolio.arsenynn.com/' },
  },

  work: {
    title: 'Work / Collaboration',
    descriptor: 'collaboration / hiring / portfolio',
    text: 'Портфолио для сотрудничества и найма: AI-автоматизация, продажи и события, видеопродакшн.',
    links: [
      { label: 'Portfolio', url: 'https://portfolio.arsenynn.com/', primary: true },
      { label: 'IT / AI', url: 'https://portfolio.arsenynn.com/it-ai/' },
      { label: 'Sales / Events', url: 'https://portfolio.arsenynn.com/sales-events/' },
      { label: 'Video production', url: 'https://portfolio.arsenynn.com/video-production/' },
    ],
  },

  // Английская версия (/en/). Поля, которых здесь нет, берутся из основных.
  en: {
    title: '@arsenynn — index',
    description:
      'An index of @arsenynn projects: auteur film, commissioned video, philosophy, radio, AI systems, VPN and travel.',
    heroLine: 'seven parallel things by one author',
    workText: 'Portfolio for collaboration and hiring: AI automation, sales and events, video production.',
  },

  footer: {
    name: '© @arsenynn',
  },
} as const;
