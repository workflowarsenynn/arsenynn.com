// Список глав для блока на главной: грузится только когда блок виден.
import posts from '../../content/stream/arsenynn.json';

export const GET = () => new Response(JSON.stringify(posts), { headers: { 'Content-Type': 'application/json' } });
