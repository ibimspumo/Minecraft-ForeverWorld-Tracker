<script lang="ts">
	import type { CategoryInfo } from '$lib/types';
	import ProgressBar from '$lib/components/atoms/ProgressBar.svelte';

	interface Props {
		category: CategoryInfo;
		completed: number;
		total: number;
		expanded?: boolean;
		onToggle?: () => void;
	}

	let { category, completed, total, expanded = true, onToggle }: Props = $props();

	const percentage = $derived(total > 0 ? Math.round((completed / total) * 100) : 0);
</script>

<button
	class="category-header"
	class:category-header--expanded={expanded}
	onclick={onToggle}
	style="--category-color: {category.color}"
>
	<div class="category-header__left">
		<span class="category-header__icon">{category.icon}</span>
		<div class="category-header__info">
			<h3 class="category-header__name">{category.name}</h3>
			<p class="category-header__desc">{category.description}</p>
		</div>
	</div>

	<div class="category-header__right">
		<div class="category-header__progress">
			<ProgressBar value={completed} max={total} size="sm" />
			<span class="category-header__count">
				{completed}/{total}
			</span>
		</div>
		<span class="category-header__percent" class:complete={percentage === 100}>
			{percentage}%
		</span>
		<svg
			class="category-header__chevron"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<path d="m6 9 6 6 6-6"/>
		</svg>
	</div>
</button>

<style>
	.category-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		width: 100%;
		padding: var(--space-md);
		background: var(--mc-dark-gray);
		border: 2px solid var(--mc-gray);
		border-left: 4px solid var(--category-color);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
		text-align: left;
	}

	.category-header:hover {
		background: rgba(255,255,255,0.03);
		border-color: var(--mc-light-gray);
		border-left-color: var(--category-color);
	}

	.category-header__left {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		min-width: 0;
	}

	.category-header__icon {
		font-size: 2rem;
		line-height: 1;
		flex-shrink: 0;
	}

	.category-header__info {
		min-width: 0;
	}

	.category-header__name {
		font-family: var(--font-pixel);
		font-size: 1.25rem;
		color: #E8E8E8;
		margin-bottom: 2px;
	}

	.category-header__desc {
		font-size: 0.8rem;
		color: var(--mc-stone);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.category-header__right {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		flex-shrink: 0;
	}

	.category-header__progress {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 150px;
	}

	.category-header__count {
		font-family: var(--font-pixel);
		font-size: 0.875rem;
		color: var(--mc-stone);
		white-space: nowrap;
	}

	.category-header__percent {
		font-family: var(--font-pixel);
		font-size: 1.25rem;
		color: var(--mc-stone);
		min-width: 4ch;
		text-align: right;
	}

	.category-header__percent.complete {
		color: var(--mc-xp-green);
		text-shadow: 0 0 10px var(--mc-xp-green);
	}

	.category-header__chevron {
		width: 24px;
		height: 24px;
		color: var(--mc-light-gray);
		transition: transform var(--transition-fast);
		flex-shrink: 0;
	}

	.category-header--expanded .category-header__chevron {
		transform: rotate(180deg);
	}

	@media (max-width: 768px) {
		.category-header {
			flex-wrap: wrap;
		}

		.category-header__desc {
			display: none;
		}

		.category-header__progress {
			width: 100px;
		}

		.category-header__right {
			gap: var(--space-sm);
		}
	}

	@media (max-width: 480px) {
		.category-header__progress {
			display: none;
		}
	}
</style>
