import type { Task, Category } from '$lib/types';

/**
 * Get the best icon URL for a task
 * Falls back through multiple naming strategies
 */
export function getTaskIconSources(task: Task): string[] {
	const wikiBase = 'https://minecraft.wiki/images';

	// Get the best icon name based on task data
	const iconName = deriveIconName(task);
	const titleCase = toTitleCase(iconName);

	const sources: string[] = [];

	// Category-specific strategies
	switch (task.category) {
		case 'mobs':
			// For mobs, use spawn eggs (most reliable)
			sources.push(`${wikiBase}/Invicon_${titleCase}_Spawn_Egg.png`);
			// Some mobs have face images
			sources.push(`${wikiBase}/${titleCase}_Face.png`);
			break;

		case 'biomes':
			// Biomes use representative blocks
			const biomeBlock = getBiomeRepresentativeBlock(task.name);
			if (biomeBlock) {
				sources.push(`${wikiBase}/Invicon_${toTitleCase(biomeBlock)}.png`);
			}
			break;

		case 'structures':
			// Structures use structure blocks or representative items
			const structureBlock = getStructureRepresentativeBlock(task.name);
			if (structureBlock) {
				sources.push(`${wikiBase}/Invicon_${toTitleCase(structureBlock)}.png`);
			}
			break;

		case 'advancements':
			// Advancements might use specific icons
			sources.push(`${wikiBase}/Invicon_${titleCase}.png`);
			// Try advancement icon if available
			const advIcon = getAdvancementIcon(task.name);
			if (advIcon) {
				sources.push(`${wikiBase}/Invicon_${toTitleCase(advIcon)}.png`);
			}
			break;

		case 'enchantments':
			// Use enchanted book for enchantments
			sources.push(`${wikiBase}/Invicon_Enchanted_Book.gif`);
			break;

		case 'potions':
			// Use potion bottle
			sources.push(`${wikiBase}/Invicon_Potion_of_Healing.gif`);
			sources.push(`${wikiBase}/Invicon_Potion_of_Regeneration.gif`);
			break;

		default:
			// Default: try Invicon format
			sources.push(`${wikiBase}/Invicon_${titleCase}.png`);
	}

	// Add common fallbacks
	sources.push(`${wikiBase}/Invicon_${titleCase}.png`);
	sources.push(`${wikiBase}/${titleCase}.png`);
	sources.push(`${wikiBase}/Grid_${titleCase}.png`);

	// Remove duplicates
	return [...new Set(sources)];
}

/**
 * Convert snake_case to Title_Case
 */
function toTitleCase(str: string): string {
	return str
		.split('_')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join('_');
}

/**
 * Derive the best icon name from task data
 */
function deriveIconName(task: Task): string {
	// If icon is specified and not generic, use it
	if (task.icon && !isGenericIcon(task.icon)) {
		return task.icon;
	}

	// For mobs, extract mob name from ID
	if (task.category === 'mobs' && task.id.startsWith('mob_')) {
		return task.id.replace('mob_', '');
	}

	// For blocks, extract block name from ID
	if (task.category === 'blocks' && task.id.startsWith('block_')) {
		return task.id.replace('block_', '');
	}

	// For items, extract item name from ID
	if (task.category === 'items' && task.id.startsWith('item_')) {
		return task.id.replace('item_', '');
	}

	// Default to task name converted to snake_case
	return task.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

/**
 * Check if an icon name is too generic
 */
function isGenericIcon(icon: string): boolean {
	const genericIcons = ['sword', 'pickaxe', 'axe', 'shovel', 'hoe', 'potion', 'book', 'armor'];
	return genericIcons.includes(icon.toLowerCase());
}

/**
 * Get a representative block for a biome
 */
function getBiomeRepresentativeBlock(biomeName: string): string | null {
	const biomeBlocks: Record<string, string> = {
		'plains': 'grass_block',
		'forest': 'oak_log',
		'birch forest': 'birch_log',
		'dark forest': 'dark_oak_log',
		'taiga': 'spruce_log',
		'snowy': 'snow_block',
		'desert': 'sand',
		'badlands': 'red_sand',
		'jungle': 'jungle_log',
		'swamp': 'lily_pad',
		'mangrove swamp': 'mangrove_log',
		'ocean': 'water_bucket',
		'beach': 'sand',
		'mushroom': 'mycelium',
		'nether': 'netherrack',
		'soul sand valley': 'soul_sand',
		'crimson forest': 'crimson_stem',
		'warped forest': 'warped_stem',
		'basalt deltas': 'basalt',
		'the end': 'end_stone',
		'cherry grove': 'cherry_log',
		'meadow': 'grass_block',
		'mountain': 'stone',
		'cave': 'stone',
		'lush caves': 'moss_block',
		'dripstone caves': 'dripstone_block',
		'deep dark': 'sculk',
	};

	const lowerName = biomeName.toLowerCase();
	for (const [key, block] of Object.entries(biomeBlocks)) {
		if (lowerName.includes(key)) {
			return block;
		}
	}
	return 'grass_block'; // Default
}

/**
 * Get a representative block for a structure
 */
function getStructureRepresentativeBlock(structureName: string): string | null {
	const structureBlocks: Record<string, string> = {
		'village': 'hay_block',
		'pillager outpost': 'crossbow',
		'mansion': 'dark_oak_log',
		'monument': 'prismarine_shard',
		'temple': 'sandstone',
		'pyramid': 'sandstone',
		'jungle temple': 'mossy_cobblestone',
		'igloo': 'snow_block',
		'witch hut': 'cauldron',
		'stronghold': 'end_portal_frame',
		'end city': 'purpur_block',
		'fortress': 'nether_bricks',
		'bastion': 'blackstone',
		'ancient city': 'sculk',
		'trail ruins': 'suspicious_gravel',
		'trial chamber': 'trial_spawner',
		'shipwreck': 'oak_planks',
		'mineshaft': 'rail',
		'dungeon': 'spawner',
		'ruined portal': 'crying_obsidian',
		'buried treasure': 'chest',
	};

	const lowerName = structureName.toLowerCase();
	for (const [key, block] of Object.entries(structureBlocks)) {
		if (lowerName.includes(key)) {
			return block;
		}
	}
	return 'structure_block';
}

/**
 * Get icon for advancement
 */
function getAdvancementIcon(advancementName: string): string | null {
	const advIcons: Record<string, string> = {
		'stone age': 'wooden_pickaxe',
		'getting an upgrade': 'stone_pickaxe',
		'acquire hardware': 'iron_pickaxe',
		'diamonds': 'diamond',
		'ice bucket challenge': 'obsidian',
		'we need to go deeper': 'flint_and_steel',
		'cover me with diamonds': 'diamond_chestplate',
		'enchanter': 'enchanting_table',
		'zombie doctor': 'golden_apple',
		'the end': 'ender_eye',
		'free the end': 'dragon_egg',
		'monster hunter': 'iron_sword',
		'adventuring time': 'diamond_boots',
		'a complete catalogue': 'cod',
		'two by two': 'wheat',
	};

	const lowerName = advancementName.toLowerCase();
	for (const [key, icon] of Object.entries(advIcons)) {
		if (lowerName.includes(key)) {
			return icon;
		}
	}
	return null;
}
