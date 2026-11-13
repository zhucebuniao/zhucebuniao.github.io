import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './_posts',
    generateId: ({ entry }) => entry.replace(/\.md$/i, ''),
  }),
  schema: z.object({
    layout: z.string().optional(),
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['dream', 'travel', 'novel', 'diary']).default('dream'),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { posts };
