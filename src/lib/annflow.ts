import { getCollection, type CollectionEntry } from 'astro:content';
import channel from '../content/annflow/channel.json';

export type Note = CollectionEntry<'annflow'>;
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

/** Скорость чтения: примерно 1300 знаков в минуту. */
export const minutesOf = (note: Note) => Math.max(1, Math.round((note.body?.length ?? 0) / 1300));

const dateFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
export const formatDate = (date: Date) => dateFormat.format(date).replace(' г.', '');

export const telegramUrl = (post: number) => `https://t.me/${channel.channel}/${post}`;
export const channelUrl = `https://t.me/${channel.channel}`;

/** Серии в порядке channel.json, заметки в порядке чтения. */
export async function getSeries(): Promise<Series[]> {
  const all = await getCollection('annflow');
  return channel.series.map((s) => {
    const [intro, ...notes] = all.filter((n) => n.data.series === s.slug).sort((a, b) => a.data.order - b.data.order);
    const published = new Set(notes.map((n) => n.data.title));
    return {
      slug: s.slug,
      title: s.title,
      note: s.note,
      intro,
      notes,
      planned: ('planned' in s ? (s.planned as string[]) : []).filter((title) => !published.has(title)),
      minutes: notes.reduce((sum, n) => sum + minutesOf(n), 0),
      cover: [intro, ...notes].flatMap((n) => n.data.media ?? []).find((m) => m.type === 'image')?.src,
    };
  });
}

/** Русское склонение: 1 заметка, 2 заметки, 5 заметок. */
export function plural(n: number, one: string, few: string, many: string) {
  const a = n % 100;
  const b = n % 10;
  if (a > 10 && a < 20) return many;
  if (b === 1) return one;
  if (b > 1 && b < 5) return few;
  return many;
}
