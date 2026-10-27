import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().trim().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase URL slug with hyphens.'),
    description: z.string().trim().min(1).max(240),
    category: z.string().trim().min(1),
    series: z.string().trim().min(1).optional(),
    tags: z.array(z.string().trim().min(1)).default([]),
    publicationDate: z.coerce.date(),
    status: z.enum(['draft', 'published']),
    readingTime: z.number().int().positive(),
    sample: z.boolean().default(false),
    sourceReferences: z.array(
      z.object({
        label: z.string().trim().min(1),
        reference: z.string().trim().min(1),
        url: z.string().url().optional(),
      }),
    ).optional(),
  }),
});

export const collections = { articles };
