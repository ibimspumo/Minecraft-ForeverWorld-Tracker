<script lang="ts">
	import { CATEGORIES } from '$lib/types';
	import ProgressBar from '$lib/components/atoms/ProgressBar.svelte';
	import StatCard from '$lib/components/molecules/StatCard.svelte';
	import { taskStore } from '$lib/stores/tasks.svelte';

	const overallStats = $derived(taskStore.getOverallStats());

	// Color mapping for categories
	const categoryColors: Record<string, 'xp' | 'diamond' | 'gold' | 'emerald' | 'redstone'> = {
		blocks: 'gold',
		items: 'diamond',
		mobs: 'redstone',
		biomes: 'emerald',
		structures: 'xp',
		advancements: 'gold',
		enchantments: 'diamond',
		potions: 'redstone',
		music_discs: 'emerald',
		paintings: 'gold',
		banner_patterns: 'redstone',
		armor_trims: 'diamond',
		pottery_sherds: 'gold',
		challenges: 'xp',
		building_goals: 'emerald'
	};
</script>

<div class="progress-overview">
	<div class="progress-overview__main">
		<div class="progress-overview__total">
			<div class="progress-overview__circle">
				<svg viewBox="0 0 120 120">
					<!-- Background circle -->
					<circle
						cx="60"
						cy="60"
						r="54"
						fill="none"
						stroke="var(--mc-gray)"
						stroke-width="8"
					/>
					<!-- Progress circle -->
					<circle
						cx="60"
						cy="60"
						r="54"
						fill="none"
						stroke="var(--mc-xp-green)"
						stroke-width="8"
						stroke-linecap="round"
						stroke-dasharray="{overallStats.percentage * 3.39} 339"
						transform="rotate(-90 60 60)"
						class="progress-circle"
					/>
				</svg>
				<div class="progress-overview__percent">
					<span class="progress-overview__number">{overallStats.percentage}</span>
					<span class="progress-overview__symbol">%</span>
				</div>
			</div>
			<div class="progress-overview__info">
				<h3 class="progress-overview__title">Overall Progress</h3>
				<p class="progress-overview__count">
					<span class="completed">{overallStats.completed}</span>
					<span class="separator">/</span>
					<span class="total">{overallStats.total}</span>
					<span class="label">tasks completed</span>
				</p>
			</div>
		</div>
	</div>

	<div class="progress-overview__categories">
		<h4 class="progress-overview__section-title">Category Breakdown</h4>
		<div class="progress-overview__grid">
			{#each CATEGORIES as category}
				{@const stats = taskStore.getCategoryStats(category.id)}
				<div class="category-progress">
					<div class="category-progress__header">
						<span class="category-progress__icon">{category.icon}</span>
						<span class="category-progress__name">{category.name}</span>
						<span class="category-progress__percent">{stats.percentage}%</span>
					</div>
					<ProgressBar
						value={stats.completed}
						max={stats.total}
						size="sm"
						color={categoryColors[category.id] ?? 'xp'}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.progress-overview {
		background: var(--mc-dark-gray);
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
	}

	.progress-overview__main {
		display: flex;
		justify-content: center;
		margin-bottom: var(--space-xl);
	}

	.progress-overview__total {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
	}

	.progress-overview__circle {
		position: relative;
		width: 120px;
		height: 120px;
	}

	.progress-overview__circle svg {
		width: 100%;
		height: 100%;
	}

	.progress-circle {
		transition: stroke-dasharray 1s ease-out;
		filter: drop-shadow(0 0 8px var(--mc-xp-green));
	}

	.progress-overview__percent {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.progress-overview__number {
		font-family: var(--font-pixel);
		font-size: 2.5rem;
		color: var(--mc-xp-green);
		text-shadow: 0 0 20px var(--mc-xp-green);
	}

	.progress-overview__symbol {
		font-family: var(--font-pixel);
		font-size: 1rem;
		color: var(--mc-stone);
		align-self: flex-start;
		margin-top: 8px;
	}

	.progress-overview__info {
		text-align: left;
	}

	.progress-overview__title {
		font-family: var(--font-pixel);
		font-size: 1.5rem;
		color: #E8E8E8;
		margin-bottom: var(--space-xs);
	}

	.progress-overview__count {
		display: flex;
		align-items: baseline;
		gap: 4px;
		font-size: 1rem;
	}

	.progress-overview__count .completed {
		font-weight: 700;
		color: var(--mc-xp-green);
		font-size: 1.25rem;
	}

	.progress-overview__count .separator,
	.progress-overview__count .total {
		color: var(--mc-stone);
	}

	.progress-overview__count .label {
		color: var(--mc-light-gray);
		margin-left: 4px;
	}

	.progress-overview__section-title {
		font-family: var(--font-pixel);
		font-size: 1rem;
		color: var(--mc-stone);
		text-transform: uppercase;
		margin-bottom: var(--space-md);
	}

	.progress-overview__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--space-md);
	}

	.category-progress {
		padding: var(--space-sm);
		background: rgba(0,0,0,0.2);
		border-radius: var(--radius-sm);
	}

	.category-progress__header {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		margin-bottom: var(--space-xs);
	}

	.category-progress__icon {
		font-size: 1rem;
	}

	.category-progress__name {
		flex: 1;
		font-size: 0.8rem;
		color: #E8E8E8;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.category-progress__percent {
		font-family: var(--font-pixel);
		font-size: 0.75rem;
		color: var(--mc-stone);
	}

	@media (max-width: 768px) {
		.progress-overview__total {
			flex-direction: column;
			text-align: center;
		}

		.progress-overview__info {
			text-align: center;
		}

		.progress-overview__count {
			justify-content: center;
		}

		.progress-overview__grid {
			grid-template-columns: 1fr;
		}
	}
</style>
