import { betterAuth } from 'better-auth';
import { genericOAuth } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

export const auth = betterAuth({
	plugins: [
		genericOAuth({
			config: [
				{
					providerId: 'hca',
					clientId: process.env.HCA_CLIENT_ID!,
					clientSecret: process.env.HCA_CLIENT_SECRET!,
					discoveryUrl: 'https://auth.hackclub.com/.well-known/openid-configuration',
					scopes: ['openid', 'slack_id']
				}
			]
		}),
		sveltekitCookies(getRequestEvent)
	]
});
