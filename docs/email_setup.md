# Почта проектов
LastUpdated: 2026-11-08 13:10 MSK

Адреса показаны внизу About своего проекта (поле `email` в `src/content/projects.yaml`). Общий личный адрес `arsenynn@arsenynn.com` стоит в блоке «Контакты».

| Адрес | Где на сайте | Где живёт почта | Статус |
|---|---|---|---|
| `arsenynn@arsenynn.com` | Контакты | iCloud+, домен arsenynn.com | проверить, создан ли |
| `workflow@arsenynn.com` | About у workflow@arsenynn | iCloud+, домен arsenynn.com | создать |
| `annflow@arsenynn.com` | About у annFlow | iCloud+, домен arsenynn.com | создать |
| `support@partyproto.com` | About у Party Protocol | iCloud+, домен partyproto.com | подключить домен, создать |

Состояние DNS на 2026-11-08 (`dig`):

- `arsenynn.com`: MX `mx01/mx02.mail.icloud.com`, TXT `apple-domain=…` и `v=spf1 include:icloud.com ~all`. Домен уже подключён к iCloud+ Custom Email Domain.
- `partyproto.com`: MX `fwd1/fwd2.porkbun.com`, SPF `include:_spf.porkbun.com`. Включена бесплатная пересылка Porkbun, ящиков нет.

Решение: оба домена в iCloud+. Так письма приходят и отправляются прямо из Почты на iPhone и Mac, без SMTP-паролей и пересылок. С октября 2026 iCloud+ даёт до 10 адресов на домен и до 5 доменов.

## 1. Адреса на arsenynn.com (DNS трогать не нужно)

На iPhone: Настройки → [имя] → iCloud → Почта iCloud → Свой домен почты → `arsenynn.com`. Или на icloud.com/icloudplus → Custom Email Domain → `arsenynn.com`.

1. Посмотреть, есть ли уже `arsenynn@arsenynn.com`. Если нет: «Добавить адрес» → `arsenynn`.
2. «Добавить адрес» → `workflow`.
3. «Добавить адрес» → `annflow`.
4. Проверка: с другой почты (Gmail, Яндекс) отправить по письму на каждый адрес. Письма придут во «Входящие» iCloud.
5. Ответить на одно из них и проверить, что в поле «От» стоит нужный адрес. В Почте на iPhone и Mac отправитель выбирается в поле «От».

## 2. Домен partyproto.com (DNS в Porkbun)

1. iCloud: Свой домен почты → «Добавить домен» → «Только для вас» → `partyproto.com`.
2. Пропустить шаг «существующие адреса» (их нет), iCloud покажет записи DNS: два MX, TXT `apple-domain=…`, TXT SPF и CNAME `sig1._domainkey`. Окно не закрывать.
3. Porkbun → Domain Management → `partyproto.com` → Email → выключить Email Forwarding. Иначе MX Porkbun будут спорить с iCloud.
4. Porkbun → `partyproto.com` → DNS. Удалить MX `fwd1.porkbun.com`, `fwd2.porkbun.com` и TXT `v=spf1 include:_spf.porkbun.com ~all`, если они остались. Остальные записи не трогать: там сайт и пересылка URL.
5. Добавить ровно те записи, которые показал iCloud, копируя значения из его окна:
   - MX, host пустой (`@`): `mx01.mail.icloud.com`, приоритет 10
   - MX, host пустой: `mx02.mail.icloud.com`, приоритет 10
   - TXT, host пустой: `apple-domain=…` (из iCloud)
   - TXT, host пустой: `v=spf1 include:icloud.com ~all`
   - CNAME, host `sig1._domainkey`: значение из iCloud, вида `sig1.dkim.partyproto.com.at.icloudmailadmin.com`
6. В iCloud нажать «Проверить» / «Готово». Проверка иногда занимает до часа, если не прошла, повторить позже.
7. «Добавить адрес» → `support`.
8. Проверка как в разделе 1: письмо на `support@partyproto.com` и ответ с него.

## 3. После создания

Написать агенту «почта готова». Тогда он выложит адреса на сайт (ветка с изменениями уже собрана) и отметит строки таблицы. До этого адреса на сайт не выкладываются: письмо на несуществующий адрес вернётся отправителю.

## Чего не делать

- Не менять MX у `arsenynn.com`: там уже iCloud.
- Не подключать к Party Protocol домены `partyproto.ru` и `partyproto.online`: это отдельное решение по переезду Party Protocol.
- Сменить адрес на сайте: поле `email` у проекта в `src/content/projects.yaml`.
