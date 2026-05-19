import {
	PayloadType,
	SlackApp,
	isPostedMessageEvent,
	type BotMessageEvent,
	type FileShareMessageEvent,
	type GenericMessageEvent,
	type ThreadBroadcastMessageEvent
} from 'slack-edge';
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

async function addOrUpdateMessage(
	payload: GenericMessageEvent | FileShareMessageEvent | ThreadBroadcastMessageEvent
) {
	let takeText = payload.text;

	// Handle forwards
	if (
		payload.attachments &&
		'is_msg_unfurl' in payload.attachments[0] &&
		payload.attachments[0].is_msg_unfurl
	) {
		// If additional message text
		if (!(takeText.trim().length === 0)) {
			takeText = takeText + '\n';
		}
		// Error handling...
		if (!payload.attachments[0].text) {
			return;
		}
		takeText = takeText + payload.attachments[0].text;
	}

	await db.insert(take).values({
		content: takeText,
		ts: payload.ts
	});
}

app.event('message', async ({ payload, context }) => {
	if (
		context.channelId === PUBLIC_CHANNEL_ID &&
		payload.type === 'message' &&
		isPostedMessageEvent(payload) &&
		!payload.subtype
	) {
		await addOrUpdateMessage(payload);
	}
	return;
});

export async function POST({ request }) {
	return await app.run(request);
}
