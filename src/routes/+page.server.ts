import { db } from '$lib/server/db';
import { take } from '$lib/server/db/schema';

export const load = async () => {
	const takes = await db.select().from(take);
	const scoredTakes = takes.map((take) => ({ ...take, score: take.upvotes - take.downvotes })).sort((a, b) => b.score - a.score);
	return { takes: scoredTakes };
};
