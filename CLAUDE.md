# CLAUDE.md
LastUpdated: 2026-11-07 00:30 MSK

## Project
Личный сайт arsenynn.com: mobile-first индекс семи проектов @arsenynn для людей, открывающих ссылку с телефона. У annFlow есть свой мир: весь канал на сайте.

## Stack
- Astro со статической сборкой, Node.js 22.23.4+ (версия CI в `.node-version`)
- TypeScript для данных, обычный CSS с токенами
- GitHub Pages, DNS в Cloudflare через `cf` CLI

MVP собран, структура в `docs/architecture.md`.

## Repository structure
- `docs/` — вся документация, начинать с `docs/implementation_plan.md`
- `assets/logos/` — исходники логотипов
- `src/content/projects.yaml` — проекты: тексты, теги, ссылки, логотипы (Content Collection, схема в `src/content.config.ts`)
- `src/data/site.ts` — hero, header, блок Work, footer, SEO
- `src/content/annflow/` — заметки канала annFlow, картинки, серии (`channel.json`)
- `src/content/stream/` — случайные посты на главной, файлы в `public/media/bis/`
- `src/components/`, `src/styles/` — разметка и design tokens

## Commands
- установка: `npm install`
- запуск: `npm run dev`
- сборка с проверкой типов: `npm run build` (результат в `dist/`)
- OG image, apple-touch-icon и favicon.ico: `NODE_PATH=$(npm root -g) node scripts/render-images.mjs`
- импорт новых постов annFlow: `node scripts/telegram/import-channel.mjs`, результат смотреть в diff, перевод новой заметки положить в `src/content/annflow/en/`
- векторизовать одноцветный логотип: `python3 scripts/trace-logo.py <in> public/logos/<slug>.svg '#hex'`
- тесты: `npm test` (Playwright + axe против `astro preview`, нужна сборка). В облачной сессии Claude: `PW_CHROMIUM=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome npm test`. В CI их запускает `.github/workflows/test.yml`. Локально: `npx playwright install chromium`; в worktree внутри `.claude/` сборка падает, см. `docs/handoff.md` раздел 7

## Code style
- Контент и URL только в `src/content/` и `src/data/site.ts`, никогда в компонентах.
- Цвета и отступы только через токены.
- Минимум JavaScript: пять маленьких скриптов, About, плеер глав, случайные посты, окно радио и метрики, без `client:*`.
- Стили сначала для телефона, расширение через `min-width`.

## Testing
- Интерфейс проверять в настоящем браузере на 320, 390 и 430 px и на desktop.
- Проверять: нет горизонтального скролла, текст не меньше 14 px, touch target не меньше 44 px, About работает с клавиатуры, reduced motion.
- Сайт должен выглядеть собранно с отключёнными изображениями.
- Критерии приёмки: `docs/brief.md` разделы 47–49.

## Agent rules
- Можно без подтверждения: правки кода и документации, сборка, проверки, local commit, Routine Safe Push при `PushPolicy: auto-safe` по `docs/ai_workflows/github-source-recovery.md` в Project Standards.
- Нужно подтверждение владельца: DNS, настройки Pages, видимость репозитория, публикация сайта. Merge в `main` публикует сайт.
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
- `docs/handoff.md` — передача проекта: состояние, рабочий цикл, открытые задачи, подводные камни
- `docs/handoff_session_2026-11-07.md` — свежий handoff: на чём остановились, метрики Umami на сервере радио
- `AGENTS.md` — provider-neutral инструкции для AI Coding Agent
- `docs/decisions_log.md` — журнал решений и исторического контекста
