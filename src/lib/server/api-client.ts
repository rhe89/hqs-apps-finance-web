/**
 * Server-only mTLS API client.
 * Loads the client certificate from env-specified paths and attaches it to every
 * request to the Finance API. The certificate never reaches the browser.
 */
import https from 'node:https';
import fs from 'node:fs';
import { env } from '$env/dynamic/private';

export interface AccountDto {
	id: string;
	bank: string;
	accountNumber: string;
	accountName: string;
	currency: string;
	balance: number;
}

export interface TransactionDto {
	id: string;
	accountId: string;
	bank: string;
	bookingDate: string;
	description: string;
	amount: number;
	currency: string;
	category: string | null;
	subCategory: string | null;
	transactionType: string | null;
	receivingAccountNumber: string | null;
	archiveReference: string | null;
	fromAccountNumber: string | null;
	toAccountNumber: string | null;
	kidReference: string | null;
	merchantArea: string | null;
	originalAmount: number | null;
	originalCurrency: string | null;
	exchangeRate: number | null;
}

export interface PagedResult<T> {
	items: T[];
	page: number;
	pageSize: number;
	totalCount: number;
	hasNextPage: boolean;
}

export interface BalanceHistoryDto {
	month: string;
	balance: number;
	currency: string;
}

export interface CategorySummaryDto {
	category: string;
	income: number;
	spending: number;
	transactionCount: number;
}

export interface CategoryBreakdownDto {
	category: string;
	subCategory: string | null;
	income: number;
	spending: number;
	transactionCount: number;
}

export interface TransactionFilter {
	search?: string;
	from?: string;
	to?: string;
	category?: string;
	minAmount?: number;
	maxAmount?: number;
	page?: number;
	pageSize?: number;
}

// ── Build the HTTPS agent once at module load ─────────────────────────────────

function buildAgent(): https.Agent | undefined {
	const certPath = env.FINANCE_API_CLIENT_CERT_PATH;
	const keyPath = env.FINANCE_API_CLIENT_KEY_PATH;
	const caPath = env.FINANCE_API_CA_CERT_PATH;

	if (!certPath || !keyPath) {
		// No cert configured — connect without mTLS.
		// The Finance API must have DisableMtls=true for this to work.
		return new https.Agent({ rejectUnauthorized: false });
	}

	return new https.Agent({
		cert: fs.readFileSync(certPath),
		key: fs.readFileSync(keyPath),
		ca: caPath ? fs.readFileSync(caPath) : undefined,
		rejectUnauthorized: true
	});
}

const agent = buildAgent();
const baseUrl = env.FINANCE_API_BASE_URL ?? 'https://localhost:7200';

async function apiFetch<T>(path: string): Promise<T> {
	const url = `${baseUrl}${path}`;
	const response = await fetch(url, {
		// @ts-expect-error — Node 18+ fetch accepts `agent` via undici dispatcher,
		// but we use the native https agent for mTLS support.
		agent,
		headers: { Accept: 'application/json' }
	});

	if (!response.ok) {
		throw new Error(`Finance API ${response.status}: ${path}`);
	}
	return response.json();
}

// ── Public API ────────────────────────────────────────────────────────────────

export const financeApi = {
	accounts: {
		getAll: (): Promise<AccountDto[]> => apiFetch('/accounts'),
		getById: (id: string): Promise<AccountDto> => apiFetch(`/accounts/${id}`),
		getTransactions: (id: string, filter: TransactionFilter = {}): Promise<PagedResult<TransactionDto>> => {
			const params = new URLSearchParams();
			if (filter.search) params.set('search', filter.search);
			if (filter.from) params.set('from', filter.from);
			if (filter.to) params.set('to', filter.to);
			if (filter.category) params.set('category', filter.category);
			if (filter.minAmount != null) params.set('minAmount', String(filter.minAmount));
			if (filter.maxAmount != null) params.set('maxAmount', String(filter.maxAmount));
			if (filter.page) params.set('page', String(filter.page));
			if (filter.pageSize) params.set('pageSize', String(filter.pageSize));
			const qs = params.toString();
			return apiFetch(`/accounts/${id}/transactions${qs ? `?${qs}` : ''}`);
		},
		getBalanceHistory: (id: string, months = 12): Promise<BalanceHistoryDto[]> =>
			apiFetch(`/accounts/${id}/balance-history?months=${months}`)
	},
	transactions: {
		getById: (id: string): Promise<TransactionDto> => apiFetch(`/transactions/${id}`)
	},
	categories: {
		getSummary: (from?: string, to?: string, accountIds?: string[]): Promise<CategorySummaryDto[]> => {
			const params = new URLSearchParams();
			if (from) params.set('from', from);
			if (to) params.set('to', to);
			accountIds?.forEach((id) => params.append('accountIds', id));
			const qs = params.toString();
			return apiFetch(`/categories/summary${qs ? `?${qs}` : ''}`);
		},
		getBreakdown: (category: string, from?: string, to?: string): Promise<CategoryBreakdownDto[]> => {
			const params = new URLSearchParams();
			if (from) params.set('from', from);
			if (to) params.set('to', to);
			const qs = params.toString();
			return apiFetch(`/categories/${encodeURIComponent(category)}/breakdown${qs ? `?${qs}` : ''}`);
		}
	}
};
