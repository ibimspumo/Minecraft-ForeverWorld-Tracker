import type { Task, Category } from '$lib/types';
import { filterStore } from './filters.svelte';
import { worldStore } from './worlds.svelte';

// Import all task data
import blocksData from '$lib/data/blocks.json';
import itemsData from '$lib/data/items.json';
import mobsData from '$lib/data/mobs.json';
import biomesData from '$lib/data/biomes.json';
import structuresData from '$lib/data/structures.json';
import advancementsData from '$lib/data/advancements.json';
import enchantmentsData from '$lib/data/enchantments.json';
import potionsData from '$lib/data/potions.json';
import collectiblesData from '$lib/data/collectibles.json';
import challengesData from '$lib/data/challenges.json';
import buildingGoalsData from '$lib/data/building_goals.json';

// Combine all tasks
const allTasks: Task[] = [
	...blocksData as Task[],
	...itemsData as Task[],
	...mobsData as Task[],
	...biomesData as Task[],
	...structuresData as Task[],
	...advancementsData as Task[],
	...enchantmentsData as Task[],
	...potionsData as Task[],
	...collectiblesData as Task[],
	...challengesData as Task[],
	...buildingGoalsData as Task[]
];

const difficultyOrder = { easy: 0, medium: 1, hard: 2, extreme: 3 };
const phaseOrder = { early_game: 0, mid_game: 1, late_game: 2, post_game: 3, any: 4 };

class TaskStore {
	private _tasks = allTasks;

	get tasks(): Task[] {
		return this._tasks;
	}

	get totalCount(): number {
		return this._tasks.length;
	}

	get filteredTasks(): Task[] {
		let result = [...this._tasks];
		const filters = filterStore;

		// Search filter
		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			result = result.filter(task =>
				task.name.toLowerCase().includes(searchLower) ||
				task.description.toLowerCase().includes(searchLower) ||
				task.tags?.some(tag => tag.toLowerCase().includes(searchLower))
			);
		}

		// Category filter
		if (filters.categories.length > 0) {
			result = result.filter(task => filters.categories.includes(task.category));
		}

		// Phase filter
		if (filters.phases.length > 0) {
			result = result.filter(task => filters.phases.includes(task.phase));
		}

		// Difficulty filter
		if (filters.difficulties.length > 0) {
			result = result.filter(task => filters.difficulties.includes(task.difficulty));
		}

		// Status filter
		if (filters.status !== 'all') {
			result = result.filter(task => {
				const status = worldStore.getTaskStatus(task.id);
				return status === filters.status;
			});
		}

		// Hide completed filter
		if (!filters.showCompleted) {
			result = result.filter(task => {
				const status = worldStore.getTaskStatus(task.id);
				return status !== 'completed';
			});
		}

		// Sorting
		result.sort((a, b) => {
			let comparison = 0;

			switch (filters.sortBy) {
				case 'name':
					comparison = a.name.localeCompare(b.name);
					break;
				case 'difficulty':
					comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
					break;
				case 'phase':
					comparison = phaseOrder[a.phase] - phaseOrder[b.phase];
					break;
				case 'category':
				default:
					comparison = a.category.localeCompare(b.category);
					if (comparison === 0) {
						comparison = a.name.localeCompare(b.name);
					}
					break;
			}

			return filters.sortDirection === 'asc' ? comparison : -comparison;
		});

		return result;
	}

	getTaskById(id: string): Task | undefined {
		return this._tasks.find(t => t.id === id);
	}

	getTasksByCategory(category: Category): Task[] {
		return this._tasks.filter(t => t.category === category);
	}

	getCategoryStats(category: Category): { total: number; completed: number; percentage: number } {
		const categoryTasks = this.getTasksByCategory(category);
		const completed = categoryTasks.filter(t =>
			worldStore.getTaskStatus(t.id) === 'completed'
		).length;

		return {
			total: categoryTasks.length,
			completed,
			percentage: categoryTasks.length > 0
				? Math.round((completed / categoryTasks.length) * 100)
				: 0
		};
	}

	getOverallStats(): { total: number; completed: number; percentage: number } {
		const completed = this._tasks.filter(t =>
			worldStore.getTaskStatus(t.id) === 'completed'
		).length;

		return {
			total: this._tasks.length,
			completed,
			percentage: this._tasks.length > 0
				? Math.round((completed / this._tasks.length) * 100)
				: 0
		};
	}

	getRecentlyCompleted(limit: number = 10): Task[] {
		if (!worldStore.activeWorld) return [];

		const completedProgress = Object.values(worldStore.activeWorld.progress)
			.filter(p => p.status === 'completed' && p.completedAt)
			.sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
			.slice(0, limit);

		return completedProgress
			.map(p => this.getTaskById(p.taskId))
			.filter((t): t is Task => t !== undefined);
	}

	searchTasks(query: string): Task[] {
		if (!query) return [];

		const queryLower = query.toLowerCase();
		return this._tasks.filter(task =>
			task.name.toLowerCase().includes(queryLower) ||
			task.description.toLowerCase().includes(queryLower) ||
			task.tags?.some(tag => tag.toLowerCase().includes(queryLower))
		).slice(0, 50); // Limit search results
	}
}

export const taskStore = new TaskStore();
