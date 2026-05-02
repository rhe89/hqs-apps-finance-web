import { json, error } from '@sveltejs/kit';
import { favoritesDb } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json(favoritesDb.getAll());
};

export const POST: RequestHandler = async ({ request }) => {
	const { accountId, bank } = await request.json();
	if (!accountId || !bank) error(400, 'accountId and bank are required');
	favoritesDb.add(accountId, bank);
	return json({ ok: true });
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { accountId } = await request.json();
	if (!accountId) error(400, 'accountId is required');
	favoritesDb.remove(accountId);
	return json({ ok: true });
};
