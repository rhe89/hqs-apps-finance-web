<script lang="ts">
import AccountCard from '$lib/components/AccountCard.svelte';
import SpendingPie from '$lib/components/SpendingPie.svelte';
import { Star, Plus, ArrowUpRight, ArrowDownLeft, Wallet, Tag, Receipt } from 'lucide-svelte';
import { getCategoryIcon } from '$lib/utils/categoryIcons';
import type { PageData } from './$types';

let { data }: { data: PageData } = $props();

function formatAmount(n: number, currency = 'NOK') {
return new Intl.NumberFormat('nb-NO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
return new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
}
</script>

<svelte:head><title>Dashboard — Finance</title></svelte:head>

<div class="page-header">
<h1>Dashboard</h1>
<p class="text-secondary text-sm">Overview of your finances</p>
</div>

<!-- Cross-bank total -->
{#if data.favoriteAccounts.length > 0}
<div class="total-card card">
<div class="total-label">
<Wallet size={14} strokeWidth={1.75} />
<span class="text-muted text-xs font-semibold">TOTAL BALANCE (FAVORITES)</span>
</div>
<div class="total-amount" class:amount-negative={data.crossBankTotal < 0}>
{formatAmount(data.crossBankTotal)}
</div>
<div class="total-sub text-muted text-sm">{data.favoriteAccounts.length} account{data.favoriteAccounts.length !== 1 ? 's' : ''}</div>
</div>
{/if}

<!-- Favorite accounts -->
<section class="section">
<div class="section-header">
<h2 class="section-title">
<Star size={15} strokeWidth={1.75} />
Favorites
</h2>
{#if data.favorites.length < 10}
<details class="add-favorites">
<summary class="btn text-sm">
<Plus size={13} strokeWidth={2} />
Add favorite
</summary>
<div class="add-favorites-list card">
{#each data.allAccounts.filter(a => !data.favorites.some(f => f.accountId === a.id)) as account}
<form method="POST" action="?/addFavorite">
<input type="hidden" name="accountId" value={account.id} />
<input type="hidden" name="bank" value={account.bank} />
<button type="submit" class="add-item">
<span class="bank-dot bank-{account.bank.toLowerCase()}"></span>
{account.accountName} <span class="text-muted">({account.bank})</span>
</button>
</form>
{/each}
</div>
</details>
{/if}
</div>

{#if data.favoriteAccounts.length === 0}
<div class="empty-state card text-muted">No favorites yet. Add up to 10 accounts above.</div>
{:else}
<div class="grid-2">
{#each data.favoriteAccounts as account}
<AccountCard {account} isFavorite={true} />
{/each}
</div>
{/if}
</section>

<!-- Top categories + Recent transactions -->
<div class="dashboard-grid">
<section class="section">
<h2 class="section-title">
<Tag size={15} strokeWidth={1.75} />
Top Spending Last Month
</h2>
{#if data.topCategories.length > 0}
<SpendingPie categories={data.topCategories} />
<div class="category-list">
{#each data.topCategories as cat}
{@const IconComp = getCategoryIcon(cat.category)}
<a href="/budget?category={encodeURIComponent(cat.category)}" class="category-row">
<span class="cat-icon-wrap">
<IconComp size={14} strokeWidth={1.75} />
<span>{cat.category}</span>
</span>
<span class="amount-negative">{formatAmount(cat.spending)}</span>
</a>
{/each}
</div>
{:else}
<div class="empty-state card text-muted">No category data for last month.</div>
{/if}
</section>

<!-- Recent transactions -->
<section class="section">
<h2 class="section-title">
<Receipt size={15} strokeWidth={1.75} />
Recent Transactions
</h2>
{#if data.recentTransactions.length > 0}
<div class="transaction-list card">
{#each data.recentTransactions as tx}
<a href="/transactions/{tx.id}" class="tx-row">
<div class="tx-icon" class:tx-icon-in={tx.amount > 0} class:tx-icon-out={tx.amount < 0}>
{#if tx.amount > 0}
<ArrowDownLeft size={14} strokeWidth={2} />
{:else}
<ArrowUpRight size={14} strokeWidth={2} />
{/if}
</div>
<div class="tx-left">
<div class="tx-desc">{tx.description}</div>
<div class="tx-meta text-muted text-xs">{formatDate(tx.bookingDate)} · {tx.bank}</div>
</div>
<div class="tx-amount" class:amount-positive={tx.amount > 0} class:amount-negative={tx.amount < 0}>
{formatAmount(tx.amount, tx.currency)}
</div>
</a>
{/each}
</div>
{:else}
<div class="empty-state card text-muted">No recent transactions.</div>
{/if}
</section>
</div>

<style>
.total-card { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 4px; }
.total-label { display: flex; align-items: center; gap: 6px; }
.total-amount { font-size: 2rem; font-weight: 700; color: var(--text-primary); line-height: 1; }

.section { margin-bottom: 2rem; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
.section-title { display: flex; align-items: center; gap: 6px; font-size: 0.95rem; font-weight: 600; }

.dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
@media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } }

.empty-state { padding: 1.5rem; text-align: center; }

.add-favorites { position: relative; }
.add-favorites-list {
position: absolute; right: 0; top: calc(100% + 4px); z-index: 10;
min-width: 260px; padding: 0.5rem; display: flex; flex-direction: column; gap: 2px;
}
.add-item {
display: flex; align-items: center; gap: 8px; width: 100%; padding: 0.4rem 0.5rem;
background: none; border: none; border-radius: var(--radius-sm);
cursor: pointer; font-size: 0.85rem; color: var(--text-primary); text-align: left;
}
.add-item:hover { background: var(--bg-hover); }
.bank-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; display: inline-block; }
:global(.bank-sbanken) { background: #0070f3; }
:global(.bank-bulderbank) { background: #22863a; }
:global(.bank-banknorwegian) { background: #d73a49; }

.category-list { margin-top: 0.75rem; display: flex; flex-direction: column; gap: 4px; }
.category-row {
display: flex; justify-content: space-between; align-items: center;
padding: 0.4rem 0.5rem; border-radius: var(--radius-sm);
font-size: 0.875rem; color: var(--text-primary); text-decoration: none;
transition: background var(--transition);
}
.category-row:hover { background: var(--bg-hover); text-decoration: none; }
.cat-icon-wrap { display: flex; align-items: center; gap: 7px; }

.transaction-list { padding: 0; overflow: hidden; }
.tx-row {
display: flex; align-items: center;
padding: 0.55rem 1rem; border-bottom: 1px solid var(--border-subtle);
color: var(--text-primary); text-decoration: none; transition: background var(--transition);
gap: 10px;
}
.tx-row:last-child { border-bottom: none; }
.tx-row:hover { background: var(--bg-hover); text-decoration: none; }
.tx-icon {
width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center;
justify-content: center; flex-shrink: 0;
}
.tx-icon-in { background: rgba(34,134,58,0.12); color: #22863a; }
.tx-icon-out { background: rgba(215,58,73,0.1); color: #d73a49; }
.tx-left { min-width: 0; flex: 1; }
.tx-desc { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.875rem; }
.tx-amount { font-size: 0.875rem; font-weight: 600; white-space: nowrap; }
</style>
