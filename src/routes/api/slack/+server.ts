import {
	PayloadType,
	SlackApp,
	isPostedMessageEvent,
	type AnyMessageItem,
	type BotMessageEvent,
	type FileShareMessageEvent,
	type GenericMessageEvent,
	type MessageChangedEvent,
	type ThreadBroadcastMessageEvent
} from 'slack-edge';
import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from '$env/static/private';
import { PUBLIC_CHANNEL_ID } from '$env/static/public';
import { db } from '$lib/server/db/index.js';
import { take } from '$lib/server/db/schema.js';
import { authorize } from './authorize';
import { eq } from 'drizzle-orm';
import homeBlocks from './app-home.js';
import { isAdmin } from './utils.js';

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

	const existingTake = await db.query.take.findFirst({
		where: eq(take.ts, payload.ts)
	});

	if (existingTake) {
		await db
			.update(take)
			.set({
				content: takeText
			})
			.where(eq(take.ts, payload.ts));
		return;
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
		(isPostedMessageEvent(payload) ||
			payload.subtype === 'message_changed' ||
			payload.subtype === 'message_deleted')
	) {
		if ('thread_ts' in payload) {
			return;
		}
		if (payload.subtype === 'message_deleted') {
			await db.delete(take).where(eq(take.ts, payload.previous_message.ts));
			return;
		} else if (payload.subtype === 'message_changed') {
			if (
				isPostedMessageEvent(payload.message) &&
				!payload.message.subtype &&
				!('thread_ts' in payload.message)
			) {
				await addOrUpdateMessage(payload.message);
			}
		} else if (!payload.subtype) {
			await addOrUpdateMessage(payload);
		}
	}
	return;
});

app.event('reaction_added', async ({ payload, context }) => {
	if (
		context.channelId === PUBLIC_CHANNEL_ID &&
		(payload.reaction === 'upvote' || payload.reaction === 'downvote')
	) {
		const takeRecord = await db.query.take.findFirst({
			where: eq(take.ts, payload.item.ts)
		});
		if (!takeRecord) return;
		const { upvotes, downvotes } = takeRecord;
		await db
			.update(take)
			.set({
				upvotes: payload.reaction === 'upvote' ? upvotes + 1 : upvotes,
				downvotes: payload.reaction === 'downvote' ? downvotes + 1 : downvotes
			})
			.where(eq(take.ts, payload.item.ts));
	}
});

app.event('reaction_removed', async ({ payload, context }) => {
	if (
		context.channelId === PUBLIC_CHANNEL_ID &&
		(payload.reaction === 'upvote' || payload.reaction === 'downvote')
	) {
		const takeRecord = await db.query.take.findFirst({
			where: eq(take.ts, payload.item.ts)
		});
		if (!takeRecord) return;
		const { upvotes, downvotes } = takeRecord;
		await db
			.update(take)
			.set({
				upvotes: payload.reaction === 'upvote' ? upvotes - 1 : upvotes,
				downvotes: payload.reaction === 'downvote' ? downvotes - 1 : downvotes
			})
			.where(eq(take.ts, payload.item.ts));
	}
});

app.event('app_home_opened', async ({ payload, context }) => {
	await context.client.views.publish({
		user_id: payload.user,
		view: {
			type: 'home',
			blocks: [...homeBlocks.main, ...(isAdmin(payload.user) ? homeBlocks.admin : [])]
		}
	});
});

export async function POST({ request }) {
	return await app.run(request);
}
