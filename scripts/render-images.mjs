// Генерирует public/og.png и public/apple-touch-icon.png через Playwright.
// Запуск: node scripts/render-images.mjs (нужен установленный playwright).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Playwright берётся из окружения (глобально или NODE_PATH), в зависимости проекта не входит.
const { chromium } = require('playwright');

const font = `-apple-system, 'Helvetica Neue', Arial, sans-serif`;
const og = `<html><body style="margin:0;width:1200px;height:630px;background:#0a0a0a;color:#f2f2f0;font-family:${font};display:flex;flex-direction:column;justify-content:flex-end;padding:80px;box-sizing:border-box">
<div style="font-size:120px;font-weight:600;letter-spacing:-4px;line-height:1">@arsenynn</div>
<div style="font-size:36px;color:#9a9a96;margin-top:28px">projects / channels / things</div>
<div style="width:18px;height:18px;border-radius:50%;background:#e5322d;margin-top:40px"></div>
</body></html>`;
const icon = `<html><body style="margin:0;width:180px;height:180px;background:#0a0a0a;color:#f2f2f0;font-family:${font};display:flex;align-items:center;justify-content:center;position:relative">
<div style="font-size:110px;font-weight:600;line-height:1;margin-top:-10px">@</div>
<div style="position:absolute;top:30px;right:30px;width:22px;height:22px;border-radius:50%;background:#e5322d"></div>
</body></html>`;

const browser = await chromium.launch();
for (const [html, w, h, out] of [[og, 1200, 630, 'public/og.png'], [icon, 180, 180, 'public/apple-touch-icon.png']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html);
  await page.screenshot({ path: out });
  await page.close();
}
await browser.close();
