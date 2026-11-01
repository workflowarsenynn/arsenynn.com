# Project Registry
LastUpdated: 2026-11-01 11:10 MSK

Фактические ссылки и статусы семи проектов. Когда появится `src/data/projects.ts`, источником ссылок станет он, а этот файл останется журналом проверки и открытых вопросов.

Проверка 2026-11-01: страницы `t.me` запрошены через curl и сверены по `og:title`, сайты проверены по HTTP-статусу. Проверка шла с Mac, не из РФ-сети.

| № | Проект | slug | Действие | URL | Проверка |
|---|---|---|---|---|---|
| 01 | @arsenynn | `arsenynn` | Telegram (primary) | https://t.me/arsenynn | канал найден |
| 02 | workflow@arsenynn | `workflow` | Portfolio (primary) | https://portfolio.arsenynn.com | 200, раздел ждёт решения |
| 02 | workflow@arsenynn | `workflow` | Telegram | https://t.me/ww_arsenynn | канал найден |
| 03 | Бессмысленность и скоротечность | `bessmyslennost` | Telegram (primary) | нет | ждёт ссылку от владельца |
| 04 | Without Streaming | `without-streaming` | Listen (primary) | https://radio.arsenynn.quest | 200, домен под риском |
| 04 | Without Streaming | `without-streaming` | Telegram | https://t.me/without_streaming | канал найден |
| 05 | annFlow | `annflow` | Telegram (primary) | https://t.me/annsflow | канал найден |
| 06 | Party Protocol | `party-protocol` | Website (primary) | https://partyprotocol.arsenynn.quest | 200, домен под риском |
| 06 | Party Protocol | `party-protocol` | Telegram | https://t.me/partyprotocol | канал найден |
| 07 | Travel Log | `travel-log` | Coming soon | нет | публичного канала нет, ссылку не ставить |

## Open questions

- **Бессмысленность и скоротечность.** В README проекта `ann_bot_2.0` это приватный чат, публичной ссылки в проверенных файлах нет. Нужна ссылка или решение показывать проект без неё.
- **Домен `arsenynn.quest`.** По `docs/implementation_plan.md` проекта Portfolio он истекает 2026-11-15. На нём сейчас `radio` и `partyprotocol`, то есть основные действия двух проектов. Нужно продлить домен или дать новые адреса до запуска сайта.
- **Portfolio из карточки workflow.** Сейчас указан корень `portfolio.arsenynn.com`. У сайта есть разделы `/sales-events/`, `/it-ai/`, `/video-production/`, для заказчика видео может подойти более точный вход.
- **Контакт в блоке Work.** В Portfolio используется личный Telegram `https://t.me/arsenynnn` (три n в конце, это не канал). Нужно подтвердить его и решить, нужен ли email.

## Other known surfaces

В MVP не показываются, записаны чтобы не искать заново:

- Mini App радио: https://t.me/without_streaming_bot/without_streaming
- Бот Party Protocol: `@partyproto_bot`

## Copy

Тексты первой версии находятся в `docs/brief.md` раздел 53. Они черновые. Полные тексты About ещё не написаны: их готовит агент из разделов 1–8 ТЗ, владелец утверждает.
