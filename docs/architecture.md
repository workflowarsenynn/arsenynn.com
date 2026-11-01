# Architecture
LastUpdated: 2026-11-01 19:35 MSK

Статус: MVP реализован по этой архитектуре. Требования и их причины находятся в `docs/brief.md`, здесь только технические решения.

## Stack

- Astro со статической сборкой: компоненты на сервере сборки, в браузер уходит только HTML, CSS и один маленький скрипт. Причины выбора в `docs/decisions_log.md`.
- TypeScript для данных, чтобы опечатка в проекте или ссылке ломала сборку, а не страницу.
- Обычный CSS с design tokens. Без Tailwind, без UI-библиотек, без icon packs: стрелка `↗` это текст.
- Шрифты (advisory phase 2): Source Serif 4 Variable для заголовков, hero-строки и литературного текста, Manrope Variable для интерфейса и текста. Оба OFL-1.1, с кириллицей, self-hosted через `@fontsource-variable/*`, только ось wght (без opsz): около 126 KB woff2 на первый просмотр с кириллицей и латиницей.
- Node.js 20 или новее.

## Repository structure

Названия можно менять, принцип разделения нет.

```text
assets/logos/            исходники логотипов от владельца
docs/                    документация проекта
public/                  favicon, OG image, apple-touch-icon, CNAME
scripts/render-images.mjs  генерация OG image и иконки через Playwright
scripts/trace-logo.py    векторизация одноцветного логотипа в SVG
scripts/build-preview.sh копия dist/ для превью-артефакта
public/logos/            веб-версии логотипов
.github/workflows/deploy.yml  сборка и публикация на Pages
src/
  content.config.ts      схема коллекции projects (zod)
  content/projects.yaml  все проекты, тексты и внешние ссылки
  data/types.ts          типы, выведенные из схемы
  data/projects.ts       getProjects(): коллекция, отсортированная по order
  data/site.ts           заголовок сайта, hero, header, блок Work, footer, SEO
  components/            SiteHeader, Hero, ProjectList, ProjectSection,
                         ProjectActions, ProjectDetails, ActionLink,
                         Collaboration, SiteFooter
  scripts/about.ts       единственный клиентский скрипт
  layouts/Base.astro     head, meta, Open Graph
  pages/index.astro      единственная страница MVP
  pages/404.astro        страница 404 для Pages
  styles/tokens.css      design tokens
  styles/global.css      база и типографика
```

## Content model

Источник контента и URL: Content Collection `projects` (`src/content/projects.yaml`, схема `src/content.config.ts`) и `src/data/site.ts`. Схема проверяет поля, `https://` у ссылок, slug, не больше четырёх абзацев About и подпись у проекта без ссылок. Журнал проверки ссылок и открытые вопросы: `docs/project_registry.md`.

```ts
type ProjectLink = {
  label: string
  url: string
  type: 'telegram' | 'website' | 'portfolio' | 'listen' | 'other'
  primary?: boolean
}

type Project = {
  id: string
  order: number
  slug: string
  title: string
  tags: string[]
  shortDescription: string
  longDescription?: string[]     // абзацы для About, не больше четырёх
  status: 'active' | 'coming-soon' | 'private'
  statusLabel?: string           // подпись вместо ссылок, если URL нет
  links: ProjectLink[]
  logo?: Asset                   // логотип вместо названия
  mark?: Asset                   // знак над названием
  detailPageEnabled: boolean     // в MVP всегда false
}
```

Правила:

- Номер на странице выводится из `order`, а не хранится текстом.
- Проект без публичного URL не получает ссылку-заглушку: `links` пустой, показывается `Coming soon` или ничего.
- `About` не выводится, если `longDescription` пуст.
- Если у проекта есть `mark`, знак (`--mark-height`) стоит в строке номера: на телефоне справа от номера, с 48rem под номером в левой колонке. `alt` пустой, название есть текстом.
- Сетка строки проекта: телефон одна колонка (meta, body, actions, details), с 48rem две колонки (8rem | контент), с 64rem три (8rem | контент | 14rem действия).
- Если у проекта есть `logo`, вместо текста в `<h2>` выводится `<img>` с `alt` = `title`. Высота задаётся токеном `--logo-height`.
- Hero: портрет `site.hero.portrait` (главный логотип хаба), wordmark из `site.hero.logo` и одна строка `site.hero.line`. Портрет — центрированный титульный кадр: плотный вертикальный кроп 750×900, чёрный поднят до фона #0a0a0a, WebP без потерь. Небольшое лицо по центру (до 42vw / 11rem, на desktop 14rem), wordmark и строка по центру под ним, наложение кадра на wordmark до ~20% высоты, чтобы огонёк в кадре оставался над названием. Края растворяются эллиптической маской. Wordmark (SVG, `fetchpriority=high`), без логотипа выводится текст. Header содержит только ссылку Portfolio, имя не дублируется.
- В названии разрешён перенос перед внутренним `@` (`workflow@arsenynn`), посреди слова названия не рвутся.
- `slug` резервирует будущий маршрут. Страниц проектов в MVP нет.
- Тексты лежат отдельно от разметки, поэтому RU/EN можно добавить позже без переписывания компонентов. Переключателя языка в MVP нет.

## Parts and contents

- У @arsenynn строки «Часть I» и «Часть II» раскрывают главы: вступление (текст части), затем видео строками `номер | название | длительность | ↗`, ссылка на пост в Telegram. Данные: `parts` в `projects.yaml` (label, labelEn, intro, chapters, позже youtube — плейлист части строкой сверху).
- Правила: один уровень раскрытия, одна ссылка на строку (вложенные аккордеоны и двойные цели в строке не используются).
- Кнопки частей и «Проекты» белые (`project-actions__toggle`), About серый.

## annFlow contents

- У annFlow строка «Проекты» (EN Projects) раскрывает оглавление канала: проект, подзаголовок, ссылка на первый пост. Данные в `contents` проекта в `projects.yaml` (схема требует https), источник — пост канала «Навигация по проектам канала» и новые серии после него.
- Панель — `.disclosure` в `global.css`, тот же скрипт `about.ts` (data-about-toggle): без JS открыта, с JS свёрнута.

## Languages

- Astro i18n: `ru` по умолчанию без префикса, `en` на `/en/` (`astro.config.mjs`). Общая разметка в `src/components/HomePage.astro`, страницы `src/pages/index.astro` и `src/pages/en/index.astro`.
- Язык компонента: `Astro.currentLocale`, служебные подписи в `src/lib/i18n.ts`, английские тексты сайта в `site.en`, проектов — в блоке `en` и `labelEn` в `projects.yaml`. Блок `en` обязателен в схеме: смешанного языка на странице быть не должно.
- Каждая страница отдаёт canonical, `hreflang` ru и en и `x-default` на русскую. 404 двуязычная, с `noindex`.
- Переключатель в header: «EN» на русской странице, «RU» на английской, зона 48 px.

## Living index

- Порядок проектов на главной задаёт владелец полем `order` (2026-11-01: Party Protocol, annFlow, Without Streaming, @arsenynn, workflow, Бессмысленность, Travel Log), затем блок Work. Свежесть влияет только на огонёк, не на порядок.
- Свежесть: дата последнего поста публичного канала (`feed` в `projects.yaml`, страница `t.me/s/<канал>`, только `<time datetime>`), иначе ручная `updatedAt`. Код: `src/lib/activity.ts`, 3 попытки по 8 с при сборке.
- Сигнальный огонёк у номера: залитая точка — до 7 дней, кольцо — до 45 дней, пусто — тишина. Без анимации. Дата текстом только для экранных дикторов и в `title`.
- `deploy.yml` пересобирает сайт по расписанию каждые 6 часов (`17 */6 * * *`).
- Для чатов без публичной ленты (группа «Бессмысленность», канал Without Streaming) даты даёт бот: `.github/workflows/telegram-activity.yml` раз в час вызывает `scripts/telegram/activity.mjs` (getUpdates), пишет только дату в `src/content/activity.json`, коммитит и запускает `deploy.yml`. Без секрета `TELEGRAM_BOT_TOKEN` ничего не делает.

## About accordion

- Кнопка `About +` / `About −` с `aria-expanded` и `aria-controls`, клавиатура работает за счёт нативной кнопки.
- Анимация через `grid-template-rows` и `opacity`, 150–250 ms. При `prefers-reduced-motion` переход отключается.
- Один общий скрипт на страницу, без фреймворка, без `client:*` директив Astro.
- Без JavaScript текст About виден сразу. Inline-скрипт в `<head>` ставит `html.js`, и CSS сворачивает панели до первой отрисовки, поэтому нет скачка. `about.ts` синхронизирует `aria-expanded` и знак `+`/`−`, класс `about-ready` включает анимацию только после загрузки. Основные ссылки от скрипта не зависят.
- Раскрытие одной секции не закрывает другие.

## Styling

- Токены только для того, что реально будем менять: цвет фона, текста, muted, accent и line, шкала отступов, два шрифта, ширина контента. Ориентир: не больше 20 токенов.
- Сначала стили для 390 px, расширение только через `min-width`.
- Размеры текста из `docs/brief.md` раздел 13: body 17–18 px, descriptors не меньше 14 px, заголовок проекта 26–36 px.
- Touch target ссылки и кнопки не меньше 44 px, цель 48 px.
- Высота hero 62 `svh` с запасным значением `vh`, чтобы был виден следующий проект. Отступы учитывают `safe-area-inset-*`.
- Desktop от 48rem: колонка номера 8rem слева, контент справа, ширина текста до 38rem, контейнер до 72rem.
- Ссылки проектов и About: строки на всю ширину колонки (`.action-list`, `ActionLink` variant `row`), высота 56 px (`--tap-row`), название слева, стрелка или `+` справа, тонкие линии между строками, primary красная. На desktop строки стоят в правой колонке 16rem. Ссылка в header текстовая (variant `text`). About текстовая кнопка.
- Сборка инлайнит CSS в HTML (`inlineStylesheets: always`). Внешние запросы: favicon и woff2 Playfair нужного подмножества (кириллица или латиница, около 40–50 KB каждое).

## Hosting

GitHub Pages плюс DNS only запись в Cloudflare. Прокси Cloudflare запрещён: в РФ он обрезает ответы примерно на 16 KB, это уже проверено на Portfolio. Детали и порядок запуска в `docs/deploy.md`.

## Non-goals

Полный список в `docs/brief.md` раздел 50. Главное: никаких CMS, базы, встроенного плеера, Telegram-ленты, аналитики и сторонних трекеров в MVP.
