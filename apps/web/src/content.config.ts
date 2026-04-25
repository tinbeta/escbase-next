import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.string(),
    tag: z.string(),
    tagIcon: z.string().optional().default('fas fa-newspaper'),
    tagColor: z.string().optional().default('#2563eb'),
    readTime: z.string().optional().default('5 min read'),
    featured: z.boolean().optional().default(false),
    image: z.string().optional(),
    ogImage: z.string().optional(),
    author: z.string().optional().default('Escbase'),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { blog };
