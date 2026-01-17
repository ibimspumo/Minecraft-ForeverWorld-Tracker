<script lang="ts">
	import type { Task, TaskStatus } from '$lib/types';
	import Checkbox from '$lib/components/atoms/Checkbox.svelte';
	import Badge from '$lib/components/atoms/Badge.svelte';
	import { getTaskIconSources } from '$lib/utils/icons';

	interface Props {
		task: Task;
		status?: TaskStatus;
		onToggle?: () => void;
		onclick?: () => void;
	}

	let { task, status = 'pending', onToggle, onclick }: Props = $props();

	const isCompleted = $derived(status === 'completed');

	// Icon handling with multiple sources
	let imageError = $state(false);
	let currentSourceIndex = $state(0);

	const iconSources = $derived(getTaskIconSources(task));
	const currentSrc = $derived(iconSources[currentSourceIndex] ?? '');

	function handleImageError() {
		if (currentSourceIndex < iconSources.length - 1) {
			currentSourceIndex++;
		} else {
			imageError = true;
		}
	}

	// Reset on task change
	$effect(() => {
		if (task) {
			imageError = false;
			currentSourceIndex = 0;
		}
	});

	// Color fallback based on category
	const categoryColors: Record<string, string> = {
		blocks: '#8B7355',
		items: '#4A90D9',
		mobs: '#E74C3C',
		biomes: '#27AE60',
		structures: '#9B59B6',
		advancements: '#F1C40F',
		enchantments: '#8E44AD',
		potions: '#E91E63',
		music_discs: '#1ABC9C',
		paintings: '#E67E22',
		banner_patterns: '#C0392B',
		armor_trims: '#3498DB',
		pottery_sherds: '#D35400',
		challenges: '#F39C12',
		building_goals: '#7F8C8D'
	};

	const fallbackColor = $derived(categoryColors[task.category] ?? '#5A5A66');
</script>

<article
	class="task-card"
	class:task-card--completed={isCompleted}
	onclick={onclick}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && onclick?.()}
>
	<div class="task-card__checkbox" onclick={(e) => e.stopPropagation()}>
		<Checkbox
			checked={isCompleted}
			onchange={() => onToggle?.()}
			size="md"
		/>
	</div>

	<div class="task-card__icon">
		{#if !imageError}
			<div class="task-card__slot" class:task-card__slot--completed={isCompleted}>
				<img
					src={currentSrc}
					alt=""
					class="task-card__slot-img"
					loading="lazy"
					onerror={handleImageError}
				/>
			</div>
		{:else}
			<div
				class="task-card__slot task-card__slot--fallback"
				class:task-card__slot--completed={isCompleted}
				style="background-color: {fallbackColor}"
			>
				{task.name.charAt(0).toUpperCase()}
			</div>
		{/if}
	</div>

	<div class="task-card__content">
		<h4 class="task-card__name" class:task-card__name--completed={isCompleted}>
			{task.name}
		</h4>
		<p class="task-card__description">{task.description}</p>
		<div class="task-card__meta">
			<Badge variant="difficulty" difficulty={task.difficulty} size="sm" />
			<Badge variant="phase" phase={task.phase} size="sm" />
			{#if task.tags && task.tags.length > 0}
				<span class="task-card__tags">
					{task.tags.slice(0, 2).join(', ')}
				</span>
			{/if}
		</div>
	</div>

	{#if task.tips}
		<div class="task-card__tip" title={task.tips}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"/>
				<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
				<path d="M12 17h.01"/>
			</svg>
		</div>
	{/if}
</article>

<style>
	.task-card {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		padding: var(--space-md);
		background: var(--mc-dark-gray);
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
		animation: slideUp 0.3s ease-out;
		position: relative;
	}

	.task-card:hover {
		border-color: var(--mc-light-gray);
		background: rgba(255,255,255,0.02);
		transform: translateX(4px);
	}

	.task-card--completed {
		opacity: 0.7;
		border-color: var(--mc-xp-green-dark);
		background: rgba(128, 255, 32, 0.05);
	}

	.task-card--completed:hover {
		opacity: 1;
	}

	.task-card__checkbox {
		flex-shrink: 0;
		padding-top: 2px;
	}

	.task-card__icon {
		flex-shrink: 0;
	}

	.task-card__slot {
		width: 32px;
		height: 32px;
		background: var(--mc-slot-bg);
		border: 2px solid;
		border-color: var(--mc-inventory-border-dark) var(--mc-inventory-border-light) var(--mc-inventory-border-light) var(--mc-inventory-border-dark);
		box-shadow: inset 2px 2px 4px rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		image-rendering: pixelated;
	}

	.task-card__slot--completed {
		background: rgba(128, 255, 32, 0.2);
	}

	.task-card__slot-img {
		width: 80%;
		height: 80%;
		object-fit: contain;
		image-rendering: pixelated;
	}

	.task-card__slot--fallback {
		font-family: var(--font-pixel);
		font-size: 0.9rem;
		color: white;
		text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
	}

	.task-card__content {
		flex: 1;
		min-width: 0;
	}

	.task-card__name {
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 1rem;
		color: #E8E8E8;
		margin-bottom: 4px;
		text-transform: none;
		letter-spacing: 0;
	}

	.task-card__name--completed {
		text-decoration: line-through;
		color: var(--mc-xp-green);
	}

	.task-card__description {
		font-size: 0.875rem;
		color: var(--mc-stone);
		margin-bottom: var(--space-sm);
		line-height: 1.4;
	}

	.task-card__meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		align-items: center;
	}

	.task-card__tags {
		font-size: 0.75rem;
		color: var(--mc-light-gray);
		font-style: italic;
	}

	.task-card__tip {
		position: absolute;
		top: var(--space-sm);
		right: var(--space-sm);
		width: 20px;
		height: 20px;
		color: var(--mc-light-gray);
		opacity: 0.5;
		transition: opacity var(--transition-fast);
	}

	.task-card:hover .task-card__tip {
		opacity: 1;
		color: var(--mc-gold);
	}

	.task-card__tip svg {
		width: 100%;
		height: 100%;
	}

	@media (max-width: 480px) {
		.task-card {
			padding: var(--space-sm);
		}

		.task-card__icon {
			display: none;
		}

		.task-card__name {
			font-size: 0.9rem;
		}

		.task-card__description {
			font-size: 0.8rem;
		}
	}
</style>
