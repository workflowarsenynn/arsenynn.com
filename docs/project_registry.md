# Project Registry
LastUpdated: 2026-11-01 12:00 MSK

Журнал проверки ссылок и открытых вопросов. Источник ссылок для сайта: `src/data/projects.ts` и `src/data/site.ts`.

Проверка 2026-11-01: страницы `t.me` запрошены через curl и сверены по `og:title`, сайты проверены по HTTP-статусу. Проверка шла с Mac, не из РФ-сети.

| № | Проект | slug | Действие | URL | Проверка |
|---|---|---|---|---|---|
| 01 | @arsenynn | `arsenynn` | Telegram (primary) | https://t.me/arsenynn | канал найден |
| 02 | workflow@arsenynn | `workflow` | Portfolio (primary) | https://portfolio.arsenynn.com/video-production/ | раздел выбран владельцем 2026-11-01 |
| 02 | workflow@arsenynn | `workflow` | Telegram | https://t.me/ww_arsenynn | канал найден |
| 03 | Бессмысленность и скоротечность | `bessmyslennost` | Telegram (primary) | нет | владелец пришлёт ссылку, до этого на сайте «Ссылка скоро» |
| 04 | Without Streaming | `without-streaming` | Listen (primary) | https://radio.arsenynn.quest | 200, владелец продлевает домен |
| 04 | Without Streaming | `without-streaming` | Telegram | https://t.me/without_streaming | канал найден |
| 05 | annFlow | `annflow` | Telegram (primary) | https://t.me/annsflow | канал найден |
| 06 | Party Protocol | `party-protocol` | Website (primary) | https://partyprotocol.arsenynn.quest | 200, владелец продлевает домен |
| 06 | Party Protocol | `party-protocol` | Telegram | https://t.me/partyprotocol | канал найден |
| 07 | Travel Log | `travel-log` | Coming soon | нет | публичного канала нет, ссылку не ставить |

## Open questions

- **Бессмысленность и скоротечность.** Владелец пришлёт ссылку. Когда она будет: добавить в `links` проекта в `src/data/projects.ts`, убрать `statusLabel`, поставить `status: 'active'`.
- **Контакт в блоке Work.** Сейчас в блоке Work стоят Portfolio и Telegram-канал workflow. Личный Telegram `https://t.me/arsenynnn` (три n) и email не добавлены: ждут подтверждения владельца.

## Resolved 2026-11-01

- **Portfolio из карточки workflow.** Ведёт на `/video-production/`. Header и блок Work используют тот же адрес.
- **Домен `arsenynn.quest`.** Владелец продлевает домен до 2026-11-15, адреса Listen и Website не меняются.

## Other known surfaces

В MVP не показываются, записаны чтобы не искать заново:

- Mini App радио: https://t.me/without_streaming_bot/without_streaming
- Бот Party Protocol: `@partyproto_bot`

## Copy

Тексты первой версии находятся в `docs/brief.md` раздел 53. Они черновые. Полные тексты About ещё не написаны: их готовит агент из разделов 1–8 ТЗ, владелец утверждает.
