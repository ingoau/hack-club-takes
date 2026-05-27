import { betterAuth } from 'better-auth';
import { genericOAuth } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import {
	BETTER_AUTH_SECRET,
	BETTER_AUTH_URL,
	HCA_CLIENT_ID,
	HCA_CLIENT_SECRET
} from '$env/static/private';

export const auth = betterAuth({
	baseURL: BETTER_AUTH_URL,
	secret: BETTER_AUTH_SECRET,
	user: {
		additionalFields: {
			slack_id: { type: 'string', input: false, required: true }
		}
	},
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: 'hca',
					clientId: HCA_CLIENT_ID!,
					clientSecret: HCA_CLIENT_SECRET!,
					discoveryUrl: 'https://auth.hackclub.com/.well-known/openid-configuration',
					scopes: ['openid', 'slack_id'],
					mapProfileToUser: async (profile) => ({
						name: profile.slack_id,
						email: profile.slack_id,
						slack_id: profile.slack_id
					})
				}
			]
		}),
		sveltekitCookies(getRequestEvent)
	]
});
