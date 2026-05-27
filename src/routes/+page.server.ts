import { auth } from '$lib/auth.js';
import { db } from '$lib/server/db';
import { take } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	if (!event.locals.user) {
		const { redirect: shouldRedirect, url } = await auth.api.signInWithOAuth2({
			body: {
				providerId: 'hca',
				callbackURL: event.url.host
			}
		});
		if (shouldRedirect) {
			return redirect(302, url);
		}
	}
	const takes = await db.select().from(take).where(eq(take.hidden, false));
	const scoredTakes = takes
		.map((take) => ({ ...take, score: take.upvotes - take.downvotes }))
		.sort((a, b) => b.score - a.score);
	return { takes: scoredTakes };
};
