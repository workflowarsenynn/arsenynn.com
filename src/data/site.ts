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
    descriptor: 'projects / channels / things',
    phrase: 'an index of parallel things',
    intro: 'Семь проектов одного автора: кино, коммерческое видео, философия, радио, AI, VPN и путешествия.',
  },

  header: {
    link: { label: 'Portfolio', url: 'https://portfolio.arsenynn.com/video-production/' },
  },

  work: {
    title: 'Work / Collaboration',
    descriptor: 'production / commercial video / creative projects',
    text: 'Коммерческие видео, production и совместные проекты. Посмотрите работы или напишите в Telegram.',
    links: [
      { label: 'Portfolio', url: 'https://portfolio.arsenynn.com/video-production/', primary: true },
      { label: 'Telegram', url: 'https://t.me/ww_arsenynn' },
    ],
  },

  footer: {
    name: '© @arsenynn',
  },
} as const;
