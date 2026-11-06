# Project Registry
LastUpdated: 2026-11-04 23:15 MSK

Журнал проверки ссылок и открытых вопросов. Источник ссылок для сайта: `src/data/projects.ts` и `src/data/site.ts`.

Проверка 2026-11-01: страницы `t.me` запрошены через curl и сверены по `og:title`, сайты проверены по HTTP-статусу. Проверка шла с Mac, не из РФ-сети.

| № | Проект | slug | Действие | URL | Проверка |
|---|---|---|---|---|---|
| 01 | @arsenynn | `arsenynn` | Telegram (primary) | https://t.me/arsenynn | канал найден |
| 01 | @arsenynn | `arsenynn` | Часть I (вступление + главы 0.1–1.11.3, посты 6–24) | https://t.me/arsenynn/5 | ссылка от владельца, главы из канала 2026-11-01 |
| 01 | @arsenynn | `arsenynn` | Часть II (вступление + главы 2.0–2.5, посты 29–54) | https://t.me/arsenynn/28 | ссылка от владельца, главы из канала 2026-11-01 |
| — | Work / Collaboration | — | Portfolio (hub) | https://portfolio.arsenynn.com/ | 200, хаб для сотрудничества и HR |
| — | Work / Collaboration | — | IT / AI, Sales / Events, Video production | https://portfolio.arsenynn.com/it-ai/, /sales-events/; Video production показан как «скоро», без ссылки | 200 |
| 02 | workflow@arsenynn | `workflow` | Portfolio | — | убрана владельцем 2026-11-01; портфолио доступно в header и блоке Work |
| 02 | workflow@arsenynn | `workflow` | Проекты: 11 работ (посты 119–194) | https://t.me/ww_arsenynn | обложки из альбомов стоп-кадров канала |
| 02 | workflow@arsenynn | `workflow` | Telegram | https://t.me/ww_arsenynn | канал найден |
| 03 | Бессмысленность и скоротечность | `bessmyslennost` | Telegram (primary) | https://t.me/bessmislennost | канал найден, ссылка от владельца 2026-11-01 |
| 04 | Without Streaming | `without-streaming` | Listen (primary) | https://radio.arsenynn.quest | 200, владелец продлевает домен |
| 04 | Without Streaming | `without-streaming` | Telegram | https://t.me/without_streaming | канал найден |
| 05 | annFlow | `annflow` | Telegram (primary) | https://t.me/annsflow | канал найден |
| 06 | Party Protocol | `party-protocol` | Website (primary) | https://partyprotocol.arsenynn.quest | 200, владелец продлевает домен |
| 06 | Party Protocol | `party-protocol` | Telegram | https://t.me/partyprotocol | канал найден |
| 07 | Travel Log | `travel-log` | Coming soon | нет | публичного канала нет, ссылку не ставить |

## Open questions

- **Переводы EN.** Сделаны агентом, ждут проверки владельца. Тексты живут в `src/content/projects.yaml`.
- **Домен `arsenynn.quest`.** Истекает 2026-11-15, по whois на 2026-11-04 не продлён. Адреса Listen и Website не меняются.
- **Почта.** Личный Telegram `https://t.me/arsenynnn` стоит в блоке контакта. Почта `arsenynn@arsenynn.com` показана на сайте, сам адрес ещё не создан.

- **YouTube 0.2 и 1.0.** Главы 0.2 «I can talk to you about the atmosphere» и 1.0 «When will you finally grow up?» не найдены на youtube.com/@arsenynn: без кадра и без плеера, ведут на Telegram.

## Resolved 2026-11-01

- **Бессмысленность и скоротечность.** Ссылка `https://t.me/bessmislennost`, проверена по `og:title`.
- **Portfolio из карточки workflow.** Ссылка убрана владельцем, Portfolio остался в header и блоке Work.

## Other known surfaces

- YouTube workflow@arsenynn: https://www.youtube.com/@workflow.arsenynn

В MVP не показываются, записаны чтобы не искать заново:

- Mini App радио: https://t.me/without_streaming_bot/without_streaming
- Бот Party Protocol: `@partyproto_bot`

## Copy

Текущие тексты в `src/data/projects.ts` и `src/data/site.ts` (v2). Скелет из `docs/brief.md` раздел 53 владелец назвал банальным: v2 короче и конкретнее, одна фраза на проект.
