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
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: 'hca',
					clientId: HCA_CLIENT_ID!,
					clientSecret: HCA_CLIENT_SECRET!,
					discoveryUrl: 'https://auth.hackclub.com/.well-known/openid-configuration',
					scopes: ['openid', 'slack_id']
				}
			]
		}),
		sveltekitCookies(getRequestEvent)
	]
});
