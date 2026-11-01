# Implementation Plan
LastUpdated: 2026-11-01 13:20 MSK

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
- Visibility: public
- PushPolicy: auto-safe

## Status
- Stage: MVP (опубликован на https://arsenynn.com)
- Журнальный индекс семи проектов: засечки в заголовках, теги через красную точку, ссылки кнопками. Ресерч в `docs/design_research.md`.
- Логотипы и знаки подключены, тексты v2. Превью: https://claude.ai/artifact/CHuWcW8SaVZWaBCBYGxmQ1. Живой сайт: https://arsenynn.com. Одна запись A пока Proxied, ждёт переключения на DNS only.

## Done
- [x] Собраны и проверены ссылки проектов, записаны в `docs/project_registry.md`
- [x] Сохранено ТЗ и создана документация по Project Standards
- [x] Создан репозиторий `workflowarsenynn/arsenynn.com`
- [x] Получены решения владельца: публичный репозиторий, продление `arsenynn.quest`, Portfolio → `/video-production/`
- [x] Создан Astro-проект, данные в `src/data/`, токены в `src/styles/tokens.css`
- [x] Собраны секции страницы, About с клавиатурой, reduced motion и работой без JS
- [x] Добавлены SEO, Open Graph, favicon, apple-touch-icon, OG image и 404
- [x] Добавлен workflow публикации на GitHub Pages
- [x] Добавлена ссылка на «Бессмысленность и скоротечность»
- [x] Проведён дизайн-ресерч, внедрено направление v2
- [x] Подключены логотипы `@arsenynn` и annFlow, OG image с wordmark
- [x] Подключены знаки NN, Ws и маска, тексты v2, опубликовано превью
- [x] MVP смержен в `main` (workflowarsenynn/arsenynn.com#1, #2) с разрешения владельца
- [x] Сайт опубликован на GitHub Pages и arsenynn.com, DNS и custom domain настроены владельцем, проверено в браузере
- [x] Пройден QA в Chromium на 320–1440 px

## In Progress
<!-- Нет задач в работе. -->

## Next
<!-- Canonical planning checklist. Plain items DO NOT auto-create Todoist subtasks. Todoist child boundaries require explicit owner/canonical-plan approval under One Plan = One Subtask. -->
- [ ] Получить чистый wordmark workflow@arsenynn
- [ ] Утвердить у владельца тексты v2 и вид по превью
- [ ] Решить, нужен ли личный Telegram или email в блоке Work
- [ ] Переключить запись `A @ 185.199.111.153` на DNS only и включить Enforce HTTPS
- [ ] Проверить в Safari iOS, с телефона из РФ и превью ссылки в Telegram

## Risks
- Запись `A @ 185.199.111.153` Proxied: Cloudflare отдаёт свои IP для всего корня, в РФ ответы могут обрезаться, GitHub не выпускает сертификат.
- `arsenynn.quest` истекает 2026-11-15: владелец продлевает домен, до продления кнопки Listen и Website под угрозой.
- Прокси Cloudflare в РФ обрезает ответы примерно на 16 KB: запись `arsenynn.com` должна оставаться DNS only.
- Safari iOS не проверялся: в cloud-контейнере его нет, нужна проверка на телефоне.
- Проверка доступности ссылок выполнялась не из РФ-сети.

## Todoist Intake
<!-- External Todoist active subtasks/descriptions that require review before becoming implementation work. -->
<!-- Empty unless Todoist intake found new unresolved inputs or intake could not be completed. -->
- Warning 2026-11-01 (повторно 13:00): cloud-сессия без доступа к Todoist MCP и `td` CLI, intake не выполнен. Статус задачи `task:6hvH5GRVH9X75cCX` обновить из локальной сессии.

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
