import { SLACK_BOT_TOKEN } from '$env/static/private';
import type { AuthorizeResult } from 'slack-edge';

export async function authorize(): Promise<AuthorizeResult> {
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
