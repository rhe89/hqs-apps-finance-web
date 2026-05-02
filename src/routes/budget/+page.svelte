<script lang="ts">
import CategoryChart from '$lib/components/CategoryChart.svelte';
import { getCategoryIcon, getCategoryColor } from '$lib/utils/categoryIcons';
import { PieChart, TrendingDown, TrendingUp, Minus, ChevronRight, ChevronDown, CalendarRange, GitBranch } from 'lucide-svelte';
import type { PageData } from './$types';

let { data }: { data: PageData } = $props();

function formatAmount(n: number) {
return new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(n);
}

const totalSpending = $derived(data.summary.reduce((s, c) => s + c.spending, 0));
const totalIncome = $derived(data.summary.reduce((s, c) => s + c.income, 0));
const net = $derived(totalIncome - totalSpending);
</script>

<svelte:head><title>Budget — Finance</title></svelte:head>

<div class="page-header">
<h1>
<PieChart size={22} strokeWidth={1.75} />
Budget
</h1>
<p class="text-secondary text-sm">Spending and income by category</p>
</div>

<!-- Date range filter -->
<form method="GET" class="filter-bar card">
<CalendarRange size={14} strokeWidth={1.75} class="filter-icon" />
<label class="filter-label">
From
<input type="date" name="from" value={data.from} class="filter-input" />
</label>
<label class="filter-label">
To
<input type="date" name="to" value={data.to} class="filter-input" />
</label>
<button type="submit" class="btn btn-primary">Apply</button>
</form>

<!-- Totals -->
<div class="totals-row">
<div class="total-chip card">
<div class="total-chip-head">
<TrendingDown size={14} strokeWidth={1.75} class="chip-icon-out" />
<div class="total-chip-label text-muted text-xs">SPENDING</div>
</div>
<div class="amount-negative font-bold">{formatAmount(totalSpending)}</div>
</div>
<div class="total-chip card">
<div class="total-chip-head">
<TrendingUp size={14} strokeWidth={1.75} class="chip-icon-in" />
<div class="total-chip-label text-muted text-xs">INCOME</div>
</div>
<div class="amount-positive font-bold">{formatAmount(totalIncome)}</div>
</div>
<div class="total-chip card">
<div class="total-chip-head">
<Minus size={14} strokeWidth={1.75} />
<div class="total-chip-label text-muted text-xs">NET</div>
</div>
<div class:amount-positive={net > 0} class:amount-negative={net < 0} class="font-bold">
{formatAmount(net)}
</div>
</div>
</div>

<!-- Category table + breakdown -->
<div class="budget-layout">
<section class="card budget-table-wrap">
<table class="budget-table">
<thead>
<tr>
<th>Category</th>
<th class="text-right">Spending</th>
<th class="text-right">Income</th>
<th class="text-right">Txns</th>
<th></th>
</tr>
</thead>
<tbody>
{#each data.summary as cat}
{@const expanded = data.expandedCategory === cat.category}
{@const CatIcon = getCategoryIcon(cat.category)}
{@const color = getCategoryColor(cat.category)}
<tr
class="cat-row"
class:active={expanded}
onclick={() => {
const url = new URL(window.location.href);
if (expanded) url.searchParams.delete('category');
else url.searchParams.set('category', cat.category);
window.location.href = url.toString();
}}
>
<td>
<span class="cat-cell">
<span class="cat-icon-bg" style="--cat-color: {color}">
<CatIcon size={12} strokeWidth={1.75} />
</span>
<span>{cat.category}</span>
</span>
</td>
<td class="text-right amount-negative">{cat.spending > 0 ? formatAmount(cat.spending) : '—'}</td>
<td class="text-right amount-positive">{cat.income > 0 ? formatAmount(cat.income) : '—'}</td>
<td class="text-right text-muted text-sm">{cat.transactionCount}</td>
<td class="expand-col">
{#if expanded}
<ChevronDown size={13} strokeWidth={1.75} />
{:else}
<ChevronRight size={13} strokeWidth={1.75} />
{/if}
</td>
</tr>
{/each}
</tbody>
</table>
</section>

<!-- Breakdown drill-down -->
{#if data.expandedCategory && data.breakdown}
{@const ParentIcon = getCategoryIcon(data.expandedCategory)}
<section class="breakdown-panel">
<h2 class="section-title">
<ParentIcon size={15} strokeWidth={1.75} />
{data.expandedCategory}
<span class="text-muted">— Subcategories</span>
</h2>
<div class="card chart-card">
<CategoryChart breakdown={data.breakdown} />
</div>
<div class="card breakdown-list">
{#each data.breakdown as item}
{@const SubIcon = item.subCategory ? getCategoryIcon(item.subCategory) : GitBranch}
<div class="breakdown-row">
<span class="breakdown-name">
<SubIcon size={13} strokeWidth={1.75} />
{item.subCategory ?? '(none)'}
</span>
<div class="breakdown-amounts">
{#if item.spending > 0}<span class="amount-negative">{formatAmount(item.spending)}</span>{/if}
{#if item.income > 0}<span class="amount-positive">{formatAmount(item.income)}</span>{/if}
</div>
</div>
{/each}
</div>
</section>
{/if}
</div>

<style>
h1 { display: flex; align-items: center; gap: 8px; }

.filter-bar { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; margin-bottom: 1.5rem; }
:global(.filter-icon) { color: var(--text-muted); align-self: center; }
.filter-label { display: flex; flex-direction: column; gap: 4px; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.filter-input { padding: 0.4rem 0.6rem; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg-input); color: var(--text-primary); font-size: 0.875rem; }

.totals-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.total-chip { flex: 1 1 150px; min-width: 120px; }
.total-chip-head { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
:global(.chip-icon-in) { color: #22863a; }
:global(.chip-icon-out) { color: #d73a49; }
.font-bold { font-size: 1.3rem; font-weight: 700; }

.budget-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
@media (max-width: 900px) { .budget-layout { grid-template-columns: 1fr; } }

.budget-table-wrap { padding: 0; overflow: hidden; }
.budget-table { width: 100%; border-collapse: collapse; }
.budget-table th {
text-align: left; padding: 0.6rem 1rem; font-size: 0.75rem; font-weight: 600;
color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;
border-bottom: 1px solid var(--border);
}
.budget-table th.text-right { text-align: right; }
.budget-table td { padding: 0.5rem 1rem; font-size: 0.875rem; border-bottom: 1px solid var(--border-subtle); }
.budget-table td.text-right { text-align: right; }
.cat-row { cursor: pointer; transition: background var(--transition); }
.cat-row:hover, .cat-row.active { background: var(--bg-hover); }

.cat-cell { display: flex; align-items: center; gap: 8px; }
.cat-icon-bg {
width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center;
justify-content: center; flex-shrink: 0; background: color-mix(in srgb, var(--cat-color) 15%, transparent);
color: var(--cat-color);
}
.expand-col { width: 24px; color: var(--text-muted); }

.section-title { display: flex; align-items: center; gap: 6px; font-size: 0.95rem; font-weight: 600; margin-bottom: 0.75rem; }
.chart-card { margin-bottom: 1rem; }
.breakdown-list { padding: 0; overflow: hidden; }
.breakdown-row {
display: flex; justify-content: space-between; align-items: center;
padding: 0.5rem 1rem; border-bottom: 1px solid var(--border-subtle); font-size: 0.875rem;
}
.breakdown-row:last-child { border-bottom: none; }
.breakdown-name { display: flex; align-items: center; gap: 7px; color: var(--text-primary); }
.breakdown-amounts { display: flex; gap: 0.75rem; }
</style>
