import { defineCollection, z } from 'astro:content';

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.enum(['news', 'comparison', 'guide']).optional().default('news'),
    category: z.string(),
    date: z.coerce.date(),
    readTime: z.string(),
    excerpt: z.string(),
    heroImage: z.string().optional(),
    summary: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),

    // Comparison-specific fields
    items: z.array(z.string()).optional(),
    verdict: z.string().optional(),
    verdictText: z.string().optional(),
    specs: z.array(z.object({
      label: z.string(),
      key: z.boolean().optional().default(false),
      a: z.string(),
      b: z.string(),
      winner: z.enum(['a', 'b', 'draw']).optional(),
    })).optional(),
    scores: z.array(z.object({
      category: z.string(),
      a: z.number(),
      b: z.number(),
    })).optional(),

    // Guide-specific fields
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    timeRequired: z.string().optional(),
    tools: z.array(z.string()).optional(),
    parts: z.array(z.string()).optional(),
  }),
});

export const collections = { news };
