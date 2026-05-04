import { financeApi } from '$lib/server/api-client';
import { favoritesDb } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { accounts, favorites } = await parent();

	const favoriteIds = new Set(favorites.map((f) => f.accountId));
	const favoriteAccounts = accounts.filter((a) => favoriteIds.has(a.id));

	const today = new Date();
	const firstOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
	const lastOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
	const from = firstOfLastMonth.toISOString().split('T')[0];
	const to = lastOfLastMonth.toISOString().split('T')[0];

	const [topCategories, recentTransactions] = await Promise.all([
		financeApi.categories.getSummary(from, to),
		favoriteAccounts.length > 0
			? financeApi.accounts.getTransactions(favoriteAccounts[0].id, { pageSize: 10 })
			: Promise.resolve({ items: [], page: 1, pageSize: 10, totalCount: 0, hasNextPage: false })
	]);

	const crossBankTotal = favoriteAccounts.reduce((sum, a) => sum + a.balance, 0);

	return {
		favoriteAccounts,
		allAccounts: accounts,
		topCategories: topCategories.slice(0, 5),
		recentTransactions: recentTransactions.items,
		crossBankTotal,
		favorites
	};
};

export const actions: Actions = {
	addFavorite: async ({ request }) => {
		const data = await request.formData();
		const accountId = data.get('accountId')?.toString();
		const bank = data.get('bank')?.toString();
		if (!accountId || !bank) return fail(400, { error: 'Missing fields' });
		favoritesDb.add(accountId, bank);
		return { success: true };
	},
	removeFavorite: async ({ request }) => {
		const data = await request.formData();
		const accountId = data.get('accountId')?.toString();
		if (!accountId) return fail(400, { error: 'Missing accountId' });
		favoritesDb.remove(accountId);
		return { success: true };
	}
};
