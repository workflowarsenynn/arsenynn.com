import { getCollection, type CollectionEntry } from 'astro:content';
import channel from '../content/annflow/channel.json';
import { localePath, type Locale } from './i18n';

/** Заметка на нужном языке: заголовок, подписи и текст подставлены, медиа общие. */
export type Note = CollectionEntry<'annflow'> & { text: CollectionEntry<'annflow'> | CollectionEntry<'annflowEn'> };
export type Series = {
  slug: string;
  title: string;
  note: string;
  /** Первый пост серии: кадр и заголовок. Оглавлением служит список на странице. */
  intro: Note;
  notes: Note[];
  /** Части, которых ещё нет на канале. Вышедшие выпадают по совпадению заголовка. */
  planned: string[];
  minutes: number;
  cover?: NonNullable<Note['data']['media']>[number]['src'];
};
type ChannelSeries = (typeof channel.series)[number] & { planned?: string[]; plannedEn?: string[] };

/** Скорость чтения: примерно 1300 знаков в минуту. */
export const minutesOf = (note: Note) => Math.max(1, Math.round((note.text.body?.length ?? 0) / 1300));

const dateFormats = {
  ru: new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
  en: new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
};
export const formatDate = (date: Date, locale: Locale) => dateFormats[locale].format(date).replace(' г.', '');

export const telegramUrl = (post: number) => `https://t.me/${channel.channel}/${post}`;
export const channelUrl = `https://t.me/${channel.channel}`;

/** Серии в порядке channel.json, заметки в порядке чтения. */
export async function getSeries(locale: Locale = 'ru'): Promise<Series[]> {
  const all = await getCollection('annflow');
  const english = new Map((await getCollection('annflowEn')).map((n) => [n.id, n]));
  const localized = (note: CollectionEntry<'annflow'>): Note => {
    const en = locale === 'en' ? english.get(note.id) : undefined;
    if (!en) return { ...note, text: note };
    const media = note.data.media?.map((m, i) => ({ ...m, caption: m.caption && (en.data.captions?.[i] ?? m.caption) }));
    return { ...note, text: en, data: { ...note.data, title: en.data.title, media } };
  };
  return (channel.series as ChannelSeries[]).map((s) => {
    const sorted = all.filter((n) => n.data.series === s.slug).sort((a, b) => a.data.order - b.data.order).map(localized);
    const [intro, ...notes] = sorted;
    const published = new Set(notes.map((n) => n.data.title));
    const planned = (locale === 'en' ? s.plannedEn : s.planned) ?? [];
    return {
      slug: s.slug,
      title: locale === 'en' ? s.titleEn : s.title,
      note: locale === 'en' ? s.noteEn : s.note,
      intro,
      notes,
      planned: planned.filter((title) => !published.has(title)),
      minutes: notes.reduce((sum, n) => sum + minutesOf(n), 0),
      cover: sorted.flatMap((n) => n.data.media ?? []).find((m) => m.type === 'image')?.src,
    };
  });
}

/** Страницы серий для обоих языков. */
export async function seriesPaths(locale: Locale) {
  const all = await getSeries(locale);
  return all.map((series, i) => ({ params: { slug: series.slug }, props: { series, next: all[i + 1] } }));
}

/** Страницы заметок. Первый пост серии живёт на её странице, старые ссылки ведут туда. */
export async function notePaths(locale: Locale) {
  const all = await getSeries(locale);
  const flat = all.flatMap((series) => series.notes.map((note, index) => ({ note, series, index })));
  const notes = flat.map((item, i) => ({
    params: { id: item.note.id },
    props: { ...item, prev: flat[i - 1]?.note, next: flat[i + 1]?.note, nextSeries: flat[i + 1]?.series },
  }));
  const intros = all.map((series) => ({ params: { id: series.intro.id }, props: { series } }));
  return [...notes, ...intros];
}

export const seriesPath = (locale: Locale, slug: string) => localePath(locale, `/annflow/projects/${slug}/`);

/** Склонение: 1 заметка, 2 заметки, 5 заметок. На английском второй и третий варианты совпадают. */
export function plural(n: number, one: string, few: string, many: string) {
  const a = n % 100;
  const b = n % 10;
  if (a > 10 && a < 20) return many;
  if (b === 1) return one;
  if (b > 1 && b < 5) return few;
  return many;
}
