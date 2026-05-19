import { SlackApp } from 'slack-edge';

const app = new SlackApp({
	env: {
		SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET!,
		SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN!,
		SLACK_LOGGING_LEVEL: 'DEBUG'
	}
});

export async function POST({ request }) {
	return await app.run(request);
}
