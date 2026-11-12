import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';

export async function captureStories(page, origin, output, projects) {
  await mkdir(new URL('stories/', output), {recursive: true});
  await page.setViewportSize({width: 390, height: 540});
  const goto = async path => {
    const response = await page.goto(new URL(path, origin).href, {waitUntil: 'networkidle'});
    assert.ok(response?.ok(), `Cannot capture ${path}`);
    await page.evaluate(async () => {
      await document.fonts.ready;
      if (document.documentElement.scrollWidth > innerWidth) throw Error('Story has horizontal overflow');
    });
  };

  const shot = async (id, target, {margin = 18, height = 540} = {}) => {
    await page.setViewportSize({width: 390, height});
    await target.waitFor({state: 'visible'});
    const y = await target.evaluate(el => el.getBoundingClientRect().top + scrollY);
    await page.evaluate(async top => {
      scrollTo({top, behavior: 'instant'});
      const visible = [...document.images].filter(img => {
        const box = img.getBoundingClientRect();
        return Boolean(img.currentSrc || img.getAttribute('src') || img.getAttribute('srcset')) && box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < innerHeight
          && box.right > 0 && box.left < innerWidth;
      });
      await Promise.all(visible.map(async img => {
        img.loading = 'eager';
        try {
          await img.decode();
        } catch {
          // Lazy picture sources can switch during a viewport change.
          await new Promise(requestAnimationFrame);
          try { await img.decode(); }
          catch (cause) { throw Error(`Cannot decode ${img.currentSrc || img.src}`, {cause}); }
        }
      }));
      await document.fonts.ready;
    }, Math.max(0, y - margin));
    const file = `stories/${id}.png`;
    await page.screenshot({path: new URL(file, output).pathname, animations: 'disabled'});
    return {file, height, path: new URL(page.url()).pathname, anchor: await target.evaluate(el => el.id || el.className)};
  };

  await goto('/');
  const catalog = {};
  for (const {slug} of projects) {
    const article = page.locator(`article[id="${slug}"]`);
    const cover = await shot(`${slug}-index`, article, {height: slug === 'travel-log' ? 374 : 475, margin: 0});
    const scenes = [cover];
    const about = article.locator('[data-about-toggle]').filter({hasText: 'About'});
    const captureAbout = async () => {
      await about.click();
      const description = article.locator('.project-details__inner');
      await description.waitFor({state: 'visible'});
      const height = await description.evaluate(async el => {
        await Promise.allSettled(el.closest('.project-details').getAnimations().map(animation => animation.finished));
        return el.getBoundingClientRect().height;
      });
      scenes.push(await shot(`${slug}-about`, description, {height: Math.max(240, Math.min(540, Math.ceil(height + 72))), margin: 34}));
    };

    if (slug === 'arsenynn') {
      for (const strip of await article.locator('section[id^="part-"]').all()) {
        const id = await strip.getAttribute('id');
        scenes.push(await shot(id, strip, {height: 420}));
        const intro = strip.locator('.strip__intro-toggle');
        if (await intro.count()) {
          const panelId = await intro.getAttribute('aria-controls');
          await intro.click();
          scenes.push(await shot(`${id}-intro`, page.locator(`[id="${panelId}"] .reading`)));
          await intro.click();
        }
      }
      scenes.push(await shot(`${slug}-screen`, article.locator('.stream')));
    } else if (slug === 'workflow') {
      const strip = article.locator('#contents-workflow');
      const track = strip.locator('.strip__track');
      const cards = await track.locator('.strip__item').count();
      for (const [index, position] of [0, Math.floor(cards / 2), cards - 1].entries()) {
        await track.evaluate((el, n) => el.scrollTo({left: el.children[n].offsetLeft - el.children[0].offsetLeft, behavior: 'instant'}), position);
        scenes.push(await shot(`workflow-works-${index + 1}`, strip, {height: 360}));
      }
      scenes.push(await shot('workflow-screen', article.locator('.stream')));
    } else if (slug === 'bessmyslennost') {
      scenes.push(await shot('bessmyslennost-post', article.locator('.stream'), {height: 610}));
    } else if (slug === 'without-streaming') {
      const address = new URL(await article.locator('[data-radio]').getAttribute('data-radio'));
      const radio = await page.context().newPage();
      try {
        await radio.setViewportSize({width: 390, height: 540});
        await radio.route('**/*', route => {
          const request = route.request();
          const url = new URL(request.url());
          return url.origin === address.origin && request.method() === 'GET'
            && request.resourceType() !== 'media' && !/\.(m3u8|m4s|ts|mp3|aac)$/i.test(url.pathname)
            ? route.continue() : route.abort();
        });
        const response = await radio.goto(address.href, {waitUntil: 'load', timeout: 12000});
        assert.ok(response?.ok());
        await radio.locator('main.radio-app').waitFor({state: 'visible', timeout: 5000});
        const file = 'stories/without-streaming-radio.png';
        await radio.screenshot({path: new URL(file, output).pathname, animations: 'disabled'});
        scenes.push({file, height: 540, path: address.href, anchor: 'main.radio-app'});
      } catch (error) {
        console.warn('Live radio landing was unavailable:', error.message);
      } finally {
        await radio.close();
      }
    } else if (slug === 'party-protocol') {
      scenes.push(await shot('party-protocol-trial', article.locator('.project-actions'), {height: 450}));
    }
    if (await about.count()) await captureAbout();
    catalog[slug] = scenes;
  }

  await goto('/annflow/');
  const world = await shot('annflow-world', page.locator('.world__head'), {height: 580, margin: 48});
  const rows = await page.locator('.series-row').evaluateAll(links => links.map(link => ({
    path: link.getAttribute('href'), title: link.querySelector('.series-row__title').textContent.trim(),
  })));
  assert.equal(rows.length, 7);
  const worldShots = [world];
  for (const index of [0, 3, 6]) {
    worldShots.push(await shot(`annflow-world-rows-${index + 1}`, page.locator('.series-row').nth(index), {height: 460, margin: 18}));
  }

  const series = {};
  for (const row of rows) {
    const slug = row.path.split('/').filter(Boolean).at(-1);
    await goto(row.path);
    const title = await shot(`series-${slug}-title`, page.locator('.series__head'), {height: 540, margin: 64});
    const contents = await shot(`series-${slug}-toc`, page.locator('.toc'), {height: 560});
    const notePath = await page.locator('.post').filter({has: page.locator('.prose p')}).first()
      .locator('.post__head h2 a').getAttribute('href');
    assert.ok(notePath.startsWith('/annflow/notes/'));
    await goto(notePath);
    const note = await shot(`series-${slug}-note`, page.locator('.note__head'), {height: 560, margin: 65});
    const excerpt = await shot(`series-${slug}-excerpt`, page.locator('.note .prose p').first(), {height: 535, margin: 2});
    series[slug] = {title: row.title, shots: [title, contents, note, excerpt]};
  }
  catalog.annflow = [catalog.annflow[0], ...worldShots, ...Object.values(series).flatMap(({shots}) => [shots[0], shots[3]])];
  return {catalog, series};
}
