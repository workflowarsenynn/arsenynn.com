import { getCollection } from 'astro:content';
import type { Project } from './types';
import { lastTelegramPost, signalFor, type Signal } from '../lib/activity';
import type { Locale } from '../lib/i18n';
import activity from '../content/activity.json';

// Даты от Telegram-бота для проектов без публичной ленты (scripts/telegram/activity.mjs).
const botActivity = activity as Record<string, { chat: string; lastActivity: string | null }>;

export type ProjectView = Project & { lastActivity?: Date; signal: Signal };

// Данные проектов лежат в src/content/projects.yaml (Content Collection).
// Порядок задаёт владелец полем order. Свежесть влияет только на сигнальный огонёк.
export async function getProjects(locale: Locale = 'ru'): Promise<ProjectView[]> {
  const entries = await getCollection('projects');
  const now = new Date();
  const views = await Promise.all(
    entries.map(async (e): Promise<ProjectView> => {
      const fromFeed = e.data.feed ? await lastTelegramPost(e.data.feed) : undefined;
      const fromBot = botActivity[e.id]?.lastActivity ? new Date(botActivity[e.id].lastActivity!) : undefined;
      const dates = [fromFeed, fromBot, e.data.updatedAt].filter((d): d is Date => Boolean(d));
      const lastActivity = dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined;
      const d = e.data;
      // На /en/ подставляются английские тексты и подписи ссылок, структура та же.
      const localized =
        locale === 'en'
          ? {
              shortDescription: d.en.shortDescription,
              longDescription: d.en.longDescription,
              statusLabel: d.en.statusLabel ?? d.statusLabel,
              links: d.links.map((l) => ({ ...l, label: l.labelEn ?? l.label })),
              contents: d.contents?.map((c) => ({ ...c, note: c.noteEn ?? c.note })),
            }
          : {};
      return { id: e.id, ...d, ...localized, lastActivity, signal: signalFor(lastActivity, now) };
    }),
  );
  return views.sort((a, b) => a.order - b.order);
}
