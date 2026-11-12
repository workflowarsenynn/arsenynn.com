import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {parseArgs} from 'node:util';
import {bundle} from '@remotion/bundler';
import {renderFrames, renderMedia, selectComposition} from '@remotion/renderer';
import {defaults, impactScenes, scenes, settings} from './settings.mjs';
import {compositeFilter, contrast, ffmpeg, probe, rate} from './media.mjs';

const {values: flags} = parseArgs({options: {
  config: {type: 'string'}, scene: {type: 'string'}, source: {type: 'string'},
  png: {type: 'boolean'}, impact: {type: 'boolean'},
}});
const root = new URL('../', import.meta.url);
process.chdir(root.pathname);
const capture = JSON.parse(await readFile('public/capture.json', 'utf8'));
const tree = execFileSync('git', ['rev-parse', 'HEAD:src', 'HEAD:public'], {encoding: 'utf8'}).trim();
assert.equal(capture.siteTree, tree, 'Site changed. Rebuild Astro and run npm run capture.');
const slugs = capture.projects.map(project => project.slug);
const config = flags.config ? JSON.parse(await readFile(flags.config, 'utf8')) : {};
const profile = settings(slugs);
const impactVariants = Object.keys(impactScenes).map(id => [id, {}]);
const variants = flags.scene ? [[flags.scene, {}]] : flags.impact ? impactVariants : [
  ['WordmarkEmergence', {side: 'left'}], ['WordmarkEmergence', {}], ['WordmarkEmergence', {side: 'right'}],
  ['FloatingWebsite', {}], ['EditorialScroll', {background: 'opaque'}],
  ['TypographyBreakout', {}], ...slugs.filter(slug => ['party-protocol', 'annflow', 'arsenynn'].includes(slug))
    .map(project => ['ProjectFocus', {project}]),
  ['FinalWebsiteReveal', {}], ['FinalWebsiteReveal', {tone: 'dark'}], ['FinalWebsiteReveal', {background: 'opaque'}],
  ...impactVariants,
];
if (flags.png && !flags.scene) throw Error('Use --png with a single --scene');
const sourceFps = flags.source ? rate(probe(flags.source).avg_frame_rate) : undefined;
const jobs = variants.map(([id, variant]) => {
  if (!Object.hasOwn(scenes, id)) throw Error(`Unknown scene: ${id}`);
  const props = profile.strict().parse({...defaults(id, slugs), ...variant, ...config,
    ...(sourceFps ? {fps: sourceFps} : {})});
  return {id, props};
});
for (const dir of ['alpha', 'opaque', 'previews', 'stills', 'qa']) await mkdir(`out/${dir}`, {recursive: true});
const serveUrl = await bundle({entryPoint: 'src/index.tsx', publicDir: 'public'});
const collection = flags.scene ?? (flags.impact ? 'impact' : 'kit');
const rows = [];
const verification = [];
for (const {id, props} of jobs) {
  const isImpact = Object.hasOwn(impactScenes, id);
  const alpha = props.background === 'transparent';
  const suffix = id === 'ProjectFocus' ? props.project
    : id === 'FinalWebsiteReveal' ? props.tone : props.side;
  const stem = `${id}-${suffix}-${props.preset}-${props.fps}fps-${props.width}x${props.height}-${props.background}`;
  const file = alpha ? `out/alpha/${stem}.mov` : `out/opaque/${stem}.mp4`;
  const preview = `out/previews/${stem}.mp4`;
  const composition = await selectComposition({serveUrl, id, inputProps: props});
  const duration = composition.durationInFrames / props.fps;
  console.log(`Rendering ${stem} (${composition.durationInFrames} frames)`);
  const common = {composition, serveUrl, inputProps: props, concurrency: 4};
  if (flags.png) {
    const outputDir = `out/alpha/${stem}-png`;
    await mkdir(outputDir, {recursive: true});
    await renderFrames({...common, outputDir, imageFormat: 'png'});
    continue;
  }
  await renderMedia({...common, outputLocation: file, colorSpace: 'bt709', muted: true,
    ...(alpha ? {codec: 'prores', proResProfile: '4444', imageFormat: 'png', pixelFormat: 'yuva444p10le'}
      : {codec: 'h264', crf: 17})});
  const info = probe(file);
  assert.equal(info.width, props.width);
  assert.equal(info.height, props.height);
  assert.ok(Math.abs(rate(info.avg_frame_rate) - props.fps) < 0.001);
  assert.equal(Number(info.nb_frames), composition.durationInFrames);
  assert.ok(Math.abs(Number(info.duration) - duration) < 0.002);
  let alphaRange = null;
  if (alpha) {
    assert.equal(info.codec_name, 'prores');
    assert.equal(info.profile, '4444');
    assert.match(info.pix_fmt, /^yuva444p/);
    const pixels = ffmpeg(['-ss', String(duration * (isImpact ? 0.8 : 0.5)), '-i', file, '-frames:v', '1',
      '-vf', 'alphaextract,format=gray', '-f', 'rawvideo', '-'], {maxBuffer: props.width * props.height + 1024});
    assert.equal(pixels.length, props.width * props.height);
    alphaRange = [pixels.includes(0) ? 0 : 'above zero', pixels.includes(255) ? 255 : 'below full'];
    if (!flags.config && props.opacity === 1 && props.text && props.duration >= 3) assert.deepEqual(alphaRange, [0, 255]);
    await writeFile(`out/qa/${stem}.json`, JSON.stringify({props, info, alphaRange}, null, 2));
    ffmpeg(['-y', '-f', 'lavfi', '-i', contrast(props.width, props.height, props.fps, duration),
      '-i', file, '-filter_complex', compositeFilter + ';[v]scale=540:960:force_original_aspect_ratio=decrease:force_divisible_by=2[preview]',
      '-map', '[preview]', '-c:v', 'libx264', '-crf', '18',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', preview]);
  } else {
    ffmpeg(['-y', '-i', file, '-vf', 'scale=540:960:force_original_aspect_ratio=decrease:force_divisible_by=2',
      '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', preview]);
  }
  const middle = {WordmarkPortal: 0.43, ShutterReveal: 0.54, ProjectOrbit: 0.36, MatchCut: 0.53};
  const keyframes = id === 'EditorialScroll' ? [0.049, 0.32, 0.92]
    : isImpact ? [0.19, middle[id], 0.80] : [0.16, 0.49, 0.81];
  const stills = keyframes.map((at, index) => {
    const path = `out/stills/${stem}-${index + 1}.png`;
    ffmpeg(['-y', '-ss', String(duration * at), '-i', preview, '-frames:v', '1', '-vf',
      'scale=180:320:force_original_aspect_ratio=decrease,pad=180:320:(ow-iw)/2:(oh-ih)/2', path]);
    return path;
  });
  const row = `out/stills/${stem}-strip.png`;
  ffmpeg(['-y', ...stills.flatMap(path => ['-i', path]), '-filter_complex', 'hstack=inputs=3', '-frames:v', '1', row]);
  rows.push(row);
  verification.push({file, preview, props, info, alphaRange});
  await writeFile(`out/qa/${collection}-manifest.json`, JSON.stringify({capture, verification}, null, 2));
}
if (rows.length > 1) {
  const columns = flags.impact ? 2 : 3;
  const layout = rows.map((_, index) => `${index % columns * 540}_${Math.floor(index / columns) * 320}`).join('|');
  ffmpeg(['-y', ...rows.flatMap(row => ['-i', row]), '-filter_complex',
    `xstack=inputs=${rows.length}:layout=${layout}:fill=0x161616`, '-frames:v', '1', flags.impact ? 'out/stills/impact-contact-sheet.png' : 'out/stills/contact-sheet.png']);
}
