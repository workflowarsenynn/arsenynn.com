import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {parseArgs} from 'node:util';
import {bundle} from '@remotion/bundler';
import {renderFrames, renderMedia, selectComposition} from '@remotion/renderer';
import {defaults, impactScenes, scenes, settings} from './settings.mjs';
import {storyCuts} from './story.mjs';
import {compositeFilter, contrast, ffmpeg, probe, rate} from './media.mjs';

const {values: flags} = parseArgs({options: {
  config: {type: 'string'}, scene: {type: 'string'}, source: {type: 'string'},
  png: {type: 'boolean'}, impact: {type: 'boolean'}, stories: {type: 'boolean'},
}});
const root = new URL('../', import.meta.url);
process.chdir(root.pathname);
const capture = JSON.parse(await readFile('public/capture.json', 'utf8'));
const tree = execFileSync('git', ['rev-parse', 'HEAD:src', 'HEAD:public'], {encoding: 'utf8'}).trim();
assert.equal(capture.siteTree, tree, 'Site changed. Rebuild Astro and run npm run capture.');
const slugs = capture.projects.map(project => project.slug);
const config = flags.config ? JSON.parse(await readFile(flags.config, 'utf8')) : {};
const seriesSlugs = Object.keys(capture.series);
const profile = settings(slugs, seriesSlugs);
const storyDurations = {'party-protocol': 10, annflow: 48, 'without-streaming': 12,
  arsenynn: 24, workflow: 19, bessmyslennost: 13, 'travel-log': 5};
const storyVariants = [
  ...slugs.map(project => ['ProjectStory', {project, duration: storyDurations[project]}]),
  ...seriesSlugs.map(series => ['AnnflowSeries', {series}]),
];
const impactVariants = Object.keys(impactScenes).map(id => [id, {}]);
const variants = flags.scene ? [[flags.scene, {}]] : flags.impact ? impactVariants : flags.stories ? storyVariants : [
  ['WordmarkEmergence', {side: 'left'}], ['WordmarkEmergence', {}], ['WordmarkEmergence', {side: 'right'}],
  ['FloatingWebsite', {}], ['EditorialScroll', {background: 'opaque'}],
  ['TypographyBreakout', {}], ...slugs.filter(slug => ['party-protocol', 'annflow', 'arsenynn'].includes(slug))
    .map(project => ['ProjectFocus', {project}]),
  ['FinalWebsiteReveal', {}], ['FinalWebsiteReveal', {tone: 'dark'}], ['FinalWebsiteReveal', {background: 'opaque'}],
  ...impactVariants, ...storyVariants,
];
if (flags.png && !flags.scene) throw Error('Use --png with a single --scene');
const sourceFps = flags.source ? rate(probe(flags.source).avg_frame_rate) : undefined;
const jobs = variants.map(([id, variant]) => {
  if (!Object.hasOwn(scenes, id)) throw Error(`Unknown scene: ${id}`);
  const props = profile.strict().parse({...defaults(id, slugs, seriesSlugs), ...variant, ...config,
    ...(sourceFps ? {fps: sourceFps} : {})});
  return {id, props};
});
for (const dir of ['alpha', 'opaque', 'previews', 'stills', 'qa']) await mkdir(`out/${dir}`, {recursive: true});
const serveUrl = await bundle({entryPoint: 'src/index.tsx', publicDir: 'public'});
const collection = flags.scene ?? (flags.impact ? 'impact' : flags.stories ? 'stories' : 'kit');
const rows = [];
const verification = [];
for (const {id, props} of jobs) {
  const isImpact = Object.hasOwn(impactScenes, id);
  const shots = id === 'ProjectStory' ? capture.catalog[props.project]
    : id === 'AnnflowSeries' ? capture.series[props.series].shots : null;
  const cuts = shots ? storyCuts(shots) : null;
  const alpha = props.background === 'transparent';
  const suffix = id === 'AnnflowSeries' ? props.series
    : id === 'ProjectFocus' || id === 'ProjectStory' ? props.project
    : id === 'FinalWebsiteReveal' ? props.tone : props.side;
  const stem = `${id}-${suffix}-${props.preset}-${props.fps}fps-${props.width}x${props.height}-${props.background}`;
  const file = alpha ? `out/alpha/${stem}.mov` : `out/opaque/${stem}.mp4`;
  const preview = cuts
    ? `out/qa/story-previews/${stem.replace(/-(transparent|opaque)$/, '')}-opaque-preview.mp4`
    : `out/previews/${stem}.mp4`;
  if (cuts) await mkdir('out/qa/story-previews', {recursive: true});
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
    const midpoint = cuts ? cuts[Math.floor(cuts.length / 2)] : null;
    const sample = midpoint ? (midpoint.from + midpoint.to) / 2 : isImpact ? 0.8 : 0.5;
    const pixels = ffmpeg(['-ss', String(duration * sample), '-i', file, '-frames:v', '1',
      '-vf', 'alphaextract,format=gray', '-f', 'rawvideo', '-'], {maxBuffer: props.width * props.height + 1024});
    assert.equal(pixels.length, props.width * props.height);
    alphaRange = [pixels.includes(0) ? 0 : 'above zero', pixels.includes(255) ? 255 : 'below full'];
    if (!flags.config && props.opacity === 1 && props.text && props.duration >= 3) assert.deepEqual(alphaRange, [0, 255]);
    await writeFile(`out/qa/${stem}.json`, JSON.stringify({props, info, alphaRange}, null, 2));
    const plate = cuts ? `color=c=0x232024:s=${props.width}x${props.height}:r=${props.fps}:d=${duration}`
      : contrast(props.width, props.height, props.fps, duration);
    const filter = cuts ? compositeFilter
      : compositeFilter.replace('[v]', '[full];[full]scale=540:960:force_original_aspect_ratio=decrease:force_divisible_by=2[v]');
    ffmpeg(['-y', '-f', 'lavfi', '-i', plate,
      '-i', file, '-filter_complex', filter, '-map', '[v]', '-c:v', 'libx264', '-crf', '18',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', preview]);
  } else {
    ffmpeg(['-y', '-i', file, '-vf', 'scale=540:960:force_original_aspect_ratio=decrease:force_divisible_by=2',
      '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', preview]);
  }
  const middle = {WordmarkPortal: 0.43, ShutterReveal: 0.54, ProjectOrbit: 0.36, MatchCut: 0.53};
  const keyframes = id === 'EditorialScroll' ? [0.049, 0.32, 0.92]
    : isImpact ? [0.19, middle[id], 0.80] : [0.16, 0.49, 0.81];
  const chosenCuts = cuts ? (props.project === 'annflow' ? cuts
    : [cuts[0], cuts[Math.floor(cuts.length / 2)], cuts.at(-1)]) : null;
  const fractions = chosenCuts ? chosenCuts.map(({from, to}) => from + (to - from) * 0.6) : keyframes;
  const stills = fractions.map((at, index) => {
    const path = `out/stills/${stem}-${index + 1}.png`;
    ffmpeg(['-y', '-ss', String(duration * at), '-i', preview, '-frames:v', '1', '-vf',
      'scale=180:320:force_original_aspect_ratio=decrease,pad=180:320:(ow-iw)/2:(oh-ih)/2', path]);
    return path;
  });
  if (fractions.length > 3) {
    const columns = 4;
    const layout = stills.map((_, i) => `${i % columns * 180}_${Math.floor(i / columns) * 320}`).join('|');
    ffmpeg(['-y', ...stills.flatMap(path => ['-i', path]), '-filter_complex',
      `xstack=inputs=${stills.length}:layout=${layout}:fill=0x161616`, '-frames:v', '1',
      `out/stills/${stem}-contact-sheet.png`]);
  }
  const row = `out/stills/${stem}-strip.png`;
  const samples = [stills[0], stills[Math.floor(stills.length / 2)], stills.at(-1)];
  ffmpeg(['-y', ...samples.flatMap(path => ['-i', path]), '-filter_complex', 'hstack=inputs=3', '-frames:v', '1', row]);
  rows.push(row);
  verification.push({file, preview, props, info, alphaRange});
  await writeFile(`out/qa/${collection}-manifest.json`, JSON.stringify({capture, verification}, null, 2));
}
if (rows.length > 1) {
  const columns = flags.impact ? 2 : 3;
  const layout = rows.map((_, index) => `${index % columns * 540}_${Math.floor(index / columns) * 320}`).join('|');
  ffmpeg(['-y', ...rows.flatMap(row => ['-i', row]), '-filter_complex',
    `xstack=inputs=${rows.length}:layout=${layout}:fill=0x161616`, '-frames:v', '1', flags.impact ? 'out/stills/impact-contact-sheet.png' : flags.stories ? 'out/stills/stories-contact-sheet.png' : 'out/stills/contact-sheet.png']);
}
