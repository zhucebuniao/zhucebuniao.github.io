import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { CN, getPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: '梦与远方',
    description: '夜里写下的梦境，白天去过的远方',
    site: context.site || 'https://zhucebuniao.github.io',
    items: posts.map((post) => ({
      title: post.st ? `${post.t} · ${post.st}` : post.t,
      pubDate: post.date,
      description: post.ex,
      link: post.u,
      categories: [CN[post.c]],
    })),
  });
}
