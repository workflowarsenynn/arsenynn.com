// Списки блоков с видео на главной.
import bessmislennost from '../content/stream/bessmislennost.json';
import arsenynn from '../content/stream/arsenynn.json';

export type StreamPost = { post: number; kind: string; text: string; date: string; src?: string; poster?: string; w?: number; h?: number };

const lists: Record<string, StreamPost[]> = {
  '/stream/bessmislennost.json': bessmislennost,
  '/stream/arsenynn.json': arsenynn,
};

export const streamPosts = (source: string) => lists[source] ?? [];
