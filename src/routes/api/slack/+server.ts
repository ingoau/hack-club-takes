import { SlackApp } from 'slack-edge';
import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from '$env/static/private';

const app = new SlackApp({
	env: {
		SLACK_SIGNING_SECRET: SLACK_SIGNING_SECRET!,
		SLACK_BOT_TOKEN: SLACK_BOT_TOKEN!,
	}
});

export async function POST({ request }) {
	return await app.run(request);
}
