import type { CollectionEntry } from 'astro:content';

// Типы выводятся из схемы src/content.config.ts.
export type Project = CollectionEntry<'projects'>['data'] & { id: string };
export type ProjectLink = Project['links'][number];
export type Asset = NonNullable<Project['logo']>;
