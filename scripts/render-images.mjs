// Генерирует public/og.png и public/apple-touch-icon.png через Playwright.
// Запуск: node scripts/render-images.mjs (нужен установленный playwright).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Playwright берётся из окружения (глобально или NODE_PATH), в зависимости проекта не входит.
const { chromium } = require('playwright');

import { readFileSync } from 'node:fs';

const font = `-apple-system, 'Helvetica Neue', Arial, sans-serif`;
const wordmark = 'data:image/svg+xml;base64,' + readFileSync('public/logos/arsenynn.svg').toString('base64');
const portrait = 'data:image/webp;base64,' + readFileSync('public/portrait.webp').toString('base64');
// Шрифты сайта для OG image: Source Serif 4 (кириллица) и Manrope (латиница).
const fontFace = (family, file) =>
  `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${readFileSync(file).toString('base64')}) format('woff2');font-weight:100 900}`;
const fonts = `<style>${fontFace('OGSerif', 'node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-cyrillic-wght-normal.woff2')}${fontFace('OGSans', 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')}</style>`;
const og = `<html><head>${fonts}</head><body style="margin:0;width:1200px;height:630px;background:#0a0a0a;color:#f2f2f0;font-family:${font};display:flex;flex-direction:column;justify-content:flex-end;padding:80px;box-sizing:border-box;position:relative">
<img src="${portrait}" style="position:absolute;right:-20px;top:15px;width:600px;height:600px;-webkit-mask-image:radial-gradient(closest-side,#000 55%,transparent 100%)">
<img src="${wordmark}" style="width:560px;display:block;position:relative;z-index:1">
<div style="font-size:36px;color:#f2f2f0;margin-top:28px;font-family:OGSerif,Georgia,serif;position:relative;z-index:1">семь параллельных вещей одного автора</div>
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
