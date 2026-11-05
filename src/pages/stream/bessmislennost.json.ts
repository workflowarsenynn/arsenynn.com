// Список постов для блока случайных постов: грузится только когда блок виден.
import posts from '../../content/stream/bessmislennost.json';

export const GET = () => new Response(JSON.stringify(posts), { headers: { 'Content-Type': 'application/json' } });
