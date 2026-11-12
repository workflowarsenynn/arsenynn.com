import React from 'react';
import {Img, staticFile} from 'remotion';
import capture from '../public/capture.json';
import {black, white, Mark, Page} from './artwork';
import {clamp, ease, mix} from './settings.mjs';

type ImpactProps = {
  scene: 'WordmarkPortal' | 'ShutterReveal' | 'ProjectOrbit' | 'MatchCut';
  time: number;
  length: number;
  zoom: number;
  speed: number;
  project: string;
  text: boolean;
  tone: 'dark' | 'light';
};

const red = '#e5322d';
const stageWidth = 900;
const stageHeight = 1320;
const markRatio = 491 / 1235;
const center = {position: 'absolute', left: '50%', top: '50%'} as const;

export function Impact({scene, time, length, zoom, speed, project, text, tone}: ImpactProps) {
  const phase = clamp(time / length);
  // Retiming is anchored in the middle, preserving the intro and the final hold.
  const p = clamp((phase - 0.5) * speed + 0.5);
  const beat = (from: number, to: number) => ease((p - from) / (to - from));
  const shot = capture.projects.find(item => item.slug === project)!;
  let layers: React.ReactNode;

  if (scene === 'WordmarkPortal') {
    const approach = beat(0.17, 0.53);
    const resolve = beat(0.40, 0.58);
    const markWidth = mix(740, 3050, approach * Math.min(1, zoom));
    const aperture = Math.hypot(stageWidth / 2, stageHeight / 2);
    layers = <>
      {text && <div style={{...center, width: markWidth, height: markWidth * markRatio,
        transform: `translate(${-50 - 9 * approach}%, -50%)`, opacity: 1 - resolve}}>
        <Mark width={markWidth} />
        <div style={{position: 'absolute', inset: 0, maskImage: `url(${staticFile('arsenynn.svg')})`, maskSize: '100% 100%',
          background: 'linear-gradient(108deg, transparent 30%, #f2f2f0 48%, transparent 64%)',
          backgroundSize: '280% 100%', backgroundPosition: `${mix(100, 0, beat(0.04, 0.32))}% 50%`,
          opacity: 0.8 * Math.sin(Math.PI * beat(0.04, 0.32))}} />
      </div>}
      {resolve > 0 && <div style={{...center, transform: `translate(-50%,-50%) scale(${mix(1.27, 1, resolve)})`,
        clipPath: `circle(${aperture * Math.sqrt(resolve)}px at 46% 50%)`}}>
        <Page width={790} height={1150} text={text} />
      </div>}
    </>;
  } else if (scene === 'ShutterReveal') {
    const count = 6;
    const open = beat(0.02, 0.31);
    const switchShot = beat(0.46, 0.65);
    const focus = beat(0.65, 0.92);
    const width = 820;
    const height = 1120;
    layers = <div style={{...center, width, height,
      transform: `translate(-50%,-50%) scale(${mix(0.95, 1.06, focus * zoom)})`}}>
      {Array.from({length: count}, (_, i) => {
        const stripe = width / count;
        const direction = i % 2 === 0 ? -1 : 1;
        const arrive = beat(0.025 + i * 0.028, 0.23 + i * 0.028);
        const cut = beat(0.44 + i * 0.025, 0.55 + i * 0.025);
        return <div key={i} style={{position: 'absolute', left: Math.floor(i * stripe),
          width: Math.ceil(stripe) + 1, height, overflow: 'hidden',
          opacity: arrive, transform: `translateY(${direction * (1 - arrive) * 630 * zoom}px)`}}>
          <div style={{position: 'absolute', left: -Math.floor(i * stripe)}}>
            <Page width={width} height={height} text={text} />
          </div>
          <div style={{position: 'absolute', left: -Math.floor(i * stripe), insetBlock: 0,
            clipPath: `inset(${direction === 1 ? (1-cut)*100 : 0}% 0 ${direction === -1 ? (1-cut)*100 : 0}% 0)`}}>
            <Page width={width} height={height} top={shot.y} text={text} />
          </div>
        </div>;
      })}
      <div style={{position: 'absolute', insetInline: 0, height: 3, background: red,
        top: `${mix(7, 88, switchShot)}%`, opacity: Math.sin(Math.PI * switchShot) * open}} />
    </div>;
  } else if (scene === 'ProjectOrbit') {
    const fan = beat(0.05, 0.31);
    const converge = beat(0.48, 0.72);
    const spread = fan * (1 - converge);
    const companions = capture.projects.filter(item => item.slug !== project).slice(0, 2);
    layers = <>
      {companions.map((item, index) => {
        const direction = index === 0 ? -1 : 1;
        return <div key={item.slug} style={{...center, opacity: spread * 0.92,
          transform: `translate(-50%, -50%) translate(${direction * spread * 285 * zoom}px,${spread * (index === 0 ? -345 : 360)}px) perspective(980px) rotateY(${direction * spread * -26 * zoom}deg) rotateZ(${direction * spread * -7}deg) scale(0.69)`,
          border: '1px solid #4a4a46'}}>
          <Page width={670} height={620} top={item.y} text={text} />
        </div>;
      })}
      <div style={{...center, border: '1px solid #4a4a46',
        transform: `translate(-50%,-50%) translateY(${spread * 12}px) perspective(1100px) rotateY(${spread * 14 * zoom}deg) scale(${mix(0.71, 1.18, converge)})`}}>
        <Page width={705} height={mix(610, 940, converge)} top={shot.y} text={text} />
      </div>
    </>;
  } else {
    const zoomIn = beat(0.31, 0.56);
    const settle = beat(0.49, 0.67);
    const hold = beat(0.04, 0.29);
    layers = <>
      <div style={{...center, opacity: 1 - settle,
        transform: `translate(-50%,-50%) translate(${-115 * zoomIn}px,${170 * zoomIn}px) scale(${mix(0.68, 0.94, hold) + 1.55 * zoomIn * zoom})`,
        filter: `blur(${5 * Math.sin(Math.PI * zoomIn)}px)`}}>
        <Page width={810} height={1170} top={shot.y} text={text} />
      </div>
      <div style={{...center, textAlign: 'center', width: stageWidth,
        color: tone === 'dark' ? black : white, opacity: settle,
        transform: `translate(-50%,-50%) scale(${mix(1.42, 1, settle)})`}}>
        <Img src={staticFile('nn.svg')} style={{width: 104, height: 104, objectFit: 'contain'}} />
        {text && <div style={{font: '750 112px Manrope', letterSpacing: '-0.065em'}}>{capture.domain}</div>}
        <div style={{background: red, width: mix(0, 630, settle), height: 5, margin: '20px auto 0'}} />
      </div>
    </>;
  }
  return <div style={{width: stageWidth, height: stageHeight, position: 'relative'}}>{layers}</div>;
}
