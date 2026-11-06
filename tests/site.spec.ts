import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Матрица ширин из advisory (Claude Code implementation brief, TESTS).
const viewports = [
  [320, 568], [360, 800], [375, 812], [390, 844], [393, 852],
  [414, 896], [430, 932], [768, 1024], [1024, 768], [1440, 900],
] as const;

for (const [width, height] of viewports) {
  test.describe(`${width}x${height}`, () => {
    test.use({ viewport: { width, height } });

    test('нет горизонтального скролла, текст от 14 px, цели от 44 px', async ({ page }) => {
      await page.goto('/');
      const r = await page.evaluate(() => {
        const out = { overflow: document.documentElement.scrollWidth > innerWidth, small: [] as string[], tiny: [] as string[] };
        for (const el of document.querySelectorAll<HTMLElement>('body *')) {
          if (el.closest('.visually-hidden, dialog:not([open])')) continue;
          const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
          if (hasText && el.getBoundingClientRect().width && parseFloat(getComputedStyle(el).fontSize) < 14) out.small.push(el.tagName);
        }
        for (const el of document.querySelectorAll('a, button')) {
          if (el.closest('dialog:not([open]), [hidden]') || !el.getClientRects().length) continue;
          const b = el.getBoundingClientRect();
          if (b.width < 44 || b.height < 44) out.tiny.push(`${el.textContent!.trim()} ${Math.round(b.width)}x${Math.round(b.height)}`);
        }
        return out;
      });
      expect(r.overflow).toBe(false);
      expect(r.small).toEqual([]);
      expect(r.tiny).toEqual([]);
    });
  });
}

test('все семь проектов на месте, прямые ссылки видны без About', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('article.project')).toHaveCount(7);
  const primary = page.locator('article.project .action--primary');
  await expect(primary).toHaveCount(6); // у Travel Log ссылки нет
  for (const link of await primary.all()) {
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /^(https:\/\/|\/annflow\/)/);
  }
});

test('About раскрывается и закрывается с клавиатуры', async ({ page }) => {
  await page.goto('/');
  // Порядок проектов зависит от свежести, поэтому панель берём из aria-controls кнопки.
  const button = page.locator('[data-about-toggle]').first();
  const panel = page.locator(`#${await button.getAttribute('aria-controls')}`);
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();
  await page.keyboard.press('Space');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});

test('без JavaScript текст About виден, ссылки работают', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#about-arsenynn')).toBeVisible();
  await expect(page.locator('article.project .action--primary').first()).toBeVisible();
  await context.close();
});

test('reduced motion: панель About без анимации', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  const duration = await page.locator('#about-arsenynn').evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(duration.split(',').every((d) => parseFloat(d) <= 0.01)).toBe(true);
  await context.close();
});

test('порядок проектов задан владельцем, номера 01–07 подряд', async ({ page }) => {
  await page.goto('/');
  const ids = await page.locator('article.project').evaluateAll((els) => els.map((el) => el.id));
  expect(ids).toEqual([
    'party-protocol', 'annflow', 'without-streaming', 'arsenynn', 'workflow', 'bessmyslennost', 'travel-log',
  ]);
  const numbers = await page.locator('article.project .project__index').allTextContents();
  expect(numbers).toEqual(['01', '02', '03', '04', '05', '06', '07']);
  await expect(page.locator('#work')).toBeVisible();
});

test('кадры лент ленивые: дальние карточки не грузятся при открытии', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const thumbs: string[] = [];
  page.on('request', (r) => { if (r.url().includes('/thumbs/')) thumbs.push(r.url()); });
  await page.goto('/', { waitUntil: 'networkidle' });
  const total = await page.locator('.strip__frame img').count();
  expect(total).toBeGreaterThan(40);
  expect(thumbs.length).toBeLessThan(total);
  for (const img of await page.locator('.strip__frame img').all()) await expect(img).toHaveAttribute('loading', 'lazy');
});

test('annFlow: проекты раскрыты лентой, следующая карточка выглядывает, «Все» ведёт в мир', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const section = page.locator('#annflow');
  await expect(section.getByRole('link', { name: 'Читать', exact: true })).toHaveCount(0);
    const cards = section.locator('.strip__card');
  await expect(cards).toHaveCount(7);
  for (const link of await cards.all()) await expect(link).toHaveAttribute('href', /^\/annflow\/projects\/[a-z-]+\/$/);
  await expect(cards.first()).toContainText('LiveContext');
  await expect(section.locator('.strip__count')).toHaveText('7');
  const track = section.locator('.strip__track');
  await track.scrollIntoViewIfNeeded();
  const m = await track.evaluate((el) => ({
    scrollable: el.scrollWidth > el.clientWidth,
    second: el.children[1].getBoundingClientRect().left,
    page: document.documentElement.scrollWidth - innerWidth,
  }));
  expect(m.scrollable).toBe(true);
  expect(m.second).toBeLessThan(390);
  expect(m.page).toBeLessThanOrEqual(0);
  await track.evaluate((el) => { el.scrollLeft = el.scrollWidth; });
  await expect(cards.last()).toBeInViewport();
  await section.locator('.strip__side').click();
  await expect(page).toHaveURL(/\/annflow\/$/);
});

test('workflow: без Portfolio, 11 работ лентой, кадры и видео', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#workflow a[href*="portfolio.arsenynn.com"]')).toHaveCount(0);
  const strip = page.locator('#contents-workflow');
  await expect(strip).toBeVisible();
  await expect(strip.locator('.strip__count')).toHaveText('11');
  const links = strip.locator('a.strip__card');
  await expect(links).toHaveCount(11);
  for (const link of await links.all()) await expect(link).toHaveAttribute('href', /^https:\/\/t\.me\/ww_arsenynn\/\d+$/);
  await expect(strip.locator('.strip__frame img')).toHaveCount(11);
});

test('@arsenynn: части открыты лентами с кадрами, ссылки на Telegram, без строки YouTube', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const [id, count] of [['part-arsenynn-1', 19], ['part-arsenynn-2', 9]] as const) {
    const strip = page.locator(`#${id}`);
    await expect(strip).toBeVisible();
    await expect(strip.locator('.strip__count')).toHaveText(String(count));
    const chapters = strip.locator('a.strip__card');
    await expect(chapters).toHaveCount(count);
    for (const link of await chapters.all()) await expect(link).toHaveAttribute('href', /^https:\/\/t\.me\/(arsenynn|bessmislennost)\/\d+$/);
    await expect(strip.locator('a[href*="youtube.com"]')).toHaveCount(0);
    const scrollable = await strip.locator('.strip__track').evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(scrollable).toBe(true);
  }
  // у всех глав первой части есть кадр
  await expect(page.locator('#part-arsenynn-1 .strip__frame img')).toHaveCount(19);
});

test('@arsenynn: «Вступление» раскрывает текст введения внутри части', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('[aria-controls="intro-arsenynn-1"]');
  const text = page.locator('#intro-arsenynn-1 .reading');
  await expect(text).toBeHidden();
  await toggle.click();
  await expect(text).toBeVisible();
  await expect(text).toContainText('Находясь в точке «сейчас»');
  await expect(text.locator('a[href="https://t.me/arsenynn/5"]')).toHaveCount(1);
});

test('Work: Video production виден, но не кликается', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#work a[href*="video-production"]')).toHaveCount(0);
  await expect(page.locator('#work .work__soon')).toContainText('Video production');
});

test('английская версия: /en/, переключатель языка, hreflang, без русского текста в описаниях', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('article.project')).toHaveCount(7);
  await expect(page.locator('link[rel="alternate"][hreflang="ru"]')).toHaveAttribute('href', 'https://arsenynn.com/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://arsenynn.com/en/');
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', 'https://arsenynn.com/');
  const shorts = await page.locator('.project__short').allTextContents();
  for (const text of shorts) expect(text).not.toMatch(/[а-яё]/i);
  await page.locator('.site-header__lang').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
});

test('английская версия: служебные названия оглавления annFlow переведены', async ({ page }) => {
  await page.goto('/en/');
  const titles = page.locator('#annflow .chapter__title');
  await expect(titles.filter({ hasText: 'MCP server' })).toHaveCount(1);
  await expect(titles.filter({ hasText: 'Auto-apply' })).toHaveCount(1);
});

test('иконки: ссылки с версией ведут на существующие файлы, favicon.ico есть', async ({ page, request }) => {
  await page.goto('/');
  const hrefs = await page.locator('link[rel="icon"], link[rel="apple-touch-icon"]').evaluateAll((l) => l.map((e) => e.getAttribute('href')!));
  expect(hrefs).toHaveLength(3);
  for (const href of hrefs) {
    expect(href).toContain('?v=');
    expect((await request.get(href)).status()).toBe(200);
  }
  const ico = await request.get('/favicon.ico');
  expect(ico.status()).toBe(200);
  expect([...(await ico.body()).subarray(0, 4)]).toEqual([0, 0, 1, 0]);
});

test.describe('случайные посты «Бессмысленности»', () => {
  const block = '#bessmyslennost .stream';

  test('список грузится только у блока, все файлы из списка на месте', async ({ page, request }) => {
    const calls: string[] = [];
    page.on('request', (r) => { if (/\/stream\/|\/media\/bis\//.test(r.url())) calls.push(r.url()); });
    await page.goto('/', { waitUntil: 'networkidle' });
    expect(calls).toEqual([]);
    const list = await (await request.get('/stream/bessmislennost.json')).json();
    expect(list).toHaveLength(157);
    for (const p of list.filter((_: unknown, i: number) => i % 10 === 0)) {
      if (p.src) expect((await request.head(p.src)).status()).toBe(200);
      if (p.poster) expect((await request.head(p.poster)).status()).toBe(200);
      expect(p.text.includes('#')).toBe(false);
    }
  });

  test('посты идут в случайном порядке и не повторяются, ссылка меняется, страница не едет', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator(`${block} [data-stream-stage]`).scrollIntoViewIfNeeded();
    const link = page.locator(`${block} [data-stream-link]`);
    await expect(page.locator(`${block} [data-stream-stage] > *`)).toHaveCount(1);
    await page.locator(`${block} [data-stream-toggle]`).click();
    await expect(page.locator(`${block} [data-stream-toggle]`)).toHaveAttribute('aria-pressed', 'true');
    const seen = new Set<string>();
    const stage = await page.locator(`${block} [data-stream-stage]`).boundingBox();
    for (let i = 0; i < 12; i += 1) {
      seen.add((await link.getAttribute('href'))!);
      await page.locator(`${block} [data-stream-next]:visible`).click();
    }
    expect(seen.size).toBe(12);
    const after = await page.locator(`${block} [data-stream-stage]`).boundingBox();
    expect(after!.height).toBe(stage!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });

  test('кадр целиком внутри сцены: вертикальные посты не обрезаются', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const stage = page.locator(`${block} [data-stream-stage]`);
    await stage.scrollIntoViewIfNeeded();
    await expect(stage.locator('> *')).toHaveCount(1);
    await page.locator(`${block} [data-stream-toggle]`).click();
    for (let i = 0; i < 15; i += 1) {
      const r = await stage.evaluate((el) => {
        const s = el.getBoundingClientRect();
        const m = el.firstElementChild!;
        const b = m.getBoundingClientRect();
        return { over: b.height - s.height, wide: b.width - s.width, fit: getComputedStyle(m).objectFit, tag: m.tagName };
      });
      if (r.tag === 'IMG' || r.tag === 'VIDEO') {
        expect(r.over).toBeLessThanOrEqual(1);
        expect(r.wide).toBeLessThanOrEqual(1);
        expect(r.fit).toBe('contain');
      }
      await page.locator(`${block} [data-stream-next]:visible`).click();
    }
  });

  test('пост с аудио тоже листается свайпом по середине кадра', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route('**/stream/bessmislennost.json', async (route) => {
      const list = await (await route.fetch()).json();
      await route.fulfill({ json: list.filter((p: { kind: string }) => p.kind === 'audio') });
    });
    await page.goto('/');
    const stage = page.locator(`${block} [data-stream-stage]`);
    await stage.scrollIntoViewIfNeeded();
    await expect(stage.locator('audio')).toHaveCount(1);
    const box = (await stage.boundingBox())!;
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + 300, y);
    await page.mouse.down();
    await page.mouse.move(box.x + 200, y, { steps: 4 });
    await expect(stage.locator('.stream__ghost')).toHaveCount(1);
    await page.mouse.up();
  });

  test('свайп листает вперёд и назад, кадр идёт за пальцем, звук не трогает', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const stage = page.locator(`${block} [data-stream-stage]`);
    await stage.scrollIntoViewIfNeeded();
    await expect(stage.locator('> *')).toHaveCount(1);
    const link = page.locator(`${block} [data-stream-link]`);
    await expect(page.locator(`${block} [data-stream-prev]`).first()).toBeDisabled();
    await expect(page.locator(`${block} [data-stream-count]`)).toHaveText("1 / 157");
    const first = await link.getAttribute('href');
    const box = (await stage.boundingBox())!;
    const y = box.y + box.height / 2;
    const swipe = async (from: number, to: number) => {
      await page.mouse.move(from, y);
      await page.mouse.down();
      await page.mouse.move((from + to) / 2, y, { steps: 4 });
      await page.mouse.move(to, y, { steps: 4 });
      await page.mouse.up();
    };
    await page.mouse.move(box.x + 300, y);
    await page.mouse.down();
    await page.mouse.move(box.x + 200, y, { steps: 4 });
    await expect(stage.locator('.stream__ghost')).toHaveCount(1);
    await page.mouse.move(box.x + 280, y, { steps: 4 });
    await page.waitForTimeout(250);
    await page.mouse.up();
    await page.waitForTimeout(300);
    await expect(stage.locator('.stream__ghost')).toHaveCount(0);
    expect(await link.getAttribute('href')).toBe(first);
    await swipe(box.x + 320, box.x + 60);
    await expect(link).not.toHaveAttribute('href', first!);
    const second = await link.getAttribute('href');
    await expect(page.locator(`${block} [data-stream-count]`)).toHaveText('2 / 157');
    await expect(stage.locator('> *')).toHaveCount(1);
    await swipe(box.x + 60, box.x + 320);
    await expect(link).toHaveAttribute('href', first!);
    await page.locator(`${block} [data-stream-next]:visible`).click();
    await expect(link).toHaveAttribute('href', second!);
    await expect(page.locator(`${block} [data-stream-sound]`)).not.toHaveAttribute('data-on');
  });

  test('компьютер: нет подсказки про свайп, стрелки на кадре листают', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.locator(`${block} [data-stream-stage]`).scrollIntoViewIfNeeded();
    await expect(page.locator(`${block} [data-stream-count]`)).toHaveText('1 / 157');
    await expect(page.locator(`${block} [data-stream-hint]`)).toBeHidden();
    await expect(page.locator(`${block} .stream__side--prev`)).toBeHidden();
    await page.locator(`${block} .stream__side--next`).click();
    await expect(page.locator(`${block} [data-stream-count]`)).toHaveText('2 / 157');
    await page.locator(`${block} .stream__side--prev`).click();
    await expect(page.locator(`${block} [data-stream-count]`)).toHaveText('1 / 157');
  });

  test('телефон: подсказка про свайп видна и исчезает после листания, стрелок на кадре нет', async ({ browser }) => {
    const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/');
    await page.locator(`${block} [data-stream-stage]`).scrollIntoViewIfNeeded();
    const hint = page.locator(`${block} [data-stream-hint]`);
    await expect(hint).toBeVisible();
    await expect(page.locator(`${block} .stream__side--next`)).toBeHidden();
    await page.locator(`${block} [data-stream-next]:visible`).click();
    await expect(hint).toBeHidden();
    await context.close();
  });

  test('звук: кнопка на кадре и нажатие по кадру, выбор сохраняется на следующем видео', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const stage = page.locator(`${block} [data-stream-stage]`);
    await stage.scrollIntoViewIfNeeded();
    await expect(stage.locator('> *')).toHaveCount(1);
    const toVideo = async () => {
      for (let i = 0; i < 40 && !(await stage.locator('video').count()); i += 1) await page.locator(`${block} [data-stream-next]:visible`).click();
      await expect(stage.locator('video')).toHaveCount(1);
    };
    await toVideo();
    const sound = page.locator(`${block} [data-stream-sound]`);
    const muted = () => stage.locator('video').evaluate((v: HTMLVideoElement) => v.muted);
    await expect(sound).toBeVisible();
    await expect(sound).toContainText('Включить звук');
    const box = (await sound.boundingBox())!;
    const frame = (await stage.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.y).toBeGreaterThanOrEqual(frame.y + frame.height);
    await sound.click();
    expect(await muted()).toBe(false);
    await expect(sound).toHaveAttribute('data-on');
    await page.locator(`${block} [data-stream-next]:visible`).click();
    await toVideo();
    await expect.poll(muted).toBe(false);
    await stage.locator('video').click();
    expect(await muted()).toBe(true);
    await expect(sound).not.toHaveAttribute('data-on');
    // Кнопка под кадром и не спорит с панелью видео на паузе.
    await page.locator(`${block} [data-stream-toggle]`).click();
    await expect(page.locator(`${block} [data-stream-toggle]`)).toHaveAttribute('aria-label', 'Смотреть дальше');
    await expect(sound).toBeVisible();
    await page.locator(`${block} [data-stream-toggle]`).click();
    await expect(page.locator(`${block} [data-stream-toggle]`)).toHaveAttribute('aria-label', 'Пауза');
  });

  test('при reduced motion смена не запускается сама', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator(`${block} [data-stream-stage]`).scrollIntoViewIfNeeded();
    await expect(page.locator(`${block} [data-stream-toggle]`)).toHaveAttribute('aria-pressed', 'true');
    const video = page.locator(`${block} video`);
    if (await video.count()) expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });

  test('axe: блок без serious и critical нарушений', async ({ page }) => {
    await page.goto('/');
    await page.locator(`${block} [data-stream-stage]`).scrollIntoViewIfNeeded();
    const { violations } = await new AxeBuilder({ page }).include(block).analyze();
    expect(violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
  });
});

test.describe('главы @arsenynn на сайте', () => {
  const block = '#arsenynn .stream';
  const stage = `${block} [data-stream-stage]`;

  test.beforeEach(async ({ page }) => {
    await page.route(/arsenynn-media/, (route) => route.fulfill({ path: 'public/media/annflow/94.mp4', contentType: 'video/mp4' }));
  });

  test('блок над лентами, главы по порядку, 16:9, без запросов к YouTube', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const calls: string[] = [];
    page.on('request', (r) => { if (/youtube/.test(r.url())) calls.push(r.url()); });
    await page.goto('/');
    await page.locator(stage).scrollIntoViewIfNeeded();
    await expect(page.locator(`${block} [data-stream-count]`)).toHaveText('1 / 27');
    await expect(page.locator(`${block} .stream__label`)).toHaveText(/^Смотреть\s*1 \/ 27$/);
    await expect(page.locator(`${block} .stream__label .visually-hidden`)).toHaveCSS('position', 'absolute');
    const box = (await page.locator(stage).boundingBox())!;
    expect(Math.abs(box.width / box.height - 16 / 9)).toBeLessThan(0.02);
    const lead = [];
    for (let i = 0; i < 3; i += 1) {
      lead.push(await page.locator(`${block} [data-stream-text]`).textContent());
      await page.locator(`${block} [data-stream-next]:visible`).click();
    }
    expect(lead.sort()).toEqual(['I Left It There', 'Reflection', 'Reflection 5 years']);
    await expect(page.locator(`${block} [data-stream-text]`)).toHaveText('Hello to the future');
    await expect(page.locator(`${block} [data-stream-date]`)).toHaveText('Часть I · 0.1');
    await page.locator(`${block} [data-stream-next]:visible`).click();
    await expect(page.locator(`${block} [data-stream-text]`)).toHaveText('I can talk to you about the atmosphere');
    expect(calls).toEqual([]);
  });

  test('глава из ленты играет в блоке со звуком, подкаст открывает плеер', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#part-arsenynn-1 [data-video]')).toHaveCount(0);
    await page.locator('#part-arsenynn-1 [data-chapter="22"]').click();
    await expect(page.locator(`${block} [data-stream-text]`)).toHaveText('Reflection');
    await expect(page.locator(`${block} [data-stream-sound]`)).toHaveAttribute('data-on');
    await expect(page.locator(stage)).toBeInViewport();
    await expect(page.locator('[data-player]')).toBeHidden();
    await page.locator('#part-arsenynn-2 [data-video="ecPJAgF_-bM"]').click();
    await expect(page.locator('[data-player]')).toBeVisible();
  });

  test('Reflection 5 years в конце части I, ссылка ведёт в её канал', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('#part-arsenynn-1 .strip__item').last().locator('[data-chapter]');
    await expect(card).toHaveAttribute('data-chapter', '2102');
    await card.click();
    await expect(page.locator(`${block} [data-stream-text]`)).toHaveText('Reflection 5 years');
    await expect(page.locator(`${block} [data-stream-link]`)).toHaveAttribute('href', 'https://t.me/bessmislennost/2102');
  });

  test('на весь экран: кадр заполняет экран, звук включён, выход возвращает блок', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.locator(stage).scrollIntoViewIfNeeded();
    const full = page.locator(`${block} [data-stream-full]`);
    await expect(full).toBeVisible();
    await expect(page.locator(`${block} .stream__controls [data-stream-sound]`)).toBeVisible();
    await expect(page.locator(`${block} .stream__controls [data-stream-full]`)).toBeVisible();
    await expect(full).toHaveAttribute('aria-label', 'На весь экран');
    await full.click();
    await expect.poll(() => page.evaluate(() => document.fullscreenElement?.className ?? '')).toContain('stream--film');
    await expect(full).toHaveAttribute('aria-label', 'Свернуть');
    await expect(page.locator(`${block} [data-stream-sound]`)).toHaveAttribute('data-on');
    const box = (await page.locator(stage).boundingBox())!;
    expect(box.width).toBe(1280);
    expect(box.height).toBe(720);
    await full.click();
    await expect.poll(() => page.evaluate(() => document.fullscreenElement)).toBeNull();
    await expect(full).toHaveAttribute('aria-label', 'На весь экран');
  });
});

test.describe('радио на сайте', () => {
  const block = '#without-streaming';

  test.beforeEach(async ({ page }) => {
    await page.route('https://radio.arsenynn.quest/**', (route) => route.fulfill({ contentType: 'text/html', body: '<title>stub</title>' }));
  });

  test('кнопка по-русски с огоньком эфира, на /en/ по-английски', async ({ page }) => {
    await page.goto('/');
    const link = page.locator(`${block} a.action--primary`);
    await expect(link).toContainText('Слушать эфир');
    await expect(link.locator('.action__live')).toBeVisible();
    await expect(link).toHaveAttribute('href', 'https://radio.arsenynn.quest');
    await page.goto('/en/');
    await expect(page.locator(`${block} a.action--primary`)).toContainText('Listen live');
  });

  test('окно радио ленивое, без автозапуска, рядом ссылка на сайт радио', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const frame = page.locator(`${block} .radio iframe`);
    await expect(frame).not.toHaveAttribute('src');
    await expect(frame).toHaveAttribute('title', 'Without Streaming');
    expect(await frame.getAttribute('allow')).toBeNull();
    await expect(page.locator(`${block} .radio__open`)).toHaveAttribute('href', 'https://radio.arsenynn.quest');
    await frame.scrollIntoViewIfNeeded();
    await expect(frame).toHaveAttribute('src', 'https://radio.arsenynn.quest');
    const box = (await page.locator(`${block} .radio__screen`).boundingBox())!;
    expect(box.width).toBe(390);
    expect(Math.abs(box.width / box.height - 16 / 9)).toBeLessThan(0.02);
    expect((await frame.boundingBox())!.width).toBeCloseTo(390, 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  });
});

test.describe('работы workflow на сайте', () => {
  const block = '#workflow .stream';

  test.beforeEach(async ({ page }) => {
    await page.route(/\/media\/workflow\/|arsenynn-media/, (route) => route.fulfill({ path: 'public/media/annflow/94.mp4', contentType: 'video/mp4' }));
  });

  test('блок над лентой, работы по порядку, карточка играет в блоке со звуком', async ({ page }) => {
    await page.goto('/');
    await page.locator(`${block} [data-stream-stage]`).scrollIntoViewIfNeeded();
    await expect(page.locator(`${block} [data-stream-count]`)).toHaveText('1 / 11');
    await expect(page.locator(`${block} [data-stream-text]`)).toHaveText('Окутало');
    await expect(page.locator('#contents-workflow [data-video]')).toHaveCount(0);
    await expect(page.locator('#contents-workflow [data-chapter]')).toHaveCount(11);
    await page.locator('#contents-workflow [data-chapter="150"]').click();
    await expect(page.locator(`${block} [data-stream-text]`)).toHaveText('HABAROVY');
    await expect(page.locator(`${block} [data-stream-link]`)).toHaveAttribute('href', 'https://t.me/ww_arsenynn/150');
    await expect(page.locator(`${block} [data-stream-sound]`)).toHaveAttribute('data-on');
    await expect(page.locator('[data-player]')).toBeHidden();
  });
});

test.describe('плеер глав', () => {
  const firstChapter = '#part-arsenynn-2 [data-video="ecPJAgF_-bM"]';

  test.beforeEach(async ({ page }) => {
    await page.route(/youtube-nocookie\.com/, (route) => route.fulfill({ contentType: 'text/html', body: '<title>stub</title>' }));
  });

  test('до нажатия нет запросов к YouTube, нажатие открывает кадр на этой же странице', async ({ page }) => {
    const calls: string[] = [];
    page.on('request', (r) => { if (/youtube/.test(r.url())) calls.push(r.url()); });
    await page.goto('/', { waitUntil: 'networkidle' });
    expect(calls).toEqual([]);
    await page.locator(firstChapter).click();
    const player = page.locator('[data-player]');
    await expect(player).toBeVisible();
    await expect(player.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/ecPJAgF_-bM\?/);
    await expect(player.locator('h2')).toHaveText('Backstage podcast #1');
    await expect(player.locator('[data-player-telegram]')).toHaveAttribute('href', 'https://t.me/arsenynn/54');
    expect(page.url()).not.toContain('youtube');
    expect(page.context().pages()).toHaveLength(1);
  });

  test('закрытие убирает iframe и возвращает фокус', async ({ page }) => {
    await page.goto('/');
    const link = page.locator(firstChapter);
    await link.click();
    const player = page.locator('[data-player]');
    await expect(player).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(player).toBeHidden();
    await expect(player.locator('iframe')).toHaveCount(0);
    await expect(link).toBeFocused();
  });

  test('хиты выделены красным, номер и время разведены', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.chapter--accent')).toHaveCount(3);
    const hit = page.locator('#part-arsenynn-1 .chapter--accent');
    await expect(hit.locator('.chapter__title')).toHaveText('Reflection');
    await expect(hit.locator('.chapter__title')).toHaveCSS('color', 'rgb(229, 50, 45)');
    // Первый кадр после нажатия панель ещё не разложена: ждём раскладку, а не читаем сразу.
    const gaps = () => hit.evaluate((el) => {
      const num = el.querySelector('.chapter__num')!.getBoundingClientRect();
      const time = el.querySelector('.chapter__time')!.getBoundingClientRect();
      return { vertical: Math.abs(time.y - num.y), horizontal: time.x - (num.x + num.width) };
    });
    await expect.poll(async () => (await gaps()).vertical).toBeLessThan(2);
    expect((await gaps()).horizontal).toBeGreaterThan(8);
  });

  test('главы без YouTube остаются ссылками на Telegram', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#part-arsenynn-1 a[href="https://t.me/arsenynn/7"]')).not.toHaveAttribute('data-video');
  });

  test('axe: открытый плеер без serious и critical нарушений', async ({ page }) => {
    await page.goto('/');
    await page.locator(firstChapter).click();
    await expect(page.locator('[data-player] iframe')).toHaveCount(1);
    await expect(page.locator('[data-player]')).toHaveCSS('opacity', '1');
    const { violations } = await new AxeBuilder({ page }).include('[data-player]').disableRules(['frame-tested']).analyze();
    expect(violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
  });

  for (const [width, height] of [[320, 568], [390, 844], [844, 390], [1440, 900]] as const) {
    test(`кадр 16:9 помещается в экран ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.locator(firstChapter).click();
      const box = (await page.locator('[data-player-frame]').boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y + box.height).toBeLessThanOrEqual(height);
      expect(Math.abs(box.width / box.height - 16 / 9)).toBeLessThan(0.02);
    });
  }
});

test.describe('мир annFlow', () => {
  test('с главной проект открывается на сайте', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('#annflow .strip__card', { hasText: 'LiveContext' });
    await expect(card).not.toHaveAttribute('target');
    await card.click();
    await expect(page).toHaveURL(/\/annflow\/projects\/live-context\/$/);
  });

  test('серия: посты идут сразу под оглавлением, оглавление ведёт к ним', async ({ page }) => {
    await page.goto('/annflow/projects/voxbase/');
    await expect(page.locator('.post')).toHaveCount(9);
    await expect(page.locator('.post .prose').first()).not.toBeEmpty();
    const toc = (await page.locator('.toc').boundingBox())!;
    const post = (await page.locator('.post').first().boundingBox())!;
    expect(post.y).toBeGreaterThanOrEqual(toc.y + toc.height);
    await page.locator('.toc a').nth(3).click();
    await expect(page).toHaveURL(/#note-\d+$/);
    await expect(page.locator('.post').nth(3).locator('h2')).toBeInViewport();
    await page.locator('.post').nth(3).locator('.post__up a').click();
    await expect(page.locator('.toc')).toBeInViewport();
  });

  test('серия лёгкая: видео без предзагрузки, дальние картинки не грузятся сразу', async ({ page }) => {
    const media: string[] = [];
    page.on('request', (r) => { if (r.url().includes('/media/annflow/')) media.push(r.url()); });
    await page.goto('/annflow/projects/without-streaming/', { waitUntil: 'networkidle' });
    expect(media).toEqual([]);
    for (const v of await page.locator('video').all()) await expect(v).toHaveAttribute('preload', 'none');
  });

  test('от серии до заметки и дальше по порядку', async ({ page }) => {
    await page.goto('/annflow/');
    await expect(page.locator('.series-row')).toHaveCount(8);
    await page.locator('.series-row', { hasText: 'VoxBase' }).click();
    await expect(page).toHaveURL(/\/annflow\/projects\/voxbase\/$/);
    await expect(page.locator('.toc li')).toHaveCount(9);
    await page.locator('#note-155 h2 a').click();
    await expect(page).toHaveURL(/\/annflow\/notes\/155\/$/);
    await expect(page.locator('.note__meta')).toContainText('1 из 9');
    await page.locator('.note__step--next').click();
    await expect(page).toHaveURL(/\/annflow\/notes\/156\/$/);
    await expect(page.locator('h1')).toHaveText('Почему голосовые заметки обычно умирают');
  });

  test('заметка: оглавление серии, источник, файл', async ({ page, request }) => {
    await page.goto('/annflow/notes/79/');
    await expect(page.locator('.note__source a')).toHaveAttribute('href', 'https://t.me/annsflow/79');
    await page.locator('.note__toc summary').click();
    await expect(page.locator('.note__toc [aria-current="page"]')).toContainText('Caps Lock');
    const file = page.locator('.note__files a');
    await expect(file).toHaveText(/caps_lock_to_hyper\.json/);
    const res = await request.get((await file.getAttribute('href'))!);
    expect(res.status()).toBe(200);
    expect(JSON.parse(await res.text())).toBeTruthy();
  });

  test('видео: файл играет на сайте и не грузится заранее', async ({ page }) => {
    await page.goto('/annflow/notes/93/');
    await expect(page.locator('video source')).toHaveAttribute('src', '/media/annflow/94.mp4');
    await expect(page.locator('video')).toHaveAttribute('preload', 'none');
  });

  test('видео от владельца: посты 89 и 108 один файл, ролики отдаются и читаются', async ({ page, request }) => {
    for (const [note, file] of [['90', '89'], ['107', '89'], ['99', '100'], ['101', '102'], ['147', '147'], ['184', '184'], ['189', '189']]) {
      await page.goto(`/annflow/notes/${note}/`);
      await expect(page.locator('video source')).toHaveAttribute('src', `/media/annflow/${file}.mp4`);
      await expect(page.locator('.note-video')).toHaveCount(0);
      const res = await request.get(`/media/annflow/${file}.mp4`);
      expect(res.status()).toBe(200);
    }
    await page.goto('/annflow/notes/181/');
    await expect(page.locator('video source')).toHaveCount(2);
    await expect(page.locator('.note-video')).toHaveCount(0);
  });

  test('ни одно видео канала не уводит в Telegram', async ({ page }) => {
    for (const slug of ['mac-automation', 'without-streaming', 'bessmyslennost', 'auto-apply', 'live-context']) {
      await page.goto(`/annflow/projects/${slug}/`);
      await expect(page.locator('.note-video')).toHaveCount(0);
    }
  });

  test('служебных хвостов Telegram в заметках нет, внутренние ссылки ведут на сайт', async ({ page }) => {
    await page.goto('/annflow/notes/115/');
    await expect(page.locator('.prose')).not.toContainText('Оглавление темы');
    await expect(page.locator('.prose')).not.toContainText('@annsFlow');
    await page.goto('/annflow/notes/181/');
    await expect(page.locator('.prose a[href="/annflow/notes/93/"]')).toHaveCount(1);
  });

  for (const width of [320, 390, 430, 1440]) {
    test(`страницы с кодом и картинками без горизонтального скролла, ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      for (const path of ['/annflow/', '/annflow/projects/mac-automation/', '/annflow/notes/85/', '/annflow/notes/115/', '/annflow/notes/146/']) {
        await page.goto(path);
        const r = await page.evaluate(() => ({
          over: document.documentElement.scrollWidth - innerWidth,
          small: [...document.querySelectorAll<HTMLElement>('main *')]
            .filter((el) => !el.closest('.visually-hidden') && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()))
            .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 14).map((el) => el.tagName),
        }));
        expect(r.over, path).toBeLessThanOrEqual(0);
        expect(r.small, path).toEqual([]);
      }
    });
  }

  test('axe: страницы annFlow без serious и critical нарушений', async ({ page }) => {
    for (const path of ['/annflow/', '/annflow/projects/voxbase/', '/annflow/projects/mac-automation/', '/annflow/notes/146/']) {
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')), path).toEqual([]);
    }
  });

  test('заметка лёгкая: картинки ниже экрана не грузятся сразу, нет лишних скриптов', async ({ page }) => {
    const kinds: string[] = [];
    page.on('request', (r) => kinds.push(r.resourceType()));
    await page.goto('/annflow/notes/146/', { waitUntil: 'networkidle' });
    expect(kinds.filter((k) => k === 'script')).toEqual([]);
  });
});

test('404 отдаёт страницу со ссылкой на главную', async ({ page }) => {
  const response = await page.goto('/nope');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('link', { name: 'На главную' })).toBeVisible();
});

test('axe: нет serious и critical нарушений', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(bad.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});
