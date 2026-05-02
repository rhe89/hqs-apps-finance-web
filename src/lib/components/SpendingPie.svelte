<script lang="ts">
	import { onMount } from 'svelte';
	import type { CategorySummaryDto } from '$lib/server/api-client';

	let { categories }: { categories: CategorySummaryDto[] } = $props();
	let canvas: HTMLCanvasElement;

	onMount(async () => {
		const { Chart, ArcElement, Tooltip, Legend, PieController } = await import('chart.js');
		Chart.register(ArcElement, Tooltip, Legend, PieController);

		const colors = ['#5c6ac4','#22863a','#d73a49','#f5a623','#9b59b6','#1abc9c','#e67e22','#3498db'];
		const top = categories.slice(0, 7);

		new Chart(canvas, {
			type: 'pie',
			data: {
				labels: top.map((c) => c.category),
				datasets: [{
					data: top.map((c) => c.spending),
					backgroundColor: colors.slice(0, top.length),
					borderWidth: 2,
					borderColor: 'var(--bg-surface)'
				}]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'bottom',
						labels: { color: 'var(--text-secondary)', font: { size: 11 }, padding: 12 }
					},
					tooltip: {
						callbacks: {
							label: (ctx) => {
								const val = ctx.parsed as number;
								return ` ${new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(val)}`;
							}
						}
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
	.chart-wrap { max-width: 300px; margin: 0 auto; }
</style>
