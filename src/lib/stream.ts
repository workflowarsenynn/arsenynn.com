// Списки блоков с видео на главной.
import bessmislennost from '../content/stream/bessmislennost.json';
import arsenynn from '../content/stream/arsenynn.json';
import workflow from '../content/stream/workflow.json';

export type StreamPost = { post: number; kind: string; text: string; date: string; src?: string; poster?: string; w?: number; h?: number; url?: string; lead?: boolean };

const lists: Record<string, StreamPost[]> = {
  '/stream/bessmislennost.json': bessmislennost,
  '/stream/arsenynn.json': arsenynn,
  '/stream/workflow.json': workflow,
};

export const streamPosts = (source: string) => lists[source] ?? [];
