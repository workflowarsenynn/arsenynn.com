// Последняя активность проекта для сигнального огонька и порядка на главной.
// Источник: публичная лента t.me/s/<канал> (только дата последнего поста, контент не копируется,
// advisory: Telegram — источник событий, а не хранилище). Запасной вариант: updatedAt в projects.yaml.

const cache = new Map<string, Promise<Date | undefined>>();

async function fetchLastPost(handle: string): Promise<Date | undefined> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://t.me/s/${handle}`, { signal: AbortSignal.timeout(8000), redirect: 'follow' });
      if (!res.ok) continue;
      const html = await res.text();
      const times = [...html.matchAll(/<time datetime="([^"]+)"/g)].map((m) => new Date(m[1]));
      const valid = times.filter((d) => !Number.isNaN(d.getTime()));
      if (valid.length) return new Date(Math.max(...valid.map((d) => d.getTime())));
    } catch {
      // сеть или таймаут: пробуем ещё раз, затем запасной вариант
    }
  }
  return undefined;
}

export function lastTelegramPost(handle: string): Promise<Date | undefined> {
  if (!cache.has(handle)) cache.set(handle, fetchLastPost(handle));
  return cache.get(handle)!;
}

export type Signal = 'live' | 'recent' | 'quiet';

const DAY = 24 * 60 * 60 * 1000;

/** live: до 7 дней, recent: до 45 дней, quiet: старше или нет данных. */
export function signalFor(date: Date | undefined, now = new Date()): Signal {
  if (!date) return 'quiet';
  const days = (now.getTime() - date.getTime()) / DAY;
  if (days <= 7) return 'live';
  if (days <= 45) return 'recent';
  return 'quiet';
}

/** «сегодня», «3 дня назад», «5 недель назад» — для экранных дикторов и подсказки. */
export function relativeRu(date: Date, now = new Date()): string {
  const days = Math.max(0, Math.floor((now.getTime() - date.getTime()) / DAY));
  const plural = (n: number, one: string, few: string, many: string) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  };
  if (days === 0) return 'сегодня';
  if (days === 1) return 'вчера';
  if (days < 14) return `${days} ${plural(days, 'день', 'дня', 'дней')} назад`;
  const weeks = Math.round(days / 7);
  if (days < 60) return `${weeks} ${plural(weeks, 'неделю', 'недели', 'недель')} назад`;
  const months = Math.round(days / 30);
  return `${months} ${plural(months, 'месяц', 'месяца', 'месяцев')} назад`;
}

/** "today", "3 days ago", "5 weeks ago". */
export function relativeEn(date: Date, now = new Date()): string {
  const days = Math.max(0, Math.floor((now.getTime() - date.getTime()) / DAY));
  const unit = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'} ago`;
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 14) return unit(days, 'day');
  if (days < 60) return unit(Math.round(days / 7), 'week');
  return unit(Math.round(days / 30), 'month');
}

export function relative(date: Date, locale: 'ru' | 'en', now = new Date()): string {
  return locale === 'en' ? relativeEn(date, now) : relativeRu(date, now);
}
