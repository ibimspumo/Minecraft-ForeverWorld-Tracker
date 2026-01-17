<script lang="ts">
	import { CATEGORIES, PHASES, DIFFICULTIES, type Category, type Phase, type Difficulty } from '$lib/types';
	import SearchInput from '$lib/components/atoms/SearchInput.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import Badge from '$lib/components/atoms/Badge.svelte';

	interface Props {
		search: string;
		selectedCategories: Category[];
		selectedPhases: Phase[];
		selectedDifficulties: Difficulty[];
		showCompleted: boolean;
		hasActiveFilters: boolean;
		onSearchChange?: (value: string) => void;
		onCategoryToggle?: (category: Category) => void;
		onPhaseToggle?: (phase: Phase) => void;
		onDifficultyToggle?: (difficulty: Difficulty) => void;
		onShowCompletedToggle?: () => void;
		onClearFilters?: () => void;
	}

	let {
		search,
		selectedCategories,
		selectedPhases,
		selectedDifficulties,
		showCompleted,
		hasActiveFilters,
		onSearchChange,
		onCategoryToggle,
		onPhaseToggle,
		onDifficultyToggle,
		onShowCompletedToggle,
		onClearFilters
	}: Props = $props();

	let showFilters = $state(false);
</script>

<div class="filter-bar">
	<div class="filter-bar__main">
		<div class="filter-bar__search">
			<SearchInput
				value={search}
				placeholder="Search tasks..."
				oninput={(v) => onSearchChange?.(v)}
			/>
		</div>

		<div class="filter-bar__actions">
			<button
				class="filter-toggle"
				class:active={showFilters || hasActiveFilters}
				onclick={() => showFilters = !showFilters}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
				</svg>
				Filters
				{#if hasActiveFilters}
					<span class="filter-badge"></span>
				{/if}
			</button>

			<label class="completed-toggle">
				<input
					type="checkbox"
					checked={showCompleted}
					onchange={onShowCompletedToggle}
				/>
				<span>Show Completed</span>
			</label>
		</div>
	</div>

	{#if showFilters}
		<div class="filter-bar__expanded">
			<div class="filter-section">
				<h4 class="filter-section__title">Categories</h4>
				<div class="filter-chips">
					{#each CATEGORIES as cat}
						<button
							class="filter-chip"
							class:selected={selectedCategories.includes(cat.id)}
							onclick={() => onCategoryToggle?.(cat.id)}
							style="--chip-color: {cat.color}"
						>
							<span class="filter-chip__icon">{cat.icon}</span>
							{cat.name}
						</button>
					{/each}
				</div>
			</div>

			<div class="filter-section">
				<h4 class="filter-section__title">Phase</h4>
				<div class="filter-chips">
					{#each PHASES as phase}
						<button
							class="filter-chip"
							class:selected={selectedPhases.includes(phase.id)}
							onclick={() => onPhaseToggle?.(phase.id)}
							style="--chip-color: {phase.color}"
						>
							{phase.name}
						</button>
					{/each}
				</div>
			</div>

			<div class="filter-section">
				<h4 class="filter-section__title">Difficulty</h4>
				<div class="filter-chips">
					{#each DIFFICULTIES as diff}
						<button
							class="filter-chip"
							class:selected={selectedDifficulties.includes(diff.id)}
							onclick={() => onDifficultyToggle?.(diff.id)}
							style="--chip-color: {diff.color}"
						>
							{diff.name}
						</button>
					{/each}
				</div>
			</div>

			{#if hasActiveFilters}
				<div class="filter-section__actions">
					<Button variant="ghost" size="sm" onclick={onClearFilters}>
						Clear All Filters
					</Button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.filter-bar {
		background: var(--mc-dark-gray);
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.filter-bar__main {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-md);
	}

	.filter-bar__search {
		flex: 1;
		max-width: 400px;
	}

	.filter-bar__actions {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.filter-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-sm) var(--space-md);
		background: var(--mc-black);
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-sm);
		color: #E8E8E8;
		font-family: var(--font-body);
		font-size: 0.9rem;
		cursor: pointer;
		transition: all var(--transition-fast);
		position: relative;
	}

	.filter-toggle svg {
		width: 18px;
		height: 18px;
	}

	.filter-toggle:hover,
	.filter-toggle.active {
		border-color: var(--mc-xp-green);
	}

	.filter-badge {
		position: absolute;
		top: -4px;
		right: -4px;
		width: 10px;
		height: 10px;
		background: var(--mc-xp-green);
		border-radius: 50%;
	}

	.completed-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		cursor: pointer;
		font-size: 0.9rem;
		color: var(--mc-stone);
	}

	.completed-toggle input {
		width: 18px;
		height: 18px;
		accent-color: var(--mc-xp-green);
	}

	.filter-bar__expanded {
		padding: var(--space-md);
		border-top: 1px solid var(--mc-gray);
		background: rgba(0,0,0,0.2);
		animation: slideDown 0.2s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			max-height: 0;
		}
		to {
			opacity: 1;
			max-height: 500px;
		}
	}

	.filter-section {
		margin-bottom: var(--space-md);
	}

	.filter-section:last-child {
		margin-bottom: 0;
	}

	.filter-section__title {
		font-family: var(--font-pixel);
		font-size: 0.875rem;
		color: var(--mc-stone);
		margin-bottom: var(--space-sm);
		text-transform: uppercase;
	}

	.filter-chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
	}

	.filter-chip {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 4px 10px;
		background: var(--mc-black);
		border: 2px solid var(--mc-gray);
		border-radius: var(--radius-sm);
		color: #E8E8E8;
		font-family: var(--font-body);
		font-size: 0.8rem;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.filter-chip:hover {
		border-color: var(--chip-color);
	}

	.filter-chip.selected {
		background: var(--chip-color);
		border-color: var(--chip-color);
		color: #000;
	}

	.filter-chip__icon {
		font-size: 1rem;
	}

	.filter-section__actions {
		margin-top: var(--space-md);
		padding-top: var(--space-md);
		border-top: 1px solid var(--mc-gray);
	}

	@media (max-width: 768px) {
		.filter-bar__main {
			flex-direction: column;
			align-items: stretch;
		}

		.filter-bar__search {
			max-width: none;
		}

		.filter-bar__actions {
			justify-content: space-between;
		}

		.completed-toggle span {
			display: none;
		}
	}
</style>
