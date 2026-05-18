import { db } from '$lib/server/db';
import { take } from '$lib/server/db/schema';

export const load = async () => {
	const takes = await db.select().from(take);
	takes.map((take) => ({ ...take, score: take.upvotes - take.downvotes }));
	return { takes };
};
