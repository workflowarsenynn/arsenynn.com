import { getCollection } from 'astro:content';
import type { Project } from './types';

// Данные проектов лежат в src/content/projects.yaml (Content Collection).
export async function getProjects(): Promise<Project[]> {
  const entries = await getCollection('projects');
  return entries.map((e) => ({ id: e.id, ...e.data })).sort((a, b) => a.order - b.order);
}
