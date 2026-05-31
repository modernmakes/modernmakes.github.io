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
    material: z.string(),
    materialFull: z.string(),
    verdict: z.string(),
    verdictLabel: z.string(),
    summary: z.string(),
    publishedDate: z.string(),
    updatedDate: z.string(),
    stats: z.object({
      nozzleTemp: z.string(),
      bedTemp: z.string(),
      chamberTemp: z.string(),
      coolingFan: z.string(),
      maxSpeed: z.string(),
      heatDeflection: z.string(),
      difficulty: z.string(),
    }),
    brands: z.array(z.object({
      name: z.string(),
      tier: z.string(),
      price: z.string(),
      notes: z.string(),
      affiliate: z.boolean(),
    })),
    compatibility: z.array(z.object({
      printer: z.string(),
      rating: z.string(),
      notes: z.string(),
    })),
    failureModes: z.array(z.object({
      issue: z.string(),
      cause: z.string(),
      fix: z.string(),
    })),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    excerpt: z.string().optional(),
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
