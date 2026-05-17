import { db } from '$lib/server/db';
import { take } from '$lib/server/db/schema';

export const load = async () => {
	const takes = await db.select().from(take);
	return { takes };
};
