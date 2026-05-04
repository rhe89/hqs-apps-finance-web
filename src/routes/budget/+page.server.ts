import { financeApi } from '$lib/server/api-client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const today = new Date();
	const defaultFrom = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
	const defaultTo = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];

	const from = url.searchParams.get('from') ?? defaultFrom;
	const to = url.searchParams.get('to') ?? defaultTo;
	const expandedCategory = url.searchParams.get('category') ?? null;
	const expandedSubCategory = url.searchParams.get('subCategory') ?? null;

	const [summary, breakdown, subCategoryTransactions] = await Promise.all([
		financeApi.categories.getSummary(from, to),
		expandedCategory ? financeApi.categories.getBreakdown(expandedCategory, from, to) : Promise.resolve(null),
		expandedCategory && expandedSubCategory
			? financeApi.transactions.getAll({ category: expandedCategory, subCategory: expandedSubCategory, from, to, pageSize: 100 })
			: Promise.resolve(null)
	]);

	return { summary, breakdown, expandedCategory, expandedSubCategory, subCategoryTransactions, from, to };
};
