import React from 'react';
import {Img, staticFile} from 'remotion';
import capture from '../public/capture.json';

export const black = '#0a0a0a';
export const white = '#f2f2f0';

export function Page({width, height, top = 0, clean = false, text = true}: {
  width: number; height: number; top?: number; clean?: boolean; text?: boolean;
}) {
  return <div style={{width, height, overflow: 'hidden', background: black, position: 'relative'}}>
    <Img src={staticFile(clean ? 'hero-clean.png' : text ? 'site.png' : 'site-no-text.png')}
      style={{display: 'block', width, height: (clean ? capture.height : capture.heightFull) * width / capture.width,
        transform: `translateY(${-top * width / capture.width}px)`}} />
  </div>;
}

export function Mark({width}: {width: number}) {
  return <Img src={staticFile('arsenynn.svg')} style={{width, display: 'block'}} />;
}
