import {realpathSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {parseArgs} from 'node:util';
import {compositeFilter, ffmpeg, probe} from './media.mjs';

const {positionals, values} = parseArgs({allowPositionals: true, options: {start: {type: 'string', default: '0'}}});
const [source, layer, output] = positionals;
if (positionals.length !== 3 || !output.endsWith('.mp4') || existsSync(output)) {
  throw Error('Usage: npm run composite -- source.mov alpha.mov new-output.mp4 [--start 0]');
}
if (realpathSync(source) === resolve(output) || realpathSync(layer) === resolve(output)) throw Error('Choose a new output file');
if (!/^yuva/.test(probe(layer).pix_fmt)) throw Error('Overlay must carry alpha');
const start = Number(values.start);
if (!Number.isFinite(start) || start < 0) throw Error('Start must be non-negative');
const {width, height} = probe(layer);
const filters = `[0:v]scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}[fit];`
  + `[1:v]setpts=PTS-STARTPTS+${start}/TB[overlay];`
  + compositeFilter.replace('[0:v]', '[fit]').replace('[1:v]', '[overlay]');
ffmpeg(['-n', '-i', source, '-i', layer, '-filter_complex', filters, '-map', '[v]', '-map', '0:a?',
  '-c:v', 'libx264', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-movflags', '+faststart', output]);
