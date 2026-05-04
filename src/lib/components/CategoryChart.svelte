<script lang="ts">
	import { onMount } from 'svelte';
	import type { CategoryBreakdownDto } from '$lib/server/api-client';

	let { breakdown }: { breakdown: CategoryBreakdownDto[] } = $props();
	let canvas: HTMLCanvasElement;

	onMount(async () => {
		const { Chart, BarElement, CategoryScale, LinearScale, Tooltip, BarController } =
			await import('chart.js');
		Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, BarController);

		const fmt = new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });

		const style = getComputedStyle(document.documentElement);
		const textMuted = style.getPropertyValue('--text-muted').trim();
		const textSecondary = style.getPropertyValue('--text-secondary').trim();
		const borderSubtle = style.getPropertyValue('--border-subtle').trim();

		new Chart(canvas, {
			type: 'bar',
			data: {
				labels: breakdown.map((b) => b.subCategory ?? '(none)'),
				datasets: [
					{
						label: 'Spending',
						data: breakdown.map((b) => b.spending),
						backgroundColor: '#d73a49cc',
						borderRadius: 4
					},
					{
						label: 'Income',
						data: breakdown.map((b) => b.income),
						backgroundColor: '#22863acc',
						borderRadius: 4
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: 'top', labels: { color: textSecondary, font: { size: 11 } } },
					tooltip: { callbacks: { label: (ctx) => ` ${fmt.format(ctx.parsed.y as number)}` } }
				},
				scales: {
					x: { ticks: { color: textMuted, font: { size: 11 } }, grid: { display: false } },
					y: { ticks: { color: textMuted, font: { size: 11 }, callback: (v) => fmt.format(v as number) }, grid: { color: borderSubtle } }
				}
			}
		});
	});
</script>

<div class="chart-wrap">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.chart-wrap { width: 100%; margin-bottom: 1rem; }
</style>
