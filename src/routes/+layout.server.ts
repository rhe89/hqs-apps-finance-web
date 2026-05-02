import { financeApi } from '$lib/server/api-client';
import { favoritesDb } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const [accounts, favorites] = await Promise.all([
		financeApi.accounts.getAll(),
		Promise.resolve(favoritesDb.getAll())
	]);

	return { accounts, favorites };
};
