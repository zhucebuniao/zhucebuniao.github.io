import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zhucebuniao.github.io',
  integrations: [sitemap()],
  image: {
    service: passthroughImageService(),
  },
  build: {
    format: 'directory',
  },
  redirects: {
    '/dreams': '/?cat=dream#archive',
    '/travels': '/?cat=travel#archive',
    '/novel': '/?cat=novel#archive',
    '/diary': '/?cat=diary#archive',
  },
  markdown: {
    shikiConfig: {
      theme: 'tokyo-night',
    },
  },
});
