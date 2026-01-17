import type { Category, Phase, Difficulty, TaskStatus, FilterState } from '$lib/types';

class FilterStore {
	search = $state('');
	categories = $state<Category[]>([]);
	phases = $state<Phase[]>([]);
	difficulties = $state<Difficulty[]>([]);
	status = $state<TaskStatus | 'all'>('all');
	showCompleted = $state(true);
	sortBy = $state<'name' | 'difficulty' | 'phase' | 'category'>('category');
	sortDirection = $state<'asc' | 'desc'>('asc');

	get hasActiveFilters(): boolean {
		return (
			this.search.length > 0 ||
			this.categories.length > 0 ||
			this.phases.length > 0 ||
			this.difficulties.length > 0 ||
			this.status !== 'all' ||
			!this.showCompleted
		);
	}

	get filterState(): FilterState {
		return {
			search: this.search,
			categories: this.categories,
			phases: this.phases,
			difficulties: this.difficulties,
			status: this.status,
			showCompleted: this.showCompleted
		};
	}

	setSearch(value: string): void {
		this.search = value;
	}

	toggleCategory(category: Category): void {
		if (this.categories.includes(category)) {
			this.categories = this.categories.filter(c => c !== category);
		} else {
			this.categories = [...this.categories, category];
		}
	}

	setCategories(categories: Category[]): void {
		this.categories = categories;
	}

	togglePhase(phase: Phase): void {
		if (this.phases.includes(phase)) {
			this.phases = this.phases.filter(p => p !== phase);
		} else {
			this.phases = [...this.phases, phase];
		}
	}

	setPhases(phases: Phase[]): void {
		this.phases = phases;
	}

	toggleDifficulty(difficulty: Difficulty): void {
		if (this.difficulties.includes(difficulty)) {
			this.difficulties = this.difficulties.filter(d => d !== difficulty);
		} else {
			this.difficulties = [...this.difficulties, difficulty];
		}
	}

	setDifficulties(difficulties: Difficulty[]): void {
		this.difficulties = difficulties;
	}

	setStatus(status: TaskStatus | 'all'): void {
		this.status = status;
	}

	toggleShowCompleted(): void {
		this.showCompleted = !this.showCompleted;
	}

	setSortBy(sortBy: 'name' | 'difficulty' | 'phase' | 'category'): void {
		if (this.sortBy === sortBy) {
			this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			this.sortBy = sortBy;
			this.sortDirection = 'asc';
		}
	}

	clearFilters(): void {
		this.search = '';
		this.categories = [];
		this.phases = [];
		this.difficulties = [];
		this.status = 'all';
		this.showCompleted = true;
	}

	clearSearch(): void {
		this.search = '';
	}
}

export const filterStore = new FilterStore();
