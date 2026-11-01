import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// Advisory, migration step 4: Content Collections без смены URL.
// Сборка падает, если в src/content/projects.yaml опечатка в поле, ссылке или статусе.

const asset = z.object({
  src: z.string().startsWith('/'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const projects = defineCollection({
  loader: file('src/content/projects.yaml'),
  schema: z
    .object({
      order: z.number().int().min(1),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      title: z.string().min(1),
      tags: z.array(z.string()).min(1),
      shortDescription: z.string().min(1),
      longDescription: z.array(z.string()).max(4).optional(),
      status: z.enum(['active', 'coming-soon', 'private']),
      statusLabel: z.string().optional(),
      links: z.array(
        z.object({
          label: z.string().min(1),
          /** Подпись на /en/, если отличается (например, «Часть I» -> Part I). */
          labelEn: z.string().min(1).optional(),
          url: z.url().refine((u) => u.startsWith('https://'), 'Ссылка должна начинаться с https://'),
          type: z.enum(['telegram', 'website', 'portfolio', 'listen', 'chapter', 'other']),
          primary: z.boolean().optional(),
        }),
      ),
      logo: asset.optional(),
      mark: asset.optional(),
      /** Публичный Telegram-канал, по последнему посту которого считается активность. */
      feed: z.string().regex(/^[A-Za-z0-9_]+$/).optional(),
      /** Ручная дата последнего обновления, если ленты нет. */
      updatedAt: z.coerce.date().optional(),
      /** Английский текст для /en/. Обязателен: смешанного языка на странице быть не должно. */
      en: z.object({
        shortDescription: z.string().min(1),
        longDescription: z.array(z.string()).max(4).optional(),
        statusLabel: z.string().optional(),
      }),
      detailPageEnabled: z.boolean(),
    })
    // Нет публичного URL — нет ссылки-заглушки, но должна быть подпись.
    .refine((p) => p.links.length > 0 || Boolean(p.statusLabel), {
      message: 'Проект без ссылок должен иметь statusLabel (например, Coming soon)',
    }),
});

export const collections = { projects };
