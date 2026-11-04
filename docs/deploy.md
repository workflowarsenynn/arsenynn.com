# Deploy Runbook
LastUpdated: 2026-11-04 22:30 MSK

Статус: сайт опубликован на https://arsenynn.com (2026-11-01). DNS и custom domain настроены. Все записи DNS only и указывают на GitHub. Сертификат `CN=arsenynn.com` выпущен, www редиректит на корень. Осталось включить Enforce HTTPS.

## Preview

До публикации на домене есть приватное превью в claude.ai: https://claude.ai/artifact/CHuWcW8SaVZWaBCBYGxmQ1 (видно только владельцу и тем, с кем он поделится через Share).

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

После DNS: дождаться сертификата Let's Encrypt от GitHub и включить Enforce HTTPS. Сделано, `http://arsenynn.com` отвечает 301 на https (проверено 2026-11-04).

## Publishing model

Решение владельца от 2026-11-01: один публичный репозиторий `workflowarsenynn/arsenynn.com`. В публичном репозитории Actions бесплатны, поэтому сборка идёт через `.github/workflows/deploy.yml` при push в `main`. Секретов в репозитории нет.

Порядок запуска, всё делает или подтверждает владелец:

1. Смержить ветку с MVP в `main`.
2. Сделать репозиторий публичным: Settings → General → Danger Zone → Change visibility.
3. Settings → Pages → Source: `GitHub Actions`.
   Workflow берёт `base_path` из `actions/configure-pages` и передаёт в сборку как `PAGES_BASE`: без своего домена сайт открывается на `https://workflowarsenynn.github.io/arsenynn.com/`, с доменом на корне.
4. Запустить workflow `Deploy to GitHub Pages` (или push в `main`) и проверить временный адрес Pages.
5. Settings → Pages → Custom domain: `arsenynn.com`. Файл `public/CNAME` уже в сборке.
6. Создать DNS-записи из таблицы выше, DNS only.
7. После выпуска сертификата включить Enforce HTTPS и пройти Acceptance.

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
