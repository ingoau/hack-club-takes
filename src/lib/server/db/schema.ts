import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';

export const task = pgTable('take', {
	// Slack message timestamp
	ts: text('ts').primaryKey(),
	content: text('content').notNull(),
	upvotes: integer('upvotes').notNull().default(0),
	downvotes: integer('downvotes').notNull().default(0)
});
