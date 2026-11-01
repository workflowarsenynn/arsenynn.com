# CLAUDE.md
LastUpdated: 2026-11-01 11:10 MSK

## Project
Личный сайт arsenynn.com: mobile-first индекс семи проектов @arsenynn на одной странице, для людей, открывающих ссылку с телефона.

## Stack
- Astro со статической сборкой, Node.js 20+
- TypeScript для данных, обычный CSS с токенами
- GitHub Pages, DNS в Cloudflare через `cf` CLI

Код ещё не создан, целевая структура в `docs/architecture.md`.

## Repository structure
- `docs/` — вся документация, начинать с `docs/implementation_plan.md`
- `assets/logos/` — исходники логотипов
- `src/data/` — будущий единственный источник контента и ссылок

## Commands
Появятся вместе с Astro-проектом:
- запуск: `npm run dev`
- сборка: `npm run build`
- тесты: пока нет, проверка идёт через сборку и браузер

## Code style
- Контент и URL только в `src/data/`.
- Цвета и отступы только через токены.
- Минимум JavaScript: один маленький скрипт для About, без `client:*`.
- Стили сначала для телефона, расширение через `min-width`.

## Testing
- Интерфейс проверять в настоящем браузере на 320, 390 и 430 px и на desktop.
- Проверять: нет горизонтального скролла, текст не меньше 14 px, touch target не меньше 44 px, About работает с клавиатуры, reduced motion.
- Сайт должен выглядеть собранно с отключёнными изображениями.
- Критерии приёмки: `docs/brief.md` разделы 47–49.

## Agent rules
- Можно без подтверждения: правки кода и документации, сборка, проверки, local commit, Routine Safe Push при `PushPolicy: auto-safe` по `docs/ai_workflows/github-source-recovery.md` в Project Standards.
- Нужно подтверждение владельца: DNS, настройки Pages, видимость репозитория, публикация сайта.
- Запрещено автоматически: force push, разрешение divergence, переписывание опубликованной истории, замена remote, `reset --hard`, `git clean`, удаление веток и репозитория.
- После любой правки `docs/implementation_plan.md` обновлять `LastUpdated` и Machine Layer, сохранять `## Next` checklist-only. Отдельные Todoist subtasks только для явно одобренных границ по One Plan = One Subtask.
- При каждой правке плана проверять, нужна ли запись в `docs/decisions_log.md`. Журнал хранит решения, смену подхода, rejected options, runtime findings и lessons; мелкие технические правки в него не пишутся.
- `## Done` держать не длиннее 15 пунктов. При сжатии подробная история переносится в `docs/decisions_log.md`, терять её нельзя.
- Смысл полей и безопасность записи в Todoist: `Todoist Standards/README.md`. Sync и intake: `PROJECT_STANDARDS.md` и docs-sync workflow. Todoist Intake: local Change Gate, затем read-only MCP fallback (`mcp_connector_fallback`) или `td` CLI. Если Todoist MCP/API недоступен или intake неполный, добавить warning в `## Todoist Intake` и сообщить пользователю.
- После каждого завершённого логического изменения создавать local commit.
- Остальные правила и запреты в `AGENTS.md`.

## Key files
- `docs/implementation_plan.md` — план реализации
- `docs/brief.md` — ТЗ владельца
- `PROJECT_STANDARDS.md` — стандарт оформления, лежит в репозитории `workflowarsenynn/Projects-Standarts`
- `AGENTS.md` — provider-neutral инструкции для AI Coding Agent
- `docs/decisions_log.md` — журнал решений и исторического контекста
