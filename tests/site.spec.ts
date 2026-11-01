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
          if (el.closest('.visually-hidden')) continue;
          const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
          if (hasText && el.getBoundingClientRect().width && parseFloat(getComputedStyle(el).fontSize) < 14) out.small.push(el.tagName);
        }
        for (const el of document.querySelectorAll('a, button')) {
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
  const button = page.locator('[data-about-toggle]').first();
  const panel = page.locator('#about-arsenynn');
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
