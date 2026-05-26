import { ADMINS } from '$env/static/private';

export const isAdmin = (userId: string) => {
	return ADMINS.includes(userId);
};
