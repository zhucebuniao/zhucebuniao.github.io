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
  markdown: {
    shikiConfig: {
      theme: 'tokyo-night',
    },
  },
});
