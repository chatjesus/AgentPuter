import { defineCollection, z } from 'astro:content';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  author: z.string().default('AgentPuter Lab'),
  readingTime: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
});

const blog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const zhBlog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const ja_blog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const ko_blog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const es_blog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const pt_br_blog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const de_blog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const fr_blog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const zh_tw_blog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

const ru_blog = defineCollection({
  type: 'content',
  schema: blogSchema,
});

export const collections = { blog, 'zh-blog': zhBlog, 'zh-tw-blog': zh_tw_blog, 'fr-blog': fr_blog, 'de-blog': de_blog, 'pt-br-blog': pt_br_blog, 'es-blog': es_blog, 'ko-blog': ko_blog, 'ja-blog': ja_blog, 'ru-blog': ru_blog };
