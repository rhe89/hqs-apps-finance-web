<script lang="ts">
	import '../app.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { LayoutDashboard, PieChart, CreditCard, Landmark } from 'lucide-svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();
</script>

<div class="page-layout">
	<aside class="sidebar">
		<div class="sidebar-logo">
			<Landmark size={20} strokeWidth={2} />
			<span class="logo-text">Finance</span>
		</div>

		<nav class="sidebar-nav">
			<a href="/" class="nav-link">
				<LayoutDashboard size={16} strokeWidth={1.75} />
				Dashboard
			</a>
			<a href="/budget" class="nav-link">
				<PieChart size={16} strokeWidth={1.75} />
				Budget
			</a>
		</nav>

		{#if data.accounts.length > 0}
			<div class="sidebar-section">
				<div class="sidebar-section-label">Accounts</div>
				{#each data.accounts as account}
					<a href="/accounts/{account.id}" class="nav-link nav-link-sm">
						<CreditCard size={13} strokeWidth={1.75} class="bank-icon bank-{account.bank.toLowerCase()}" />
						<span class="nav-account-name">{account.accountName}</span>
					</a>
				{/each}
			</div>
		{/if}

		<div class="sidebar-bottom">
			<ThemeToggle />
		</div>
	</aside>

	<main class="main-content">
		{@render children()}
	</main>
</div>

<style>
	.sidebar-logo {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 1.1rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		color: var(--accent);
	}
	.logo-text { color: var(--text-primary); }

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-bottom: 1.5rem;
	}

	.sidebar-section {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-subtle);
	}

	.sidebar-section-label {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
		padding: 0 0.5rem;
		margin-bottom: 4px;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0.45rem 0.5rem;
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-decoration: none;
		transition: background var(--transition), color var(--transition);
	}
	.nav-link:hover { background: var(--bg-hover); color: var(--text-primary); text-decoration: none; }
	.nav-link-sm { font-size: 0.8rem; font-weight: 400; }

	.nav-account-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(.bank-sbanken) { color: #0070f3; }
	:global(.bank-bulderbank) { color: #22863a; }
	:global(.bank-banknorwegian) { color: #d73a49; }

	.sidebar-bottom {
		margin-top: auto;
		padding-top: 1rem;
		border-top: 1px solid var(--border-subtle);
	}
</style>
