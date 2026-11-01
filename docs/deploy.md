# Deploy Runbook
LastUpdated: 2026-11-01 14:15 MSK

Статус: сайт опубликован на `https://arsenynn.com`. Merge в `main` запускает `.github/workflows/deploy.yml` и обновляет сайт. Остался один шаг запуска: Enforce HTTPS.

## Preview

Приватное превью в claude.ai: https://claude.ai/artifact/CHuWcW8SaVZWaBCBYGxmQ1 (видно только владельцу и тем, с кем он поделится через Share). Сейчас оно нужно только для просмотра правок до merge.

Обновить: `npm run build`, затем `scripts/build-preview.sh <папка>` и опубликовать `<папка>/index.html` с файлами `logos/`, `fonts/`, `favicon.svg`, `apple-touch-icon.png` в тот же артефакт.

## Target

| Что | Значение |
|---|---|
| Адрес | `https://arsenynn.com` |
| Хостинг | GitHub Pages |
| DNS | Cloudflare, зона `arsenynn.com`, только DNS only |
| Сборка | `npm run build`, результат в `dist/` |

## Why not Cloudflare Pages

Прокси Cloudflare в РФ обрезает ответы примерно на 16 KB, поэтому Portfolio уже переехал на GitHub Pages и работает из РФ. Этот сайт идёт тем же путём. Подробнее в `docs/decisions_log.md`.

## DNS

Записи созданы и проверены 2026-11-01. Менять DNS можно только после отдельного подтверждения владельца, другие записи зоны не трогать.

| Тип | Имя | Значение | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `workflowarsenynn.github.io` | DNS only |

Проект использует `cf` CLI: `cf dns records list -z arsenynn.com`.

## Publishing model

Решение владельца от 2026-11-01: один публичный репозиторий `workflowarsenynn/arsenynn.com`. В публичном репозитории Actions бесплатны, поэтому сборка идёт через `.github/workflows/deploy.yml` при push в `main`. Секретов в репозитории нет. Все файлы репозитория, включая `assets/` и `docs/`, видны всем.

Запуск:

- [x] MVP смержен в `main`.
- [x] Репозиторий публичный.
- [x] Pages с источником `GitHub Actions`, деплой проходит.
- [x] Custom domain `arsenynn.com`, сертификат выдан.
- [x] DNS-записи созданы, DNS only.
- [ ] Включить Enforce HTTPS: сейчас `http://arsenynn.com` отвечает 200 без редиректа.

## Acceptance

```bash
curl -sI https://arsenynn.com/ | head -1
curl -sI https://www.arsenynn.com/ | grep -iE '^(HTTP|location)'
curl -sI http://arsenynn.com/ | grep -iE '^(HTTP|location)'
curl -sI https://arsenynn.com/nope | head -1
dig +short A arsenynn.com
```

Ожидается: 200 на корне, редиректы на `https://arsenynn.com`, 404 на неизвестном URL, в DNS адреса GitHub, а не Cloudflare.

Ручные проверки владельца: открыть с телефона из РФ-сети и отправить ссылку в Telegram, чтобы увидеть превью.

## Rollback

Вернуть предыдущий коммит опубликованных файлов через `git revert` и дождаться пересборки Pages. Удалять DNS-записи для отката не нужно.
