import { defineCollection, z } from 'astro:content';

const home = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
	}),
});

const football = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishedAt: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
	}),
});

const software = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishedAt: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
	}),
});

const projects = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishedAt: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
	}),
});

const notes = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		section: z.string(),
		publishedAt: z.coerce.date().optional(),
	}),
});

const x = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		section: z.string(), // piro, poetry, about, etc.
		conversational: z.boolean().default(true),
		publishedAt: z.coerce.date().optional(),
	}),
});

export const collections = { home, football, software, projects, notes, x };
