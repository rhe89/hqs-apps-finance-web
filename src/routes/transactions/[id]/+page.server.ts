import { financeApi } from '$lib/server/api-client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const transaction = await financeApi.transactions.getById(params.id);
	if (!transaction) error(404, 'Transaction not found');
	return { transaction };
};
