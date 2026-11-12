import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {compositeFilter, ffmpeg, probe} from './media.mjs';

process.chdir(new URL('../', import.meta.url).pathname);
const {verification} = JSON.parse(await readFile('out/qa/impact-manifest.json', 'utf8'));
const edit = [
  {scene: 'WordmarkPortal', plate: '0xe8ded2', in: 0.08, out: 4.12},
  {scene: 'ShutterReveal', plate: '0x221417', in: 0.20, out: 4.25},
  {scene: 'ProjectOrbit', plate: '0x191a20', in: 0.23, out: 4.98},
  {scene: 'MatchCut', plate: '0xe8ded2', in: 0.24, out: 5.38},
];
const filters = [];
const inputs = [];
for (const [i, shot] of edit.entries()) {
  const item = verification.find(({file}) => file.split('/').at(-1).startsWith(shot.scene + '-'));
  assert.ok(item?.file.endsWith('.mov'), `Render the transparent ${shot.scene} first`);
  assert.ok(Number(item.info.duration) >= shot.out, 'Render the default scene durations for the reel');
  inputs.push('-f', 'lavfi', '-i', `color=c=${shot.plate}:s=1080x1920:r=30:d=${item.info.duration}`,
    '-i', item.file);
  const overlay = compositeFilter.replace('[0:v]', `[${i * 2}:v]`).replace('[1:v]', `[${i * 2 + 1}:v]`)
    .replaceAll('[plate]', `[plate${i}]`).replace('[v]', `[v${i}]`);
  filters.push(overlay, `[v${i}]trim=start=${shot.in}:end=${shot.out},setpts=PTS-STARTPTS,setsar=1[s${i}]`);
}
filters.push(edit.map((_, i) => `[s${i}]`).join('') + `concat=n=${edit.length}:v=1:a=0[reel]`);
const output = 'out/previews/impact-reel.mp4';
ffmpeg(['-y', ...inputs, '-filter_complex', filters.join(';'), '-map', '[reel]',
  '-c:v', 'libx264', '-crf', '17', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709',
  '-color_primaries', 'bt709', '-color_trc', 'bt709', '-movflags', '+faststart', output]);
const info = probe(output);
assert.equal(info.width, 1080);
assert.equal(info.height, 1920);
assert.equal(info.avg_frame_rate, '30/1');
const expected = edit.reduce((total, shot) => total + shot.out - shot.in, 0);
assert.ok(Math.abs(Number(info.duration) - expected) < 0.2);
console.log(`${output} · ${info.duration}s`);
