// Генерирует public/og.png, public/apple-touch-icon.png и public/favicon.ico через Playwright.
// Запуск: node scripts/render-images.mjs (нужен установленный playwright).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Playwright берётся из окружения (глобально или NODE_PATH), в зависимости проекта не входит.
const { chromium } = require('playwright');

import { readFileSync, writeFileSync } from 'node:fs';

const font = `-apple-system, 'Helvetica Neue', Arial, sans-serif`;
const wordmark = 'data:image/svg+xml;base64,' + readFileSync('public/logos/arsenynn.svg').toString('base64');
const portrait = 'data:image/webp;base64,' + readFileSync('public/portrait.webp').toString('base64');
// Шрифты сайта для OG image: Source Serif 4 (кириллица) и Manrope (латиница).
const fontFace = (family, file) =>
  `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${readFileSync(file).toString('base64')}) format('woff2');font-weight:100 900}`;
const fonts = `<style>${fontFace('OGSerif', 'node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-cyrillic-wght-normal.woff2')}${fontFace('OGSans', 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')}</style>`;
const og = `<html><head>${fonts}</head><body style="margin:0;width:1200px;height:630px;background:#0a0a0a;color:#f2f2f0;font-family:${font};display:flex;flex-direction:column;justify-content:flex-end;padding:80px;box-sizing:border-box;position:relative">
<img src="${portrait}" style="position:absolute;right:40px;top:0;width:525px;height:630px;-webkit-mask-image:radial-gradient(ellipse 85% 80% at 72% 38%,#000 45%,transparent 100%)">
<img src="${wordmark}" style="width:560px;display:block;position:relative;z-index:1">
<div style="font-size:34px;line-height:1.25;max-width:560px;text-wrap:balance;color:#f2f2f0;margin-top:28px;font-family:OGSerif,Georgia,serif;position:relative;z-index:1">Финальная битва между самоценным и рациональным</div>
</body></html>`;
const nnIcon = 'data:image/svg+xml;base64,' + readFileSync('public/favicon.svg').toString('base64');
const icon = `<html><body style="margin:0;width:180px;height:180px;background:#0a0a0a;display:flex;align-items:center;justify-content:center"><img src="${nnIcon}" style="width:150px;height:150px"></body></html>`;

const browser = await chromium.launch();
for (const [html, w, h, out] of [[og, 1200, 630, 'public/og.png'], [icon, 180, 180, 'public/apple-touch-icon.png']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html);
  await page.screenshot({ path: out });
  await page.close();
}

// favicon.ico: тот же знак NN на прозрачном фоне, PNG внутри контейнера ICO.
const sizes = [16, 32, 48];
const pngs = [];
for (const size of sizes) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<html><body style="margin:0;background:transparent"><img src="${nnIcon}" style="display:block;width:${size}px;height:${size}px"></body></html>`);
  pngs.push(await page.screenshot({ omitBackground: true }));
  await page.close();
}
await browser.close();

const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((size, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0);
  entry.writeUInt8(size, 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngs[i].length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return entry;
});
writeFileSync('public/favicon.ico', Buffer.concat([header, ...entries, ...pngs]));
