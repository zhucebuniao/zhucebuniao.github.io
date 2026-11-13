import type { APIRoute } from 'astro';
import { getAllPosts } from '../utils/posts';

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const payload = posts.map((p) => ({
    id: p.id,
    url: p.url,
    title: p.title,
    subtitle: p.subtitle || '',
    date: p.dateFormatted,
    category: p.category,
    categoryLabel: p.categoryMeta.label,
    city: p.city?.name || '',
    excerpt: p.excerpt,
    plainText: p.plainText.slice(0, 600),
  }));

  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
