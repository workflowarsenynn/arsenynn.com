import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Advisory, migration step 4: Content Collections без смены URL.
// Сборка падает, если в src/content/projects.yaml опечатка в поле, ссылке или статусе.

const asset = z.object({
  src: z.string().startsWith('/'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** Множитель размера знака (фото-знаки крупнее штриховых, иначе лицо не читается). */
  scale: z.number().positive().optional(),
  /** Фото: края растворяются в фоне, как портрет в hero. */
  photo: z.boolean().optional(),
});

const projects = defineCollection({
  loader: file('src/content/projects.yaml'),
  schema: z
    .object({
      order: z.number().int().min(1),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      title: z.string().min(1),
      /** Название акцентным красным (главный проект @arsenynn). */
      accent: z.boolean().optional(),
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
          /** Внешняя ссылка по https:// или страница сайта от корня. */
          url: z.string().refine((u) => u.startsWith('https://') || u.startsWith('/'), 'Ссылка: https:// или путь от корня сайта'),
          type: z.enum(['telegram', 'website', 'portfolio', 'listen', 'chapter', 'site', 'other']),
          primary: z.boolean().optional(),
        }),
      ),
      /** Лента случайных постов канала: адрес списка на сайте. */
      stream: z.string().startsWith('/').optional(),
      /** Пробный доступ. Пока enabled: false, в HTML нет ни кнопки, ни ссылки. Только русская версия. */
      trial: z
        .object({
          enabled: z.boolean(),
          label: z.string().min(1),
          note: z.string().min(1),
          url: z.url().refine((u) => u.startsWith('https://'), 'Ссылка должна начинаться с https://'),
        })
        .optional(),
      /** Сайт эфира: играет в маленьком окне на главной. */
      radio: z.url().optional(),
      /** Страница всех проектов. Если задана, contents на главной идут раскрытой лентой. */
      contentsAll: z.string().startsWith('/').optional(),
      /** Оглавление канала: проекты со ссылками на первые посты (пока только annFlow). */
      contents: z
        .array(
          z.object({
            title: z.string().min(1),
            /** Английское название, если оно отличается от title. */
            titleEn: z.string().optional(),
            note: z.string().optional(),
            noteEn: z.string().optional(),
            /** Страница этой серии на сайте, важнее url. */
            path: z.string().startsWith('/').optional(),
            /** Строка над названием слева: год. */
            meta: z.string().optional(),
            /** Длительность, справа на той же строке. */
            duration: z.string().optional(),
            /** ID видео на YouTube, открывается в плеере на сайте. */
            youtube: z.string().regex(/^[\w-]{11}$/).optional(),
            /** Хит: название красным. */
            accent: z.boolean().optional(),
            /** Кадр-обложка 16:9 из public/thumbs/. */
            thumb: z.string().startsWith('/').optional(),
            url: z.url().refine((u) => u.startsWith('https://'), 'Ссылка должна начинаться с https://'),
          }),
        )
        .optional(),
      /** Части с главами (у @arsenynn): каждая часть раскрывается списком видео. */
      parts: z
        .array(
          z.object({
            label: z.string().min(1),
            labelEn: z.string().min(1),
            intro: z.url().optional(),
            /** Полный текст вступления (RU) для чтения прямо на сайте. */
            introText: z.array(z.string()).optional(),
            chapters: z.array(
              z.object({
                num: z.string().min(1),
                title: z.string().min(1),
                duration: z.string().optional(),
                /** Кадр-обложка 16:9 из public/thumbs/. */
                thumb: z.string().startsWith('/').optional(),
                /** ID видео на YouTube (канал @arsenynn). */
                youtube: z.string().regex(/^[\w-]{11}$/).optional(),
                /** Хит: название красным. */
                accent: z.boolean().optional(),
                url: z.url().refine((u) => u.startsWith('https://'), 'Ссылка должна начинаться с https://'),
              }),
            ),
          }),
        )
        .optional(),
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

// Заметки канала annFlow: scripts/telegram/import-channel.mjs, серии в src/content/annflow/channel.json.
const annflow = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/annflow/notes' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      series: z.string().regex(/^[a-z0-9-]+$/),
      order: z.number().int().min(1),
      publishedAt: z.coerce.date(),
      /** Посты Telegram, из которых собрана заметка, первый — основной. */
      source: z.array(z.number().int().positive()).min(1),
      /** Файлы из public/files/annflow/. */
      files: z.array(z.string()).optional(),
      media: z
        .array(
          z.object({
            type: z.enum(['image', 'video']),
            /** Картинка или постер видео. */
            src: image().optional(),
            /** Файл видео в public/. Без него постер ведёт в Telegram. */
            file: z.string().startsWith('/').optional(),
            duration: z.string().optional(),
            caption: z.string().optional(),
            post: z.number().int().positive(),
          }),
        )
        .optional(),
    }),
});

export const collections = { projects, annflow };
