# Implementation Plan
LastUpdated: 2026-11-01 16:40 MSK

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
- Stage: Phase 4 of The Moving Index (advisory), только тёмная тема, сайт на https://arsenynn.com
- Направление задано `docs/Advisory/deep_research_and_implementation_direction.md`: оставить Astro и статику, развивать фазами, каждая фаза отдельным деплоем с точкой отката.
- Phase 1: hero в одну строку, тексты по advisory, знаки в строке номера, текстовые ссылки вместо «пилюль», трёхколоночный desktop.

## Rollback
- Точки отката: ветки `rollback/phase-N` на GitHub, каждая указывает на прод до начала фазы N+1.
- `rollback/phase-0`: прод до advisory (c67cab3).
- `rollback/phase-1`: прод после Phase 1, до Phase 1.1 (8256bd0).
- `rollback/phase-1-1`: прод после Phase 1.1, до Phase 2 (5086a8c).
- `rollback/phase-2`: прод после Phase 2, до Phase 3 (0eb5957).
- `rollback/phase-3`: прод со светлой темой (769b072), отменён владельцем.
- `rollback/phase-3r`: прод после отката к тёмной теме, до Phase 4 (7214de9).
- Откат: PR из revert-коммита фазы в `main` или `git revert <merge-commit>`; GitHub Actions пересоберёт сайт за 1–2 минуты.

## Done
- [x] MVP: Astro, данные в `src/data/`, About, SEO, OG, 404, Pages workflow, QA 320–1440 px
- [x] Дизайн v2: ресерч, засечки, логотипы и знаки проектов (NN, Ws, annFlow, маска), тексты v2
- [x] Публикация: репозиторий публичный, GitHub Pages, DNS only в Cloudflare, сертификат на arsenynn.com
- [x] Полное описание проекта для deep research, получен advisory
- [x] Phase 0: точка отката `rollback/phase-0`, advisory сохранён в `docs/Advisory/`, проверены все 10 внешних ссылок
- [x] Phase 1: hero, тексты, место знаков, стиль ссылок, desktop-сетка
- [x] Phase 1.1: ссылки строками на всю ширину 56 px по просьбе владельца (удобство на телефоне)
- [x] Phase 2: Source Serif 4 + Manrope вместо Playfair и системного шрифта, шкала advisory (body 18/19 px, 1.58), OG на шрифтах сайта
- [x] Phase 3 (светлая тема) сделана и отменена владельцем: сайт только тёмный
- [x] Phase 4: тесты Playwright + axe (16 проверок) и workflow Test в GitHub Actions

## In Progress
<!-- Нет задач в работе. -->

## Next
<!-- Canonical planning checklist. Plain items DO NOT auto-create Todoist subtasks. Todoist child boundaries require explicit owner/canonical-plan approval under One Plan = One Subtask. -->
- [ ] Включить Enforce HTTPS в настройках Pages (владелец)
- [ ] Content Collections без смены URL, затем RU/EN и первый мир `/arsenynn/` (только с реальным контентом)
- [ ] Получить чистый wordmark workflow@arsenynn
- [ ] Проверить на iPhone и из РФ-сети

## Risks
- Telegram отдаёт урезанные страницы при частых запросах: проверку ссылок повторять несколько раз.
- Ветка `docs/sync-live-status` с локального Mac не смержена: её правки документации могут конфликтовать с этой веткой.
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
