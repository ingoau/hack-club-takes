import { SlackApp, isPostedMessageEvent } from 'slack-edge';
import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from '$env/static/private';
import { PUBLIC_CHANNEL_ID } from '$env/static/public';
import { db } from '$lib/server/db/index.js';
import { take } from '$lib/server/db/schema.js';
import { authorize } from './authorize';

const app = new SlackApp({
	env: {
		SLACK_SIGNING_SECRET: SLACK_SIGNING_SECRET!,
		SLACK_BOT_TOKEN: SLACK_BOT_TOKEN!
	},
	authorize: authorize
});

app.event('message', async ({ payload, context }) => {
	if (context.channelId === PUBLIC_CHANNEL_ID && payload.type === 'message' && 'text' in payload) {
		let takeText = payload.text;

		// Handle forwards
		if (
			'attachments' in payload &&
			payload.attachments &&
			'is_msg_unfurl' in payload.attachments[0] &&
			payload.attachments[0].is_msg_unfurl
		) {
			// If no message text
			if (takeText.trim().length === 0) {
				// Error handling...
				if (!payload.attachments[0].text) {
					return;
				}
				takeText = payload.attachments[0].text;
			} else {
				takeText = `${takeText}\n${payload.attachments[0].text}`;
			}
		}

		await db.insert(take).values({
			content: takeText,
			ts: payload.ts
		});
	}
	return;
});

export async function POST({ request }) {
	return await app.run(request);
}
