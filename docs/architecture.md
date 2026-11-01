# Architecture
LastUpdated: 2026-11-01 11:10 MSK

Статус: целевая архитектура MVP. Код ещё не написан. Требования и их причины находятся в `docs/brief.md`, здесь только технические решения.

## Stack

- Astro со статической сборкой: компоненты на сервере сборки, в браузер уходит только HTML, CSS и один маленький скрипт. Причины выбора в `docs/decisions_log.md`.
- TypeScript для данных, чтобы опечатка в проекте или ссылке ломала сборку, а не страницу.
- Обычный CSS с design tokens. Без Tailwind, без UI-библиотек, без icon packs: стрелка `↗` это текст.
- Шрифт: на первом проходе system stack. Открытый шрифт с кириллицей подключается только self-hosted, с подтверждённой лицензией и после теста типографики (`docs/brief.md` разделы 13, 28).
- Node.js 20 или новее.

## Repository structure

Каталоги кода появятся на этапе реализации. Названия можно менять, принцип разделения нет.

```text
assets/logos/            исходники логотипов от владельца
docs/                    документация проекта
public/                  favicon, OG image, CNAME
src/
  data/projects.ts       все проекты, тексты и внешние ссылки
  data/site.ts           заголовок сайта, hero, блок Work, footer, SEO
  components/            Hero, ProjectList, ProjectSection, ProjectActions,
                         ProjectDetails, Collaboration, SiteFooter
  layouts/Base.astro     head, meta, Open Graph
  pages/index.astro      единственная страница MVP
  styles/tokens.css      design tokens
  styles/global.css      база и типографика
```

## Content model

Единственный источник контента и URL: `src/data/`. До появления кода фактические значения лежат в `docs/project_registry.md`.

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
  links: ProjectLink[]
  logo?: string
  detailPageEnabled: boolean     // в MVP всегда false
}
```

Правила:

- Номер на странице выводится из `order`, а не хранится текстом.
- Проект без публичного URL не получает ссылку-заглушку: `links` пустой, показывается `Coming soon` или ничего.
- `About` не выводится, если `longDescription` пуст.
- `slug` резервирует будущий маршрут. Страниц проектов в MVP нет.
- Тексты лежат отдельно от разметки, поэтому RU/EN можно добавить позже без переписывания компонентов. Переключателя языка в MVP нет.

## About accordion

- Кнопка `About +` / `About −` с `aria-expanded` и `aria-controls`, клавиатура работает за счёт нативной кнопки.
- Анимация через `grid-template-rows` и `opacity`, 150–250 ms. При `prefers-reduced-motion` переход отключается.
- Один общий скрипт на страницу, без фреймворка, без `client:*` директив Astro.
- Без JavaScript текст About виден сразу: скрипт сам сворачивает секции при загрузке. Основные ссылки от скрипта не зависят.
- Раскрытие одной секции не закрывает другие.

## Styling

- Токены только для того, что реально будем менять: цвет фона, текста, muted, accent и line, шкала отступов, два шрифта, ширина контента. Ориентир: не больше 20 токенов.
- Сначала стили для 390 px, расширение только через `min-width`.
- Размеры текста из `docs/brief.md` раздел 13: body 17–18 px, descriptors не меньше 14 px, заголовок проекта 26–36 px.
- Touch target ссылки и кнопки не меньше 44 px, цель 48 px.
- Высота hero через `svh` с запасным значением `vh`, меньше первого экрана, чтобы был виден следующий проект. Отступы учитывают `safe-area-inset-*`.

## Hosting

GitHub Pages плюс DNS only запись в Cloudflare. Прокси Cloudflare запрещён: в РФ он обрезает ответы примерно на 16 KB, это уже проверено на Portfolio. Детали и порядок запуска в `docs/deploy.md`.

## Non-goals

Полный список в `docs/brief.md` раздел 50. Главное: никаких CMS, базы, встроенного плеера, Telegram-ленты, аналитики и сторонних трекеров в MVP.
