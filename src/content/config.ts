import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    author: z.string(),
    image: z.string().optional(),
    description: z.string(),
    category: z.string(),
    status: z.enum(['draft', 'published']).default('draft'),
    notificationSent: z.boolean().optional().default(false),
  }),
});

export const collections = {
  'blog': blogCollection,
};
