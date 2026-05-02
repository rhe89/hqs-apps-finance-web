import { financeApi } from '$lib/server/api-client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const today = new Date();
	const defaultFrom = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
	const defaultTo = today.toISOString().split('T')[0];

	const from = url.searchParams.get('from') ?? defaultFrom;
	const to = url.searchParams.get('to') ?? defaultTo;
	const expandedCategory = url.searchParams.get('category') ?? null;

	const [summary, breakdown] = await Promise.all([
		financeApi.categories.getSummary(from, to),
		expandedCategory ? financeApi.categories.getBreakdown(expandedCategory, from, to) : Promise.resolve(null)
	]);

	return { summary, breakdown, expandedCategory, from, to };
};
