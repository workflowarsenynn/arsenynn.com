import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {parseArgs} from 'node:util';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderMedia} from '@remotion/renderer';
import {contrast, compositeFilter, ffmpeg, probe} from './media.mjs';

const {values} = parseArgs({options: {scene: {type: 'string'}, 'verify-only': {type: 'boolean'}, output: {type: 'string', default: 'out/media-playback'}}});
process.chdir(new URL('../', import.meta.url).pathname);
const output = resolve(values.output);
const snapshot = JSON.parse(await readFile('public/media-showcase.json', 'utf8'));
assert.equal(snapshot.siteTree, execFileSync('git', ['rev-parse', 'HEAD:src', 'HEAD:public'], {encoding: 'utf8'}).trim());
for (const folder of ['alpha', 'qa']) await mkdir(join(output, folder), {recursive: true});
const bundleDir = await mkdtemp(join(tmpdir(), 'arsenynn-playback-'));
const scenes = {
  BisPlayback: {project: 'bessmyslennost', stills: [1.7, 3.5, 7.5, 12.0, 16.1, 18.7]},
  WorkflowPlayback: {project: 'workflow', stills: [1.2, 3.2, 4.4, 7.8, 9.4, 12.9]},
  RadioVisuals: {project: 'without-streaming', stills: [1.2, 3.0, 4.8, 6.2, 8.1, 10.9]},
};
try {
  const serveUrl = await bundle({entryPoint: 'src/media-scenes.tsx', publicDir: 'public', outDir: bundleDir});
  const compositions = (await getCompositions(serveUrl)).filter(({id}) => !values.scene || id === values.scene);
  assert.ok(compositions.length, 'Unknown playback composition');
  for (const composition of compositions) {
    const {id, fps, width, height, durationInFrames} = composition;
    const {project, stills} = scenes[id];
    const stem = `${id}-${width}x${height}-${fps}fps-transparent`;
    const file = join(output, 'alpha', stem + '.mov');
    console.log(`${values['verify-only'] ? 'Verifying' : 'Rendering'} ${stem} · ${durationInFrames / fps}s`);
    if (!values['verify-only']) await renderMedia({serveUrl, composition, codec: 'prores', proResProfile: '4444',
      pixelFormat: 'yuva444p10le', imageFormat: 'png', proResBitsPerMacroblock: 640,
      colorSpace: 'bt709', outputLocation: file, concurrency: 2, muted: true,
      offthreadVideoCacheSizeInBytes: 96 * 1024 ** 2});
    const info = probe(file);
    assert.equal(info.width, width);
    assert.equal(info.height, height);
    assert.equal(info.avg_frame_rate, fps + '/1');
    assert.equal(Number(info.nb_frames), durationInFrames);
    assert.equal(info.profile, '4444');
    assert.match(info.pix_fmt, /^yuva444p/);
    const samples = [];
    for (const [index, time] of stills.entries()) {
      const pixels = ffmpeg(['-ss', String(time), '-i', file, '-frames:v', '1',
        '-vf', 'alphaextract,format=gray', '-f', 'rawvideo', '-'], {maxBuffer: width * height + 1024});
      assert.equal(pixels.length, width * height);
      assert.ok(pixels.includes(0) && pixels.includes(255), `${id} at ${time}s needs visible and transparent regions`);
      const path = join(output, 'qa', `${id}-${index + 1}.png`);
      ffmpeg(['-y', '-f', 'lavfi', '-i', contrast(width, height, fps, 0.1),
        '-ss', String(time), '-i', file, '-filter_complex', '[1:v]setpts=PTS-STARTPTS[layer];' + compositeFilter.replace('[1:v]', '[layer]') + ';[v]scale=270:480[thumb]',
        '-map', '[thumb]', '-frames:v', '1', path]);
      samples.push(path);
    }
    const layout = samples.map((_, i) => `${i % 3 * 270}_${Math.floor(i / 3) * 480}`).join('|');
    ffmpeg(['-y', ...samples.flatMap(path => ['-i', path]), '-filter_complex',
      `xstack=inputs=${samples.length}:layout=${layout}`, '-frames:v', '1', join(output, 'qa', id + '-contact.png')]);
    const hashes = ffmpeg(['-ss', String(stills[2]), '-i', file, '-frames:v', '10',
      '-vf', 'crop=240:160:(iw-ow)/2:(ih-oh)/2', '-f', 'framemd5', '-']).toString();
    const distinctFrames = new Set(hashes.split('\n').filter(line => /^0,/.test(line)).map(line => line.split(',').at(-1).trim())).size;
    assert.ok(distinctFrames >= 5, `${id}: sampled playback did not move`);
    await writeFile(join(output, 'qa', id + '.json'),
      JSON.stringify({project, file, info, alphaSampleTimes: stills, distinctFrames, sources: snapshot[project]}, null, 2));
  }
} finally {
  await rm(bundleDir, {recursive: true, force: true});
}
