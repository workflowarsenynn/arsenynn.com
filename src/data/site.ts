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

  // Яндекс Метрика: номер счётчика. Пока пусто, на сайте нет ни баннера, ни счётчика.
  metrics: { yandexId: '' },

  // Как написать лично.
  contact: {
    links: [
      { label: 'Telegram', detail: '@arsenynnn', url: 'https://t.me/arsenynnn' },
      { label: 'Email', detail: 'arsenynn@arsenynn.com', url: 'mailto:arsenynn@arsenynn.com' },
    ],
  },

  work: {
    title: 'Work / Collaboration',
    descriptor: 'collaboration / hiring / portfolio',
    text: 'Портфолио для сотрудничества и найма: AI-автоматизация, продажи и организация мероприятий, видеопродакшн.',
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

  // Страница о данных. Показывается вместе с Метрикой.
  privacy: {
    ru: {
      title: 'Данные и cookie',
      text: [
        'Этот сайт использует Яндекс Метрику, чтобы понимать, что смотрят посетители и что на сайте работает плохо. Она включается только после вашего согласия.',
        'Метрика собирает cookie, данные об устройстве и браузере, примерное местоположение, адрес страниц, источник перехода и действия на сайте: нажатия, прокрутку, запуск видео. Вебвизор записывает выборку визитов, записи хранятся 15 дней.',
        'Данные обрабатывает ООО «Яндекс» на условиях сервиса Яндекс Метрика. Сайт не просит имя, телефон, оплату или другие данные.',
        'Согласие можно отозвать кнопкой ниже: счётчик перестанет загружаться. Вопросы можно задать по адресу arsenynn@arsenynn.com.',
      ],
      reset: 'Отозвать согласие',
      done: 'Согласие отозвано',
    },
    en: {
      title: 'Data and cookies',
      text: [
        'This site uses Yandex Metrica to understand what visitors watch and what works badly on the site. It turns on only after your consent.',
        'Metrica collects cookies, device and browser data, approximate location, page addresses, the referring source and actions on the site: clicks, scrolling, starting a video. Session Replay records a sample of visits, recordings are kept for 15 days.',
        'The data is processed by Yandex LLC under the terms of the Yandex Metrica service. The site does not ask for your name, phone number, payment or any other data.',
        'You can withdraw consent with the button below: the counter will stop loading. Questions: arsenynn@arsenynn.com.',
      ],
      reset: 'Withdraw consent',
      done: 'Consent withdrawn',
    },
  },
} as const;
