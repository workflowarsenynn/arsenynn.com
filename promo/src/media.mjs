import {execFileSync} from 'node:child_process';

export function ffmpeg(args, options = {}) {
  return execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args], options);
}

export function probe(file) {
  const result = JSON.parse(execFileSync('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0', '-show_streams', '-of', 'json', file,
  ]));
  if (!result.streams[0]) throw Error(`No video stream in ${file}`);
  return result.streams[0];
}

export function rate(value) {
  const [numerator, denominator = 1] = value.split('/').map(Number);
  const fps = numerator / denominator;
  if (!(fps > 0) || !Number.isFinite(fps)) throw Error(`Invalid frame rate: ${value}`);
  return fps;
}

export const contrast = (width, height, fps, duration) =>
  `color=c=0x191d24:s=${width}x${height}:r=${fps}:d=${duration},drawbox=x=0:y=0:w=iw/2:h=ih:c=0xe4ded1:t=fill`;

export const compositeFilter = '[0:v]format=yuv444p[plate];[plate][1:v]overlay=format=yuv444:alpha=straight:eof_action=pass[v]';
