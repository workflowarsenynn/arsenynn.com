# Implementation Plan
LastUpdated: 2026-11-01 11:10 MSK

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
- Stage: Inception (документация готова, код не начат)
- ТЗ владельца сохранено в `docs/brief.md`, стек и хостинг выбраны, сайт не опубликован.
- Реализацию ждут логотипы, ссылка на «Бессмысленность и скоротечность» и решение по модели публикации.

## Done
- [x] Собраны и проверены ссылки проектов, записаны в `docs/project_registry.md`
- [x] Сохранено ТЗ и создана документация по Project Standards
- [x] Создан приватный репозиторий `workflowarsenynn/arsenynn.com`

## In Progress
<!-- Нет задач в работе. -->

## Next
<!-- Canonical planning checklist. Plain items DO NOT auto-create Todoist subtasks. Todoist child boundaries require explicit owner/canonical-plan approval under One Plan = One Subtask. -->
- [ ] Получить логотипы от владельца в `assets/logos/`
- [ ] Получить решения по вопросам из `docs/project_registry.md`
- [ ] Выбрать модель публикации (см. Risks)
- [ ] Создать Astro-проект и `src/data/` по `docs/architecture.md`
- [ ] Собрать секции страницы без финального дизайна
- [ ] Реализовать About с клавиатурой и reduced motion
- [ ] Написать тексты About и утвердить у владельца
- [ ] Подобрать типографику и отступы на 390 px
- [ ] Адаптировать desktop
- [ ] Добавить SEO, favicon и OG image
- [ ] Пройти QA по `docs/brief.md` разделы 47–49
- [ ] Опубликовать на GitHub Pages и подключить DNS с подтверждения владельца
- [ ] Проверить сайт с телефона из РФ и превью в Telegram

## Risks
- `arsenynn.quest` истекает 2026-11-15 по данным Portfolio, на нём ссылки Listen и Website: без продления или переноса две главные кнопки перестанут работать.
- Модель публикации не выбрана. Actions в приватных репозиториях этого аккаунта не запускаются из-за billing: при приватном коде cloud-сессия сможет сделать PR, но публиковать придётся с Mac.
- Прокси Cloudflare в РФ обрезает ответы примерно на 16 KB: запись `arsenynn.com` должна оставаться DNS only.
- У «Бессмысленности и скоротечности» нет публичной ссылки: приватный чат по README проекта `ann_bot_2.0`.
- Проверка доступности выполнялась не из РФ-сети: статусы в реестре это не подтверждают доступ из РФ.

## Todoist Intake
<!-- External Todoist active subtasks/descriptions that require review before becoming implementation work. -->
<!-- Empty unless Todoist intake found new unresolved inputs or intake could not be completed. -->

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
