// Список работ для блока на главной: грузится только когда блок виден.
import posts from '../../content/stream/workflow.json';

export const GET = () => new Response(JSON.stringify(posts), { headers: { 'Content-Type': 'application/json' } });
