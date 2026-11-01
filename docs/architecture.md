# Architecture
LastUpdated: 2026-11-01 15:30 MSK

Статус: MVP реализован по этой архитектуре. Требования и их причины находятся в `docs/brief.md`, здесь только технические решения.

## Stack

- Astro со статической сборкой: компоненты на сервере сборки, в браузер уходит только HTML, CSS и один маленький скрипт. Причины выбора в `docs/decisions_log.md`.
- TypeScript для данных, чтобы опечатка в проекте или ссылке ломала сборку, а не страницу.
- Обычный CSS с design tokens. Без Tailwind, без UI-библиотек, без icon packs: стрелка `↗` это текст.
- Шрифты: Playfair Display Variable (OFL-1.1, кириллица) для названий проектов, hero-фразы и Work, self-hosted через `@fontsource-variable/playfair-display`; системный sans для остального. Обоснование в `docs/design_research.md`.
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
  data/types.ts          типы Project и ProjectLink
  data/projects.ts       все проекты, тексты и внешние ссылки
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

Единственный источник контента и URL: `src/data/`. Журнал проверки ссылок и открытые вопросы: `docs/project_registry.md`.

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
- Hero: wordmark из `site.hero.logo` и одна строка `site.hero.line`. Wordmark (SVG, `fetchpriority=high`), без логотипа выводится текст. Header содержит только ссылку Portfolio, имя не дублируется.
- В названии разрешён перенос перед внутренним `@` (`workflow@arsenynn`), посреди слова названия не рвутся.
- `slug` резервирует будущий маршрут. Страниц проектов в MVP нет.
- Тексты лежат отдельно от разметки, поэтому RU/EN можно добавить позже без переписывания компонентов. Переключателя языка в MVP нет.

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
- Ссылки проектов: текст со стрелкой и тонкой линией снизу, зона нажатия 48 px (`ActionLink` variant `button`), primary красная. Ссылка в header текстовая (variant `text`). About текстовая кнопка.
- Сборка инлайнит CSS в HTML (`inlineStylesheets: always`). Внешние запросы: favicon и woff2 Playfair нужного подмножества (кириллица или латиница, около 40–50 KB каждое).

## Hosting

GitHub Pages плюс DNS only запись в Cloudflare. Прокси Cloudflare запрещён: в РФ он обрезает ответы примерно на 16 KB, это уже проверено на Portfolio. Детали и порядок запуска в `docs/deploy.md`.

## Non-goals

Полный список в `docs/brief.md` раздел 50. Главное: никаких CMS, базы, встроенного плеера, Telegram-ленты, аналитики и сторонних трекеров в MVP.
