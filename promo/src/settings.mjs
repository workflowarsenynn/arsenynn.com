import {z} from 'zod';

export const impactScenes = {
  WordmarkPortal: {duration: 5.6, preset: 'dynamic', enter: 'fade'},
  ShutterReveal: {duration: 5.2, preset: 'dynamic', enter: 'fade', project: 'annflow'},
  ProjectOrbit: {duration: 6.2, preset: 'dynamic', enter: 'fade', project: 'arsenynn'},
  MatchCut: {duration: 5.6, preset: 'dynamic', enter: 'fade', tone: 'dark'},
};

export const storyScenes = {
  ProjectStory: {duration: 48, project: 'annflow', enter: 'fade'},
  AnnflowSeries: {duration: 15, project: 'annflow', enter: 'fade'},
};

export const scenes = {
  ...storyScenes,
  ...impactScenes,
  WordmarkEmergence: {duration: 4, y: 690},
  FloatingWebsite: {duration: 5, side: 'left'},
  EditorialScroll: {duration: 16},
  TypographyBreakout: {duration: 5},
  ProjectFocus: {duration: 5},
  FinalWebsiteReveal: {duration: 5, y: 750},
};

export const presets = {
  subtle: {transition: 0.38, travel: 0.32, zoom: 0.35},
  editorial: {transition: 0.72, travel: 1, zoom: 1},
  dynamic: {transition: 0.46, travel: 1.25, zoom: 1.18},
};

export function settings(projects, series = ['live-context']) {
  return z.object({
    duration: z.number().min(0.5).max(120),
    fps: z.number().min(12).max(120),
    width: z.number().int().min(180).max(4320).multipleOf(2),
    height: z.number().int().min(320).max(7680).multipleOf(2),
    x: z.number(), y: z.number(), scale: z.number().min(0.1).max(4),
    opacity: z.number().min(0).max(1), speed: z.number().min(0.25).max(4),
    enter: z.enum(['slide', 'fade', 'cut']), exit: z.enum(['slide', 'fade', 'cut']),
    preset: z.enum(['subtle', 'editorial', 'dynamic']),
    side: z.enum(['left', 'center', 'right']),
    project: z.enum(projects), series: z.enum(series),
    scrollFrom: z.enum(['hero', ...projects]), scrollTo: z.enum(projects),
    text: z.boolean(), tone: z.enum(['light', 'dark']), background: z.enum(['transparent', 'opaque']),
  });
}

export function defaults(scene, projects, series = ['live-context']) {
  return {
    fps: 30, width: 1080, height: 1920, x: 540, y: 880, scale: 1,
    opacity: 1, speed: 1, enter: 'slide', exit: 'fade', side: 'center',
    preset: 'editorial', project: projects[0], series: series[0], scrollFrom: 'hero',
    scrollTo: projects.at(-1), text: true, tone: 'light', background: 'transparent',
    ...scenes[scene],
  };
}

export const clamp = t => Math.min(1, Math.max(0, t));
export const ease = t => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
export const mix = (a, b, t) => a + (b - a) * t;

export function scrollAt(stops, progress) {
  const index = clamp(progress) * (stops.length - 1);
  const start = Math.floor(index);
  return mix(stops[start], stops[start + 1] ?? stops[start], ease((index - start - 0.12) / 0.72));
}
