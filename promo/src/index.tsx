import React from 'react';
import {AbsoluteFill, Composition, Img, registerRoot, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {z} from 'zod';
import capture from '../public/capture.json';
import {clamp, defaults, ease, mix, presets, scenes, scrollAt, settings} from './settings.mjs';

import {black, white, Page, Mark} from './artwork';
import {Impact} from './Impact';
import {Story} from './Story';

const projects = capture.projects.map(project => project.slug);
const series = Object.keys(capture.series);
const schema = settings(projects, series);
type Props = z.infer<typeof schema>;
type Scene = keyof typeof scenes;


function Film({scene, ...props}: Props & {scene: Scene}) {
  const frame = useCurrentFrame();
  const {width, height, fps, durationInFrames} = useVideoConfig();
  const time = frame / fps;
  const length = (durationInFrames - 1) / fps;
  const profile = presets[props.preset];
  const transition = Math.min(length * 0.21, profile.transition / props.speed);
  const enter = props.enter === 'cut' ? 1 : ease(time / transition);
  const exit = props.exit === 'cut' ? 1 : ease((length - time) / transition);
  const beat = ease((time - transition) / Math.max(0.1, length - 2 * transition));
  const side = {left: -1, center: 0, right: 1}[props.side];
  const direction = side || -1;
  const isMark = scene === 'WordmarkEmergence';
  const offset = (props.enter === 'slide' ? direction * (1 - enter) * (isMark ? 470 : 112) : 0)
    + (props.exit === 'slide' ? -direction * (1 - exit) * 132 : 0);
  const unit = Math.min(width / 1080, height / 1920);
  const base = (props.background === 'opaque' ? black : 'transparent');
  const target = capture.projects.find(project => project.slug === props.project)!;

  let content: React.ReactNode;
  switch (scene) {
    case 'ProjectStory':
    case 'AnnflowSeries': {
      const shots = scene === 'ProjectStory' ? capture.catalog[props.project] : capture.series[props.series].shots;
      content = <Story shots={shots} phase={time / length} zoom={profile.zoom} speed={props.speed}
        length={length} project={props.project} />;
      break;
    }
    case 'WordmarkPortal':
    case 'ShutterReveal':
    case 'ProjectOrbit':
    case 'MatchCut':
      content = <Impact scene={scene} time={time} length={length} zoom={profile.zoom} speed={props.speed}
        project={props.project} text={props.text} tone={props.tone} />;
      break;
    case 'WordmarkEmergence':
      content = props.text && <Mark width={mix(590, 680, beat * profile.zoom)} />;
      break;
    case 'FloatingWebsite':
      const panelWidth = mix(664, 748, beat * profile.zoom);
      content = <Page width={panelWidth} height={(capture.projects[0].y + 3) * panelWidth / capture.width} text={props.text} />;
      break;
    case 'EditorialScroll': {
      const all = [{slug: 'hero', y: 0}, ...capture.projects];
      const from = all.findIndex(project => project.slug === props.scrollFrom);
      const to = all.findIndex(project => project.slug === props.scrollTo);
      const range = all.slice(Math.min(from, to), Math.max(from, to) + 1);
      if (from > to) range.reverse();
      const pageWidth = 952;
      const pageHeight = 1370;
      const tops = range.map(project => Math.min(Math.max(0, project.y - 16),
        capture.heightFull - pageHeight * capture.width / pageWidth));
      const progress = clamp((time - Math.max(transition, 0.8)) / Math.max(0.1, (length - 2.1) / props.speed));
      content = <Page width={pageWidth} height={pageHeight} top={scrollAt(tops, progress)} text={props.text} />;
      break;
    }
    case 'TypographyBreakout': {
      const panelWidth = 714;
      const panelHeight = 1150;
      const ratio = panelWidth / capture.width;
      const phase = time / length;
      const pull = ease((phase - 0.26) * 12 * props.speed);
      const returnToPanel = ease((phase - 0.65) * 10 * props.speed);
      const breakout = pull * (1 - returnToPanel);
      const {wordmark} = capture;
      const jump = phase >= 0.43 && phase < 0.63 && props.preset !== 'subtle';
      content = <div style={{width: panelWidth, height: panelHeight, position: 'relative'}}>
        <div style={{opacity: 1 - breakout}}>
          <Page width={panelWidth} height={panelHeight} clean={props.text} text={props.text} />
        </div>
        {props.text && <div style={{position: 'absolute', left: wordmark.x * ratio + breakout * (jump ? -390 : -65),
          top: wordmark.y * ratio + breakout * 135, transformOrigin: 'left center'}}>
          <Mark width={mix(wordmark.width * ratio, jump ? 1520 : 780, breakout * Math.min(1, profile.zoom))} />
        </div>}
      </div>;
      break;
    }
    case 'ProjectFocus': {
      const projectWidth = mix(650, 828, beat * profile.zoom);
      const crop = Math.min(target.height, mix(172, Math.min(590, target.height), ease(beat * 1.3)));
      content = <Page width={projectWidth} height={crop * projectWidth / capture.width} top={target.y} text={props.text} />;
      break;
    }
    case 'FinalWebsiteReveal':
      content = <div style={{textAlign: 'center', color: props.tone === 'dark' ? black : white}}>
        <Img src={staticFile('nn.svg')} style={{width: 88, height: 88, objectFit: 'contain'}} />
        {props.text && <div style={{font: '650 91px Manrope', letterSpacing: '-0.055em', marginTop: 20}}>
          {capture.domain}
        </div>}
      </div>;
      break;
  }

  return <AbsoluteFill style={{background: base, overflow: 'hidden'}}>
    <style>{`@font-face{font-family:Manrope;src:url(${staticFile('manrope.woff2')}) format('woff2');font-weight:200 800;}`}</style>
    <div style={{
      position: 'absolute',
      left: width / 2 + (props.x - 540 + side * (isMark ? 144 : 88) + offset * profile.travel) * unit,
      top: height / 2 + (props.y - 960 + (1 - enter) * (props.enter === 'slide' ? 28 : 0)) * unit,
      transform: `translate(-50%, -50%) scale(${unit * props.scale})`,
      opacity: enter * exit * props.opacity,
    }}>{content}</div>
  </AbsoluteFill>;
}

function Root() {
  return <>{(Object.keys(scenes) as Scene[]).map(scene => {
    const Component = (props: Props) => <Film scene={scene} {...props} />;
    return <Composition key={scene} id={scene} component={Component} schema={schema}
      defaultProps={defaults(scene, projects, series)} width={1080} height={1920} fps={30} durationInFrames={150}
      calculateMetadata={({props}) => ({
        width: props.width, height: props.height, fps: props.fps,
        durationInFrames: Math.round(props.duration * props.fps),
        ...(props.background === 'transparent' ? {
          defaultCodec: 'prores', defaultPixelFormat: 'yuva444p10le',
          defaultVideoImageFormat: 'png', defaultProResProfile: '4444',
        } as const : {defaultCodec: 'h264'} as const),
      })} />;
  })}</>;
}
registerRoot(Root);
