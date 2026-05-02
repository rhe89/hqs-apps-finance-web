<script lang="ts">
import { getCategoryIcon } from '$lib/utils/categoryIcons';
import {
ArrowUpRight, ArrowDownLeft, Calendar, Building2, CreditCard,
Tag, GitBranch, Banknote, Globe, Hash, Receipt, ChevronLeft
} from 'lucide-svelte';
import type { PageData } from './$types';

let { data }: { data: PageData } = $props();
const tx = $derived(data.transaction);

function formatAmount(n: number, currency = 'NOK') {
return new Intl.NumberFormat('nb-NO', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n);
}
function formatDate(d: string) {
return new Date(d).toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

const CategoryIcon = $derived(tx.category ? getCategoryIcon(tx.category) : Receipt);
</script>

<svelte:head><title>{tx.description} — Finance</title></svelte:head>

<div class="page-header">
<button onclick={() => history.back()} class="back-btn text-muted text-sm">
<ChevronLeft size={14} strokeWidth={2} /> Back
</button>
<h1>Transaction Detail</h1>
</div>

<div class="detail-card card">
<div class="amount-row">
<div class="direction-icon" class:dir-in={tx.amount > 0} class:dir-out={tx.amount < 0}>
{#if tx.amount > 0}
<ArrowDownLeft size={22} strokeWidth={2} />
{:else}
<ArrowUpRight size={22} strokeWidth={2} />
{/if}
</div>
<div class="amount-hero" class:amount-positive={tx.amount > 0} class:amount-negative={tx.amount < 0}>
{formatAmount(tx.amount, tx.currency)}
</div>
</div>
<div class="tx-desc-lg">{tx.description}</div>

<div class="detail-rows">
<div class="detail-row">
<span class="detail-icon"><Calendar size={14} strokeWidth={1.75} /></span>
<span class="detail-label">Date</span>
<span class="detail-value">{formatDate(tx.bookingDate)}</span>
</div>
<div class="detail-row">
<span class="detail-icon"><Building2 size={14} strokeWidth={1.75} /></span>
<span class="detail-label">Bank</span>
<span class="detail-value">{tx.bank}</span>
</div>
<div class="detail-row">
<span class="detail-icon"><Banknote size={14} strokeWidth={1.75} /></span>
<span class="detail-label">Currency</span>
<span class="detail-value">{tx.currency}</span>
</div>

{#if tx.category}
<div class="detail-row">
<span class="detail-icon"><CategoryIcon size={14} strokeWidth={1.75} /></span>
<span class="detail-label">Category</span>
<span class="detail-value">{tx.category}</span>
</div>
{/if}

{#if tx.subCategory}
<div class="detail-row">
<span class="detail-icon"><GitBranch size={14} strokeWidth={1.75} /></span>
<span class="detail-label">Sub-category</span>
<span class="detail-value">{tx.subCategory}</span>
</div>
{/if}

{#if tx.transactionType}
<div class="detail-row">
<span class="detail-icon"><Tag size={14} strokeWidth={1.75} /></span>
<span class="detail-label">Type</span>
<span class="detail-value">{tx.transactionType}</span>
</div>
{/if}

{#if tx.merchantArea}
<div class="detail-row">
<span class="detail-icon"><Globe size={14} strokeWidth={1.75} /></span>
<span class="detail-label">Area</span>
<span class="detail-value">{tx.merchantArea}</span>
</div>
{/if}

{#if tx.originalAmount != null && tx.originalCurrency && tx.originalCurrency !== tx.currency}
<div class="detail-row">
<span class="detail-icon"><CreditCard size={14} strokeWidth={1.75} /></span>
<span class="detail-label">Original</span>
<span class="detail-value">{formatAmount(tx.originalAmount, tx.originalCurrency)}</span>
</div>
{/if}

{#if tx.exchangeRate != null}
<div class="detail-row">
<span class="detail-icon"><Globe size={14} strokeWidth={1.75} /></span>
<span class="detail-label">Exchange rate</span>
<span class="detail-value">{tx.exchangeRate}</span>
</div>
{/if}
</div>

<div class="tx-id text-muted text-xs">
<Hash size={11} strokeWidth={1.75} />
{tx.id}
</div>
</div>

<style>
.back-btn {
display: inline-flex; align-items: center; gap: 4px; background: none; border: none;
cursor: pointer; padding: 0; margin-bottom: 0.5rem; font-size: 0.875rem;
}
.back-btn:hover { color: var(--text-primary); }

.detail-card { max-width: 560px; }

.amount-row { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
.direction-icon {
width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center;
justify-content: center; flex-shrink: 0;
}
.dir-in { background: rgba(34,134,58,0.12); color: #22863a; }
.dir-out { background: rgba(215,58,73,0.10); color: #d73a49; }
.amount-hero { font-size: 2.2rem; font-weight: 700; line-height: 1; }
.tx-desc-lg { font-size: 1.05rem; color: var(--text-secondary); margin-bottom: 1.5rem; }

.detail-rows { display: flex; flex-direction: column; }
.detail-row {
display: flex; align-items: center; gap: 10px; padding: 0.45rem 0;
border-bottom: 1px solid var(--border-subtle);
}
.detail-row:last-child { border-bottom: none; }
.detail-icon { color: var(--text-muted); display: flex; align-items: center; width: 18px; justify-content: center; flex-shrink: 0; }
.detail-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; width: 110px; flex-shrink: 0; }
.detail-value { font-size: 0.9rem; color: var(--text-primary); }

.tx-id { display: flex; align-items: center; gap: 4px; margin-top: 1.25rem; word-break: break-all; }
</style>
