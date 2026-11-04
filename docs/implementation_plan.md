# Implementation Plan
LastUpdated: 2026-11-04 22:30 MSK

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
- LastUpdated: 2026-11-04
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
- Stage: Polish (сайт в проде на https://arsenynn.com, The Moving Index по advisory, последняя фаза 24)
- Направление задано `docs/Advisory/deep_research_and_implementation_direction.md`: оставить Astro и статику, развивать фазами, каждая фаза отдельным деплоем с точкой отката.
- Сейчас на проде: hero с портретом, индекс из семи проектов по центру, части и главы @arsenynn, оглавления annFlow и workflow, RU и /en/, только тёмная тема.
- Передача проекта и рабочий цикл: `docs/handoff.md`.

## Rollback
- Точки отката: ветки `rollback/phase-N` на GitHub, каждая указывает на прод до начала фазы N+1.
- `rollback/phase-0`: прод до advisory (c67cab3).
- `rollback/phase-1`: прод после Phase 1, до Phase 1.1 (8256bd0).
- `rollback/phase-1-1`: прод после Phase 1.1, до Phase 2 (5086a8c).
- `rollback/phase-2`: прод после Phase 2, до Phase 3 (0eb5957).
- `rollback/phase-3`: прод со светлой темой (769b072), отменён владельцем.
- `rollback/phase-3r`: прод после отката к тёмной теме, до Phase 4 (7214de9).
- `rollback/phase-4`: прод после Phase 4, до Phase 5 (7919e86).
- `rollback/phase-5`: прод после Phase 5, до Phase 6 (c2f8ba2).
- `rollback/phase-6`: прод после Phase 6, до Phase 7 (24a7b08).
- `rollback/phase-7`: прод после Phase 7, до Phase 8 (9363dd8).
- `rollback/phase-8`: прод после Phase 8, до Phase 9 (46887f4).
- `rollback/phase-9`: прод после Phase 9, до Phase 10 (839ae2b), автосортировка по свежести.
- `rollback/phase-10`: порядок владельца, NN ещё у «Бессмысленности» (715dac1).
- `rollback/phase-11`: NN у @arsenynn, до портрета в hero (651388f).
- `rollback/phase-12`: портрет-логотип в hero и превью (5f8dfcc).
- `rollback/phase-13`, `-14`, `-15`: hero как титульный кадр, меньше портрет, новая строка (18385a3, 885ab43, 5a08c16).
- `rollback/phase-16`, `-17`: оглавление annFlow, главы частей @arsenynn (39f7e4a, 923f146).
- `rollback/phase-18`, `-19`: слоган и равные по весу знаки, превью ссылки (e76b100, 9ebd78e).
- `rollback/phase-20`, `-21`: кадры глав, логотип «Бессмысленности» (0149597, b550e15).
- `rollback/phase-22`: проекты workflow и обложки annFlow, включая PR 27 и 28 (1106327).
- `rollback/phase-23`: индекс по центру на desktop (b30c701).
- `rollback/phase-24`: вступления, favicon NN, знак ann, новые тексты (194becf).
- Откат: PR из revert-коммита фазы в `main` или `git revert <merge-commit>`; GitHub Actions пересоберёт сайт за 1–2 минуты.

## Done
- [x] MVP: Astro, About, SEO, OG, 404, Pages workflow, QA 320–1440 px
- [x] Дизайн v2: ресерч, логотипы и знаки проектов, тексты v2
- [x] Публикация: репозиторий публичный, Pages, DNS only в Cloudflare, сертификат, Enforce HTTPS (301 проверен 2026-11-04)
- [x] Advisory получен, Phase 0: точка отката, проверка внешних ссылок
- [x] Phase 1–1.1: hero, тексты, ссылки строками 56 px на всю ширину
- [x] Phase 2: Source Serif 4 + Manrope, шкала advisory; Phase 3 (светлая тема) сделана и отменена владельцем
- [x] Phase 4–5: тесты Playwright + axe, workflow Test, проекты в Content Collection со схемой
- [x] Phase 6 + 10: сигнальный огонёк, пересборка каждые 6 часов, порядок проектов задан владельцем
- [x] Phase 7–8: части @arsenynn, портфолио-хаб, английская версия /en/ с hreflang
- [x] Phase 9: workflow Telegram activity, ждёт токен
- [x] Phase 12–15: портрет-логотип хаба, hero как титульный кадр, OG
- [x] Phase 16–17: оглавление annFlow, части @arsenynn с главами и кадрами
- [x] Phase 18–22: знаки по площади, превью ссылки, кадры глав, логотип ann, 11 работ workflow, обложки annFlow
- [x] Phase 23–24: индекс по центру на desktop, вступления, favicon NN, новые тексты, NFC
- [x] Базовые метрики прода, кадры закрытых панелей больше не грузятся на старте (476 → 230 KB), `titleEn` в оглавлении

## In Progress
<!-- Нет задач в работе. -->

## Next
<!-- Canonical planning checklist. Plain items DO NOT auto-create Todoist subtasks. Todoist child boundaries require explicit owner/canonical-plan approval under One Plan = One Subtask. -->
- [ ] Владелец: продлить домен `arsenynn.quest` до 2026-11-15 (Porkbun), на нём Listen и Website Party Protocol
- [ ] Владелец: прислать видео или анимацию радио для Without Streaming, блок не увеличивать
- [ ] Владелец: создать бота в @BotFather, добавить админом в @without_streaming и @bessmislennost, сохранить токен в секрет `TELEGRAM_BOT_TOKEN`
- [ ] Владелец: прислать кадры для глав 0.2 и 1.0 @arsenynn
- [ ] Владелец: проверить переводы EN, сделанные агентом
- [ ] Владелец: решить судьбу ветки `docs/sync-live-status`
- [ ] Проверить на iPhone и из РФ-сети
- [ ] Шрифты первого экрана: 125 KB при бюджете advisory 120 KB
- [ ] Advisory step 6: первый мир `/arsenynn/`, отложен владельцем: первая версия только со ссылками

## Risks
- Домен `arsenynn.quest` истекает 2026-11-15 (whois 2026-11-04, продления ещё нет): без него перестанут работать Listen и Website Party Protocol.
- Огоньки зависят от публичной ленты t.me/s/: если Telegram не ответит при сборке, проект временно опустится в «тишину» до следующей пересборки.
- Telegram отдаёт урезанные страницы при частых запросах: проверку ссылок повторять несколько раз. Код 200 от t.me не доказывает, что пост существует.
- Ветка `docs/sync-live-status` с локального Mac не смержена и отстаёт от `main` на 66 коммитов: её правки документации конфликтуют с текущими.
- Проверка доступности ссылок выполнялась не из РФ-сети.

## Todoist Intake
<!-- External Todoist active subtasks/descriptions that require review before becoming implementation work. -->
<!-- Empty unless Todoist intake found new unresolved inputs or intake could not be completed. -->
- 2026-11-04: intake через `td` CLI (путь `mcp_connector_fallback` не понадобился, local gate без токена). Подзадач у `task:6hvH5GRVH9X75cCX` нет, новых вводных нет. Статус в Todoist не менялся: запись только по запросу владельца.

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
