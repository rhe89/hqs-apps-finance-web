<script lang="ts">
import BalanceChart from '$lib/components/BalanceChart.svelte';
import { getCategoryIcon } from '$lib/utils/categoryIcons';
import {
CreditCard, TrendingUp, SlidersHorizontal, ArrowUpRight, ArrowDownLeft,
ChevronLeft, ChevronRight, Hash, Tag, GitBranch
} from 'lucide-svelte';
import type { PageData } from './$types';

let { data }: { data: PageData } = $props();

function formatAmount(n: number, currency = 'NOK') {
return new Intl.NumberFormat('nb-NO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}
function formatDate(d: string) {
return new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
}

const bankColors: Record<string, string> = {
Sbanken: '#0070f3', BulderBank: '#22863a', BankNorwegian: '#d73a49'
};

function buildPageUrl(page: number) {
const p = new URLSearchParams(
Object.entries(data.filter)
.filter(([, v]) => v != null && v !== undefined)
.map(([k, v]) => [k, String(v)])
);
p.set('page', String(page));
return `?${p.toString()}`;
}
</script>

<svelte:head><title>{data.account.accountName} — Finance</title></svelte:head>

<div class="page-header">
<div class="account-title">
<div class="bank-tag" style="--color: {bankColors[data.account.bank] ?? '#888'}">
<CreditCard size={11} strokeWidth={2} />
{data.account.bank}
</div>
<h1>{data.account.accountName}</h1>
</div>
<div class="balance" class:amount-negative={data.account.balance < 0}>
{formatAmount(data.account.balance, data.account.currency)}
</div>
<div class="acct-number text-muted text-xs">
<Hash size={11} strokeWidth={1.75} />
{data.account.accountNumber}
</div>
</div>

<!-- Balance history chart -->
{#if data.balanceHistory.length > 0}
<section class="section card">
<h2 class="section-title">
<TrendingUp size={15} strokeWidth={1.75} />
Balance Last 12 Months
</h2>
<BalanceChart history={data.balanceHistory} currency={data.account.currency} />
</section>
{/if}

<!-- Filter bar -->
<form method="GET" class="filter-bar card">
<div class="filter-bar-icon"><SlidersHorizontal size={14} strokeWidth={1.75} /></div>
<input
type="text"
name="search"
placeholder="Search transactions…"
value={data.filter.search ?? ''}
class="filter-input"
/>
<input type="date" name="from" value={data.filter.from ?? ''} class="filter-input" />
<input type="date" name="to" value={data.filter.to ?? ''} class="filter-input" />
<input type="text" name="category" placeholder="Category" value={data.filter.category ?? ''} class="filter-input" />
<input type="number" name="minAmount" placeholder="Min" value={data.filter.minAmount ?? ''} class="filter-input filter-input-sm" />
<input type="number" name="maxAmount" placeholder="Max" value={data.filter.maxAmount ?? ''} class="filter-input filter-input-sm" />
<button type="submit" class="btn btn-primary">Apply</button>
<a href="?" class="btn">Clear</a>
</form>

<!-- Transaction list -->
<section class="section">
<div class="section-header">
<h2 class="section-title">
<ArrowUpRight size={15} strokeWidth={1.75} />
Transactions
</h2>
<span class="text-muted text-sm">{data.transactions.totalCount} total</span>
</div>

{#if data.transactions.items.length === 0}
<div class="empty-state card text-muted">No transactions match the filters.</div>
{:else}
<div class="transaction-list card">
{#each data.transactions.items as tx}
<a href="/transactions/{tx.id}" class="tx-row">
<div class="tx-icon" class:tx-icon-in={tx.amount > 0} class:tx-icon-out={tx.amount < 0}>
{#if tx.amount > 0}
<ArrowDownLeft size={13} strokeWidth={2} />
{:else}
<ArrowUpRight size={13} strokeWidth={2} />
{/if}
</div>
<div class="tx-left">
<div class="tx-desc">{tx.description}</div>
<div class="tx-meta text-muted text-xs">
{formatDate(tx.bookingDate)}
{#if tx.category}
{@const CatIcon = getCategoryIcon(tx.category)}
<span class="tx-cat">
<CatIcon size={10} strokeWidth={1.75} />
{tx.category}
</span>
{/if}
{#if tx.subCategory}
<span class="tx-subcat">
<GitBranch size={10} strokeWidth={1.75} />
{tx.subCategory}
</span>
{/if}
</div>
</div>
<div class="tx-amount" class:amount-positive={tx.amount > 0} class:amount-negative={tx.amount < 0}>
{formatAmount(tx.amount, tx.currency)}
</div>
</a>
{/each}
</div>

<!-- Pagination -->
{#if data.transactions.totalCount > 25}
<div class="pagination">
{#if data.filter.page > 1}
<a href={buildPageUrl(data.filter.page - 1)} class="btn">
<ChevronLeft size={14} strokeWidth={2} /> Prev
</a>
{/if}
<span class="text-muted text-sm">Page {data.filter.page}</span>
{#if data.transactions.hasNextPage}
<a href={buildPageUrl(data.filter.page + 1)} class="btn">
Next <ChevronRight size={14} strokeWidth={2} />
</a>
{/if}
</div>
{/if}
{/if}
</section>

<style>
.account-title { display: flex; align-items: center; gap: 10px; }
.balance { font-size: 2rem; font-weight: 700; margin-top: 4px; }
.acct-number { display: flex; align-items: center; gap: 4px; margin-top: 2px; }
.bank-tag {
display: flex; align-items: center; gap: 5px;
font-size: 0.7rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
color: var(--color); border: 1px solid var(--color); border-radius: 99px; padding: 2px 8px;
}

.section { margin-bottom: 1.5rem; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
.section-title { display: flex; align-items: center; gap: 6px; font-size: 0.95rem; font-weight: 600; margin-bottom: 0.75rem; }

.filter-bar {
display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 1.5rem;
}
.filter-bar-icon { color: var(--text-muted); display: flex; align-items: center; }
.filter-input {
flex: 1 1 130px; padding: 0.4rem 0.6rem; border: 1px solid var(--border);
border-radius: var(--radius-sm); background: var(--bg-input); color: var(--text-primary);
font-size: 0.85rem; min-width: 100px;
}
.filter-input-sm { flex-basis: 80px; min-width: 60px; }

.transaction-list { padding: 0; overflow: hidden; }
.tx-row {
display: flex; align-items: center; gap: 10px;
padding: 0.55rem 1rem; border-bottom: 1px solid var(--border-subtle);
color: var(--text-primary); text-decoration: none; transition: background var(--transition);
}
.tx-row:last-child { border-bottom: none; }
.tx-row:hover { background: var(--bg-hover); text-decoration: none; }
.tx-icon {
width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center;
justify-content: center; flex-shrink: 0;
}
.tx-icon-in { background: rgba(34,134,58,0.12); color: #22863a; }
.tx-icon-out { background: rgba(215,58,73,0.1); color: #d73a49; }
.tx-left { min-width: 0; flex: 1; }
.tx-desc { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.875rem; }
.tx-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 2px; }
.tx-cat { display: flex; align-items: center; gap: 3px; }
.tx-subcat { display: flex; align-items: center; gap: 3px; }
.tx-amount { font-size: 0.875rem; font-weight: 600; white-space: nowrap; }

.pagination { display: flex; align-items: center; gap: 1rem; justify-content: center; margin-top: 1rem; }
.empty-state { padding: 1.5rem; text-align: center; }
</style>
