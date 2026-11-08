# Umami на сервере радио
LastUpdated: 2026-11-07 17:30 MSK

Счётчик посетителей без cookie и баннера. Хост `asus-debian-lab` (ssh-алиас), тот же, что у радио.

## Состояние

| Шаг | Статус |
|---|---|
| Umami и Postgres в Docker, `~/umami/compose.yaml`, порт только `127.0.0.1:3100` | сделано 2026-11-06 |
| Лимиты: Umami 512 MB и 1 CPU, база 256 MB и 0.5 CPU | сделано |
| Стандартный пароль `admin` заменён случайным, лежит в `~/umami/admin-password` (права 600) | сделано, вход проверен |
| Сайт `arsenynn.com` в Umami, Website ID `34e4f895-c331-409d-96e9-0ffb001fa009` | сделано |
| DNS `stats.arsenynn.com` → `94.19.110.215`, только DNS | сделано владельцем 2026-11-07 |
| Блок в Caddy, копия `Caddyfile.before-umami-*` | сделано владельцем 2026-11-07, `script.js` и радио отвечают 200 |
| Счётчик на сайте (`site.metrics`) | на проде с 2026-11-07 (PR 54, фаза 47), визит с arsenynn.com принят: `/api/send` 200 |

На момент установки: Umami около 180 MB, база около 37 MB, свободно около 2,5 GB памяти, все службы радио `active`.

## 1. DNS

В Cloudflare: запись A `stats` → `94.19.110.215`, только DNS, без прокси. Или командой:

```bash
cf dns records create -z arsenynn.com --body '{"type":"A","name":"stats.arsenynn.com","content":"94.19.110.215","proxied":false,"ttl":1,"comment":"Umami on the radio host"}'
```

## 2. Caddy

Не заменять рабочий Caddyfile, только дописать блок. Резервная копия, проверка, `reload` без перезапуска эфира:

```bash
ssh -t asus-debian-lab
sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.before-umami-$(date +%Y%m%dT%H%M%S)
printf '\nstats.arsenynn.com {\n\treverse_proxy 127.0.0.1:3100\n}\n' | sudo tee -a /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile && sudo systemctl reload caddy
```

Проверка: `https://stats.arsenynn.com/script.js` отвечает 200, `https://radio.arsenynn.quest/` по-прежнему работает.

## 3. Включить на сайте

В `src/data/site.ts`:

```ts
metrics: { src: 'https://stats.arsenynn.com/script.js', websiteId: '34e4f895-c331-409d-96e9-0ffb001fa009' },
```

## Вход

`https://stats.arsenynn.com`, пользователь `admin`, пароль на хосте: `cat ~/umami/admin-password`. После первого входа можно сменить пароль в настройках Umami.

## Обслуживание

- Перезапуск: `cd ~/umami && docker compose restart`.
- Обновление: `docker compose pull && docker compose up -d`.
- Остановить, если мешает эфиру: `docker compose stop`. Сайт продолжит работать, просто перестанет считать.

## События

`video_sound`, `video_fullscreen`, `video_finished` с параметрами `block` и `title`, `radio_start`, `podcast_open`, `vpn_trial_click`, `contact_click` (у почты в About ещё `project`), `contact_open`, `language_switch`, `about_open`, `outbound_click`.
