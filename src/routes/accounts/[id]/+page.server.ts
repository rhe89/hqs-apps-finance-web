import { financeApi } from '$lib/server/api-client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const page = parseInt(url.searchParams.get('page') ?? '1');
	const filter = {
		search: url.searchParams.get('search') ?? undefined,
		from: url.searchParams.get('from') ?? undefined,
		to: url.searchParams.get('to') ?? undefined,
		category: url.searchParams.get('category') ?? undefined,
		minAmount: url.searchParams.get('minAmount') ? Number(url.searchParams.get('minAmount')) : undefined,
		maxAmount: url.searchParams.get('maxAmount') ? Number(url.searchParams.get('maxAmount')) : undefined,
		page,
		pageSize: 25
	};

	const [account, transactions, balanceHistory] = await Promise.all([
		financeApi.accounts.getById(params.id),
		financeApi.accounts.getTransactions(params.id, filter),
		financeApi.accounts.getBalanceHistory(params.id)
	]);

	if (!account) error(404, 'Account not found');

	return { account, transactions, balanceHistory, filter };
};
