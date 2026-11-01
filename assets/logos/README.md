# Logos
LastUpdated: 2026-11-01 13:00 MSK

Исходники логотипов и фото от владельца. Оригиналы лежат здесь, веб-версии в `public/logos/` и подключаются через `src/data/` (`site.hero.logo`, поле `logo` проекта).

Оригиналы у владельца в iCloud (`iPictures/@arsenynn/arsenynn.com`). Cloud-сессия их не видит: файлы нужно запушить сюда или приложить в чат файлом. Картинка, вставленная в сообщение как превью, до сессии файлом не доходит.

## Inventory

Источник: папка владельца на Google Drive `assest/logos.zip`, 2026-11-01.

| Файл | Что | На сайте |
|---|---|---|
| `arsenynn-wordmark.webp` | красный wordmark `@arsenynn` | `public/logos/arsenynn.svg`: hero, OG image |
| `annflow-on-black.webp`, `annflow-main.png` | annFlow белым и красным | `public/logos/annflow.webp`: логотип строки 05 |
| `annflow-app-icon.webp` | иконка annFlow со знаком `>_` | нет |
| `nn-main.png`, `nn.psd` | знак NN красным | `public/logos/nn.svg`: знак строки 03 |
| `without-streaming.png`, `without-streaming-circle.png` | монограмма Ws | `public/logos/without-streaming.svg`: знак строки 04 |
| `party-protocol-mask.png` | маска | `public/logos/party-protocol.svg`: знак строки 06, белым |
| `party-protocol-party.png`, `party-protocol-poster.png` | надпись PARTY, постер на жёлтом | нет |
| `bessmyslennost-ann.png` | портрет ann в кепке | нет |
| `wwnn-pattern.jpg` | паттерн workflow со знаками WW/NN | нет |
| `../photos/*` | портрет, эскизы annFlow | нет |

Не взяты в репозиторий из-за размера: апскейл портрета ann (35 MB), портрет `Main logo arsenynn.png` 7680 px (есть уменьшенная копия `../photos/portrait-red.webp`), фото эскизов (есть копия), скриншот паттерна workflow.

## Missing

Чистого wordmark `workflow@arsenynn` нет: в паттерне он с глитчем. Travel Log без логотипа.

## How to add

1. Положить оригинал сюда. Лучше SVG, затем PNG с прозрачным фоном от 1000 px.
2. Одноцветный знак: `python3 scripts/trace-logo.py <файл> public/logos/<slug>.svg '#hex'` (нужен `pip install potracer`).
3. Многоцветный: WebP с прозрачностью шириной около 600 px в `public/logos/`.
4. Прописать `logo: { src, width, height }` проекту в `src/data/projects.ts`. Высота в строке задаётся токеном `--logo-height`.
