<script lang="ts">
	import type { Task, Category } from '$lib/types';
	import { CATEGORIES } from '$lib/types';
	import TaskCard from '$lib/components/molecules/TaskCard.svelte';
	import CategoryHeader from '$lib/components/molecules/CategoryHeader.svelte';
	import { taskStore } from '$lib/stores/tasks.svelte';
	import { worldStore } from '$lib/stores/worlds.svelte';

	interface Props {
		tasks: Task[];
		groupByCategory?: boolean;
		selectedCategory?: Category | null;
	}

	let { tasks, groupByCategory = true, selectedCategory = null }: Props = $props();

	// Track expanded categories
	let expandedCategories = $state<Set<Category>>(new Set(CATEGORIES.map(c => c.id)));

	// Group tasks by category
	const groupedTasks = $derived(() => {
		if (!groupByCategory || selectedCategory) {
			return null;
		}

		const groups: Record<Category, Task[]> = {} as Record<Category, Task[]>;
		for (const task of tasks) {
			if (!groups[task.category]) {
				groups[task.category] = [];
			}
			groups[task.category].push(task);
		}
		return groups;
	});

	// Filter to selected category if set
	const displayTasks = $derived(() => {
		if (selectedCategory) {
			return tasks.filter(t => t.category === selectedCategory);
		}
		return tasks;
	});

	function toggleCategory(category: Category) {
		const newExpanded = new Set(expandedCategories);
		if (newExpanded.has(category)) {
			newExpanded.delete(category);
		} else {
			newExpanded.add(category);
		}
		expandedCategories = newExpanded;
	}

	function getCategoryInfo(categoryId: Category) {
		return CATEGORIES.find(c => c.id === categoryId)!;
	}
</script>

<div class="task-list">
	{#if groupByCategory && !selectedCategory && groupedTasks()}
		{#each CATEGORIES as categoryInfo}
			{@const categoryTasks = groupedTasks()?.[categoryInfo.id] ?? []}
			{#if categoryTasks.length > 0}
				{@const stats = taskStore.getCategoryStats(categoryInfo.id)}
				<div class="task-list__category">
					<CategoryHeader
						category={categoryInfo}
						completed={stats.completed}
						total={stats.total}
						expanded={expandedCategories.has(categoryInfo.id)}
						onToggle={() => toggleCategory(categoryInfo.id)}
					/>

					{#if expandedCategories.has(categoryInfo.id)}
						<div class="task-list__items">
							{#each categoryTasks as task, i (task.id)}
								<div style="animation-delay: {i * 30}ms">
									<TaskCard
										{task}
										status={worldStore.getTaskStatus(task.id)}
										onToggle={() => worldStore.toggleTaskComplete(task.id)}
									/>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	{:else}
		<!-- Flat list when category is selected or grouping is disabled -->
		{#if selectedCategory}
			{@const categoryInfo = getCategoryInfo(selectedCategory)}
			{@const stats = taskStore.getCategoryStats(selectedCategory)}
			<div class="task-list__header">
				<span class="task-list__header-icon">{categoryInfo.icon}</span>
				<h2 class="task-list__header-title">{categoryInfo.name}</h2>
				<span class="task-list__header-count">{stats.completed}/{stats.total}</span>
			</div>
		{/if}

		<div class="task-list__items task-list__items--flat">
			{#each displayTasks() as task, i (task.id)}
				<div style="animation-delay: {Math.min(i * 20, 500)}ms">
					<TaskCard
						{task}
						status={worldStore.getTaskStatus(task.id)}
						onToggle={() => worldStore.toggleTaskComplete(task.id)}
					/>
				</div>
			{/each}
		</div>
	{/if}

	{#if displayTasks().length === 0}
		<div class="task-list__empty">
			<span class="task-list__empty-icon">🔍</span>
			<p class="task-list__empty-text">No tasks found</p>
			<p class="task-list__empty-hint">Try adjusting your filters</p>
		</div>
	{/if}
</div>

<style>
	.task-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.task-list__category {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.task-list__items {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		padding-left: var(--space-md);
		border-left: 2px solid var(--mc-gray);
		margin-left: var(--space-md);
	}

	.task-list__items > div {
		animation: slideUp 0.3s ease-out backwards;
	}

	.task-list__items--flat {
		padding-left: 0;
		border-left: none;
		margin-left: 0;
	}

	.task-list__header {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding-bottom: var(--space-md);
		border-bottom: 2px solid var(--mc-gray);
		margin-bottom: var(--space-md);
	}

	.task-list__header-icon {
		font-size: 2rem;
	}

	.task-list__header-title {
		font-family: var(--font-pixel);
		font-size: 1.5rem;
		color: #E8E8E8;
		flex: 1;
	}

	.task-list__header-count {
		font-family: var(--font-pixel);
		font-size: 1.25rem;
		color: var(--mc-xp-green);
	}

	.task-list__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-2xl);
		text-align: center;
	}

	.task-list__empty-icon {
		font-size: 4rem;
		margin-bottom: var(--space-md);
		opacity: 0.5;
	}

	.task-list__empty-text {
		font-family: var(--font-pixel);
		font-size: 1.5rem;
		color: var(--mc-stone);
		margin-bottom: var(--space-sm);
	}

	.task-list__empty-hint {
		font-size: 0.9rem;
		color: var(--mc-light-gray);
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.task-list__items {
			padding-left: var(--space-sm);
			margin-left: var(--space-sm);
		}
	}
</style>
