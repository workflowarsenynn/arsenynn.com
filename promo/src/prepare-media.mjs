import assert from 'node:assert/strict';
import {copyFile, mkdir, readFile, writeFile} from 'node:fs/promises';
import {ffmpeg, probe} from './media.mjs';

const root = new URL('../', import.meta.url);
const site = new URL('../dist/', root);
const output = new URL('public/showcase/', root);
const radioOrigin = 'https://radio.arsenynn.quest';
const workflowOrigin = 'https://workflowarsenynn.github.io';
const load = async url => JSON.parse(await readFile(url, 'utf8'));
const snapshot = await load(new URL('public/capture.json', root));
await mkdir(output, {recursive: true});

function local(path) {
  assert.match(path, /^\/(media|thumbs)\//);
  return new URL(path.slice(1), site);
}

async function image(id, source) {
  const file = `showcase/${id}.webp`;
  await copyFile(local(source), new URL('public/' + file, root));
  return file;
}

function video(id, source, offset) {
  const input = source.startsWith('/') ? local(source).pathname : source;
  if (input.startsWith('https:')) {
    const url = new URL(input);
    assert.ok((url.origin === radioOrigin && /^\/visual\/[a-f0-9]{64}\.mp4$/.test(url.pathname))
      || (url.origin === workflowOrigin && url.pathname.startsWith('/arsenynn-media/')));
  }
  const file = `showcase/${id}.mp4`;
  const path = new URL('public/' + file, root).pathname;
  ffmpeg(['-y', ...(input.startsWith('https:') ? ['-rw_timeout', '12000000'] : []),
    '-ss', String(offset), '-i', input, '-t', '4.2', '-an', '-map', '0:v:0',
    '-vf', 'fps=30,scale=900:1024:force_original_aspect_ratio=decrease:force_divisible_by=2',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path]);
  const info = probe(path);
  assert.ok(Number(info.nb_frames) > 18, `No playable excerpt: ${source}`);
  return {file, width: info.width, height: info.height, frames: Number(info.nb_frames), source, offset};
}

const bis = await load(new URL('stream/bessmislennost.json', site));
const bisVideos = [4305, 4106, 3955, 3937, 3807, 3702, 4117, 3946].map((id, index) => {
  const post = bis.find(item => item.post === id && item.kind === 'video');
  return {...video('bis-' + id, post.src, [0.7, 3, 1.5, 0.2, 2, 4, 0.3, 1][index]),
    id, title: post.text?.split('\n')[0], url: post.url};
});
const bisImages = [];
for (const id of [4281, 4187, 3864, 2992, 2794, 2767, 2757, 2463]) {
  const post = bis.find(item => item.post === id && item.kind === 'image');
  bisImages.push({file: await image('bis-' + id, post.src), id, width: post.w, height: post.h,
    title: post.text?.split('\n')[0], source: post.src, url: post.url});
}
const workflow = await load(new URL('stream/workflow.json', site));
const workflowPosters = [];
for (const post of workflow) {
  workflowPosters.push({file: await image('workflow-poster-' + post.post, post.poster),
    id: post.post, title: post.text, source: post.poster});
}
const workflowVideos = [189, 194, 150, 143, 170, 119].map((id, index) => {
  const post = workflow.find(item => item.post === id);
  return {...video('workflow-' + id, post.src, [11, 10, 8, 13, 6, 7][index]), id, title: post.text, url: post.url};
});

const response = await fetch(radioOrigin + '/playlist', {signal: AbortSignal.timeout(12000)});
assert.ok(response.ok, 'Radio catalog unavailable');
const radio = await response.json();
assert.ok(radio.gifs.length > 0 && radio.tracks.length > 0);
const radioVideos = [124, 267, 302, 417, 442, 389].map(id => {
  const item = radio.gifs.find(gif => gif.id === id);
  return {...video('radio-' + id, radioOrigin + item.url, 0.25), id,
    title: item.source?.title, credit: item.source?.project, url: item.source?.url};
});
const cover = (project, suffix) => {
  const shot = snapshot.catalog[project].find(item => item.file.endsWith(suffix + '.png'));
  assert.ok(shot, `Missing actual site capture for ${project}; run npm run capture`);
  return shot;
};
const manifest = {
  siteTree: snapshot.siteTree,
  radioCatalog: radioOrigin + '/playlist',
  'bessmyslennost': {
    cover: cover('bessmyslennost', '-index'), player: cover('bessmyslennost', '-post'),
    videos: bisVideos, images: bisImages,
    counts: {total: bis.length, video: bis.filter(item => item.kind === 'video').length,
      image: bis.filter(item => item.kind === 'image').length},
  },
  workflow: {cover: cover('workflow', '-index'), player: cover('workflow', '-screen'),
    videos: workflowVideos, images: workflowPosters, counts: {total: workflow.length}},
  'without-streaming': {
    cover: cover('without-streaming', '-index'), player: cover('without-streaming', '-radio'),
    videos: radioVideos, images: [], counts: {video: radio.gifs.length, audio: radio.tracks.length},
  },
};
await copyFile(new URL('../node_modules/@fontsource-variable/manrope/files/manrope-cyrillic-wght-normal.woff2', root),
  new URL('manrope-cyrillic.woff2', output));
await writeFile(new URL('public/media-showcase.json', root), JSON.stringify(manifest, null, 2));
console.log('Prepared 20 motion excerpts, 19 stills and project captures');
