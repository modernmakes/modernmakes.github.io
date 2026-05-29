import { defineCollection, z } from 'astro:content';

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    readTime: z.string(),
    excerpt: z.string(),
    heroImage: z.string().optional(),
    summary: z.array(z.string()),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { news };
