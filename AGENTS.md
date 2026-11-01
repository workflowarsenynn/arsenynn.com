# AGENTS.md
LastUpdated: 2026-11-01 12:50 MSK
> Этот файл читается AI Coding Agent перед началом работы.

## Project
Личный сайт arsenynn.com: минималистичный mobile-first индекс семи проектов @arsenynn на одной странице.

## Stack
- Astro со статической сборкой, TypeScript для данных, обычный CSS с токенами
- Без UI-фреймворка в браузере, без сторонних скриптов и трекеров
- GitHub Pages, DNS в Cloudflare

Структура кода описана в `docs/architecture.md`.

## Repository structure
- `docs/brief.md` — ТЗ владельца, главный источник требований
- `docs/implementation_plan.md` — текущий статус и следующие шаги
- `docs/architecture.md` — технические решения
- `docs/design_research.md` — ресерч и визуальное направление v2
- `docs/project_overview_for_research.md` — полное описание проекта и промт для deep research
- `docs/references/` — макеты владельца: брать структуру, не внешний вид
- `docs/project_registry.md` — ссылки проектов и открытые вопросы
- `docs/deploy.md` — публикация и DNS
- `docs/cloud_workflow.md` — работа в cloud-сессиях
- `docs/decisions_log.md` — решения и их причины
- `assets/logos/` — исходники логотипов

## Commands
- `npm install` — установить зависимости
- `npm run dev` — локальный сервер
- `npm run build` — `astro check` и статическая сборка в `dist/`
- `NODE_PATH=$(npm root -g) node scripts/render-images.mjs` — перегенерировать `public/og.png` и `public/apple-touch-icon.png` (нужен Playwright в окружении)
- `python3 scripts/trace-logo.py <in> public/logos/<slug>.svg '#hex'` — векторизовать одноцветный логотип (нужен `pip install potracer`)

Проверка документации:
- `python3 "$HOME/Documents/Projects Standarts/scripts/check_docs_drift.py" .` — только на Mac владельца

## Rules
- Перед любыми правками UI прочитать нужные разделы `docs/brief.md`. При конфликте действуют приоритеты из раздела 52: читаемое важнее красивого, mobile важнее desktop.
- Порядок работы: UX → hierarchy → typography → spacing → responsive → content → visual personality.
- Контент и URL только в `src/data/`, никогда в компонентах.
- Основные ссылки проекта всегда доступны без раскрытия About.
- Любой изменённый интерфейс проверять в браузере на 320, 390 и 430 px и на desktop: нет горизонтального скролла, текст не меньше 14 px, touch target не меньше 44 px.
- Цвета и отступы брать из design tokens, не вводить новые токены без необходимости.
- После любой правки `docs/implementation_plan.md` MUST обновить `LastUpdated` и Machine Layer (`Status/Done/In Progress/Next/Risks`) и сохранить `## Next` как checklist-only. Todoist subtasks создаются только из явно одобренных границ по `SubtaskBoundaryMarker` и One Plan = One Subtask.
- При каждой правке плана MUST проверить, нужна ли запись в `docs/decisions_log.md`, и добавить её при значимом изменении. Журнал хранит решения, смену подхода, rejected options, runtime findings и lessons; мелкие технические правки в него не пишутся.
- `## Done` MUST быть не длиннее 15 пунктов. При превышении сжать старые пункты в semantic summary, а подробную историю перенести в `docs/decisions_log.md`, терять её нельзя.
- Смысл полей и безопасность записи в Todoist: `Todoist Standards/README.md` и `Todoist Standards/AGENTS.md`. Sync и intake: `PROJECT_STANDARDS.md` и `docs/ai_workflows/docs-sync-from-standards.md` в репозитории Project Standards. Проект работает в `Sync: manual`.
- Todoist Intake: сначала local Change Gate, затем read-only MCP fallback (`mcp_connector_fallback`) или `td` CLI. Если Todoist MCP/API недоступен или intake неполный, MUST добавить warning в `## Todoist Intake` и сообщить об этом пользователю.
- После каждого завершённого логического изменения MUST создать local commit, затем для `PushPolicy: auto-safe` выполнить Routine Safe Push по `docs/ai_workflows/github-source-recovery.md`.
- Cloud-сессии работают в своей ветке и открывают PR по `docs/cloud_workflow.md`.

## What NOT to do
- Не копировать предыдущие визуальные концепты и анти-паттерны из `docs/brief.md` раздел 37.
- Не добавлять то, что перечислено в `docs/brief.md` раздел 50, без решения владельца.
- Не ставить ссылку-заглушку: нет публичного URL, значит `Coming soon` или ничего.
- Не включать прокси Cloudflare для `arsenynn.com`: в РФ он обрезает ответы.
- Не менять DNS, настройки Pages и видимость репозитория без подтверждения владельца. Другие записи зоны не трогать.
- Не подключать шрифт без подтверждённой лицензии.
- Не коммитить секреты и `.env`.
- Force push, разрешение divergence, переписывание опубликованной истории, замена remote, `reset --hard`, `git clean`, удаление веток и репозитория автоматически запрещены.
