import { db } from '$lib/server/db';
import { take } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
	const takes = await db.select().from(take).where(eq(take.deleted, false));
	const scoredTakes = takes.map((take) => ({ ...take, score: take.upvotes - take.downvotes })).sort((a, b) => b.score - a.score);
	return { takes: scoredTakes };
};
