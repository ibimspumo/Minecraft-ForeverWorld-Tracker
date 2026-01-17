import { browser } from '$app/environment';
import type { World, TaskProgress, TaskStatus } from '$lib/types';

const STORAGE_KEY = 'mc-tracker-worlds';
const ACTIVE_WORLD_KEY = 'mc-tracker-active-world';

function generateId(): string {
	return Math.random().toString(36).substring(2, 9);
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
	if (!browser) return defaultValue;
	try {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : defaultValue;
	} catch {
		return defaultValue;
	}
}

function saveToStorage(key: string, value: unknown): void {
	if (!browser) return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.error('Failed to save to localStorage:', e);
	}
}

// World icons (emoji options)
export const WORLD_ICONS = ['🌍', '🌎', '🌏', '⛏️', '🏔️', '🌲', '🏜️', '🌊', '🔥', '💎', '⭐', '🐉'];

class WorldStore {
	worlds = $state<World[]>([]);
	activeWorldId = $state<string | null>(null);

	constructor() {
		if (browser) {
			this.worlds = loadFromStorage<World[]>(STORAGE_KEY, []);
			this.activeWorldId = loadFromStorage<string | null>(ACTIVE_WORLD_KEY, null);

			// Create default world if none exists
			if (this.worlds.length === 0) {
				this.createWorld('My World', '🌍');
			} else if (!this.activeWorldId || !this.worlds.find(w => w.id === this.activeWorldId)) {
				this.activeWorldId = this.worlds[0].id;
			}
		}
	}

	get activeWorld(): World | null {
		return this.worlds.find(w => w.id === this.activeWorldId) ?? null;
	}

	get worldCount(): number {
		return this.worlds.length;
	}

	private persist(): void {
		saveToStorage(STORAGE_KEY, this.worlds);
		saveToStorage(ACTIVE_WORLD_KEY, this.activeWorldId);
	}

	createWorld(name: string, icon: string = '🌍', seed?: string, version: string = '1.21'): World {
		const world: World = {
			id: generateId(),
			name,
			icon,
			seed,
			version,
			createdAt: Date.now(),
			progress: {}
		};

		this.worlds = [...this.worlds, world];
		this.activeWorldId = world.id;
		this.persist();

		return world;
	}

	deleteWorld(id: string): void {
		this.worlds = this.worlds.filter(w => w.id !== id);

		if (this.activeWorldId === id) {
			this.activeWorldId = this.worlds[0]?.id ?? null;
		}

		this.persist();
	}

	setActiveWorld(id: string): void {
		if (this.worlds.find(w => w.id === id)) {
			this.activeWorldId = id;
			this.persist();
		}
	}

	updateWorld(id: string, updates: Partial<Omit<World, 'id' | 'createdAt' | 'progress'>>): void {
		this.worlds = this.worlds.map(w =>
			w.id === id ? { ...w, ...updates } : w
		);
		this.persist();
	}

	// Task Progress Methods
	getTaskProgress(taskId: string): TaskProgress | null {
		if (!this.activeWorld) return null;
		return this.activeWorld.progress[taskId] ?? null;
	}

	getTaskStatus(taskId: string): TaskStatus {
		const progress = this.getTaskProgress(taskId);
		return progress?.status ?? 'pending';
	}

	setTaskStatus(taskId: string, status: TaskStatus): void {
		if (!this.activeWorld || !this.activeWorldId) return;

		const worldIndex = this.worlds.findIndex(w => w.id === this.activeWorldId);
		if (worldIndex === -1) return;

		const updatedProgress = { ...this.worlds[worldIndex].progress };

		if (status === 'pending') {
			delete updatedProgress[taskId];
		} else {
			updatedProgress[taskId] = {
				taskId,
				status,
				completedAt: status === 'completed' ? Date.now() : undefined,
				notes: updatedProgress[taskId]?.notes
			};
		}

		this.worlds = this.worlds.map((w, i) =>
			i === worldIndex ? { ...w, progress: updatedProgress } : w
		);
		this.persist();
	}

	toggleTaskComplete(taskId: string): void {
		const currentStatus = this.getTaskStatus(taskId);
		this.setTaskStatus(taskId, currentStatus === 'completed' ? 'pending' : 'completed');
	}

	setTaskNotes(taskId: string, notes: string): void {
		if (!this.activeWorld || !this.activeWorldId) return;

		const worldIndex = this.worlds.findIndex(w => w.id === this.activeWorldId);
		if (worldIndex === -1) return;

		const currentProgress = this.worlds[worldIndex].progress[taskId];
		const updatedProgress = {
			...this.worlds[worldIndex].progress,
			[taskId]: {
				taskId,
				status: currentProgress?.status ?? 'pending',
				completedAt: currentProgress?.completedAt,
				notes
			}
		};

		this.worlds = this.worlds.map((w, i) =>
			i === worldIndex ? { ...w, progress: updatedProgress } : w
		);
		this.persist();
	}

	// Stats Methods
	getCompletedCount(): number {
		if (!this.activeWorld) return 0;
		return Object.values(this.activeWorld.progress)
			.filter(p => p.status === 'completed').length;
	}

	getCategoryProgress(category: string, tasks: { id: string; category: string }[]): { completed: number; total: number } {
		if (!this.activeWorld) return { completed: 0, total: 0 };

		const categoryTasks = tasks.filter(t => t.category === category);
		const completed = categoryTasks.filter(t =>
			this.activeWorld!.progress[t.id]?.status === 'completed'
		).length;

		return { completed, total: categoryTasks.length };
	}

	// Export/Import
	exportProgress(): string {
		return JSON.stringify({
			version: 1,
			exportedAt: Date.now(),
			worlds: this.worlds
		}, null, 2);
	}

	importProgress(jsonString: string): boolean {
		try {
			const data = JSON.parse(jsonString);
			if (data.worlds && Array.isArray(data.worlds)) {
				this.worlds = data.worlds;
				this.activeWorldId = this.worlds[0]?.id ?? null;
				this.persist();
				return true;
			}
			return false;
		} catch {
			return false;
		}
	}

	// Reset
	resetWorldProgress(): void {
		if (!this.activeWorldId) return;

		this.worlds = this.worlds.map(w =>
			w.id === this.activeWorldId ? { ...w, progress: {} } : w
		);
		this.persist();
	}
}

export const worldStore = new WorldStore();
