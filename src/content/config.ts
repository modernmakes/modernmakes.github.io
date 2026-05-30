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
    summary: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
  }),
});

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    readTime: z.string(),
    excerpt: z.string(),
    heroImage: z.string().optional(),
    summary: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    timeRequired: z.string(),
    tools: z.array(z.string()).optional().default([]),
    parts: z.array(z.string()).optional().default([]),
    guideCategory: z.enum([
      'Calibration',
      'Hardware Setup',
      'Software & Firmware',
      'Filament',
      'Troubleshooting',
      'Builds',
    ]).optional(),
  }),
});

const comparisons = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    readTime: z.string(),
    excerpt: z.string(),
    heroImage: z.string().optional(),
    summary: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
    items: z.array(z.string()),
    verdict: z.string().optional(),
    verdictText: z.string().optional(),
    specs: z.array(z.object({
      label: z.string(),
      key: z.boolean().optional().default(false),
      a: z.string(),
      b: z.string(),
      winner: z.enum(['a', 'b', 'draw']).optional(),
    })).optional().default([]),
    scores: z.array(z.object({
      category: z.string(),
      a: z.number(),
      b: z.number(),
    })).optional().default([]),
  }),
});

const filament = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.string().optional(),
    featured: z.boolean().optional().default(false),
  }),
});

const hardware = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.string().optional(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { news, guides, comparisons, filament, hardware };
