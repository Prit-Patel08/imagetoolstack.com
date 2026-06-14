import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const formatsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/formats" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
  }),
});

const articlesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = {
  'formats': formatsCollection,
  'articles': articlesCollection,
};
