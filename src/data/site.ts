// Тексты и ссылки сайта вне проектов. Черновой copy, меняется здесь.

export const site = {
  name: '@arsenynn',
  url: 'https://arsenynn.com',
  lang: 'ru',
  // Google и вкладка браузера: <title> и meta description (описание содержательное, для поиска).
  title: '@arsenynn — Финальная битва между самоценным и рациональным',
  description:
    'Проекты @arsenynn: авторское кино, видео на заказ, философия, интернет-радио, AI-системы, VPN и путешествия.',
  // Превью в Telegram и соцсетях: только имя и слоган.
  ogSiteName: 'arsenynn.com',
  ogTitle: '@arsenynn',
  ogDescription: 'Финальная битва между самоценным и рациональным',
  themeColor: '#0a0a0a',
  ogImage: '/og.png',

  // Провайдер плеера глав. Сменить провайдера: эти адреса и параметры в src/scripts/player.ts.
  video: {
    embed: 'https://www.youtube-nocookie.com/embed/',
    watch: 'https://www.youtube.com/watch?v=',
  },

  hero: {
    title: '@arsenynn',
    logo: { src: '/logos/arsenynn.svg', width: 1235, height: 491 },
    // Главный логотип хаба: портрет в красном свете, единственное изображение сайта.
    portrait: { src: '/portrait.webp', width: 750, height: 900 },
    // Одна строка вместо трёх слоёв объяснения (advisory: reduce explanation, increase identity).
    line: 'Финальная битва между самоценным и рациональным',
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
      // Раздел готовится: строка видна, но не кликается.
      { label: 'Video production', url: 'https://portfolio.arsenynn.com/video-production/', soon: true },
    ],
  },

  // Английская версия (/en/). Поля, которых здесь нет, берутся из основных.
  en: {
    title: '@arsenynn — The final battle between the intrinsic and the rational',
    description:
      'Projects by @arsenynn: auteur film, commissioned video, philosophy, internet radio, AI systems, VPN and travel.',
    ogDescription: 'The final battle between the intrinsic and the rational',
    heroLine: 'The final battle between the intrinsic and the rational',
    workText: 'Portfolio for collaboration and hiring: AI automation, sales and events, video production.',
  },

  footer: {
    name: '© @arsenynn',
  },
} as const;
