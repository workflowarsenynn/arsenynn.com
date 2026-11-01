# Decisions Log
LastUpdated: 2026-11-01 11:10 MSK

Этот файл хранит историю проекта: важные решения, изменения подхода, причины архитектурных поворотов, rejected options, runtime findings и выводы, которые помогают понять, как проект развивался.

Записи идут в обратном хронологическом порядке: новые сверху.

---

## 2026-11-01 — Старт: статичный индекс на Astro и GitHub Pages

**Type:** decision
**Project:** arsenynn.com
**Phase:** Inception
**Status:** accepted
**Related plan:** `docs/implementation_plan.md`
**Related files:** `docs/brief.md`, `docs/architecture.md`, `docs/deploy.md`

### Context
Владелец передал подробное ТЗ на личный сайт и попросил сразу вести проект на GitHub, потому что дальше над ним будет работать cloud-сессия. Папка была пустой, GitHub-репозитория не было.

### Previous assumption
В начале обсуждения агент предложил один HTML-файл на Cloudflare Pages, тогда ещё без ТЗ и без чтения документации Portfolio. Оба предложения оказались неверными для этого проекта.

### Trigger
ТЗ требует отделить контент от разметки и подготовить будущие страницы проектов. В `docs/implementation_plan.md` проекта Portfolio уже записано решение владельца от 2026-10-21: `arsenynn.com` это будущая главная, `portfolio.arsenynn.com` это Portfolio, а прокси Cloudflare в РФ режет ответы примерно на 16 KB.

### Decision
Astro со статической сборкой, данные в `src/data/`, обычный CSS с токенами, один маленький скрипт для About. Хостинг GitHub Pages, DNS в Cloudflare только в режиме DNS only.

### Why
Astro не отправляет в браузер фреймворк, а компоненты и данные разделены с первого дня. Новая страница проекта это новый файл, а не переделка сайта. GitHub Pages уже проверен владельцем из РФ на Portfolio.

### Alternatives / rejected options
- Один HTML-файл: проще всего, но контент смешан с разметкой, а будущие страницы потребуют переезда.
- Next.js: тяжёлый application framework ради одной статичной страницы, ТЗ раздел 26 этого не хочет.
- Cloudflare Pages: прокси режет ответы в РФ, а основная аудитория там.

### Consequences
Нужен шаг сборки и Node.js. Публикация зависит от выбранной модели репозитория: Actions в приватных репозиториях аккаунта не запускаются из-за billing.

### Implementation notes
Создан приватный репозиторий `workflowarsenynn/arsenynn.com`, документация по Project Standards, реестр ссылок, Todoist root task. Кода сайта пока нет.

### Lesson
Перед советом по хостингу надо читать соседние проекты: нужное решение и его причина уже были записаны в Portfolio.

### Source
ТЗ владельца от 2026-11-01, `docs/implementation_plan.md` и `docs/deploy_portfolio.md` проекта Portfolio.
