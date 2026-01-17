<script lang="ts">
	import { CATEGORIES, type Category } from '$lib/types';
	import ProgressBar from '$lib/components/atoms/ProgressBar.svelte';
	import StatCard from '$lib/components/molecules/StatCard.svelte';
	import { taskStore } from '$lib/stores/tasks.svelte';
	import { filterStore } from '$lib/stores/filters.svelte';

	interface Props {
		isOpen?: boolean;
		onClose?: () => void;
		onCategorySelect?: (category: Category | null) => void;
		selectedCategory?: Category | null;
	}

	let { isOpen = true, onClose, onCategorySelect, selectedCategory = null }: Props = $props();

	const overallStats = $derived(taskStore.getOverallStats());
</script>

{#if isOpen}
	<div class="sidebar-overlay" onclick={onClose}></div>
{/if}

<aside class="sidebar" class:sidebar--open={isOpen}>
	<div class="sidebar__header">
		<h2 class="sidebar__title">Progress</h2>
		<button class="sidebar__close" onclick={onClose} aria-label="Close sidebar">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M18 6 6 18M6 6l12 12"/>
			</svg>
		</button>
	</div>

	<div class="sidebar__content">
		<!-- Overall Progress -->
		<div class="sidebar__section">
			<StatCard
				title="Total Progress"
				value={overallStats.completed}
				total={overallStats.total}
				icon="🏆"
				color="xp"
			/>
		</div>

		<!-- Category List -->
		<div class="sidebar__section">
			<h3 class="sidebar__section-title">Categories</h3>

			<button
				class="category-item"
				class:active={selectedCategory === null}
				onclick={() => onCategorySelect?.(null)}
			>
				<span class="category-item__icon">📋</span>
				<span class="category-item__name">All Tasks</span>
				<span class="category-item__count">{overallStats.total}</span>
			</button>

			{#each CATEGORIES as category}
				{@const stats = taskStore.getCategoryStats(category.id)}
				<button
					class="category-item"
					class:active={selectedCategory === category.id}
					onclick={() => onCategorySelect?.(category.id)}
					style="--category-color: {category.color}"
				>
					<span class="category-item__icon">{category.icon}</span>
					<span class="category-item__name">{category.name}</span>
					<div class="category-item__progress">
						<ProgressBar value={stats.completed} max={stats.total} size="sm" />
					</div>
					<span class="category-item__count">
						{stats.completed}/{stats.total}
					</span>
				</button>
			{/each}
		</div>
	</div>
</aside>

<style>
	.sidebar-overlay {
		display: none;
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.6);
		z-index: 149;
	}

	.sidebar {
		position: fixed;
		left: 0;
		top: var(--header-height);
		bottom: 0;
		width: var(--sidebar-width);
		background: var(--mc-dark-gray);
		border-right: 2px solid var(--mc-gray);
		overflow-y: auto;
		z-index: 150;
		transition: transform var(--transition-normal);
	}

	.sidebar__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-md);
		border-bottom: 1px solid var(--mc-gray);
		position: sticky;
		top: 0;
		background: var(--mc-dark-gray);
		z-index: 1;
	}

	.sidebar__title {
		font-family: var(--font-pixel);
		font-size: 1.25rem;
		color: #E8E8E8;
	}

	.sidebar__close {
		display: none;
		width: 32px;
		height: 32px;
		padding: 6px;
		background: transparent;
		border: none;
		color: var(--mc-stone);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
	}

	.sidebar__close:hover {
		background: rgba(255,255,255,0.1);
		color: #E8E8E8;
	}

	.sidebar__close svg {
		width: 100%;
		height: 100%;
	}

	.sidebar__content {
		padding: var(--space-md);
	}

	.sidebar__section {
		margin-bottom: var(--space-lg);
	}

	.sidebar__section-title {
		font-family: var(--font-pixel);
		font-size: 0.875rem;
		color: var(--mc-stone);
		text-transform: uppercase;
		margin-bottom: var(--space-sm);
		padding-left: var(--space-sm);
	}

	.category-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
		padding: var(--space-sm);
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
		text-align: left;
		border-left: 3px solid transparent;
	}

	.category-item:hover {
		background: rgba(255,255,255,0.05);
	}

	.category-item.active {
		background: rgba(128, 255, 32, 0.1);
		border-left-color: var(--mc-xp-green);
	}

	.category-item__icon {
		font-size: 1.25rem;
		flex-shrink: 0;
	}

	.category-item__name {
		flex: 1;
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: #E8E8E8;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.category-item__progress {
		width: 50px;
		flex-shrink: 0;
	}

	.category-item__count {
		font-family: var(--font-pixel);
		font-size: 0.75rem;
		color: var(--mc-stone);
		flex-shrink: 0;
	}

	@media (max-width: 768px) {
		.sidebar-overlay {
			display: block;
		}

		.sidebar {
			transform: translateX(-100%);
			width: 85%;
			max-width: 320px;
		}

		.sidebar--open {
			transform: translateX(0);
		}

		.sidebar__close {
			display: flex;
		}
	}
</style>
