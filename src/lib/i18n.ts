// Языки сайта (advisory): русский по умолчанию без префикса, английский на /en/.
export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

export function toLocale(value: string | undefined): Locale {
  return value === 'en' ? 'en' : 'ru';
}

/** Путь страницы в нужном языке: '/' -> '/en/'. */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/${locale}${clean}`;
}

export const ui = {
  ru: {
    htmlLang: 'ru',
    ogLocale: 'ru_RU',
    projectsLabel: 'Проекты',
    tagsLabel: 'Темы',
    newTab: ' (откроется в новой вкладке)',
    updated: 'Обновлено',
    contentsLabel: 'Проекты',
    radioLabel: 'Сейчас в эфире',
    radioOpen: 'На сайт радио',
    allLabel: 'Все',
    streamLabel: 'Случайные посты',
    streamFilm: 'Смотреть',
    streamPause: 'Пауза',
    streamPlay: 'Смотреть дальше',
    streamNext: 'Следующий пост',
    streamPrev: 'Предыдущий пост',
    streamHint: 'Листайте',
    streamSoundOn: 'Включить звук',
    streamSoundOff: 'Выключить звук',
    streamFullOn: 'На весь экран',
    streamFullOff: 'Свернуть',
    introLabel: 'Вступление',
    readInTelegram: 'Читать в Telegram',
    soon: 'скоро',
    playVideo: ' (откроется плеер)',
    playerClose: 'Закрыть',
    playerPrev: 'Назад',
    playerNext: 'Дальше',
    playerTelegram: 'Смотреть в Telegram',
    switchLabel: 'EN',
    switchName: 'English version',
    notFoundText: 'Такой страницы нет.',
    notFoundBack: 'На главную',
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    projectsLabel: 'Projects',
    tagsLabel: 'Topics',
    newTab: ' (opens in a new tab)',
    updated: 'Updated',
    contentsLabel: 'Projects',
    radioLabel: 'On air now',
    radioOpen: 'Open the radio',
    allLabel: 'All (in Russian)',
    streamLabel: 'Random posts',
    streamFilm: 'Watch',
    streamPause: 'Pause',
    streamPlay: 'Keep watching',
    streamNext: 'Next post',
    streamPrev: 'Previous post',
    streamHint: 'Swipe',
    streamSoundOn: 'Sound on',
    streamSoundOff: 'Sound off',
    streamFullOn: 'Full screen',
    streamFullOff: 'Exit full screen',
    introLabel: 'Introduction (RU)',
    readInTelegram: 'Read on Telegram',
    soon: 'soon',
    playVideo: ' (opens the player)',
    playerClose: 'Close',
    playerPrev: 'Previous',
    playerNext: 'Next',
    playerTelegram: 'Watch on Telegram',
    switchLabel: 'RU',
    switchName: 'Русская версия',
    notFoundText: 'This page does not exist.',
    notFoundBack: 'Home',
  },
} as const satisfies Record<Locale, Record<string, string>>;
