# Cloud Workflow
LastUpdated: 2026-11-01 11:10 MSK

Как вести проект в cloud-сессиях Claude Code. Cloud-сессия клонирует GitHub-репозиторий и видит только запушенное, поэтому всё нужное для работы должно лежать в `workflowarsenynn/arsenynn.com`.

## One-time setup

Делает владелец, нужен его логин:

1. Открыть claude.ai/code и установить Claude GitHub App на репозиторий `workflowarsenynn/arsenynn.com`. Репозиторий приватный, без этого он не будет виден.
2. Environment: `Default`, network access `Trusted`. Секреты не добавлять, сайту они не нужны.

## Starting prompt

```text
Репозиторий workflowarsenynn/arsenynn.com: сайт-индекс @arsenynn.
Прочитай CLAUDE.md, docs/implementation_plan.md и docs/architecture.md,
требования смотри в docs/brief.md.
Работай в своей ветке. После правок: сборка и проверки из AGENTS.md,
обнови Machine Layer в docs/implementation_plan.md, commit, push, PR в main.
DNS и публикацию не трогай.

Задача: <что нужно сделать>
```

## Cycle

1. Своя ветка на задачу, `main` напрямую не менять.
2. Правки кода и документации, проверки из `AGENTS.md`.
3. Обновить `docs/implementation_plan.md`.
4. Commit, push ветки, PR в `main`.
5. Владелец смотрит diff и превью, затем мержит.

Несколько задач можно вести параллельно, если они не трогают одни и те же файлы.

## Limits

Cloud-сессии нельзя: менять Cloudflare DNS, настройки Pages и видимость репозитория, читать секреты. Файлы вне репозитория ей недоступны, включая Todoist CLI: статус в Todoist обновляет локальная сессия.
