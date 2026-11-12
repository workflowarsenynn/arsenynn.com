import {clamp} from './settings.mjs';

export function storyCuts(shots) {
  const lengths = shots.map(({file}) => {
    if (/-excerpt\.png$|-intro\.png$|-about\.png$|-post\.png$/.test(file)) return 1.5;
    if (/-title\.png$|-rows-\d+\.png$/.test(file)) return 0.82;
    return 1;
  });
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let start = 0;
  return lengths.map(length => {
    const from = start / total;
    start += length;
    return {from, to: start / total};
  });
}

export function storyPosition(shots, phase) {
  const cuts = storyCuts(shots);
  const time = clamp(phase);
  const found = cuts.findIndex(cut => time < cut.to);
  const index = found < 0 ? cuts.length - 1 : found;
  const {from, to} = cuts[index];
  return {index, progress: clamp((time - from) / (to - from))};
}
