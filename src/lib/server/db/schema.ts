import { pgTable, boolean, integer, text } from 'drizzle-orm/pg-core';

export const take = pgTable('take', {
	// Slack message timestamp
	ts: text('ts').primaryKey(),
	content: text('content').notNull(),
	upvotes: integer('upvotes').notNull().default(0),
	downvotes: integer('downvotes').notNull().default(0),
	deleted: boolean('deleted').notNull().default(false)
});
