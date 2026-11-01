# Deploy Runbook
LastUpdated: 2026-11-01 11:10 MSK

Статус: сайт не опубликован, в зоне `arsenynn.com` нет записей для корня домена. Все команды ниже это план, они ещё не выполнялись.

## Target

| Что | Значение |
|---|---|
| Адрес | `https://arsenynn.com` |
| Хостинг | GitHub Pages |
| DNS | Cloudflare, зона `arsenynn.com`, только DNS only |
| Сборка | `npm run build`, результат в `dist/` |

## Why not Cloudflare Pages

Прокси Cloudflare в РФ обрезает ответы примерно на 16 KB, поэтому Portfolio уже переехал на GitHub Pages и работает из РФ. Этот сайт идёт тем же путём. Подробнее в `docs/decisions_log.md`.

## DNS plan

Менять DNS можно только после отдельного подтверждения владельца. В зоне уже есть `portfolio`, `mail-mcp` и `mail-platform`, их не трогать.

| Тип | Имя | Значение | Proxy |
|---|---|---|---|
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `workflowarsenynn.github.io` | DNS only |

Проект использует `cf` CLI: `cf dns records list -z arsenynn.com`.

После DNS: дождаться сертификата Let's Encrypt от GitHub и включить Enforce HTTPS.

## Publishing model

Ждёт решения владельца, варианты записаны в `docs/implementation_plan.md` раздел `## Risks`. GitHub Actions в приватных репозиториях этого аккаунта сейчас не запускаются из-за billing, а Pages нужен публичный репозиторий.

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
