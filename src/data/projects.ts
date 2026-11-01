import { getCollection } from 'astro:content';
import type { Project } from './types';
import { lastTelegramPost, signalFor, type Signal } from '../lib/activity';

export type ProjectView = Project & { lastActivity?: Date; signal: Signal };

// Данные проектов лежат в src/content/projects.yaml (Content Collection).
// Порядок: свежие наверху, проекты без ссылок (Coming soon) внизу, при равенстве — поле order.
export async function getProjects(): Promise<ProjectView[]> {
  const entries = await getCollection('projects');
  const now = new Date();
  const views = await Promise.all(
    entries.map(async (e): Promise<ProjectView> => {
      const fromFeed = e.data.feed ? await lastTelegramPost(e.data.feed) : undefined;
      const dates = [fromFeed, e.data.updatedAt].filter((d): d is Date => Boolean(d));
      const lastActivity = dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined;
      return { id: e.id, ...e.data, lastActivity, signal: signalFor(lastActivity, now) };
    }),
  );
  const rank = (p: ProjectView) => (p.links.length === 0 ? 1 : 0);
  return views.sort(
    (a, b) =>
      rank(a) - rank(b) ||
      (b.lastActivity?.getTime() ?? 0) - (a.lastActivity?.getTime() ?? 0) ||
      a.order - b.order,
  );
}
