export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type Category =
	| 'blocks'
	| 'items'
	| 'mobs'
	| 'biomes'
	| 'structures'
	| 'advancements'
	| 'enchantments'
	| 'potions'
	| 'music_discs'
	| 'paintings'
	| 'banner_patterns'
	| 'armor_trims'
	| 'pottery_sherds'
	| 'challenges'
	| 'building_goals';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export type Phase =
	| 'early_game'      // First days, basic survival
	| 'mid_game'        // Iron/Diamond tier, Nether access
	| 'late_game'       // End access, Elytra, Beacons
	| 'post_game'       // Completionist content
	| 'any';            // Can be done anytime

export interface Task {
	id: string;
	name: string;
	description: string;
	category: Category;
	phase: Phase;
	difficulty: Difficulty;
	icon?: string;          // Minecraft texture name or URL
	wikiLink?: string;      // Link to Minecraft Wiki
	tags?: string[];        // For filtering
	requirements?: string[]; // IDs of tasks that must be completed first
	tips?: string;          // Helpful tips for completing
}

export interface TaskProgress {
	taskId: string;
	status: TaskStatus;
	completedAt?: number;   // Timestamp
	notes?: string;         // User notes
}

export interface World {
	id: string;
	name: string;
	createdAt: number;
	seed?: string;
	version: string;        // MC version
	icon: string;           // Emoji or color identifier
	progress: Record<string, TaskProgress>;
}

export interface CategoryInfo {
	id: Category;
	name: string;
	description: string;
	icon: string;
	color: string;
}

export interface FilterState {
	search: string;
	categories: Category[];
	phases: Phase[];
	difficulties: Difficulty[];
	status: TaskStatus | 'all';
	showCompleted: boolean;
}

export interface AppState {
	worlds: World[];
	activeWorldId: string | null;
	filters: FilterState;
	sidebarOpen: boolean;
	theme: 'dark' | 'light';
}

// Category metadata
export const CATEGORIES: CategoryInfo[] = [
	{ id: 'blocks', name: 'Blocks', description: 'Collect and place all block types', icon: '🧱', color: '#8B7355' },
	{ id: 'items', name: 'Items', description: 'Obtain all items and tools', icon: '⚔️', color: '#4A90D9' },
	{ id: 'mobs', name: 'Mobs', description: 'Encounter and defeat all creatures', icon: '🐉', color: '#E74C3C' },
	{ id: 'biomes', name: 'Biomes', description: 'Explore every biome type', icon: '🌍', color: '#27AE60' },
	{ id: 'structures', name: 'Structures', description: 'Discover all generated structures', icon: '🏰', color: '#9B59B6' },
	{ id: 'advancements', name: 'Advancements', description: 'Complete all game advancements', icon: '🏆', color: '#F1C40F' },
	{ id: 'enchantments', name: 'Enchantments', description: 'Apply all enchantment types', icon: '✨', color: '#8E44AD' },
	{ id: 'potions', name: 'Potions', description: 'Brew every potion variant', icon: '🧪', color: '#E91E63' },
	{ id: 'music_discs', name: 'Music Discs', description: 'Collect all music discs', icon: '💿', color: '#1ABC9C' },
	{ id: 'paintings', name: 'Paintings', description: 'Discover all painting variants', icon: '🖼️', color: '#E67E22' },
	{ id: 'banner_patterns', name: 'Banner Patterns', description: 'Unlock all special patterns', icon: '🚩', color: '#C0392B' },
	{ id: 'armor_trims', name: 'Armor Trims', description: 'Find all smithing templates', icon: '🛡️', color: '#3498DB' },
	{ id: 'pottery_sherds', name: 'Pottery Sherds', description: 'Collect all decorated sherds', icon: '🏺', color: '#D35400' },
	{ id: 'challenges', name: 'Challenges', description: 'Complete special long-term goals', icon: '⭐', color: '#F39C12' },
	{ id: 'building_goals', name: 'Building Goals', description: 'Construct farms and contraptions', icon: '🔧', color: '#7F8C8D' }
];

export const PHASES: { id: Phase; name: string; color: string }[] = [
	{ id: 'early_game', name: 'Early Game', color: '#7CB342' },
	{ id: 'mid_game', name: 'Mid Game', color: '#FFA726' },
	{ id: 'late_game', name: 'Late Game', color: '#EF5350' },
	{ id: 'post_game', name: 'Post Game', color: '#AB47BC' },
	{ id: 'any', name: 'Any Phase', color: '#78909C' }
];

export const DIFFICULTIES: { id: Difficulty; name: string; color: string }[] = [
	{ id: 'easy', name: 'Easy', color: '#4CAF50' },
	{ id: 'medium', name: 'Medium', color: '#FF9800' },
	{ id: 'hard', name: 'Hard', color: '#f44336' },
	{ id: 'extreme', name: 'Extreme', color: '#9C27B0' }
];
