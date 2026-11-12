import assert from 'node:assert/strict';
import {mkdir, readFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {chromium} from 'playwright';
import {ffmpeg, probe, contrast, compositeFilter} from './media.mjs';

const output = resolve(process.argv[2] ?? 'out/party-protocol');
const site = 'https://partyprotocol.arsenynn.quest/';
const bot = 'https://t.me/partyproto_bot';
for (const dir of ['captures', 'alpha', 'qa']) await mkdir(join(output, dir), {recursive: true});
const path = (name, dir = 'captures') => join(output, dir, name);
const png = async name => 'data:image/png;base64,' + (await readFile(path(name))).toString('base64');
const font = (await readFile(new URL('../public/manrope.woff2', import.meta.url))).toString('base64');
const cyrillic = (await readFile(new URL('../../node_modules/@fontsource-variable/manrope/files/manrope-cyrillic-wght-normal.woff2', import.meta.url))).toString('base64');

const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport: {width: 390, height: 730}, deviceScaleFactor: 2});
  await page.goto(site, {waitUntil: 'domcontentloaded', timeout: 20000});
  const telegram = page.getByRole('button', {name: 'Войти через Telegram', exact: true});
  await telegram.waitFor({timeout: 15000});
  const heading = page.getByText('Вход в кабинет', {exact: true});
  await heading.waitFor();
  await page.screenshot({path: path('website.png'), animations: 'disabled'});
  await page.goto(bot, {waitUntil: 'domcontentloaded', timeout: 20000});
  const card = page.locator('.tgme_page');
  await card.waitFor();
  assert.match(await card.innerText(), /partyproto_bot/i);
  const avatar = card.locator('.tgme_page_photo_image');
  if (await avatar.count()) {
    await avatar.evaluate(img => Promise.race([
      img.decode().catch(() => {}),
      new Promise(resolve => setTimeout(resolve, 3500)),
    ]));
  }
  await card.screenshot({path: path('telegram-public.png'), animations: 'disabled'});
  await page.setViewportSize({width: 540, height: 960});
  const website = await png('website.png');
  const botCard = await png('telegram-public.png');
  const logo = (await readFile(new URL('../../public/logos/party-protocol.svg', import.meta.url))).toString('base64');
  const brand = `<header><img src="data:image/svg+xml;base64,${logo}"><span>Party Protocol</span></header>`;
  const steps = [
    ['site', `${brand}<div class="title">Личный кабинет</div><img class="site" src="${website}"><div class="address">partyprotocol.arsenynn.quest</div>`],
    ['site-detail', `${brand}<div class="title">Два способа входа</div><section><em>01</em><b>Через Telegram</b><p>Для действующей подписки</p></section><section><em>02</em><b>По email</b><p>Ссылка для входа на почту</p></section><div class="address">partyprotocol.arsenynn.quest</div>`],
    ['bot', `${brand}<div class="title">Начать в Telegram</div><img class="bot" src="${botCard}"><div class="address">@partyproto_bot</div>`],
    ['bot-detail', `${brand}<div class="title">Схема подключения</div><section><em>01</em><b>Выбрать тариф</b><p>В меню Telegram-бота</p></section><section><em>02</em><b>Открыть профиль</b><p>Когда доступ активирован</p></section><section><em>03</em><b>Открыть в Incy</b><p>Добавить профиль в приложение</p></section><div class="address">@partyproto_bot</div>`],
  ];
  for (const [id, content] of steps) {
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>
      @font-face{font-family:Manrope;src:url(data:font/woff2;base64,${font});font-weight:200 800}
      @font-face{font-family:Manrope;src:url(data:font/woff2;base64,${cyrillic});font-weight:200 800;unicode-range:U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}
      *{box-sizing:border-box}body{margin:0;color:#f6faf7;font-family:Manrope,sans-serif}
      main{position:absolute;left:40px;right:40px;top:46%;transform:translateY(-50%);display:grid;gap:10px}
      header,.title,section,.address{background:#101a15}header{justify-self:start;display:flex;align-items:center;gap:10px;padding:8px 14px;font-size:16px;font-weight:800;border-left:3px solid #95f6ae}
      header img{width:27px}.title{font-weight:800;font-size:36px;letter-spacing:-.045em;padding:9px 15px 12px}
      img.site{width:320px;max-height:580px;object-fit:contain;background:#0f1412;justify-self:center;border:1px solid #4e6c58}
      img.bot{width:360px;max-height:385px;object-fit:contain;background:#fff;justify-self:center;border-radius:5px}
      section{padding:13px 18px;border-top:2px solid #95f6ae;position:relative}
      em{color:#95f6ae;font-size:15px;font-style:normal;position:absolute;right:19px;top:17px}
      b{font-size:26px}p{font-size:17px;margin:3px 0;color:#c0cfc3}
      .address{justify-self:start;padding:7px 13px;font-size:19px;font-weight:750;color:#95f6ae}
    </style><main>${content}</main>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({path: path(id + '.png'), omitBackground: true});
  }
} finally {
  await browser.close();
}

for (const [id, a, b] of [['Website', 'site', 'site-detail'], ['Bot', 'bot', 'bot-detail']]) {
  const file = path(`PartyProtocol-${id}-1080x1920-30fps-alpha.mov`, 'alpha');
  const layer = (index, fadeIn, fadeOut) => `[${index}:v]format=rgba,fade=t=in:st=${fadeIn}:d=0.25:alpha=1,fade=t=out:st=${fadeOut}:d=0.25:alpha=1[layer${index}]`;
  const filters = [
    layer(1, 0, 3.0), layer(2, 3.25, 7.6),
    "[0:v][layer1]overlay=x='-94*max(0,1-t/0.38)+90*min(1,max(0,(t-3)/0.25))':format=rgb:alpha=straight[first]",
    "[first][layer2]overlay=x='112*max(0,1-(t-3.25)/0.42)':format=rgb:alpha=straight,format=yuva444p10le[out]",
  ];
  ffmpeg(['-y', '-filter_complex_threads', '2', '-f', 'lavfi', '-i', 'color=c=black@0.0:s=1080x1920:r=30:d=8,format=rgba',
    ...[a,b].flatMap(name => ['-loop', '1', '-framerate', '30', '-i', path(name + '.png')]),
    '-filter_complex', filters.join(';'), '-map', '[out]', '-frames:v', '240',
    '-c:v', 'prores_ks', '-profile:v', '4', '-bits_per_mb', '640', '-threads', '3', '-pix_fmt', 'yuva444p10le', file]);
  const info = probe(file);
  assert.equal(info.profile, '4444');
  assert.equal(Number(info.nb_frames), 240);
  assert.equal(info.width, 1080);
  assert.equal(info.height, 1920);
  assert.equal(info.avg_frame_rate, '30/1');
  assert.match(info.pix_fmt, /^yuva/);
  for (const [index, time] of [1.4, 5.0].entries()) {
    const pixels = ffmpeg(['-ss', String(time), '-i', file, '-frames:v', '1', '-vf', 'alphaextract,format=gray',
      '-f', 'rawvideo', '-'], {maxBuffer: 1080 * 1920 + 1024});
    assert.ok(pixels.includes(0) && pixels.includes(255));
    ffmpeg(['-y', '-f', 'lavfi', '-i', contrast(1080, 1920, 30, 0.2), '-ss', String(time), '-i', file,
      '-filter_complex', '[1:v]setpts=PTS-STARTPTS[layer];' + compositeFilter.replace('[1:v]', '[layer]') + ';[v]scale=405:720[qa]',
      '-map', '[qa]', '-frames:v', '1', path(`${id}-${index + 1}.png`, 'qa')]);
  }
  console.log(file, info.duration, info.pix_fmt);
}
