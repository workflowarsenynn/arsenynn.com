# Decisions Log
LastUpdated: 2026-11-01 18:45 MSK

Этот файл хранит историю проекта: важные решения, изменения подхода, причины архитектурных поворотов, rejected options, runtime findings и выводы, которые помогают понять, как проект развивался.

Записи идут в обратном хронологическом порядке: новые сверху.

---

## 2026-11-01 — Hero как титульный кадр

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/components/Hero.astro`, `public/portrait.webp`

### Context
Владелец: после добавления портрета пропорции нарушены, много пустого места вверху справа.

### Decision
Плотный вертикальный кроп лица. Сначала кадр справа с уходом в край экрана, затем по предложению владельца — по центру: лицо, под ним красный wordmark и строка, как титры фильма. Центр выбран: симметрия убирает пустоту справа и не спорит с левой колонкой индекса ниже (обложка, затем оглавление).

### Lesson
Огонёк в кадре над буквой «e» читался как диакритика («@arsēnynn»): декоративные световые точки нельзя ставить вплотную к wordmark.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Phase 12: портрет-логотип хаба в hero и превью

**Type:** decision
**Project:** arsenynn.com
**Phase:** Phase 12
**Status:** accepted
**Related files:** `public/portrait.webp`, `src/components/Hero.astro`, `scripts/render-images.mjs`

### Context
Владелец: портрет в красном свете — главный логотип всего хаба arsenynn, можно ли его использовать или это лишнее.

### Decision
Использован как единственное изображение сайта: в hero (на телефоне над wordmark справа, на desktop справа от wordmark) и в OG image. Кадр почти чёрный, чёрный поднят до цвета фона, края растворяются маской: портрет проступает из темноты, не становясь постером. Вес 20 KB.

### Why
ТЗ (разделы 16, 40) и advisory разрешают одно сильное изображение как редкое событие, если оно вторично к тексту и не снижает контраст. Портрет не перекрывает текст.

### Alternatives / rejected options
- Favicon: на 16–32 px кадр нечитаем.
- Фон всего hero за текстом: снижает контраст wordmark.

### Lesson
WebP с потерями не держит ровный тёмный фон: на маске видны кольца. Для тёмного кадра на тёмном фоне нужен WebP без потерь.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Знак NN принадлежит @arsenynn

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/content/projects.yaml`, `assets/logos/README.md`

### Context
Знак NN стоял у «Бессмысленности и скоротечности»: агент вывел связь из кепки ann и общих букв NN. Владелец уточнил: NN — логотип проекта @arsenynn (там, где части).

### Decision
Знак перенесён на строку @arsenynn, у «Бессмысленности» знака нет.

### Lesson
Принадлежность логотипов проверять у владельца, а не выводить из визуальных совпадений.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Phase 10: порядок проектов задаёт владелец

**Type:** decision
**Project:** arsenynn.com
**Phase:** Phase 10
**Status:** accepted
**Related files:** `src/content/projects.yaml`, `src/data/projects.ts`

### Context
Владелец задал порядок: Party Protocol, annFlow, Without Streaming, @arsenynn, workflow@arsenynn, Бессмысленность и скоротечность, Travel Log, затем Work / Collaboration.

### Decision
Порядок из поля `order`, автосортировка по свежести из Phase 6 отключена. Сигнальный огонёк остаётся и показывает свежесть, не меняя порядок. Тест проверяет точный порядок.

### Alternatives / rejected options
- Оставить автосортировку: противоречит явному порядку владельца. Вернуть её можно из `rollback/phase-9`.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Phase 9: даты активности от Telegram-бота

**Type:** decision
**Project:** arsenynn.com
**Phase:** Phase 9 (advisory Telegram pipeline, metadata only)
**Status:** accepted, ждёт токен
**Related files:** `scripts/telegram/activity.mjs`, `.github/workflows/telegram-activity.yml`, `src/content/activity.json`

### Context
У группы «Бессмысленность и скоротечность» и канала Without Streaming нет публичной ленты, поэтому сигнальный огонёк для них не работает. Владелец попросил импорт из Telegram ботом по advisory.

### Decision
Отдельный бот (не ann: два процесса не могут читать getUpdates одного бота). Workflow раз в час забирает события, пишет только дату последнего сообщения по username чата, подтверждает offset, коммитит `activity.json` и явно запускает `deploy.yml`.

### Why
Advisory: Telegram — источник событий, не хранилище; для Without Streaming метаданные отдельно от архива. Bot API хранит события около 24 часов, поэтому опрос раз в час и сохранение даты в репозитории. Push от GITHUB_TOKEN не запускает другие workflow, кроме workflow_dispatch, поэтому публикация вызывается через `gh workflow run`.

### Alternatives / rejected options
- Черновики постов в Markdown (полный pipeline advisory): нужен, когда появятся внутренние страницы с контентом.
- Webhook: нужен постоянный сервер, у сайта его нет.

### Consequences
Проверено на поддельных событиях: регистр username не важен, учитывается edit_date, чужие чаты игнорируются, offset подтверждается. До появления секрета workflow завершается без действий.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Phase 8: английская версия

**Type:** decision
**Project:** arsenynn.com
**Phase:** Phase 8 (advisory migration step 5)
**Status:** accepted
**Related files:** `astro.config.mjs`, `src/lib/i18n.ts`, `src/content/projects.yaml`, `src/layouts/Base.astro`, `src/components/SiteHeader.astro`

### Context
Владелец: «английская версия: делать сейчас». В исходном ТЗ переключатель языка не требовался, advisory ставит RU/EN пятым шагом миграции.

### Decision
Русский без префикса, английский на `/en/`, общие slug. hreflang ru/en и x-default на русскую. Переключатель RU/EN в header. Английские тексты проектов обязательны в схеме. Короткие английские фразы взяты из advisory (Final voice examples, EN), About переведены. Названия проектов и теги не переводятся (ТЗ раздел 34).

### Alternatives / rejected options
- Переводить slug: advisory советует общие slug для простоты ссылок и миграций.
- Показывать русский текст, если перевода нет: advisory запрещает смешанный язык, поэтому перевод обязателен в схеме.

### Lesson
В YAML фраза с «: » внутри без кавычек превращается в объект: английские строки взяты в кавычки, ошибку поймала схема.

### Source
Сообщение владельца 2026-11-01, advisory (Language, Information architecture).

---

## 2026-11-01 — Phase 7: части @arsenynn и портфолио-хаб

**Type:** decision
**Project:** arsenynn.com
**Phase:** Phase 7
**Status:** accepted
**Related files:** `src/content/projects.yaml`, `src/data/site.ts`

### Context
Владелец: первая версия сайта только со ссылками, видео на сайте пока не будет, но у @arsenynn нужны ссылки на части (t.me/arsenynn/5 и /28). Портфолио `portfolio.arsenynn.com` для сотрудничества и HR должно быть видно на сайте.

### Decision
- У @arsenynn строки «Часть I» и «Часть II» (тип ссылки `chapter`) после Telegram.
- Header Portfolio ведёт на хаб, а не на видеораздел.
- Блок Work / Collaboration стал входом для сотрудничества и найма: Portfolio (хаб, primary), IT / AI, Sales / Events, Video production.
- У workflow@arsenynn осталась прямая ссылка на видеопортфолио.
- Внутренний мир `/arsenynn/` (advisory step 6) отложен до появления видео на сайте.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Phase 6: живой индекс и сигнальный огонёк

**Type:** decision
**Project:** arsenynn.com
**Phase:** Phase 6
**Status:** accepted
**Related files:** `src/lib/activity.ts`, `src/data/projects.ts`, `src/components/ProjectSection.astro`, `.github/workflows/deploy.yml`

### Context
Владелец попросил сделать сайт живее: последний обновлённый проект наверху, давний внизу, и показать это метафорой, изящно и интуитивно, без «дата обновления такая-то».

### Decision
- Порядок по свежести: дата последнего поста публичного Telegram-канала, иначе ручная `updatedAt`. Coming soon всегда внизу. Номер 01–07 показывает текущее место.
- Метафора — сигнальный огонёк, как лампочка записи на камере: ● залитая красная точка — обновлялся на этой неделе, ○ кольцо — за полтора месяца, пусто — тишина. Advisory: neutral shell, red event.
- Пересборка по расписанию каждые 6 часов.

### Why
Точка у номера почти не занимает места, понятна без подписи и остаётся неподвижной (advisory запрещает бесконечную анимацию). Берётся только дата, контент из Telegram не копируется: в духе advisory «Telegram — источник событий, а не хранилище».

### Alternatives / rejected options
- Дата текстом: владелец просил не «в лоб».
- Пульсирующая точка: advisory запрещает непрерывную анимацию.
- Постоянные номера проектов при плавающем порядке: последовательность 03, 01, 05 выглядит как ошибка.
- Bot API: нужен бот-админ в каждом канале, отложено.

### Consequences
У «Бессмысленности» (группа) и Without Streaming нет публичной ленты: без `updatedAt` они стоят в «тишине». Advisory держит индекс стабильным и предлагает отдельный блок «recently published»; здесь по просьбе владельца сам индекс сортируется по свежести.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Phase 5: проекты в Content Collection

**Type:** decision
**Project:** arsenynn.com
**Phase:** Advisory Phase 5 (migration step 4)
**Status:** accepted
**Related files:** `src/content.config.ts`, `src/content/projects.yaml`, `src/data/projects.ts`, `src/data/types.ts`

### Context
Advisory, migration step 4: Content Collections без смены URL, до RU/EN и внутренних миров.

### Decision
Проекты перенесены из `src/data/projects.ts` в `src/content/projects.yaml` (loader `file`). Схема zod проверяет поля, `https://` у ссылок, slug, до четырёх абзацев About и `statusLabel` у проекта без ссылок. Типы выводятся из схемы. `site.ts` пока остаётся TypeScript-модулем.

### Why
YAML удобно править владельцу и агентам, а схема превращает опечатку в ошибку сборки, а не в сломанную страницу. Это основа для коллекции `works` с видео, фото и текстами.

### Consequences
HTML главной совпадает с продом байт в байт (проверено diff). Проверено: ссылка с `http://` останавливает сборку с понятным сообщением.

### Source
Advisory, разделы Content model и Migration.

---

## 2026-11-01 — Только тёмная тема: Phase 3 отменена

**Type:** decision
**Project:** arsenynn.com
**Phase:** Advisory Phase 3 revert
**Status:** accepted
**Related plan:** `docs/implementation_plan.md`

### Context
Владелец посмотрел светлую тему на проде: «пусть будет только тёмная тема».

### Decision
Phase 3 откатана revert-коммитом merge-коммита 769b072. Сайт снова тёмный всегда, как после Phase 2. Ветка `rollback/phase-3` сохраняет светлую тему, если к ней вернутся.

### Consequences
Пункт advisory о светлой теме закрыт решением владельца. Расхождение с advisory зафиксировано здесь, следующие агенты не должны возвращать светлую тему без запроса.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Phase 3: светлая тема «тёплая бумага»

**Type:** decision
**Project:** arsenynn.com
**Phase:** Advisory Phase 3
**Status:** reverted (2026-11-01, решение владельца: только тёмная тема)
**Related files:** `src/styles/tokens.css`, `src/components/ThemedImage.astro`, `public/logos/*-light.*`

### Context
Advisory: светлая тема должна быть тёплой бумагой, а не инверсией; оболочка следует `prefers-color-scheme`; красный уточнить; пары цветов проверить на контраст при реализации. Владелец: «продолжай проект».

### Decision
- Светлая тема: фон #f2f0ea, текст #171716, muted #6b6964, линии #d8d5ce.
- Красный разделён на два токена. Текст ссылок: #e5322d в тёмной и #b92420 в светлой. Графика (точки тегов, фокус): #d9322b из advisory.
- Белые знаки Ws, маска и annFlow получили тёмные версии для бумаги, выбор через `<picture>` и `prefers-color-scheme`.
- Два `theme-color` с media, `color-scheme: dark light`.

### Why
#d9322b из advisory на чёрном даёт 4.19:1 и не проходит AA для текста 18 px, поэтому для текста оставлен #e5322d (4.55:1). Белые знаки на бумаге не видны.

### Lesson
Scoped-стили Astro не действуют на элементы внутри дочернего компонента: класс, переданный в `ThemedImage`, нужно стилизовать через `:global()`, иначе SVG растягивается на всю ширину и появляется горизонтальный скролл. Playwright по умолчанию эмулирует светлую схему.

### Source
Advisory, раздел Color and theme.

---

## 2026-11-01 — Phase 2: Source Serif 4 и Manrope

**Type:** decision
**Project:** arsenynn.com
**Phase:** Advisory Phase 2
**Status:** accepted
**Related files:** `src/styles/tokens.css`, `src/layouts/Base.astro`, `scripts/render-images.mjs`

### Context
Advisory: Playfair Display стал привычным редакционным приёмом; Source Serif 4 — серьёзное текстовое семейство с кириллицей и variable-версией, Manrope — сдержанный современный гротеск с кириллицей. Менять шрифты отдельным деплоем, цвета не трогать.

### Decision
Source Serif 4 для заголовков и hero-строки, Manrope для интерфейса и текста. Шкала из advisory: body 18 px на телефоне и 19 px на desktop, line-height 1.58, lead 22/26 px, заголовок проекта 32–52 px. Подключена только ось wght: файлы с opsz весят в 2.5 раза больше. OG image рендерится шрифтами сайта.

### Consequences
Вес шрифтов около 126 KB при бюджете advisory 120 KB: кириллица и латиница обоих семейств. Можно снизить, если вынести латиницу Source Serif в подмножество.

### Source
Advisory, разделы Typography и Claude Code implementation brief.

---

## 2026-11-01 — Phase 1.1: ссылки строками для большого пальца

**Type:** decision
**Project:** arsenynn.com
**Phase:** Advisory Phase 1.1
**Status:** accepted
**Related files:** `src/styles/global.css`, `src/components/ProjectActions.astro`, `src/components/ActionLink.astro`

### Context
Владелец посмотрел Phase 1: «нормально, но кнопки должны быть удобные для пользователей на смартфонах, максимально удобно».

### Decision
Каждое действие стало строкой на всю ширину колонки высотой 56 px: название слева, ↗ или `+` справа, тонкие линии между строками, подсветка при нажатии. About и «Coming soon» в той же системе. На desktop строки стоят в правой колонке.

### Why
Текстовые ссылки с зоной 48 px были удобны по высоте, но узкие по ширине: в короткое слово легко промахнуться. Строка на всю ширину нажимается в любом месте и остаётся в рамках advisory: тонкие линии и типографика вместо пилюль и заливок.

### Alternatives / rejected options
- Вернуть пилюли с рамкой: advisory считает их продуктовым UI.
- Залитые кнопки: семь красных блоков ломают «красный как подпись».

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Advisory принят, Phase 1 The Moving Index

**Type:** decision
**Project:** arsenynn.com
**Phase:** Advisory Phase 1
**Status:** accepted
**Related plan:** `docs/implementation_plan.md`
**Related files:** `docs/Advisory/deep_research_and_implementation_direction.md`, `src/components/ProjectSection.astro`, `src/components/Hero.astro`, `src/styles/global.css`, `src/data/projects.ts`

### Context
Deep research владельца предложил направление The Moving Index: строгий редакционный каркас, внутри которого иногда случаются кинематографические события. Владельцу нравится текущий сайт, он просит изменить тексты, место логотипов, проверить ссылки и дальше следовать advisory, с возможностью отката и сразу на проде.

### Decision
- Работа фазами, по одной архитектурной смене на деплой. Перед фазой создаётся ветка `rollback/phase-N`: git-теги прокси облачной сессии не пропускает.
- Hero: wordmark и одна строка «семь параллельных вещей одного автора» вместо трёх слоёв объяснения.
- Короткие тексты проектов взяты из advisory (Final voice examples, RU).
- Знаки проектов перенесены в строку номера: на телефоне номер слева и знак справа, на планшете и desktop знак под номером в левой колонке. Логотип annFlow остаётся вместо названия.
- Ссылки: текст и тонкая линия снизу вместо «пилюль» с рамкой 999px, зона нажатия 48 px сохранена, primary красная.
- Desktop от 1024 px: номер | название и текст | действия (advisory grid). Тишина между проектами 96 px на desktop.

### Why
Advisory: hero объяснял таксономию трижды; пилюли читаются как продуктовый UI, а не авторский индекс; ритм кино идёт от пауз 96–144 px, а не от эффектов. Шрифты меняются отдельной фазой, чтобы владелец оценивал изменения по одному.

### Alternatives / rejected options
- Сразу Source Serif 4 + Manrope и светлая тема: advisory запрещает менять layout, шрифты и цвета одним деплоем.
- Next.js, CMS, анимационные библиотеки: advisory прямо отвергает.

### Consequences
OG image обновлён под новую строку. About пока остаётся, advisory предлагает убрать его, когда у мира появится настоящий контент.

### Source
Advisory `docs/Advisory/deep_research_and_implementation_direction.md`, сообщение владельца 2026-11-01.

---

## 2026-11-01 — Знаки проектов, тексты v2 и превью

**Type:** decision
**Project:** arsenynn.com
**Phase:** MVP
**Status:** accepted
**Related plan:** `docs/implementation_plan.md`
**Related files:** `src/data/projects.ts`, `assets/logos/README.md`, `scripts/build-preview.sh`, `docs/deploy.md`

### Context
Владелец дал папку Google Drive со всеми логотипами, назвал описания проектов банальными и попросил включить сайт, чтобы посмотреть.

### Decision
- Две роли для графики: `logo` заменяет название (annFlow), `mark` стоит над текстовым названием (NN у «Бессмысленности», Ws у Without Streaming, маска у Party Protocol). Все знаки векторизованы, светлые или красные.
- Тексты v2: одна короткая фраза на проект с образом вместо перечисления жанров, About в два коротких абзаца.
- Сайт показан как приватное превью-артефакт claude.ai, без публикации на домене.

### Why
Логотипы проектов очень разные (узкий гротеск, кисть, рукопись, силуэт). Если поставить их все вместо названий, строки потеряют общую систему, о которой просит раздел 38 ТЗ. Знак над текстовым названием сохраняет характер проекта и ритм индекса. Превью не трогает DNS, Pages и видимость репозитория, поэтому подтверждение не нужно.

### Alternatives / rejected options
- Все логотипы вместо названий, как в макетах GPT: визуальная ярмарка, длинное «Бессмысленность и скоротечность» не читается в логотипе.
- Жёлтый постер Party Protocol и надпись PARTY: другой цвет и стиль, ломают тёмную систему.
- Портрет ann: сильное изображение, раздел 16 ТЗ разрешает такое только как редкий акцент, решение за владельцем.

### Consequences
Нет чистого wordmark workflow@arsenynn, строка 02 остаётся текстовой. Превью нужно обновлять вручную после изменений.

### Lesson
Файлы Google Drive, расшаренные по ссылке, скачиваются напрямую через `drive.usercontent.google.com`, без передачи base64 через MCP. Картинки-превью в сообщении до сессии файлами не доходят.

### Source
Сообщение владельца 2026-11-01, Google Drive `assest/logos.zip`.

---

## 2026-11-01 — Подключены логотипы @arsenynn и annFlow

**Type:** decision
**Project:** arsenynn.com
**Phase:** MVP
**Status:** accepted
**Related plan:** `docs/implementation_plan.md`
**Related files:** `assets/logos/README.md`, `public/logos/`, `scripts/trace-logo.py`, `src/components/Hero.astro`

### Context
Владелец прислал логотипы. Файлами дошли wordmark `@arsenynn`, annFlow, PSD со знаком NN и два фото. Остальные (Without Streaming, Party Protocol, workflow) пришли только превью в чате, сессия не может их сохранить.

### Decision
- Wordmark `@arsenynn` векторизован в SVG (7.7 KB) и стоит в hero вместо текста, а также в OG image.
- annFlow: фон убран по яркости, WebP 600 px, логотип вместо названия в строке 05.
- Имя в header убрано: wordmark стоит сразу ниже.
- Портрет и фото эскизов сохранены, но не используются.

### Why
SVG чёткий на любом экране и легче растра. Красный wordmark становится главным красным пятном страницы, как и задумано в `docs/design_research.md`. Портрет отложен по разделу 40 ТЗ: сначала без него.

### Alternatives / rejected options
- WebP для wordmark: 43 KB lossy и 77 KB lossless против 7.7 KB SVG.
- Брать логотипы из макетов GPT: это перерисовки, не оригиналы.

### Consequences
Логотипы остальных проектов ждут файлов. Цвет wordmark `#cf0100` темнее accent `#e5322d`: как графика проходит 3:1, менять accent под него нельзя, у текста упадёт контраст.

### Lesson
potracer трассирует нулевые пиксели: маску нужно инвертировать, иначе получается прямоугольник с вырезанными буквами.

### Source
Файлы владельца в сессии 2026-11-01.

---

## 2026-11-01 — Визуальное направление v2: индекс вместо карточек

**Type:** decision
**Project:** arsenynn.com
**Phase:** MVP
**Status:** accepted
**Related plan:** `docs/implementation_plan.md`
**Related files:** `docs/design_research.md`, `docs/references/`, `src/styles/tokens.css`, `src/components/`

### Context
Владелец прислал макеты GPT: суть нравится (нумерованный список проектов с логотипами и ссылками), вид нет. Попросил большой ресерч и страницу стильную, минималистичную, в стиле своих логотипов и понятную с первого взгляда. Заодно прислал ссылку на «Бессмысленность и скоротечность».

### Decision
- Журнальный индекс: номер в левой колонке, название засечками, теги через красную точку, одна фраза, кнопки. Линии между проектами, без карточек.
- Playfair Display Variable для заголовков, системный sans для текста.
- Ссылки стали явными кнопками 48 px с тонкой рамкой, primary красная рамка, без заливки и свечения.
- В hero добавлена строка-пояснение о семи проектах, hero стал компактнее.
- Поле `logo` готово, ждёт файлы.

### Why
Ресерч (`docs/design_research.md`): швейцарская сетка и оглавление проверены временем, засечки и archival index актуальны в 2026, NN/g требует видимых и крупных целей. Текстовые ссылки в v1 читались хуже как действие, а владельцу важно, чтобы всем было понятно, что нажимать.

### Alternatives / rejected options
- Повторить макеты GPT: карточки, glow-кнопки, фото и ссылки за `+` нарушают разделы 10, 16 и 37 ТЗ.
- Оставить текстовые ссылки v1: минималистично, но действие менее очевидно.
- Fraunces и Instrument Serif: нет кириллицы.

### Consequences
Появились внешние запросы к woff2 Playfair. Красный стал заметнее за счёт точек в тегах и primary-кнопок, контраст accent на фоне 4.55:1, это проходит AA впритык.

### Implementation notes
На 320 px длинные названия рвались посреди слова: убран `overflow-wrap: break-word` у заголовков, размер заголовка от 26 px, перенос разрешён перед `@`. QA в Chromium 320–1440 px пройден.

### Lesson
`overflow-wrap: break-word` на body ломает крупные заголовки на узких экранах: для display-текста его нужно отключать и подбирать размер.

### Source
Сообщение владельца с макетами 2026-11-01, ресерч в `docs/design_research.md`.

---

## 2026-11-01 — Ответы владельца и сборка MVP

**Type:** decision
**Project:** arsenynn.com
**Phase:** MVP
**Status:** accepted
**Related plan:** `docs/implementation_plan.md`
**Related files:** `src/data/projects.ts`, `docs/deploy.md`, `docs/project_registry.md`, `.github/workflows/deploy.yml`

### Context
После бутстрапа документации владелец ответил на четыре вопроса: модель публикации, ссылка «Бессмысленности и скоротечности», домен `arsenynn.quest`, адрес Portfolio для workflow.

### Decision
- Публикация: один публичный репозиторий, GitHub Pages через Actions.
- «Бессмысленность и скоротечность»: владелец пришлёт ссылку. До этого проект показан без ссылки, с подписью «Ссылка скоро».
- `arsenynn.quest`: владелец продлевает домен, адреса Listen и Website остаются.
- Portfolio у workflow, в header и в блоке Work: `https://portfolio.arsenynn.com/video-production/`.
- Собран MVP на Astro 7: одна страница, system font stack, CSS инлайнится в HTML, один скрипт About.

### Why
Публичный репозиторий снимает проблему billing для Actions и позволяет публиковать через merge в `main` без Mac. Секретов в проекте нет. Раздел `/video-production/` сразу показывает заказчику видео, а не общий индекс Portfolio.

### Alternatives / rejected options
- Приватный код и отдельный публичный репозиторий только с `dist/`: публикация зависит от Mac владельца.
- Web-шрифт на первом проходе: ТЗ просит сначала решить интерфейс, system stack не требует лицензии.

### Consequences
Сайт заработает после смены видимости, включения Pages и DNS, это действия владельца. Пока репозиторий приватный, workflow может падать из-за billing, это ожидаемо.

### Implementation notes
QA в Chromium (Playwright) на 320, 360, 375, 390, 414, 430, 768, 1280, 1440 px: горизонтального скролла нет, минимальный текст 15 px, все ссылки и кнопки не меньше 44×44, About открывается Enter и Space, с reduced motion и без JavaScript работает, изображений на странице нет. Safari iOS не проверялся: в cloud-контейнере его нет.

### Lesson
Сворачивать About нужно через CSS по классу из inline-скрипта в `<head>`, а не из модульного скрипта: иначе страница сначала рисуется раскрытой и прыгает.

### Source
Ответы владельца в сессии 2026-11-01, сборка и браузерный QA.

---

## 2026-11-01 — Старт: статичный индекс на Astro и GitHub Pages

**Type:** decision
**Project:** arsenynn.com
**Phase:** Inception
**Status:** accepted
**Related plan:** `docs/implementation_plan.md`
**Related files:** `docs/brief.md`, `docs/architecture.md`, `docs/deploy.md`

### Context
Владелец передал подробное ТЗ на личный сайт и попросил сразу вести проект на GitHub, потому что дальше над ним будет работать cloud-сессия. Папка была пустой, GitHub-репозитория не было.

### Previous assumption
В начале обсуждения агент предложил один HTML-файл на Cloudflare Pages, тогда ещё без ТЗ и без чтения документации Portfolio. Оба предложения оказались неверными для этого проекта.

### Trigger
ТЗ требует отделить контент от разметки и подготовить будущие страницы проектов. В `docs/implementation_plan.md` проекта Portfolio уже записано решение владельца от 2026-10-21: `arsenynn.com` это будущая главная, `portfolio.arsenynn.com` это Portfolio, а прокси Cloudflare в РФ режет ответы примерно на 16 KB.

### Decision
Astro со статической сборкой, данные в `src/data/`, обычный CSS с токенами, один маленький скрипт для About. Хостинг GitHub Pages, DNS в Cloudflare только в режиме DNS only.

### Why
Astro не отправляет в браузер фреймворк, а компоненты и данные разделены с первого дня. Новая страница проекта это новый файл, а не переделка сайта. GitHub Pages уже проверен владельцем из РФ на Portfolio.

### Alternatives / rejected options
- Один HTML-файл: проще всего, но контент смешан с разметкой, а будущие страницы потребуют переезда.
- Next.js: тяжёлый application framework ради одной статичной страницы, ТЗ раздел 26 этого не хочет.
- Cloudflare Pages: прокси режет ответы в РФ, а основная аудитория там.

### Consequences
Нужен шаг сборки и Node.js. Публикация зависит от выбранной модели репозитория: Actions в приватных репозиториях аккаунта не запускаются из-за billing.

### Implementation notes
Создан приватный репозиторий `workflowarsenynn/arsenynn.com`, документация по Project Standards, реестр ссылок, Todoist root task. Кода сайта пока нет.

### Lesson
Перед советом по хостингу надо читать соседние проекты: нужное решение и его причина уже были записаны в Portfolio.

### Source
ТЗ владельца от 2026-11-01, `docs/implementation_plan.md` и `docs/deploy_portfolio.md` проекта Portfolio.
