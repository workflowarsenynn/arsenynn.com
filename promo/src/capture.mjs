import assert from 'node:assert/strict';
import {execFileSync, spawn} from 'node:child_process';
import {copyFile, mkdir, readFile, writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {parse} from 'yaml';

const source = new URL('../../', import.meta.url);
const output = new URL('../public/', import.meta.url);
const port = 4617;
const origin = `http://127.0.0.1:${port}`;
const projects = parse(await readFile(new URL('src/content/projects.yaml', source), 'utf8'))
  .sort((a, b) => a.order - b.order).map(({slug, order}) => ({slug, order}));
assert.equal(projects.length, 7);
assert.equal(new Set(projects.map(({order}) => order)).size, 7);
await mkdir(output, {recursive: true});
const revision = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: source, encoding: 'utf8'}).trim();
const siteTree = execFileSync('git', ['rev-parse', 'HEAD:src', 'HEAD:public'], {cwd: source, encoding: 'utf8'}).trim();
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', 'dist'], {cwd: source, stdio: 'inherit', detached: true});
let browser;
try {
  for (let attempt = 0; ; attempt++) {
    if (server.exitCode !== null) throw Error('Astro preview exited');
    try { if ((await fetch(origin)).ok) break; } catch {}
    if (attempt === 60) throw Error('Astro preview did not start');
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  browser = await chromium.launch({executablePath: process.env.PW_CHROMIUM});
  const viewport = {width: 390, height: 694};
  const page = await browser.newPage({viewport, deviceScaleFactor: 2.75, colorScheme: 'dark', reducedMotion: 'reduce'});
  await page.addInitScript(() => {
    const NativeObserver = window.IntersectionObserver;
    window.IntersectionObserver = class extends NativeObserver {
      observe(element) {
        if (!element.matches('[data-stream-stage]')) super.observe(element);
      }
    };
  });
  await page.route('**/*', route => route.request().url().startsWith(origin + '/') ? route.continue() : route.abort());
  await page.goto(origin, {waitUntil: 'networkidle'});
  const manifest = await page.evaluate(async ({projects, viewport}) => {
    const list = document.querySelector('.project-list');
    const hero = document.querySelector('.hero__logo');
    const images = [...document.querySelectorAll('main img')];
    for (const img of images) img.loading = 'eager';
    await Promise.all(images.filter(img => img.getClientRects().length).map(img => img.decode()));
    await document.fonts.ready;
    if (!document.fonts.check('17px "Manrope Variable"') ||
        !document.fonts.check('24px "Source Serif 4 Variable"')) throw Error('Site fonts unavailable');
    for (const {slug, order} of projects) {
      const article = document.getElementById(slug);
      if (article?.parentElement !== list) throw Error(`Missing section ${slug}`);
      article.querySelector('.project__index').textContent = String(order).padStart(2, '0');
      list.append(article);
    }
    const box = el => {
      const {x, y, width, height} = el.getBoundingClientRect();
      return {x, y: y + scrollY, width, height};
    };
    return {
      ...viewport,
      wordmark: box(hero),
      heightFull: document.documentElement.scrollHeight,
      projects: projects.map(p => ({...p, ...box(document.getElementById(p.slug))})),
      domain: new URL(document.querySelector('link[rel=canonical]').href).hostname,
    };
  }, {projects, viewport});
  assert.equal(manifest.domain, 'arsenynn.com');
  const screenshot = async (name, options = {}) => {
    const url = new URL(name, output);
    await writeFile(url, await page.screenshot({animations: 'disabled', ...options}));
  };
  await screenshot('site.png', {fullPage: true});
  await page.locator('.hero__logo').evaluate(el => {el.style.visibility = 'hidden';});
  await screenshot('hero-clean.png');
  await page.locator('.hero__logo').evaluate(el => {el.style.visibility = '';});
  await page.addStyleTag({content: 'body * { -webkit-text-fill-color: transparent !important; text-shadow: none !important; }'});
  await screenshot('site-no-text.png', {fullPage: true});
  for (const file of ['arsenynn.svg', 'nn.svg']) {
    await copyFile(new URL('public/logos/' + file, source), new URL(file, output));
  }
  const font = new URL('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2', source);
  await copyFile(font, new URL('manrope.woff2', output));
  await writeFile(new URL('capture.json', output), JSON.stringify({...manifest, revision, siteTree}, null, 2));
  console.log('Captured', projects.map(p => p.slug).join(' → '), 'from', revision);
} finally {
  await browser?.close();
  try { process.kill(-server.pid, 'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
}
