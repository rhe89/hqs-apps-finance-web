<script lang="ts">
	import { onMount } from 'svelte';
	import type { BalanceHistoryDto } from '$lib/server/api-client';

	let { history, currency = 'NOK' }: { history: BalanceHistoryDto[]; currency?: string } = $props();
	let canvas: HTMLCanvasElement;

	onMount(async () => {
		const { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler, LineController } =
			await import('chart.js');
		Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler, LineController);

		const fmt = new Intl.NumberFormat('nb-NO', { style: 'currency', currency, maximumFractionDigits: 0 });

		const style = getComputedStyle(document.documentElement);
		const textMuted = style.getPropertyValue('--text-muted').trim();
		const borderSubtle = style.getPropertyValue('--border-subtle').trim();

		new Chart(canvas, {
			type: 'line',
			data: {
				labels: history.map((h) =>
					new Date(h.month + 'T00:00:00').toLocaleDateString('nb-NO', { month: 'short', year: '2-digit' })
				),
				datasets: [{
					data: history.map((h) => h.balance),
					borderColor: '#5c6ac4',
					backgroundColor: 'rgba(92,106,196,0.1)',
					fill: true,
					tension: 0.3,
					pointRadius: 4,
					pointBackgroundColor: '#5c6ac4'
				}]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { display: false },
					tooltip: {
						callbacks: { label: (ctx) => ` ${fmt.format(ctx.parsed.y as number)}` }
					}
				},
				scales: {
					x: { ticks: { color: textMuted, font: { size: 11 } }, grid: { color: borderSubtle } },
					y: {
						ticks: { color: textMuted, font: { size: 11 }, callback: (v) => fmt.format(v as number) },
						grid: { color: borderSubtle }
					}
				}
			}
		});
	});
</script>

<div class="chart-wrap">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.chart-wrap { width: 100%; }
</style>
