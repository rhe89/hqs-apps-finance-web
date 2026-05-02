<script lang="ts">
import { Sun, Moon } from 'lucide-svelte';

let isDark = $state(false);

function init() {
isDark = localStorage.getItem('theme') === 'dark' ||
(!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

function toggle() {
isDark = !isDark;
const theme = isDark ? 'dark' : 'light';
localStorage.setItem('theme', theme);
document.documentElement.setAttribute('data-theme', theme);
}
</script>

<svelte:window onload={init} />

<button class="theme-btn" onclick={toggle} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
{#if isDark}
<Sun size={15} strokeWidth={1.75} />
<span>Light mode</span>
{:else}
<Moon size={15} strokeWidth={1.75} />
<span>Dark mode</span>
{/if}
</button>

<style>
.theme-btn {
display: flex;
align-items: center;
gap: 8px;
background: none;
border: 1px solid var(--border);
border-radius: var(--radius-sm);
padding: 0.4rem 0.6rem;
cursor: pointer;
color: var(--text-secondary);
font-size: 0.8rem;
transition: background var(--transition), color var(--transition);
width: 100%;
}
.theme-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
</style>
