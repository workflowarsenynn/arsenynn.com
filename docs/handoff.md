# Handoff
LastUpdated: 2026-11-05 16:30 MSK

Передача проекта следующему агенту. Прочитай целиком перед первой правкой. Дальше: `CLAUDE.md` → `AGENTS.md` → `docs/implementation_plan.md` → `docs/architecture.md` → `docs/decisions_log.md` (последние записи сверху).

## 1. Что это и где

- Сайт: **https://arsenynn.com** (живой), английская версия **https://arsenynn.com/en/**.
- Репозиторий: `workflowarsenynn/arsenynn.com` (публичный), ветка разработки `claude/adoring-meitner-l33yf3`, прод — `main`.
- Хостинг: GitHub Pages через Actions (`.github/workflows/deploy.yml`). DNS в Cloudflare, все записи **DNS only** (прокси Cloudflare в РФ режет ответы, это проверено). Сертификат GitHub выпущен, Enforce HTTPS включён владельцем.
- Владелец общается по-русски, присылает скриншоты с iPhone и Mac, хочет видеть каждое изменение сразу на проде и иметь возможность отката.

## 2. Как работать (рабочий цикл, обязательно)

Шаги ниже написаны для облачной сессии. В локальной сессии на Mac: отдельный worktree от `origin/main`, Chromium ставит `npx playwright install chromium`, `PW_CHROMIUM` не нужен, PR и ветки через `gh`. Подробности в разделе 7. Merge в `main` публикует сайт, поэтому нужно подтверждение владельца.

1. Правки в ветке `claude/adoring-meitner-l33yf3` (перед началом `git fetch origin && git merge origin/main`).
2. `npm run build` (включает `astro check`, должен быть «0 errors, 0 warnings»).
3. Тесты: `npx astro preview --port 4321 &` затем `PW_CHROMIUM=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome npx playwright test` (сейчас 47 тестов). Останавливать preview: `pkill -f "astro.mjs previe[w]"` — скобки нужны, иначе pkill убьёт собственную команду.
4. Визуальная проверка в Playwright на 390 и 1280/1440 px, отправить скриншоты владельцу.
5. Обновить доки (`docs/decisions_log.md` запись сверху, `architecture.md`, при необходимости `implementation_plan.md`, `LastUpdated`).
6. Commit → push → PR в `main` через GitHub MCP → **дождаться зелёного workflow `Test`** на PR → merge.
7. Проверить живой сайт (`curl` по маркеру из нового HTML, обычно 30–70 с после merge).
8. Создать точку отката: ветка `rollback/phase-N` от `main` через `mcp__github__create_branch` (git-теги прокси сессии не пропускает). Последняя: `rollback/phase-29`.
9. Сообщить владельцу «опубликовано» только после проверки живого сайта. Он это проверяет.

Откат: revert merge-коммита фазы отдельным PR (так уже откатывали светлую тему) или PR из нужной `rollback/phase-N`. Историю в `decisions_log.md` не удалять, а помечать `Status: reverted`.

## 3. Текущее состояние сайта

**Hero (по центру):** маленький портрет-логотип хаба (`public/portrait.webp`, вертикальный кроп, чёрный поднят до фона #0a0a0a, WebP без потерь), под ним красный wordmark `@arsenynn` (SVG), строка «Финальная битва между самоценным и рациональным». Header: переключатель EN/RU и Portfolio (хаб).

**Индекс (порядок задан владельцем полем `order`):**

| № | Проект | Знак/лого | Ссылки и раскрывашки |
|---|---|---|---|
| 01 | Party Protocol | маска | Telegram (главная), Website, About |
| 02 | annFlow | логотип вместо названия | «Читать» (главная, `/annflow/`), Telegram, «Проекты» (7 серий, ведут на страницы сайта), About |
| 03 | Without Streaming | Ws | Listen, Telegram, About |
| 04 | @arsenynn | NN; **название красное** (`accent`) | Telegram, «Часть I», «Часть II» («Вступление» с текстом, главы с кадрами открываются в плеере), About |
| 05 | workflow@arsenynn | WW/NN | Telegram, «Проекты» (11 работ с кадрами, открываются в плеере), About. **Portfolio убрана владельцем** |
| 06 | Бессмысленность и скоротечность | ann в кепке, круг | Telegram (группа), About |
| 07 | Travel Log | — | Coming soon |
| — | Work / Collaboration | — | Portfolio (хаб), IT / AI, Sales / Events, Video production — **«скоро», без ссылки** |

- Сигнальный огонёк у номера: ● пост за 7 дней, ○ за 45 дней, иначе пусто. Только индикатор, на порядок не влияет. Сайт пересобирается каждые 6 часов (cron в `deploy.yml`).
- Только тёмная тема. Светлую делали и **отменили по решению владельца**, не возвращать без запроса.
- Favicon: красные NN (`public/favicon.svg`, штрих утолщён для 16 px) и `public/favicon.ico`. При смене иконки поднимать `?v=` в `Base.astro`, иначе браузер покажет кэш.
- Превью в Telegram: site_name `arsenynn.com`, title `@arsenynn`, description — слоган; OG-картинка `public/og.png` рендерится `scripts/render-images.mjs`. Meta description для Google — содержательный список проектов.

## 4. Где что лежит

- `src/content/projects.yaml` — **все проекты, тексты RU/EN, ссылки, знаки, части, главы, оглавления**. Схема zod в `src/content.config.ts` (сборка падает на ошибке: http вместо https, нет перевода и т. п.).
- `src/content/annflow/` — мир annFlow: `notes/<id>.md` (заметки), `media/` (картинки), `channel.json` (серии, состав заметок, заголовки, видео, файлы). Импорт новых постов: `node scripts/telegram/import-channel.mjs` (заметки не перезаписывает, `--force` пересоздаёт всё и сотрёт ручные правки). Страницы: `src/pages/annflow/`, данные: `src/lib/annflow.ts`.
- `src/data/site.ts` — hero, header, Work, footer, SEO/OG тексты, английские поля `site.en`.
- `src/lib/i18n.ts` — служебные подписи RU/EN. `src/lib/activity.ts` — даты постов для огоньков.
- `src/components/` — `HomePage`, `Hero`, `ProjectSection` (сетка строки, знаки), `ProjectActions` (ссылки, части, главы, оглавления, вступление), `Collaboration`, `ActionLink`.
- `src/styles/tokens.css` — все токены (цвета, размеры, `--mark-size`, `--index-width`). `global.css` — строки действий `.action--row`, раскрывашки `.disclosure`.
- `src/scripts/about.ts` — все раскрывашки с `data-about-toggle` + `aria-controls`. `src/scripts/player.ts` и `src/components/VideoPlayer.astro` — плеер глав, адреса провайдера в `site.video`.
- `public/logos/`, `public/thumbs/` (кадры глав и работ 288×162), `public/portrait.webp`.
- `assets/logos/README.md` — инвентарь исходников и что где используется. Оригиналы владельца — Google Drive `assest/logos.zip` (см. ниже, как скачать).
- `docs/Advisory/deep_research_and_implementation_direction.md` — направление развития (The Moving Index). Владелец просит «делать по advisory».
- `docs/references/youtube-arsenynn-map.txt` — соответствие постов @arsenynn и видео YouTube.
- `tests/site.spec.ts` — 47 тестов (ширины 320–1440, ссылки, раскрывашки, ленивые кадры, иконки, плеер, без JS, reduced motion, 404, axe, EN, порядок, оглавления, вступление, Work).

## 5. Открытые задачи

1. **Without Streaming: видео/анимация радио.** Владелец пришлёт файл. Согласованное ограничение: не увеличивать блок. Предложены варианты: беззвучная зацикленная анимация на месте знака Ws либо узкая полоса 16:9 под описанием; `muted playsinline`, poster, при `prefers-reduced-motion` — статичный кадр, не грузить до видимости. По умолчанию — вариант 1.
2. **Telegram-бот для огоньков** «Бессмысленности» (группа) и Without Streaming (у них нет публичной ленты). Код готов (`scripts/telegram/activity.mjs`, workflow `telegram-activity.yml`, раз в час, без токена ничего не делает). Ждёт от владельца: бот в @BotFather (не ann), админ в @without_streaming и @bessmislennost, секрет `TELEGRAM_BOT_TOKEN`.
3. **Кадры для глав 0.2 и 1.0** @arsenynn: на YouTube их нет, сейчас заглушка с номером. Нужны видео или кадры от владельца.
4. **Проверить переводы EN**, сделанные агентом (слоганы, About «Бессмысленности», Without Streaming, @arsenynn, annFlow, названия `titleEn` в оглавлении annFlow). Это оценка владельца: явных ошибок агент не нашёл, голос текста может судить только он.
5. **Домен `arsenynn.quest` истекает 2026-11-15** (Porkbun, на нём Listen и Website Party Protocol). По whois на 2026-11-04 не продлён, сами поддомены отвечают 200. Владелец обещал продлить — напомнить и проверить. Голый `https://arsenynn.quest` не отвечает, сайт на него не ссылается.
6. **Внутренние страницы:** annFlow сделан (`/annflow/`). 6 видео и аудио ждут файлов от владельца, список в `implementation_plan.md`. Файлы с Drive владельца скачиваются обычной ссылкой `drive.usercontent.google.com/download?id=<id>&export=download&confirm=t`, коннектор отдаёт base64 и для видео не годится. Следующий мир выбирает владелец, advisory советует `/arsenynn/`.
7. Ветка `docs/sync-live-status` (с Mac владельца) не смержена: один коммит, 66 коммитов позади `main`. Из нового в ней только запись журнала «Сайт в проде, документы отстали от факта», остальное устарело (Enforce HTTPS уже включён). Не трогать без владельца.
8. Todoist из облачной сессии недоступен, из локальной работает `td`. Intake 2026-11-04 чистый, подзадач нет. Запись статуса только по запросу владельца.
9. Шрифты первого экрана 125 KB при бюджете advisory 120 KB. Остальной бюджет выполнен, замер в `decisions_log.md` от 2026-11-04.

## 6. Решения владельца, которые нельзя ломать

- Главы @arsenynn и работы workflow открывают YouTube внутри сайта, в `<dialog>`, не на новой странице. Под кадром всегда видна ссылка на Telegram.
- Reflection и I Left It There — хиты, название красным (`accent` у главы или работы). Номер и время разведены по краям строки.
- Ссылки всегда видны без раскрытия About. Одна ссылка на строку, строки 56 px на всю ширину (для большого пальца). Без вложенных раскрывашек, **кроме** «Вступления» внутри частей (прямая просьба владельца).
- На desktop индекс по центру (`--index-width` 54rem), без правой колонки: раскрытые списки в ней были неудобны.
- Знаки выравниваются по площади (`--mark-size` / √пропорции); фото-знак ann — круг, `scale: 1.2`; annFlow-лого не трогать.
- Кадры обложек: если в Telegram нет или плохой — брать с YouTube (`i.ytimg.com/vi/<id>/{maxresdefault,sd1,sd2,sd3}.jpg`, выбирать по яркости/контрасту/цвету/резкости, как уже сделано).
- Только тёмная тема; красный — акцент текста #e5322d (контраст 4.55), графика #d9322b.
- Шрифты: Source Serif 4 (заголовки, длинное чтение) + Manrope (интерфейс), self-hosted.
- Скриншоты с именами людей и матом в заметках annFlow оставлены решением владельца, не цензурировать.
- Тексты от владельца вставлять дословно; служебные хвосты Telegram («|», «t.me/arsenynn 🎶») убирать.

## 7. Подводные камни этой среды

- Node в деплое и тестах закреплена в `.node-version`: при `node-version: 22` разные раннеры брали разные 22.x из кэша, и 22.23.3 ронял сборку (случай PR 36). Если Astro потребует версию новее, обновить этот файл.

- **Картинки, вставленные в сообщение,** до сессии файлом часто не доходят (кроме тех, что сохранились в `…/images/`). Файлы через «@» доходят в `/root/.claude/uploads/…`. Путь на Mac/iCloud недоступен.
- **Google Drive по ссылке-шаре:** большие файлы качать напрямую `curl -L "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t"`, а не через MCP (base64). Находить ID через `mcp__Google_Drive__search_files` с `parentId`.
- **Telegram:** `t.me/s/<канал>` и `t.me/<канал>/<n>?embed=1&mode=tme` дают тексты, даты, обложки; видеофайлы почти никогда. Ответы иногда урезаны — повторять. Тексты приводить к Unicode NFC (была разложенная «й»).
- **YouTube:** список видео канала — парсить `ytInitialData` → `lockupViewModel` со страницы `@arsenynn/videos`. Работы workflow на отдельном канале `@workflow.arsenynn`.
- Astro scoped CSS не действует на элементы дочернего компонента — использовать `:global()`.
- YAML: строки с «: » брать в кавычки (иначе станут объектом); при генерации через Python — `json.dumps(..., ensure_ascii=False)` и лямбда в `re.sub`.
- Тёмные картинки на тёмном фоне — WebP **без потерь** и чёрный поднять до #0a0a0a, иначе кольца на маске.
- Push от `GITHUB_TOKEN` не запускает другие workflow; деплой из бота вызывается `gh workflow run deploy.yml`.
- Foreground `sleep` блокируется — ждать CI через Bash с `run_in_background: true`.
- DNS, видимость репозитория, настройки Pages — только с подтверждения владельца (у облачной сессии к ним нет доступа).
- **Worktree внутри `.claude/`:** `npm run build` падает с `Tsconfig not found astro/tsconfigs/strict` из-за скрытого каталога в пути. Собирать и тестировать на копии вне `.claude/` (`rsync` без `node_modules`, `.git`, `dist`).
- **Astro 7 preview** в агентной среде уходит в фон и держит один сервер. Playwright пишет `Process from config.webServer exited early`, при повторном запуске подключается к нему. Проверить, откуда работает сервер: `npx astro preview status`, остановить: `npx astro preview stop`. Сервер отдаёт `dist/` того каталога, где запущен.
- **Закрытые панели:** `grid-template-rows: 0fr` не убирает содержимое из раскладки, lazy-картинки считаются видимыми. Поэтому на `.disclosure__inner` стоит `content-visibility: hidden`, не убирать.
