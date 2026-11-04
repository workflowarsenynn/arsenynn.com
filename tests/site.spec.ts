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
          if (el.closest('dialog:not([open])')) continue;
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
    await expect(link).toHaveAttribute('href', /^https:\/\//);
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

test('кадры закрытых панелей не грузятся, пока панель не открыта', async ({ page }) => {
  const thumbs: string[] = [];
  page.on('request', (r) => { if (r.url().includes('/thumbs/')) thumbs.push(r.url()); });
  await page.goto('/', { waitUntil: 'networkidle' });
  expect(thumbs).toEqual([]);
  await page.locator('#annflow [aria-controls="contents-annflow"]').click();
  await expect.poll(() => thumbs.length).toBeGreaterThan(0);
});

test('annFlow: кнопка «Проекты» раскрывает оглавление с обложками и ссылками на посты', async ({ page }) => {
  await page.goto('/');
  const button = page.locator('#annflow [aria-controls="contents-annflow"]');
  const panel = page.locator('#contents-annflow');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
  await button.click();
  await expect(panel).toBeVisible();
  const links = panel.locator('a');
  await expect(links).toHaveCount(7);
  for (const link of await links.all()) await expect(link).toHaveAttribute('href', /^https:\/\/t\.me\/annsflow\/\d+$/);
  await expect(panel.locator('.chapter__frame img')).toHaveCount(7);
});

test('workflow: без Portfolio, «Проекты» раскрывают 11 работ с кадрами', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#workflow a[href*="portfolio.arsenynn.com"]')).toHaveCount(0);
  await page.locator('#workflow [aria-controls="contents-workflow"]').click();
  const links = page.locator('#contents-workflow a');
  await expect(links).toHaveCount(11);
  for (const link of await links.all()) await expect(link).toHaveAttribute('href', /^https:\/\/t\.me\/ww_arsenynn\/\d+$/);
  await expect(page.locator('#contents-workflow .chapter__frame img')).toHaveCount(11);
  // всего два оглавления: annFlow и workflow
  await expect(page.locator('[id^="contents-"]')).toHaveCount(2);
});

test('@arsenynn: части раскрываются главами с кадрами, ссылки на Telegram и строка YouTube', async ({ page }) => {
  await page.goto('/');
  for (const [id, count] of [['part-arsenynn-1', 18], ['part-arsenynn-2', 9]] as const) {
    const button = page.locator(`[aria-controls="${id}"]`);
    const panel = page.locator(`#${id}`);
    await expect(panel).toBeHidden();
    await button.click();
    await expect(panel).toBeVisible();
    const chapters = panel.locator('a.chapter');
    await expect(chapters).toHaveCount(count);
    for (const link of await chapters.all()) await expect(link).toHaveAttribute('href', /^https:\/\/t\.me\/arsenynn\/\d+$/);
    await expect(panel.locator('a[href^="https://www.youtube.com/@arsenynn"]')).toHaveCount(1);
  }
  // кадры загружаются: у первой части 16 кадров (0.2 и 1.0 без YouTube — заглушка с номером)
  await expect(page.locator('#part-arsenynn-1 .chapter__frame img')).toHaveCount(16);
});

test('@arsenynn: «Вступление» раскрывает текст введения внутри части', async ({ page }) => {
  await page.goto('/');
  await page.locator('[aria-controls="part-arsenynn-1"]').click();
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
  const titles = page.locator('#contents-annflow .contents__title');
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

test.describe('плеер глав', () => {
  const firstChapter = '#part-arsenynn-1 [data-video="Ko0993YuBsU"]';

  test.beforeEach(async ({ page }) => {
    await page.route(/youtube-nocookie\.com/, (route) => route.fulfill({ contentType: 'text/html', body: '<title>stub</title>' }));
  });

  test('до нажатия нет запросов к YouTube, нажатие открывает кадр на этой же странице', async ({ page }) => {
    const calls: string[] = [];
    page.on('request', (r) => { if (/youtube/.test(r.url())) calls.push(r.url()); });
    await page.goto('/', { waitUntil: 'networkidle' });
    expect(calls).toEqual([]);

    await page.locator('[aria-controls="part-arsenynn-1"]').click();
    await page.locator(firstChapter).click();
    const player = page.locator('[data-player]');
    await expect(player).toBeVisible();
    await expect(player.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/Ko0993YuBsU\?/);
    await expect(player.locator('h2')).toHaveText('Hello to the future');
    await expect(player.locator('[data-player-telegram]')).toHaveAttribute('href', 'https://t.me/arsenynn/6');
    expect(page.url()).not.toContain('youtube');
    expect(page.context().pages()).toHaveLength(1);
  });

  test('«Дальше» пропускает главы без видео, закрытие убирает iframe и возвращает фокус', async ({ page }) => {
    await page.goto('/');
    await page.locator('[aria-controls="part-arsenynn-1"]').click();
    const link = page.locator(firstChapter);
    await link.click();
    const player = page.locator('[data-player]');
    await expect(player.locator('[data-player-prev]')).toBeDisabled();
    await player.locator('[data-player-next]').click();
    await expect(player.locator('h2')).toHaveText('Come here');
    await page.keyboard.press('Escape');
    await expect(player).toBeHidden();
    await expect(player.locator('iframe')).toHaveCount(0);
    await expect(link).toBeFocused();
  });

  test('главы без YouTube остаются ссылками на Telegram', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#part-arsenynn-1 a[href="https://t.me/arsenynn/7"]')).not.toHaveAttribute('data-video');
  });

  test('axe: открытый плеер без serious и critical нарушений', async ({ page }) => {
    await page.goto('/');
    await page.locator('[aria-controls="part-arsenynn-1"]').click();
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
      await page.locator('[aria-controls="part-arsenynn-1"]').click();
      await page.locator(firstChapter).click();
      const box = (await page.locator('[data-player-frame]').boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y + box.height).toBeLessThanOrEqual(height);
      expect(Math.abs(box.width / box.height - 16 / 9)).toBeLessThan(0.02);
    });
  }
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
