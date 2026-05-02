<script lang="ts">
import { CreditCard, Star } from 'lucide-svelte';
import type { AccountDto } from '$lib/server/api-client';

let { account, isFavorite = false }: { account: AccountDto; isFavorite?: boolean } = $props();

const bankColors: Record<string, string> = {
Sbanken: '#0070f3',
BulderBank: '#22863a',
BankNorwegian: '#d73a49'
};

function formatBalance(n: number, currency: string) {
return new Intl.NumberFormat('nb-NO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}
</script>

<a href="/accounts/{account.id}" class="account-card card">
<div class="card-top">
<div class="bank-tag" style="--color: {bankColors[account.bank] ?? '#888'}">
<CreditCard size={11} strokeWidth={2} />
{account.bank}
</div>
{#if isFavorite}
<form method="POST" action="/?/removeFavorite">
<input type="hidden" name="accountId" value={account.id} />
<button type="submit" class="star-btn" title="Remove favorite" onclick={(e) => e.stopPropagation()}>
<Star size={14} strokeWidth={0} fill="currentColor" />
</button>
</form>
{/if}
</div>
<div class="account-name">{account.accountName}</div>
<div class="account-number text-muted text-xs">{account.accountNumber}</div>
<div class="balance" class:amount-negative={account.balance < 0}>
{formatBalance(account.balance, account.currency)}
</div>
</a>

<style>
.account-card {
display: flex;
flex-direction: column;
gap: 4px;
text-decoration: none;
color: var(--text-primary);
transition: box-shadow var(--transition), transform var(--transition);
}
.account-card:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); text-decoration: none; }

.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }

.bank-tag {
display: flex;
align-items: center;
gap: 5px;
font-size: 0.7rem;
font-weight: 600;
letter-spacing: 0.05em;
text-transform: uppercase;
color: var(--color);
border: 1px solid var(--color);
border-radius: 99px;
padding: 2px 8px;
opacity: 0.85;
}

.star-btn {
background: none;
border: none;
color: #f5c518;
font-size: 1rem;
cursor: pointer;
padding: 2px;
display: flex;
align-items: center;
}

.account-name { font-weight: 600; font-size: 0.95rem; }
.account-number { margin-top: 2px; }
.balance { font-size: 1.4rem; font-weight: 700; margin-top: 8px; }
</style>
