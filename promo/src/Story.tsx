import React from 'react';
import {Img, staticFile} from 'remotion';
import {black} from './artwork';
import {ease, mix} from './settings.mjs';
import {storyPosition} from './story.mjs';

type Shot = {file: string; height: number; path: string; anchor: string};
const centered = {position: 'absolute', left: '50%', top: '50%'} as const;
const width = 910;
const styles = {
  'party-protocol': 'shutter',
  annflow: 'scan',
  'without-streaming': 'iris',
  arsenynn: 'push',
  workflow: 'slide',
  bessmyslennost: 'dissolve',
  'travel-log': 'push',
} as const;

export function Story({shots, phase, zoom, speed, length, project}: {
  shots: Shot[]; phase: number; zoom: number; speed: number; length: number; project: string;
}) {
  const {index, progress} = storyPosition(shots, phase);
  const prior = index > 0 ? shots[index - 1] : null;
  const current = shots[index];
  const reading = /(?:excerpt|intro|about|post)\.png$/.test(current.file);
  const style = styles[project];
  const vertical = style === 'shutter' || (style === 'scan' && index % 3 !== 2);
  const direction = index % 2 ? 1 : -1;
  const transition = ease(progress / Math.min(0.47, (style === 'dissolve' ? 0.4 : 0.27) / speed));
  const drift = ease(progress);
  const emphasis = reading ? 0.032 : 0.07;
  const opening = index === 0 ? ease(phase * length / 0.78) : 1;
  const opacity = prior ? (style === 'dissolve' || style === 'push' ? transition : 1) : mix(0.5, 1, opening);
  const inset = prior ? (1 - transition) * 100 : 0;
  const wipe = vertical
    ? `inset(${direction > 0 ? inset : 0}% 0 ${direction < 0 ? inset : 0}% 0)`
    : `inset(0 ${direction < 0 ? inset : 0}% 0 ${direction > 0 ? inset : 0}%)`;

  const incomingMask = !prior ? undefined
    : style === 'iris' && transition < 1 ? `circle(${Math.sqrt(transition) * 920}px at 50% 55%)`
    : style === 'scan' || style === 'shutter' ? wipe : undefined;
  const x = prior && style === 'slide' ? direction * (1 - transition) * 1040 : 0;
  const push = prior && style === 'push' ? (1 - transition) * 0.31 : 0;
  const outgoingX = style === 'slide' ? -direction * transition * 1040 : 0;

  const place = (shot: Shot, scale: number, x: number, y: number, style: React.CSSProperties = {}) =>
    <div style={{...centered, width, transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
      backgroundColor: black, boxShadow: '0 0 0 1px #66605e80', ...style}}>
      <Img src={staticFile(shot.file)} style={{display: 'block', width, height: shot.height * width / 390}} />
      {/(?:excerpt|intro|post)\.png$/.test(shot.file) && <div style={{position: 'absolute', insetInline: 0, bottom: 0,
        height: 65, background: 'linear-gradient(transparent, #0a0a0a)', pointerEvents: 'none'}} />}
    </div>;

  return <div style={{width: 980, height: 1440, position: 'relative'}}>
    {prior && transition < 1 && place(prior, 1.03 + transition * (style === 'push' ? 0.32 : 0.07) * zoom,
      outgoingX, -direction * transition * 32 * zoom, {opacity: 1 - transition})}
    {place(current, mix(0.85, 1, opening) + emphasis * drift * zoom - push, x,
      (1 - opening) * 92 + (prior && vertical ? direction * (1 - transition) * 46 * zoom : 0),
      {opacity, clipPath: incomingMask})}
    {prior && transition < 1 && (style === 'scan' || style === 'shutter') && <div style={{...centered,
      width: vertical ? width : 3, height: vertical ? 3 : current.height * width / 390,
      transform: `translate(-50%, -50%) translate(${vertical ? 0 : direction * (0.5-transition) * width}px,${vertical ? direction * (0.5-transition) * current.height * width / 390 : 0}px)`,
      background: '#e5322d', opacity: Math.sin(Math.PI * transition) * 0.7}} />}
  </div>;
}
