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
    descriptor: 'projects / channels / things',
    phrase: 'an index of parallel things',
    intro: 'Один автор, семь параллельных линий: кино, заказное видео, разговор, эфир, системы, приватность и дорога.',
  },

  header: {
    link: { label: 'Portfolio', url: 'https://portfolio.arsenynn.com/video-production/' },
  },

  work: {
    title: 'Work / Collaboration',
    descriptor: 'production / commercial video / creative projects',
    text: 'Снимаю для брендов, событий и людей. Работы в портфолио, остальное в Telegram.',
    links: [
      { label: 'Portfolio', url: 'https://portfolio.arsenynn.com/video-production/', primary: true },
      { label: 'Telegram', url: 'https://t.me/ww_arsenynn' },
    ],
  },

  footer: {
    name: '© @arsenynn',
  },
} as const;
