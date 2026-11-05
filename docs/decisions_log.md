# Decisions Log
LastUpdated: 2026-11-06 01:00 MSK

Этот файл хранит историю проекта: важные решения, изменения подхода, причины архитектурных поворотов, rejected options, runtime findings и выводы, которые помогают понять, как проект развивался.

Записи идут в обратном хронологическом порядке: новые сверху.

---

## 2026-11-05 — Случайные посты «Бессмысленности и скоротечности» на главной

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/components/PostStream.astro`, `src/scripts/stream.ts`, `src/pages/stream/bessmislennost.json.ts`, `src/content/stream/bessmislennost.json`, `public/media/bis/`

### Context
Владелец: на главной в блоке проекта показывать посты рубрики в случайном порядке, чтобы они сменяли друг друга и запускались прямо на сайте. Список постов: `database/content.json` в `ann_bot_2.0`, канал `bessmislennost`, 157 постов (владелец называл файл context, рубрику bis).

### Decision
- Все 157 постов перенесены на сайт: 96 видео, 56 картинок, 4 аудио, 1 текст. Файлы скачаны из Telegram Web после входа владельца, сжаты: видео до 720 px по ширине или 1000 px по высоте, CRF 28, 30 fps, метаданные удалены. Вышло 244 MB из 2,5 GB.
- Порядок случайный, без повторов, пока не показаны все. Видео идёт до конца без звука, картинка и текст держатся 9 секунд. Есть «Пауза», «Включить звук», «Следующий».
- Список грузится только когда блок виден, видео и таймер работают только на экране (advisory: previews load after intersection and stop outside it).
- При reduced motion и экономии трафика смена сама не запускается: только кнопкой.
- Без JS остаётся один пост. Текст постов очищен от хэштегов и подписи канала, `hidden_description` бота на сайт не идёт.
- Это третий скрипт на сайте: правило «два маленьких скрипта» расширено решением владельца.

- Звук: кнопка лежит на кадре в верхнем правом углу, пока звук выключен, рядом надпись «Включить звук». Нажатие по кадру тоже включает звук, как в сторис. Выбор сохраняется на следующих видео. На все ролики один элемент `<video>`: иначе iOS сбрасывает разрешение на звук. Кнопка внизу не работала: её не находили.

### Alternatives / rejected options
- Виджет Telegram в iframe: чужой скрипт, большие видео в нём не играют, зависит от доступа к Telegram.
- Ссылки на файлы Telegram: адреса с токенами устаревают.

### Consequences
- Сайт вырос примерно до 320 MB. Лимит Pages около 1 GB, файл до 100 MB, самый большой файл 21 MB. Git-история хранит эти файлы навсегда, каждый деплой загружает весь сайт.
- Если трафик приблизится к 100 GB в месяц, `public/media/bis/` перенести в Cloudflare R2: поменять только пути в `bessmislennost.json`.
- У постов-альбомов (74, 235, 328, 776, 802, 915, 1453) показан только первый файл. Пост 89 только текст.
- Новые посты рубрики сами не появятся, это разовый перенос.
- Скриншоты и записи содержат мат и переписки, как в канале.

### Source
Сообщение владельца 2026-11-05.

---

## 2026-11-05 — Ленты у @arsenynn и workflow, кадры 800 px

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/components/ProjectStrip.astro`, `src/components/ProjectActions.astro`, `public/thumbs/`

### Context
На iPhone обложки ленты выглядели мутно: карточка 270 CSS px на экране 3x требует около 800 px, файлы были 480 px из исходника 800 px. Владелец попросил поправить качество и сделать такие же ленты у частей @arsenynn и у workflow.

### Decision
- Все кадры 800×450 WebP. Обложки annFlow из оригиналов Telegram 1280×675 (они же заменили `media/<id>-1.jpg`), кадры глав и работ из обложек YouTube.
- Части I и II и работы workflow идут лентами, панелей с «+» больше нет. Одна лента `ProjectStrip` на всех: номер и время над названием, значок воспроизведения на кадре, хиты красным. «Вступление» стало кнопкой в строке заголовка части.
- Плеер не менялся: он берёт главы из списка с `data-part`.

### Consequences
- Вес главной вырос: около 650 KB в Chromium на 390 px против бюджета advisory 350 KB, потому что браузер заранее грузит ленивые кадры ближайших секций. Это цена чёткости на экране 3x. `content-visibility` проверен и не дал выигрыша, убран.
- У `arsenynn-12` есть только обложка YouTube 480×360, у `arsenynn-11`, `arsenynn-31`, `workflow-177`, `workflow-194` только 640×480: эти кадры мягче остальных.
- Главы 0.2 и 1.0 без кадра, на карточке номер.

### Lesson
- Скрытая подпись с `position: absolute` внутри ленты вылезает из `overflow` и расширяет страницу, если сама лента не задаёт `position: relative`.

### Source
Сообщение владельца 2026-11-05 со снимком iPhone.

---

## 2026-11-05 — annFlow: лента проектов на главной, посты под оглавлением, файлы на GitHub Pages

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/components/ProjectStrip.astro`, `src/components/NoteBody.astro`, `src/pages/annflow/projects/[slug].astro`, `src/content/projects.yaml`, `public/thumbs/annflow-*.webp`

### Context
Владелец: убрать «Читать», раскрыть «Проекты» на главной, показать несколько последних и дать понять, что можно мотать дальше. Под оглавлением серии сразу посты, без переключения.

### Decision
- На главной лента с прокруткой вбок, новые проекты слева. На телефоне видна одна карточка и край следующей, на desktop три и край четвёртой, рядом счётчик и ссылка «Все» на `/annflow/`. Только CSS, `scroll-snap`, без JS и без перехвата прокрутки (advisory: No scroll hijacking, No infinite feed).
- В ленте все 7 проектов, а не 3: владелец хочет мотать их, а экран всё равно показывает несколько. Обложки вне экрана грузятся лениво, 15 KB каждая.
- Страница серии: оглавление, под ним все посты целиком, строки оглавления ведут к якорям `#note-<id>`, после поста ссылка «К оглавлению». Заголовок поста ведёт на отдельную страницу заметки, она осталась: адрес стабилен и на него ведут ссылки между постами.
- Стикеры (посты 111, 134, 144, 172) и аудио из поста 83 владелец решил не добавлять. Поддержка аудио убрана из схемы, импорта и `NoteMedia`.
- Видео хранятся в репозитории и отдаются GitHub Pages. Лимиты: файл до 100 MB, сайт около 1 GB, трафик около 100 GB в месяц. `preload="none"`, байтовые диапазоны работают (проверен ответ 206). Все 9 постов с видео играют на сайте, пост 184 (9:20) тоже файлом, по решению владельца, без YouTube. Если трафик вырастет, большие ролики перенести в Cloudflare R2.
- Шесть последних видео: 102, 147, 180, 183 скачаны из Telegram Web в браузере приложения после входа владельца по QR, 184 и 189 с Google Drive (имя и размер совпали с документами в Telegram). Постеры заменены кадрами из роликов.

### Alternatives / rejected options
- 3 карточки и «Ещё»: нечего мотать, владелец просил обратное.
- Кнопки «влево/вправо» и индикатор страниц: нужен третий скрипт, правило проекта запрещает.
- Вертикальный список: длинная секция annFlow на главной, как раз перегрузка.

### Consequences
- У annFlow на главной нет панели `contents-annflow`, вход в мир через «Все» и карточки.
- `primary` теперь у Telegram.
- Страницы серий длинные, вес держат ленивые картинки и видео без предзагрузки.

### Source
Сообщение владельца 2026-11-05, advisory разделы Homepage behavior и Motion rules.

---

## 2026-11-04 — Мир annFlow: весь канал на сайте

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `scripts/telegram/import-channel.mjs`, `src/content/annflow/`, `src/lib/annflow.ts`, `src/pages/annflow/`, `src/components/NoteMedia.astro`, `src/components/WorldBar.astro`, `src/content.config.ts`, `src/styles/global.css`

### Context
Владелец: всё из Telegram annFlow (картинки, тексты, файлы, видео) должно быть на сайте, удобно, стильно, без перегрузки. Предложил либо несколько постов с кнопкой «далее», либо один пост и обязательное оглавление.

### Trigger
Канал: 100 постов, около 136 тысяч знаков, 42 текста длиннее 1500 знаков, 8 тем. На одной странице такой объём не читается.

### Decision
- Один пост — одна страница с оглавлением, вариант владельца номер два. Три уровня: `/annflow/`, `/annflow/projects/<серия>/`, `/annflow/notes/<id>/`. Маршруты взяты из advisory.
- Адрес заметки равен номеру поста в Telegram: стабильно и легко сверять.
- На странице заметки: «N из M», время чтения, дата, текст, медиа, «Дальше» и «Назад», оглавление серии в нативном `<details>`, оригинал в Telegram. После последней заметки «Дальше» ведёт в следующую серию. JavaScript на страницах чтения не нужен.
- Импорт разовый и через Git, не зеркало: Telegram -> Markdown -> ревью -> main. Так advisory советует для annFlow, потому что Telegram хорош как источник событий и плох как архив. Новые посты: `node scripts/telegram/import-channel.mjs`, существующие заметки не перезаписываются.
- Серии и состав заметок заданы явно в `src/content/annflow/channel.json`, не эвристикой. Короткие посты с картинками присоединены к тексту, к которому относятся.
- Служебное убрано: «Навигация по проектам», «Оглавление темы», хэштеги, «Все каналы». Их заменяет оглавление сайта. Ссылки `t.me/annsflow/N` ведут на страницы сайта.
- Картинки лежат рядом с заметками, Astro отдаёт их в WebP нужной ширины и лениво. На телефоне скриншоты идут в одну колонку без обрезки.
- На странице `/annflow/` нет абзацев About: иначе список серий уходил за первый экран (advisory: reduce explanation).
- Страницы только на русском: перевод 136 тысяч знаков в эту стадию не входит. На `/en/` ссылка подписана «Read (in Russian)».
- Переход между страницами: CSS `@view-transition`, без JS, с учётом reduced motion.

### Alternatives / rejected options
- Несколько постов и «далее» на одной странице: нет постоянного адреса у поста, страница растёт, читатель теряет место.
- Лента со всеми постами: advisory, «No infinite feed».
- Автоматическое зеркало по расписанию: advisory отвергает, правка в Telegram молча меняла бы сайт.

### Consequences
- Видео: Telegram отдаёт файл только у поста 94, он сжат с 14 MB до 1,1 MB и играет на сайте. У постов 89, 100, 102, 108, 147, 180, 183, 184, 189 постер ведёт в Telegram. Когда владелец пришлёт файлы, их кладём в `public/media/annflow/` и пишем в `videos` в `channel.json`. 2026-11-05: встроены посты 89, 100 и 108. Посты 89 и 108 один ролик (постеры совпали побайтно, длина та же), на сайте один файл `89.mp4`. Их чёрные постеры заменены кадром из ролика, постер поста 100 заменён чётким кадром. Метаданные iPhone при сжатии удаляются (`-map_metadata -1`). `import-channel.mjs --force` вернёт старые постеры из Telegram.
- Аудио из поста 83 доступно только ссылкой на Telegram.
- Файлы `.json` из постов 79–82 Telegram без клиента не отдаёт. Они взяты из `~/Documents/portfolio-pages-deploy/downloads/mac-automation/`, размеры совпадают с постами.
- Посты 111, 134, 144, 172: только медиа, которое Telegram не показывает в браузере, сайт их не содержит.
- Вес главной не изменился, сайт вырос до 78 страниц.
- Скриншоты диалогов с ботом содержат имена участников и мат и индексируются как часть сайта. Владелец 2026-11-05: оставлять как есть.

### Lesson
- В постах выделение иногда начинается посреди слова, импорт расширяет его до границы слова.
- Текстовый блок поста заканчивается первым `</div>`: следом могут идти превью ссылки и реакции.
- Сверка по предложениям ловит потери лучше просмотра глазами: 1836 предложений канала проверены автоматически.

### Source
Сообщение владельца 2026-11-04, `docs/Advisory/deep_research_and_implementation_direction.md` разделы Source of truth and Telegram, Information architecture, Content model, Homepage behavior.

---

## 2026-11-04 — Плеер у workflow, хиты красным, номер и время разведены

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/content/projects.yaml`, `src/content.config.ts`, `src/components/ProjectActions.astro`, `src/scripts/player.ts`, `tests/site.spec.ts`

### Context
Владелец: убрать «Смотреть на YouTube», раз видео запускаются на сайте; номер и время сливаются; Reflection и I Left It There выделить красным как лучшие работы, закрывающие части; workflow@arsenynn открывать так же, как @arsenynn.

### Decision
- Строки «Смотреть на YouTube» и поле `youtube` у частей убраны.
- Номер слева, время справа на той же строке над названием. Разделитель-точка убран, в плеере осталось только «часть · номер».
- Поле `accent` у глав и работ: красное название и значок в строке, красное название в плеере. Выделены Reflection (1.11.2), I Left It There (2.4.2) и I left it there у workflow. Reflection BST не выделен: владелец назвал только Reflection.
- У работ `meta` стало годом, длительность вынесена в `duration`.
- Все 11 работ workflow открываются в плеере, «Назад» и «Дальше» идут по списку.

### Alternatives / rejected options
- Время в отдельной колонке у значка: на 320 px название сжималось примерно до 90 px.
- Время на кадре, как на YouTube: 15 px закрывает заметную часть кадра шириной 88 px.

### Lesson
У workflow отдельный канал `https://www.youtube.com/@workflow.arsenynn`. Прежняя запись «UFO на YouTube нет» неверна: ролик там есть (`GcwnBXtJq4Y`). Dissociation не показан на вкладке видео канала и находится поиском, «Окутало» лежит на канале @arsenynn. Искать по названию канала, а не угадывать handle.

### Source
Сообщение владельца 2026-11-04, YouTube oEmbed по 11 работам: автор и встраивание подтверждены.

---

## 2026-11-04 — Плеер глав на сайте и новый порядок слов в слогане

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/components/VideoPlayer.astro`, `src/scripts/player.ts`, `src/components/ProjectActions.astro`, `src/data/site.ts`, `scripts/render-images.mjs`, `public/og.png`, `tests/site.spec.ts`

### Context
Владелец: при нажатии на главу части I или II видео с YouTube открывается внутри сайта, не на новой странице, максимально стильно, по advisory. Слоган меняется на «Финальная битва между самоценным и рациональным».

### Decision
- Решение владельца отменяет запрет на встроенный плеер из `docs/brief.md` раздел 50 для глав @arsenynn. Запрет на сторонние скрипты сохраняется до нажатия: iframe создаётся только по явному действию.
- Один нативный `<dialog>` на страницу, на весь экран цвета фона: страница уходит в темноту, остаётся кадр. Подпись: часть, номер, длительность, название в Source Serif, «Назад» и «Дальше» по главам части, ссылки Telegram и YouTube.
- Без JS и при нажатии с модификатором глава остаётся ссылкой на Telegram. Главы 0.2 и 1.0 без YouTube остаются ссылками: в строке ↗ вместо ▶.
- `youtube-nocookie.com`, адреса в `src/data/site.ts`, не в компонентах (advisory: не вшивать провайдера).
- Закрытие удаляет iframe, звук останавливается. Постер размыт и держит кадр, пока iframe не загрузился.
- Появление 320 ms, новый токен `--duration-reveal` (advisory: 240–450 ms).
- Английский слоган зеркально: «between the intrinsic and the rational».

### Alternatives / rejected options
- Плеер внутри строки главы: вложенная раскрывашка, прыжок списка, на телефоне 16:9 внутри отступов.
- Подгрузка YouTube API и своя панель управления: сторонний скрипт и лишняя сложность.
- Kinescope или Mux: advisory советует их для РФ, но это перезалив всех видео и решение владельца.

### Consequences
- YouTube в РФ работает с перебоями, а аудитория сайта в основном там. Поэтому ссылка «Смотреть в Telegram» всегда видна под кадром. Проверка из РФ-сети ещё нужна.
- На iPhone автозапуск со звуком внутри iframe может не сработать, тогда нужно второе нажатие на кнопку YouTube. Не проверено на устройстве.
- Длительности на сайте взяты из Telegram и могут немного отличаться от YouTube: 1.1.2 — 1:10 и 1:05.
- Telegram кэширует превью ссылки, новая OG-картинка появится там не сразу.

### Source
Сообщение владельца 2026-11-04, `docs/Advisory/deep_research_and_implementation_direction.md` разделы Media and motion и Video infrastructure, YouTube oEmbed по 25 роликам (встраивание разрешено у всех).

---

## 2026-11-04 — Старый значок @ в браузере: кэш favicon

**Type:** runtime-finding
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/layouts/Base.astro`, `public/favicon.ico`, `scripts/render-images.mjs`, `tests/site.spec.ts`

### Context
Владелец прислал скриншот адресной строки: значок всё ещё «@ с красной точкой», а должен быть NN.

### Trigger
Прод отдавал правильный `favicon.svg` с NN. Значок на скриншоте совпал с favicon времён MVP. Новый файл лежал по прежнему адресу, поэтому браузер продолжал показывать кэш. `/favicon.ico` отдавал 404, запасной иконки не было.

### Decision
- Ссылки на иконки получили `?v=2`, адрес изменился и кэш больше не подходит.
- Добавлен `public/favicon.ico` (16, 32, 48 px) с тем же знаком NN, его генерирует `scripts/render-images.mjs`.

### Lesson
Favicon кэшируется отдельно от страницы и не подчиняется `cache-control`. При смене иконки менять адрес, а не только содержимое файла.

### Source
Скриншот владельца 2026-11-04, `curl` прода, `git show 6de74ca~1:public/favicon.svg`.

---

## 2026-11-04 — Базовые метрики прода: кадры закрытых панелей грузились на старте

**Type:** runtime-finding
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/styles/global.css`, `src/content.config.ts`, `src/data/projects.ts`, `tests/site.spec.ts`, `docs/handoff.md`

### Context
Первая локальная сессия после облачной. Advisory относит к NOW базовые метрики производительности, их не было.

### Trigger
Замер живого сайта, профиль iPhone 13, 2026-11-04: 476 KB на первом экране, из них 334 KB картинки, CLS 0, LCP около 0,7 с без ограничения сети, горизонтального скролла нет. Все 43 кадра закрытых панелей загружались сразу, 238 KB.

### Decision
- Панель, свёрнутая через `grid-template-rows: 0fr`, остаётся в раскладке, поэтому `loading="lazy"` считает кадры видимыми. На закрытую панель поставлен `content-visibility: hidden`, первый экран стал около 230 KB (бюджет advisory без медиа 350 KB).
- Анимацию закрытия сохраняет `transition: content-visibility ... allow-discrete`.
- Safari до 26 правило пропускает и ведёт себя как раньше: панель скрыта через `visibility`, кадры грузятся сразу. Отдельный fallback не нужен.
- Оглавление получило необязательное `titleEn`: на /en/ оставались «MCP-сервер» и «Автоотклики». Имена собственные не переводятся.

### Alternatives / rejected options
- `data-src` и подстановка скриптом: без JS кадры пропали бы, а панели без JS открыты.
- `display: none` на закрытой панели: ломает анимацию высоты.

### Consequences
Шрифты 125 KB при бюджете 120 KB, оставлено в `## Next`. /en/ всё равно грузит кириллические шрифты из-за имён собственных и переключателя языка, это ожидаемо.

### Lesson
- `npm run build` падает с `Tsconfig not found astro/tsconfigs/strict` в worktree внутри `.claude/`: скрытый каталог в пути. Код ни при чём, вне `.claude/` сборка проходит.
- Astro 7 в агентной среде уводит `astro preview` в фон и держит один сервер на lock-файле. Playwright пишет `Process from config.webServer exited early`, повторный запуск подключается к уже работающему серверу. Управление: `npx astro preview status` и `stop`.

### Source
Playwright с CDP на https://arsenynn.com и `/en/`, `whois`, `curl` по 61 внешней ссылке.

---

## 2026-11-01 — Вступления на сайте, favicon NN, новые тексты, знак ann кругом

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/content/projects.yaml`, `src/components/ProjectActions.astro`, `public/favicon.svg`, `public/logos/bessmyslennost.webp`, `src/data/site.ts`

### Context
Владелец: favicon — красные NN; «Вступление» должно раскрывать текст с идеальной вёрсткой по advisory; новые тексты «Бессмысленности» и Without Streaming; убрать хвосты из About annFlow и workflow; Video production заглушить; знак «Бессмысленности» выглядит плохо.

### Decision
- Favicon: NN из `nn.svg` с утолщённым штрихом (иначе на 16 px линии исчезают), apple-touch-icon — NN на тёмном.
- «Вступление»: вложенная раскрывашка внутри части — по прямой просьбе владельца, вопреки общему правилу одного уровня; блок чтения по advisory Typography (serif, 62ch, 1.6).
- Знак ann: был тёмным фото с размытыми краями (на 71 px — мутное пятно, другой визуальный язык). Стал чётким кругом плотнее по лицу, +35% яркости, +20% контраста, лёгкая резкость, тонкое кольцо, 50 px.
- Video production в блоке Work — строка без ссылки с пометкой «скоро».
- Тексты: «Бессмысленность» (слоган и 3 абзаца), Without Streaming (слоган и 2 абзаца), annFlow без «@arsenynn.» в первом абзаце, workflow без второго абзаца. EN — переводы агента.

### Lesson
Текст из Telegram пришёл с разложенной «й» (и + U+0306): поиск по странице и тесты не находили слова. `projects.yaml` приведён к Unicode NFC (22 символа); текст из внешних источников нормализовать при импорте.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Индекс по центру на desktop, тексты @arsenynn и annFlow

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/components/ProjectSection.astro`, `src/content/projects.yaml`, `src/styles/global.css`

### Context
Владелец: на desktop раскрытые «Проекты» в правой колонке выглядят неудобно, всё должно быть в центре. Также: у Party Protocol сначала Telegram; @arsenynn целиком красным, новый слоган и About; новый About у annFlow; видео для Without Streaming пришлёт позже.

### Decision
- Desktop: правая колонка действий убрана (это была трёхколоночная сетка из advisory Phase 1), индекс центрирован (54rem), ссылки и списки под текстом на всю его ширину.
- Party Protocol: Telegram первым и главным, затем Website.
- @arsenynn: название акцентным красным (`accent: true`), слоган «Там, где отсутствие необходимости не исключает неизбежности», About из трёх абзацев владельца. EN-переводы сделаны агентом.
- annFlow: About владельца из трёх абзацев.

### Alternatives / rejected options
- Оставить колонку и вынести раскрытые списки под строку: в колонке остались бы узкие строки, и между кнопкой и её списком был бы разрыв.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Проекты workflow с кадрами, обложки annFlow, без Portfolio у workflow

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/content/projects.yaml`, `src/components/ProjectActions.astro`, `public/thumbs/`

### Context
Владелец: убрать ссылку Portfolio у workflow@arsenynn, добавить проекты с каверами как у @arsenynn, то же для annFlow (в постах оглавления есть картинки).

### Decision
- workflow: главная ссылка Telegram; «Проекты» раскрывают 11 работ канала, свежие сверху, строка «год · длительность» над названием. Обложки — лучший кадр из альбома стоп-кадров перед каждым видео; у Dissociation — паттерн workflow. Правило владельца: если в Telegram кадра нет или он плохой, брать с YouTube. I left it there — кадр с YouTube (то же видео, что 2.4.2 у @arsenynn); UFO на YouTube нет — кадр приближен к светлому экрану в центре и осветлён.
- annFlow: у семи серий обложки из первых постов серий (оформленные заставки канала).
- Портфолио осталось в header и блоке Work / Collaboration.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Логотип «Бессмысленности»: ann в кепке

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `public/logos/bessmyslennost.webp`, `src/content.config.ts`, `src/components/ProjectSection.astro`

### Context
Владелец: у «Бессмысленности и скоротечности» логотип — портрет ann в кепке с надписью проекта.

### Decision
Квадратный кроп лица и кепки из оригинала (Drive, 6144×4096), чёрный поднят до фона, края растворяются маской, как у портрета в hero. Фото-знак в 1.7 раза крупнее штриховых знаков (71 px против ~42 px): при равной площади лицо не читается.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Кадры к главам @arsenynn

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `public/thumbs/`, `src/content/projects.yaml`, `src/components/ProjectActions.astro`

### Context
Владелец: добавить к главам каверы — лучший кадр из каждого видео, чтобы у людей была картинка, на что нажать. Затем дал YouTube-канал @arsenynn.

### Decision
25 из 27 глав нашлись на YouTube. Для каждой из кандидатов (обложка 1280×720 и автокадры YouTube из начала, середины и конца) выбран лучший по яркости, контрасту, цвету и резкости; 2.3.2 заменён вручную на кадр с людьми. Кадры 288×162 WebP, всего 154 KB, загружаются только при раскрытии части. 0.2 и 1.0 на YouTube не найдены — заглушка с номером. В каждой части строка «Смотреть на YouTube» ведёт на канал; ID видео сохранены в данных.

### Why
Обложки Telegram не подошли: в 19 из 27 это чёрный первый кадр, файлы видео Telegram отдаёт только у одного ролика. Строки глав по-прежнему ведут в Telegram: одна ссылка на строку, и Telegram надёжнее YouTube в России.

### Source
Сообщения владельца 2026-11-01.

---

## 2026-11-01 — Превью ссылки: имя и слоган, описание для поиска отдельно

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/data/site.ts`, `src/layouts/Base.astro`

### Context
Владелец увидел превью в Telegram: «@arsenynn — index» и «Индекс проектов @arsenynn: авторское кино…» — банально, спросил, менять ли на слоган или оставить для SEO.

### Decision
Разделены аудитории. Telegram и соцсети (og/twitter): site_name `arsenynn.com`, title `@arsenynn`, description — слоган. Google: `<title>` «@arsenynn — Финальная битва между рациональным и самоценным», meta description — содержательный список проектов для поиска.

### Why
og-теги видят люди в мессенджерах, meta description — поисковик. Слоган в превью сохраняет образ, список в meta description сохраняет находимость.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Слоган, знак workflow и выравнивание знаков

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/data/site.ts`, `public/logos/workflow.svg`, `src/components/ProjectSection.astro`, `src/styles/tokens.css`

### Context
Владелец выбрал слоган «Финальная битва между рациональным и самоценным» (суть annFlow: утилитарное как фундамент для неутилитарного), прислал знак WW/NN для workflow и заметил, что знаки разного размера.

### Decision
- Слоган в hero и OG; EN: «The final battle between the rational and the intrinsic».
- Знак WW/NN векторизован (8 KB, трассировка с 600 px; с 2000 px было 128 KB) и стоит у workflow@arsenynn.
- Знаки выравниваются по площади, а не по высоте: высота = 2.6rem / √(пропорция). Логотип annFlow не меняется.

### Why
При одинаковой высоте широкая маска (2.55:1) выглядела вдвое тяжелее квадратного знака. Одинаковая площадь — стандартный способ уравнять разные логотипы в одном ряду.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Части @arsenynn раскрываются главами

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/content/projects.yaml`, `src/components/ProjectActions.astro`

### Context
Владелец: у @arsenynn «Часть 1» и «Часть 2» должны раскрываться списком видео, каждая ссылка — на видео в Telegram и YouTube, без усложнения и промахов.

### Decision
Один уровень раскрытия: «Часть I» (вступление t.me/arsenynn/5 и 18 глав, 0.1–1.11.3) и «Часть II» (вступление /28 и 9 глав, 2.0–2.5). Строка главы: номер, название, длительность, вся строка ведёт на пост. YouTube — не вторая кнопка в каждой строке, а строка «Смотреть на YouTube» сверху части (плейлист), когда владелец пришлёт ссылки.

### Why
NN/g: двойные цели в одной строке путают, вложенные аккордеоны (GOV.UK) ухудшают находимость. Одна ссылка на строку 56 px — без промахов.

### Alternatives / rejected options
- Telegram и YouTube в каждой строке: 54 цели вместо 27, риск промаха.
- Отдельная страница части: advisory откладывает внутренние страницы до видео на сайте.

### Source
Сообщение владельца 2026-11-01; номера, названия и длительности из подписей постов канала.

---

## 2026-11-01 — Оглавление проектов annFlow

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/content/projects.yaml`, `src/components/ProjectActions.astro`, `src/styles/global.css`

### Context
Владелец: нужна кнопка со всеми проектами канала и ссылками на посты, чтобы люди сразу видели проекты. Только у annFlow.

### Decision
Строка «Проекты» между Telegram и About раскрывает семь строк: LiveContext, MCP-сервер, VoxBase, Автоотклики, Бессмысленность и скоротечность, Without Streaming, Mac Automation Stack. Свежие сверху, каждая строка — название и подзаголовок первого поста серии, ссылка на пост. Структура взята из поста канала «Навигация по проектам канала» (t.me/annsflow/179) плюс LiveContext (t.me/annsflow/186), вышедший позже.

### Why
Владелец уже ведёт оглавление в канале; сайт повторяет его структуру, а не придумывает свою. Раскрытие на месте, как About, без отдельной страницы (advisory: страницы только при реальном контенте).

### Consequences
Новые серии в канале нужно добавлять в `contents` вручную или через будущий импорт.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Пропорции hero и новая строка

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/components/Hero.astro`, `src/data/site.ts`, `scripts/render-images.mjs`

### Context
Владелец попросил опустить `@arsenynn` чуть ниже, проверить пропорции портрета и двух надписей и заменить строку на «одна авторская система, внутри которой семь способов смотреть на мир».

### Decision
Wordmark больше не накладывается на кадр: под портретом воздух 16–24 px. Ширина wordmark ≈ 1.6 ширины портрета (18rem к 11rem на телефоне, 24rem к 15rem на desktop). Строка: `text-wrap: balance`, ширина около ширины wordmark. EN: «one authored system, seven ways of looking at the world». OG image обновлён.

### Source
Сообщение владельца 2026-11-01.

---

## 2026-11-01 — Hero как титульный кадр

**Type:** decision
**Project:** arsenynn.com
**Status:** accepted
**Related files:** `src/components/Hero.astro`, `public/portrait.webp`

### Context
Владелец: после добавления портрета пропорции нарушены, много пустого места вверху справа.

### Decision
Плотный вертикальный кроп лица. Сначала кадр справа с уходом в край экрана, затем по предложению владельца — по центру: лицо, под ним красный wordmark и строка, как титры фильма. Центр выбран: симметрия убирает пустоту справа и не спорит с левой колонкой индекса ниже (обложка, затем оглавление). Крупный центральный кадр (до 72vw) владелец счёл слишком большим: портрет уменьшен до 42vw / 11rem на телефоне и 14rem на desktop — деталь над названием, а не постер.

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
