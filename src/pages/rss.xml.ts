import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllPosts } from '../utils/posts';

export async function GET(context: APIContext) {
  const posts = await getAllPosts();
  return rss({
    title: '梦与远方',
    description: '夜里写下的梦境，白天去过的远方',
    site: context.site || 'https://zhucebuniao.github.io',
    items: posts.map((post) => ({
      title: post.subtitle ? `${post.title} · ${post.subtitle}` : post.title,
      pubDate: post.date,
      description: post.excerpt,
      link: post.url,
      categories: [post.categoryMeta.label],
    })),
  });
}
