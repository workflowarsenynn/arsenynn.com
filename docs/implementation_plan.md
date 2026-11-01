# Implementation Plan
LastUpdated: 2026-11-01 12:00 MSK

## Todoist Sync
- Sync: manual
- Project: arsenynn.com
- ProjectKey: arsenynn-com
- StatusTask: task:6hvH5GRVH9X75cCX
- Mode: router+subtasks+comments
- Language: headings=en, content=ru
- RouterSummary: @arsenynn Website: минималистичный mobile-first авторский индекс семи проектов на arsenynn.com.
- ChecklistSource: Next
- SubtaskMaterialization: explicit-boundaries
- SubtaskBoundaryMarker: TODOIST:SUBTASK
- StatusCommentSource: Status
- LastUpdated: 2026-11-01
- ProjectPath: /Users/arsey/Documents/arsenynn.com
- ObsidianProjectPath: N/A
- PathRegistry: N/A
- PlanHook:
- CanvasHook:
- WorkspaceHook:

## GitHub Recovery
- Repository: workflowarsenynn/arsenynn.com
- Remote: origin
- Mode: direct
- Visibility: private
- PushPolicy: auto-safe

## Status
- Stage: MVP (страница собрана и проверена локально, не опубликована)
- Одна страница на Astro: hero, семь проектов, About, блок Work, footer, SEO, OG image, favicon, 404.
- Публикацию ждут смена видимости репозитория, включение Pages и DNS, это действия владельца.

## Done
- [x] Собраны и проверены ссылки проектов, записаны в `docs/project_registry.md`
- [x] Сохранено ТЗ и создана документация по Project Standards
- [x] Создан приватный репозиторий `workflowarsenynn/arsenynn.com`
- [x] Получены решения владельца: публичный репозиторий, продление `arsenynn.quest`, Portfolio → `/video-production/`
- [x] Создан Astro-проект, данные в `src/data/`, токены в `src/styles/tokens.css`
- [x] Собраны секции страницы, About с клавиатурой, reduced motion и работой без JS
- [x] Добавлены SEO, Open Graph, favicon, apple-touch-icon, OG image и 404
- [x] Добавлен workflow публикации на GitHub Pages
- [x] Пройден QA в Chromium на 320–1440 px

## In Progress
<!-- Нет задач в работе. -->

## Next
<!-- Canonical planning checklist. Plain items DO NOT auto-create Todoist subtasks. Todoist child boundaries require explicit owner/canonical-plan approval under One Plan = One Subtask. -->
- [ ] Получить логотипы от владельца в `assets/logos/` и решить, где они улучшают композицию
- [ ] Получить ссылку на «Бессмысленность и скоротечность» и добавить в `src/data/projects.ts`
- [ ] Утвердить у владельца тексты hero, проектов и About
- [ ] Решить, нужен ли личный Telegram или email в блоке Work
- [ ] Смержить ветку в `main`
- [ ] Сделать репозиторий публичным и включить Pages с источником GitHub Actions (владелец)
- [ ] Подключить DNS `arsenynn.com` по `docs/deploy.md` (с подтверждения владельца)
- [ ] Проверить в Safari iOS, с телефона из РФ и превью ссылки в Telegram
- [ ] Подобрать типографику и характер после утверждения основы

## Risks
- `arsenynn.quest` истекает 2026-11-15: владелец продлевает домен, до продления кнопки Listen и Website под угрозой.
- Пока репозиторий приватный, workflow публикации не запустится из-за billing.
- Прокси Cloudflare в РФ обрезает ответы примерно на 16 KB: запись `arsenynn.com` должна оставаться DNS only.
- Safari iOS не проверялся: в cloud-контейнере его нет, нужна проверка на телефоне.
- Проверка доступности ссылок выполнялась не из РФ-сети.

## Todoist Intake
<!-- External Todoist active subtasks/descriptions that require review before becoming implementation work. -->
<!-- Empty unless Todoist intake found new unresolved inputs or intake could not be completed. -->
- Warning 2026-11-01: cloud-сессия без доступа к Todoist MCP и `td` CLI, intake не выполнен. Статус задачи `task:6hvH5GRVH9X75cCX` обновить из локальной сессии.

---

## Problem
У @arsenynn семь разных проектов и нет одной точки входа. Человек с телефона должен за несколько секунд понять, что это за индекс, и одним нажатием перейти в нужное место.

## Goals
- Одна быстрая страница, удобная на iPhone, все ссылки доступны без раскрытия About.
- Контент и ссылки редактируются отдельно от вёрстки.
- Дизайн легко менять: первая версия намеренно provisional.
- Готовность добавлять страницы проектов по одной, без строительства их заранее.

## Non-goals
- Полный список в `docs/brief.md` раздел 50: CMS, база, поиск, встроенный плеер, Telegram-лента, аналитика, PWA.

## Architecture
См. `docs/architecture.md`. Деплой: `docs/deploy.md`. Работа в cloud: `docs/cloud_workflow.md`.

## Milestones
Порядок задан ТЗ: UX → hierarchy → typography → spacing → responsive → content → visual personality.

Критерии приёмки первой версии: `docs/brief.md` раздел 49.
