// Импорт канала annFlow в Markdown. Запускается вручную, результат смотрят в Git (advisory:
// Telegram -> черновик -> ревью -> main, без автоматического зеркала).
// Запуск: node scripts/telegram/import-channel.mjs [--force]
// Уже существующие заметки не перезаписываются: их можно править руками. --force пересоздаёт всё.
// Распределение постов по сериям: src/content/annflow/channel.json.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const map = JSON.parse(readFileSync('src/content/annflow/channel.json', 'utf8'));
const force = process.argv.includes('--force');
const notesDir = 'src/content/annflow/notes';
const mediaDir = 'src/content/annflow/media';
mkdirSync(notesDir, { recursive: true });
mkdirSync(mediaDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchRetry(url) {
  for (let i = 0; ; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return res;
    } catch (err) {
      if (i === 3) throw err;
      await sleep(1500);
    }
  }
}

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const escapeMd = (s) => s.replace(/([\\`*_[\]<>])/g, '\\$1');

// Заметки канала и их адреса на сайте: ссылки t.me/annsflow/N ведут на страницы сайта.
const noteOf = new Map();
for (const series of map.series) {
  for (const ids of series.notes) for (const id of ids) noteOf.set(id, ids[0]);
}
const noteUrl = (href) => {
  const m = href.match(new RegExp(`^https?://t\\.me/${map.channel}/(\\d+)`));
  if (m && noteOf.has(+m[1])) return `/annflow/notes/${noteOf.get(+m[1])}/`;
  return href;
};

/** HTML сообщения Telegram в Markdown. */
function toMarkdown(html) {
  let s = html
    // Кастомные эмодзи: внутри обычный символ, обёртки не несут смысла.
    .replace(/<tg-emoji[^>]*>(.*?)<\/tg-emoji>/gs, '$1')
    .replace(/<i class="emoji"[^>]*>(?:<b>)?(.*?)(?:<\/b>)?<\/i>/gs, '$1')
    .replace(/<br\s*\/?>/g, '\n');

  const blocks = [];
  s = s.replace(/<pre[^>]*>(.*?)<\/pre>/gs, (_, code) => {
    blocks.push('\n\n```\n' + decode(code.replace(/<[^>]+>/g, '')).trim() + '\n```\n\n');
    return `\u0000${blocks.length - 1}\u0000`;
  });

  // Текст экранируется, теги превращаются в разметку. Выделение не терпит пробелов и переводов
  // строк у границ, поэтому оборачивается каждая строка отдельно, пробелы остаются снаружи.
  const wrap = (inner, mark) =>
    inner
      .split(/(\n+)/)
      .map((seg) => {
        if (!seg.trim()) return seg;
        const [, lead, core, trail] = seg.match(/^(\s*)(.*?)(\s*)$/s);
        return `${lead}${mark}${core}${mark}${trail}`;
      })
      .join('');
  const MARKS = { b: '**', strong: '**', i: '*', em: '*', s: '~~', del: '~~', code: '`' };
  const frames = [{ tag: null, buf: '' }];
  const top = () => frames[frames.length - 1];
  for (const part of s.split(/(<[^>]+>)/)) {
    if (!part.startsWith('<')) {
      const inCode = frames.some((f) => f.tag === 'code');
      top().buf += inCode ? decode(part) : escapeMd(decode(part));
      continue;
    }
    const close = part.startsWith('</');
    const tag = part.match(/^<\/?([a-z-]+)/i)?.[1]?.toLowerCase();
    if (!(tag in MARKS) && tag !== 'a' && tag !== 'blockquote') continue;
    if (!close) {
      frames.push({ tag, buf: '', href: tag === 'a' ? noteUrl(decode(part.match(/href="([^"]*)"/)?.[1] ?? '')) : undefined });
      continue;
    }
    const frame = frames.pop();
    if (tag === 'a') top().buf += frame.buf.trim() ? `[${frame.buf.trim()}](${frame.href})` : '';
    else if (tag === 'blockquote') top().buf += `\u0001${frame.buf}\u0002`;
    else top().buf += wrap(frame.buf, MARKS[tag]);
  }
  let out = frames[0].buf;

  // В постах выделение иногда начинается посреди слова: расширяем его до границы слова.
  out = out
    .replace(/(\p{L}+)\*\*(?=\p{L})([^*\n]+?)\*\*/gu, '**$1$2**')
    .replace(/\*\*([^*\n]+?\p{L})\*\*(\p{L}+)/gu, '**$1$2**');

  out = out.normalize('NFC').replace(/[ \t]+/g, ' ').replace(/ ?\n ?/g, '\n');
  out = out.replace(/\u0001([\s\S]*?)\u0002/g, (_, q) => '\n\n' + q.trim().split('\n').map((l) => `> ${l}`).join('\n') + '\n\n');

  const paragraphs = out
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const lines = p.split('\n').map((l) => l.trim()).filter(Boolean);
      const bullets = lines.map((l) => l.replace(/^(?:\*\*)?[●•◉▪▫◦–—-]\s+/, (m) => (m.startsWith('**') ? '- **' : '- ')));
      if (lines.length > 1 && bullets.every((l) => l.startsWith('- '))) return bullets.join('\n');
      if (lines.length === 1 && bullets[0].startsWith('- ')) return bullets[0];
      if (lines[0].startsWith('> ')) return lines.join('\n');
      return lines.join('  \n');
    });

  let md = paragraphs.join('\n\n');
  blocks.forEach((b, i) => {
    md = md.replace(`\u0000${i}\u0000`, b);
  });
  return md.replace(/\n{3,}/g, '\n\n').trim();
}

// Служебные хвосты Telegram: на сайте их заменяет оглавление.
const SERVICE = /^(оглавление темы|навигация по проектам( канала)?|annflow|все каналы|все проекты)$/i;
// Призывы из подписей к видео: подпись без ссылки на сайте бессмысленна.
const CALL = /запустить without streaming|live mix/i;
function stripService(md) {
  return md
    .split('\n\n')
    .map((p) =>
      p
        .split('  \n')
        .map((line) => line.replace(/\s*#\S+@annsFlow/gi, ''))
        .filter((line) => {
          const text = line.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();
          return text && !SERVICE.test(text);
        })
        .join('  \n'),
    )
    .filter(Boolean)
    .join('\n\n');
}

function parsePost(html, id) {
  if (html.includes('tgme_widget_message_error')) return null;
  // Внутри текста сообщения нет вложенных div, блок заканчивается первым закрывающим тегом.
  const textMatch = html.match(/<div class="tgme_widget_message_text[^>]*>(.*?)<\/div>/s);
  const date = html.match(/<time[^>]*datetime="([^"]+)"/)?.[1];
  const photos = [...html.matchAll(/tgme_widget_message_photo_wrap[^>]*background-image:url\('([^']+)'\)/g)].map((m) => m[1]);
  const videos = [...html.matchAll(/<a class="tgme_widget_message_video_player[^"]*"[\s\S]*?(?=<a class="tgme_widget_message_video_player|<div class="tgme_widget_message_footer)/g)].map((m) => ({
    poster: m[0].match(/tgme_widget_message_video_thumb[^>]*background-image:url\('([^']+)'\)/)?.[1],
    duration: m[0].match(/message_video_duration[^>]*>([^<]+)/)?.[1],
  }));
  const audio = html.includes('tgme_widget_message_document_icon accent_bg audio')
    ? decode(html.match(/tgme_widget_message_document_title[^>]*>([^<]+)/)?.[1] ?? '').replace(/:$/, '').normalize('NFC')
    : undefined;
  return { id, date, md: textMatch && !audio ? stripService(toMarkdown(textMatch[1])) : '', photos, videos, audio };
}

async function download(url, name) {
  const path = join(mediaDir, name);
  if (!existsSync(path)) writeFileSync(path, Buffer.from(await (await fetchRetry(url)).arrayBuffer()));
  return `../media/${name}`;
}

const yamlString = (s) => JSON.stringify(s);
const report = [];

for (const series of map.series) {
  for (const [index, ids] of series.notes.entries()) {
    const main = ids[0];
    const file = join(notesDir, `${main}.md`);
    if (existsSync(file) && !force) continue;

    const posts = [];
    for (const id of ids) {
      const html = await (await fetchRetry(`https://t.me/${map.channel}/${id}?embed=1&mode=tme`)).text();
      const post = parsePost(html, id);
      if (post) posts.push(post);
      await sleep(200);
    }
    const head = posts[0];
    const lines = head.md.split('\n\n');
    const first = lines[0].split('  \n');
    const plain = (s) => s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_\\~`]/g, '').replace(/\s+/g, ' ').trim();
    const title = map.titles[main] ?? plain(first[0]);
    // Заданный вручную заголовок оставляет первую строку поста в тексте.
    const rest = map.titles[main] ? head.md : [first.slice(1).join('  \n'), ...lines.slice(1)].filter(Boolean).join('\n\n');

    const media = [];
    let body = rest;
    for (const post of posts) {
      const text = post === head ? '' : plain(post.md);
      const caption = text && !CALL.test(text) ? text : undefined;
      let captionUsed = false;
      for (const [i, url] of post.photos.entries()) {
        media.push({ type: 'image', src: await download(url, `${post.id}-${i + 1}.jpg`), caption: captionUsed ? undefined : caption, source: post.id });
        captionUsed = true;
      }
      for (const [i, v] of post.videos.entries()) {
        media.push({ type: 'video', src: v.poster ? await download(v.poster, `${post.id}-video-${i + 1}.jpg`) : undefined, file: map.videos?.[post.id], duration: v.duration, caption: captionUsed ? undefined : caption, source: post.id });
        captionUsed = true;
      }
      if (post.audio) media.push({ type: 'audio', caption: post.audio, source: post.id });
      if (post !== head && post.md && !captionUsed) body += `\n\n${post.md}`;
    }

    const fm = [
      '---',
      `title: ${yamlString(title)}`,
      `series: ${series.slug}`,
      `order: ${index + 1}`,
      `publishedAt: ${head.date}`,
      `source: [${posts.map((p) => p.id).join(', ')}]`,
    ];
    if (map.files[main]) fm.push(`files:\n  - ${yamlString(map.files[main])}`);
    if (media.length) {
      fm.push('media:');
      for (const m of media) {
        fm.push(`  - type: ${m.type}`);
        if (m.src) fm.push(`    src: ${yamlString(m.src)}`);
        if (m.file) fm.push(`    file: ${yamlString(m.file)}`);
        if (m.duration) fm.push(`    duration: ${yamlString(m.duration)}`);
        if (m.caption) fm.push(`    caption: ${yamlString(m.caption)}`);
        fm.push(`    post: ${m.source}`);
      }
    }
    fm.push('---', '', body.trim(), '');
    writeFileSync(file, fm.join('\n'));
    report.push(`${main} ${series.slug} ${title.slice(0, 60)} | ${body.length} зн. | медиа ${media.length}`);
  }
}
console.log(report.join('\n'));
console.log(`Заметок записано: ${report.length}`);
