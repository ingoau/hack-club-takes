import { SlackApp, isPostedMessageEvent, type AuthorizeResult } from 'slack-edge';
import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from '$env/static/private';
import { PUBLIC_CHANNEL_ID } from '$env/static/public';
import { db } from '$lib/server/db/index.js';
import { take } from '$lib/server/db/schema.js';

async function authorizeWithDebug(): Promise<AuthorizeResult> {
	const response = await fetch('https://slack.com/api/auth.test', {
		headers: {
			authorization: `Bearer ${SLACK_BOT_TOKEN}`
		},
		signal: AbortSignal.timeout(5000)
	});
	const body = await response.json();

	if (!body.ok) {
		throw new Error(`Slack auth.test failed: ${body.error ?? response.status}`);
	}

	return {
		botToken: SLACK_BOT_TOKEN,
		enterpriseId: body.enterprise_id,
		teamId: body.team_id,
		team: body.team,
		url: body.url,
		botId: body.bot_id,
		botUserId: body.user_id,
		userId: body.user_id,
		user: body.user,
		botScopes: response.headers.get('x-oauth-scopes')?.split(',') ?? [],
		userToken: undefined,
		userScopes: undefined
	};
}

const app = new SlackApp({
	env: {
		SLACK_SIGNING_SECRET: SLACK_SIGNING_SECRET!,
		SLACK_BOT_TOKEN: SLACK_BOT_TOKEN!
	},
	authorize: authorizeWithDebug
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

		console.log(`New take: ${takeText}`);
	}
	return;
});

export async function POST({ request }) {
	return await app.run(request);
}
