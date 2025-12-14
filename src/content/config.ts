import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		tags: z.string(),
		// Transform string to Date object
		publishedAt: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const portfolio = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		section: z.enum(['software', 'football', 'contact', 'projects']),
		publishedAt: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
		featured: z.boolean().optional(),
	}),
});

const hidden = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		section: z.string(), // piro, poetry, about, software, football, etc.
		conversational: z.boolean().default(true),
		publishedAt: z.coerce.date().optional(),
	}),
});

export const collections = { blog, portfolio, hidden };
