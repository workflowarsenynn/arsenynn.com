# Logos
LastUpdated: 2026-11-01 12:50 MSK

Исходники логотипов и фото от владельца. Оригиналы лежат здесь, веб-версии в `public/logos/` и подключаются через `src/data/` (`site.hero.logo`, поле `logo` проекта).

Оригиналы у владельца в iCloud (`iPictures/@arsenynn/arsenynn.com`). Cloud-сессия их не видит: файлы нужно запушить сюда или приложить в чат файлом. Картинка, вставленная в сообщение как превью, до сессии файлом не доходит.

## Inventory

| Файл | Что | На сайте |
|---|---|---|
| `arsenynn-wordmark.webp` | красный wordmark `@arsenynn`, прозрачный фон, 2000×667 | `public/logos/arsenynn.svg` (векторизован), hero и OG image |
| `annflow-on-black.webp` | annFlow белым и красным на чёрном | `public/logos/annflow.webp` (фон убран), строка 05 |
| `annflow-app-icon.webp` | иконка annFlow со знаком `>_` | не используется |
| `nn.psd`, `nn.png` | знак NN красным, слои с прозрачностью | не используется |
| `../photos/annflow-sketches.jpg` | фото эскизов annFlow | не используется, референс |
| `../photos/portrait-red.webp` | портрет в красном свете | не используется: ТЗ раздел 40 просит сначала без портрета |

## Missing

Есть только превью в чате, нужны файлы: Without Streaming (`Ws` и надпись), Party Protocol (маска, надпись PARTY, постер), workflow@arsenynn (wordmark, знак WW/NN), отдельный знак NN красным, Travel Log, «Бессмысленность и скоротечность».

## How to add

1. Положить оригинал сюда. Лучше SVG, затем PNG с прозрачным фоном от 1000 px.
2. Одноцветный знак: `python3 scripts/trace-logo.py <файл> public/logos/<slug>.svg '#hex'` (нужен `pip install potracer`).
3. Многоцветный: WebP с прозрачностью шириной около 600 px в `public/logos/`.
4. Прописать `logo: { src, width, height }` проекту в `src/data/projects.ts`. Высота в строке задаётся токеном `--logo-height`.
