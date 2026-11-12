import React from 'react';
import {AbsoluteFill, Composition, Img, OffthreadVideo, registerRoot, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import media from '../public/media-showcase.json';
import {clamp, ease, mix} from './settings.mjs';

export const mediaScenes = {
  BisPlayback: {project: 'bessmyslennost', durationInFrames: 600},
  WorkflowPlayback: {project: 'workflow', durationInFrames: 444},
  RadioVisuals: {project: 'without-streaming', durationInFrames: 360},
} as const;

type Scene = keyof typeof mediaScenes;
type Entry = {file: string; title?: string; width?: number; height?: number; frames?: number; credit?: string};
const red = '#e5322d';
const ink = '#0a0a0a';
const white = '#f2f2f0';

function Picture({item, width, height, moving = false, fit = 'contain'}: {
  item: Entry; width: number; height: number; moving?: boolean; fit?: 'contain' | 'cover';
}) {
  const style = {width, height, objectFit: fit, display: 'block', background: ink};
  return moving
    ? <OffthreadVideo src={staticFile(item.file)} muted style={style} />
    : <Img src={staticFile(item.file)} style={style} />;
}

// Restart each excerpt at the cut, independent of its position in the edit.
function Clip({item, width, height, start, fit}: {
  item: Entry; width: number; height: number; start: number; fit?: 'contain' | 'cover';
}) {
  return <Sequence from={start} layout="none">
    <Picture item={item} width={width} height={height} moving fit={fit} />
  </Sequence>;
}

function Stats({values}: {values: [number, string][]}) {
  return <div style={{display: 'flex', gap: 28, alignItems: 'stretch', justifyContent: 'center'}}>
    {values.map(([number, label]) => <div key={label} style={{minWidth: 190, padding: '10px 20px 14px', background: ink,
      borderTop: `3px solid ${red}`, fontWeight: 700, letterSpacing: '-0.04em'}}>
      <div style={{fontSize: 67, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{number}</div>
      <div style={{fontSize: 23, marginTop: 6, color: '#dfdbd5', letterSpacing: 0}}>{label}</div>
    </div>)}
  </div>;
}

function Opening({shot, values, progress}: {shot: {file: string; height: number}; values: [number,string][]; progress: number}) {
  const scale = mix(0.84, 1.04, ease(progress));
  return <div style={{display: 'grid', justifyItems: 'center', gap: 26}}>
    <div style={{transform: `scale(${scale})`, overflow: 'hidden', border: '1px solid #4a4a46'}}>
      <Picture item={shot} width={680} height={shot.height * 680 / 390} />
    </div>
    <Stats values={values} />
  </div>;
}

function Playback({item, start, length, index, total, width, height, progress, credit}: {
  item: Entry; start: number; length: number; index: number; total: number; width: number; height: number;
  progress: number; credit?: string;
}) {
  const frame = useCurrentFrame();
  const speed = ease(progress / 0.29);
  return <div style={{width, position: 'relative', background: ink, overflow: 'hidden',
    boxShadow: '0 0 0 1px #545052'}}>
    <div style={{overflow: 'hidden'}}>
      <div style={{transform: `scale(${mix(1.10, 1, speed) + 0.035 * progress})`}}>
        <Clip item={item} width={width} height={height} start={start} />
      </div>
    </div>
    <div style={{height: 4, background: '#4a4a46'}}>
      <div style={{height: '100%', width: `${100 * clamp((frame - start) / length)}%`, background: red}} />
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '19px 23px',
      fontSize: 27, fontWeight: 650, minHeight: 39}}>
      <span aria-hidden style={{display: 'inline-flex', gap: 4, marginRight: 4}}>
        <i style={{width: 4, height: 19, background: red}} /><i style={{width: 4, height: 19, background: red}} />
      </span>
      <span style={{flex: 1}}>{item.title}{credit && <span style={{fontSize: 21, fontWeight: 550, display: 'block', color: '#c2bdb7'}}>{credit}</span>}</span>
      <span style={{fontSize: 21, whiteSpace: 'nowrap', color: '#c2bdb7'}}>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
  </div>;
}

function Bis({frame}: {frame: number}) {
  const data = media.bessmyslennost;
  const counts: [number, string][] = [[data.counts.total, 'публикаций'], [data.counts.video, 'видео'], [data.counts.image, 'изображений']];
  if (frame < 76) {
    const detail = frame >= 37;
    return <Opening shot={detail ? data.player : data.cover} values={counts}
      progress={detail ? (frame - 37) / 39 : frame / 37} />;
  }
  const length = 108;
  if (frame >= 508) {
    const slot = Math.min(2, Math.floor((frame - 508) / 30));
    const active = [1, 5, 7][slot];
    const item = data.images[active];
    const progress = ease(((frame - 508) % 30) / 13);
    return <div style={{display: 'grid', justifyItems: 'center', gap: 20}}>
      <div style={{position: 'relative', width: 914, height: 975}}>
        {[-1, 1].map(direction => {
          const neighbor = data.images[(active + direction + data.images.length) % data.images.length];
          return <div key={direction} style={{position: 'absolute', top: 190, left: direction < 0 ? 0 : 594,
            transform: `rotate(${direction * 6}deg) translateY(${(1-progress)*45}px)`, opacity: 0.76}}>
            <Picture item={neighbor} width={320} height={580} />
          </div>;
        })}
        <div style={{position: 'absolute', left: 150, top: 0, border: '1px solid #665e5f',
          transform: `translateX(${(1-progress)*84}px) scale(${mix(0.85,1,progress)})`}}>
          <Picture item={item} width={614} height={890} />
          <div style={{padding: '15px 18px', fontSize: 26, fontWeight: 700, background: ink}}>{item.title}</div>
        </div>
      </div>
      <Stats values={counts} />
    </div>;
  }
  const index = Math.floor((frame - 76) / length);
  const start = 76 + index * length;
  const p = clamp((frame - start) / length);
  const snap = ease(p / 0.24);
  const mainIndices = [0, 1, 4, 6];
  const companionIndices = [2, 3, 5, 7];
  const video = data.videos[mainIndices[index]];
  const portrait = video.height > video.width;
  const featuredWidth = portrait ? 568 : 885;
  const featuredHeight = portrait ? 725 : 495;
  return <div style={{display: 'grid', justifyItems: 'center', gap: 22}}>
    <div style={{transform: `translate(${(index % 2 ? 1 : -1) * (1 - snap) * 115}px, ${(1 - snap) * 53}px)`,
      clipPath: `inset(0 ${(1 - snap) * 23}% 0 0)`}}>
      <Playback item={video} start={start} length={length} index={mainIndices[index]} total={data.videos.length}
        width={featuredWidth} height={featuredHeight} progress={p} />
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 14,
      transform: `translateY(${(1 - snap) * 145 - p * 14}px) rotate(${mix(-4, 0, snap)}deg)`}}>
      <Picture item={data.images[index * 2]} width={244} height={298} />
      <Clip item={data.videos[companionIndices[index]]} start={start} width={362} height={270} />
      <Picture item={data.images[index * 2 + 1]} width={244} height={298} />
    </div>
    <Stats values={counts} />
  </div>;
}

function Workflow({frame}: {frame: number}) {
  const data = media.workflow;
  if (frame < 53) return <Opening shot={data.player} values={[[data.counts.total, 'видеоработ']]} progress={frame / 53} />;
  if (frame < 104) {
    return <div style={{display: 'grid', justifyItems: 'center', gap: 28}}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 276px)', gap: 11}}>
        {data.images.map((image, i) => {
          const p = ease((frame - 53 - 2 * i) / 21);
          return <div key={image.id} style={{opacity: p, transform: `translateY(${(1-p)*90}px) scale(${mix(0.72,1,p)})`,
            background: ink}}>
            <Picture item={image} width={276} height={148} fit="cover" />
            <div style={{padding: '8px 9px', fontSize: 17, fontWeight: 700}}>{image.title}</div>
          </div>;
        })}
      </div>
      <Stats values={[[data.counts.total, 'видеоработ']]} />
    </div>;
  }
  const length = 54;
  const index = Math.min(data.videos.length - 1, Math.floor((frame - 104) / length));
  const start = 104 + index * length;
  const p = clamp((frame - start) / length);
  const snap = ease(p / 0.38);
  const next = data.images[(data.images.findIndex(image => image.id === data.videos[index].id) + 1) % data.images.length];
  return <div style={{display: 'grid', justifyItems: 'center', gap: 22}}>
    <div style={{transform: `perspective(1100px) translateX(${(1 - snap) * 172 * (index % 2 ? 1 : -1)}px) rotateY(${(1 - snap) * -20}deg)`,
      clipPath: `inset(0 0 0 ${(1-snap)*19}%)`}}>
      <Playback item={data.videos[index]} start={start} length={length}
        index={data.images.findIndex(image => image.id === data.videos[index].id)} total={data.counts.total}
        width={892} height={502} progress={p} />
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 19, background: ink, padding: 13,
      transform: `translateX(${(1-snap)*-145}px)`}}>
      <Picture item={next} width={235} height={133} fit="cover" />
      <span style={{fontSize: 25, fontWeight: 700}}>{next.title}</span>
    </div>
  </div>;
}

function Radio({frame}: {frame: number}) {
  const data = media['without-streaming'];
  const counts: [number,string][] = [[data.counts.video, 'визуальных лупа'], [data.counts.audio, 'трек']];
  if (frame < 58) return <Opening shot={data.player} values={counts} progress={frame / 58} />;
  const length = 48;
  const index = Math.min(data.videos.length - 1, Math.floor((frame - 58) / length));
  const start = 58 + index * length;
  const p = clamp((frame - start) / length);
  const open = ease(p / 0.40);
  return <div style={{display: 'grid', justifyItems: 'center', gap: 18}}>
    <div style={{width: 842, height: 137, overflow: 'hidden', background: ink, borderBottom: `2px solid ${red}`}}>
      <Picture item={data.player} width={842} height={data.player.height * 842 / 390} />
    </div>
    <div style={{clipPath: `ellipse(${mix(22, 76, Math.sqrt(open))}% ${mix(25, 75, Math.sqrt(open))}% at 50% 52%)`,
      transform: `translateY(${(1-open) * 54}px)`}}>
      <Playback item={data.videos[index]} start={start} length={length} index={index} total={data.videos.length}
        width={842} height={552} progress={p} credit={data.videos[index].credit} />
    </div>
    <Stats values={counts} />
  </div>;
}

function MediaFilm({id}: {id: Scene}) {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const unit = Math.min(width / 1080, height / 1920);
  const opacity = ease(frame / 10) * ease((durationInFrames - 1 - frame) / 13);
  return <AbsoluteFill style={{overflow: 'hidden', color: white}}>
    <style>{`
      @font-face{font-family:Manrope;src:url(${staticFile('manrope.woff2')});font-weight:200 800}
      @font-face{font-family:Manrope;src:url(${staticFile('showcase/manrope-cyrillic.woff2')});font-weight:200 800;unicode-range:U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}
    `}</style>
    <div style={{position: 'absolute', top: '46%', left: '50%',
      transform: `translate(-50%,-50%) scale(${unit})`, opacity, fontFamily: 'Manrope, sans-serif'}}>
      {id === 'BisPlayback' ? <Bis frame={frame} /> : id === 'WorkflowPlayback' ? <Workflow frame={frame} /> : <Radio frame={frame} />}
    </div>
  </AbsoluteFill>;
}

function Root() {
  return <>{(Object.keys(mediaScenes) as Scene[]).map(id => <Composition key={id} id={id}
    component={MediaFilm} defaultProps={{id}} width={1080} height={1920} fps={30}
    durationInFrames={mediaScenes[id].durationInFrames} />)}</>;
}
registerRoot(Root);
