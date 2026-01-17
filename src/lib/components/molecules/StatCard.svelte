<script lang="ts">
	import ProgressBar from '$lib/components/atoms/ProgressBar.svelte';

	interface Props {
		title: string;
		value: number;
		total: number;
		icon?: string;
		color?: 'xp' | 'diamond' | 'gold' | 'emerald' | 'redstone';
	}

	let { title, value, total, icon, color = 'xp' }: Props = $props();

	const percentage = $derived(total > 0 ? Math.round((value / total) * 100) : 0);
	const isComplete = $derived(percentage === 100);
</script>

<div class="stat-card" class:stat-card--complete={isComplete}>
	<div class="stat-card__header">
		{#if icon}
			<span class="stat-card__icon">{icon}</span>
		{/if}
		<span class="stat-card__title">{title}</span>
	</div>

	<div class="stat-card__value" class:glow={isComplete}>
		{percentage}<span class="stat-card__percent">%</span>
	</div>

	<ProgressBar value={value} max={total} size="md" {color} />

	<div class="stat-card__count">
		<span class="stat-card__completed">{value}</span>
		<span class="stat-card__separator">/</span>
		<span class="stat-card__total">{total}</span>
		<span class="stat-card__label">completed</span>
	</div>
</div>

<style>
	.stat-card {
		background: var(--mc-dark-gray);
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-md);
		padding: var(--space-md);
		transition: all var(--transition-fast);
	}

	.stat-card:hover {
		border-color: var(--mc-light-gray);
	}

	.stat-card--complete {
		border-color: var(--mc-xp-green-dark);
		background: linear-gradient(135deg, var(--mc-dark-gray) 0%, rgba(128, 255, 32, 0.1) 100%);
	}

	.stat-card__header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-sm);
	}

	.stat-card__icon {
		font-size: 1.5rem;
	}

	.stat-card__title {
		font-family: var(--font-pixel);
		font-size: 1rem;
		color: var(--mc-stone);
		text-transform: uppercase;
	}

	.stat-card__value {
		font-family: var(--font-pixel);
		font-size: 3rem;
		color: #E8E8E8;
		line-height: 1;
		margin-bottom: var(--space-sm);
	}

	.stat-card__value.glow {
		color: var(--mc-xp-green);
		text-shadow: 0 0 20px var(--mc-xp-green), 0 0 40px var(--mc-xp-green);
	}

	.stat-card__percent {
		font-size: 1.5rem;
		color: var(--mc-stone);
	}

	.stat-card__count {
		display: flex;
		align-items: baseline;
		gap: 4px;
		margin-top: var(--space-sm);
		font-family: var(--font-body);
		font-size: 0.875rem;
	}

	.stat-card__completed {
		font-weight: 700;
		color: var(--mc-xp-green);
	}

	.stat-card__separator,
	.stat-card__total {
		color: var(--mc-stone);
	}

	.stat-card__label {
		color: var(--mc-light-gray);
		margin-left: 4px;
	}
</style>
