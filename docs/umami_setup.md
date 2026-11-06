# Umami на сервере радио
LastUpdated: 2026-11-06 22:24 MSK

Счётчик посетителей без cookie и баннера. На сайте всё готово, не хватает сервера и двух значений в `site.metrics`.

Хост `asus-debian-lab` несёт рабочий эфир, 4 GB памяти. Перед шагами прочитать `docs/asus_operations_runbook.md` в репозитории Without Streaming: снимок состояния, резервная копия, самое маленькое изменение, проверка.

## 1. Проверить запас

```bash
free -m
df -h /
docker --version
```

Нужно не меньше 1 GB свободной памяти. Если меньше, Umami на этот хост не ставить: эфир важнее.

## 2. Поднять Umami с лимитом памяти

`/opt/umami/compose.yaml`, секреты в `/opt/umami/.env` (`APP_SECRET`, `POSTGRES_PASSWORD`, значения сгенерировать на хосте):

```yaml
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    restart: unless-stopped
    ports: ['127.0.0.1:3100:3000']
    environment:
      DATABASE_URL: postgresql://umami:${POSTGRES_PASSWORD}@db:5432/umami
      APP_SECRET: ${APP_SECRET}
    depends_on: [db]
    mem_limit: 512m
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes: ['/opt/umami/db:/var/lib/postgresql/data']
    mem_limit: 256m
```

## 3. Адрес

- DNS в Cloudflare: `stats.arsenynn.com`, запись A на адрес радио, только DNS, без прокси.
- Блок в рабочем Caddyfile, не заменяя файл целиком. Сначала резервная копия и `caddy validate`, затем `reload`, а не `restart`:

```
stats.arsenynn.com {
  reverse_proxy 127.0.0.1:3100
}
```

## 4. Включить на сайте

В Umami сменить пароль администратора, добавить сайт `arsenynn.com`, взять Website ID. В `src/data/site.ts`:

```ts
metrics: { src: 'https://stats.arsenynn.com/script.js', websiteId: '...' },
```

## 5. Проверка

Открыть сайт, увидеть визит в Umami. Убедиться, что HLS эфира и `free -m` на хосте не изменились.

## События

`video_sound`, `video_fullscreen`, `video_finished` с параметрами `block` и `title`, `radio_start`, `podcast_open`, `vpn_trial_click`, `contact_click`, `contact_open`, `language_switch`, `about_open`, `outbound_click`.
