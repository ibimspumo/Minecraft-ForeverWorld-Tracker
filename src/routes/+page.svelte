<script lang="ts">
	import type { Category } from '$lib/types';
	import MainLayout from '$lib/components/templates/MainLayout.svelte';
	import FilterBar from '$lib/components/molecules/FilterBar.svelte';
	import TaskList from '$lib/components/organisms/TaskList.svelte';
	import ProgressOverview from '$lib/components/organisms/ProgressOverview.svelte';
	import WorldSelector from '$lib/components/molecules/WorldSelector.svelte';
	import { taskStore } from '$lib/stores/tasks.svelte';
	import { filterStore } from '$lib/stores/filters.svelte';
	import { worldStore } from '$lib/stores/worlds.svelte';

	let selectedCategory = $state<Category | null>(null);
	let showOverview = $state(true);

	function handleCategorySelect(category: Category | null) {
		selectedCategory = category;
		// When selecting a category, clear category filters since we're viewing specific category
		if (category) {
			filterStore.setCategories([]);
		}
	}
</script>

<MainLayout {selectedCategory} onCategorySelect={handleCategorySelect}>
	<div class="page">
		<!-- Mobile World Selector -->
		<div class="page__mobile-world">
			<WorldSelector
				worlds={worldStore.worlds}
				activeWorldId={worldStore.activeWorldId}
				onSelect={(id) => worldStore.setActiveWorld(id)}
			/>
		</div>

		<!-- Overview Toggle -->
		<div class="page__header">
			<div class="page__tabs">
				<button
					class="page__tab"
					class:active={showOverview}
					onclick={() => showOverview = true}
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M3 3v18h18"/>
						<path d="m19 9-5 5-4-4-3 3"/>
					</svg>
					Overview
				</button>
				<button
					class="page__tab"
					class:active={!showOverview}
					onclick={() => showOverview = false}
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
						<path d="M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2"/>
						<path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>
					</svg>
					Tasks
				</button>
			</div>

			<div class="page__stats">
				<span class="page__stat">
					<span class="page__stat-value">{taskStore.totalCount}</span>
					<span class="page__stat-label">Total Tasks</span>
				</span>
				<span class="page__stat">
					<span class="page__stat-value">{taskStore.getOverallStats().completed}</span>
					<span class="page__stat-label">Completed</span>
				</span>
			</div>
		</div>

		{#if showOverview}
			<!-- Progress Overview -->
			<div class="page__overview animate-fade-in">
				<ProgressOverview />
			</div>
		{:else}
			<!-- Task List View -->
			<div class="page__tasks animate-fade-in">
				<FilterBar
					search={filterStore.search}
					selectedCategories={filterStore.categories}
					selectedPhases={filterStore.phases}
					selectedDifficulties={filterStore.difficulties}
					showCompleted={filterStore.showCompleted}
					hasActiveFilters={filterStore.hasActiveFilters}
					onSearchChange={(v) => filterStore.setSearch(v)}
					onCategoryToggle={(c) => filterStore.toggleCategory(c)}
					onPhaseToggle={(p) => filterStore.togglePhase(p)}
					onDifficultyToggle={(d) => filterStore.toggleDifficulty(d)}
					onShowCompletedToggle={() => filterStore.toggleShowCompleted()}
					onClearFilters={() => filterStore.clearFilters()}
				/>

				<div class="page__task-count">
					Showing <strong>{taskStore.filteredTasks.length}</strong> of {taskStore.totalCount} tasks
				</div>

				<TaskList
					tasks={taskStore.filteredTasks}
					{selectedCategory}
					groupByCategory={!selectedCategory && filterStore.categories.length === 0}
				/>
			</div>
		{/if}
	</div>
</MainLayout>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.page__mobile-world {
		display: none;
	}

	.page__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		flex-wrap: wrap;
	}

	.page__tabs {
		display: flex;
		gap: var(--space-xs);
		background: var(--mc-dark-gray);
		padding: var(--space-xs);
		border-radius: var(--radius-md);
		border: 2px solid var(--mc-gray);
	}

	.page__tab {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-sm) var(--space-md);
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		color: var(--mc-stone);
		font-family: var(--font-pixel);
		font-size: 1rem;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.page__tab svg {
		width: 20px;
		height: 20px;
	}

	.page__tab:hover {
		color: #E8E8E8;
		background: rgba(255,255,255,0.05);
	}

	.page__tab.active {
		background: var(--mc-xp-green-dark);
		color: var(--mc-black);
	}

	.page__stats {
		display: flex;
		gap: var(--space-lg);
	}

	.page__stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.page__stat-value {
		font-family: var(--font-pixel);
		font-size: 1.5rem;
		color: var(--mc-xp-green);
	}

	.page__stat-label {
		font-size: 0.75rem;
		color: var(--mc-stone);
		text-transform: uppercase;
	}

	.page__overview {
		margin-top: var(--space-md);
	}

	.page__tasks {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.page__task-count {
		font-size: 0.9rem;
		color: var(--mc-stone);
	}

	.page__task-count strong {
		color: var(--mc-xp-green);
	}

	@media (max-width: 768px) {
		.page__mobile-world {
			display: block;
		}

		.page__header {
			flex-direction: column;
			align-items: stretch;
		}

		.page__tabs {
			justify-content: center;
		}

		.page__stats {
			justify-content: center;
		}
	}
</style>
