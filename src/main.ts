import './styles.css';
import type { Phase, World, AppState, FilterMode, Task, CollectionCategory, TabMode } from './types';

// Import all phase data
import firstNight from './data/first-night.json';
import woodAge from './data/wood-age.json';
import stoneAge from './data/stone-age.json';
import ironAge from './data/iron-age.json';
import farming from './data/farming.json';
import mining from './data/mining.json';
import diamondAge from './data/diamond-age.json';
import nether from './data/nether.json';
import enchanting from './data/enchanting.json';
import brewing from './data/brewing.json';
import endPrep from './data/end-prep.json';
import theEnd from './data/the-end.json';
import automation from './data/automation.json';
import building from './data/building.json';
import collection from './data/collection.json';
import mastery from './data/mastery.json';

// Import collection category data
import toolsCollection from './data/collection/tools.json';
import weaponsCollection from './data/collection/weapons.json';
import armorCollection from './data/collection/armor.json';
import foodCollection from './data/collection/food.json';
import materialsCollection from './data/collection/materials.json';
import dyesCollection from './data/collection/dyes.json';
import potionsCollection from './data/collection/potions.json';
import musicDiscsCollection from './data/collection/music-discs.json';
import enchantedBooksCollection from './data/collection/enchanted-books.json';
import bannerPatternsCollection from './data/collection/banner-patterns.json';
import potterySherdsCollection from './data/collection/pottery-sherds.json';
import smithingTemplatesCollection from './data/collection/smithing-templates.json';
import transportationCollection from './data/collection/transportation.json';
import redstoneCollection from './data/collection/redstone.json';
import decorationsCollection from './data/collection/decorations.json';
import buildingBlocksCollection from './data/collection/building-blocks.json';
import functionalBlocksCollection from './data/collection/functional-blocks.json';
import miscellaneousCollection from './data/collection/miscellaneous.json';
import woodBlocksCollection from './data/collection/wood-blocks.json';
import slabsStairsWallsCollection from './data/collection/slabs-stairs-walls.json';

// All phases in order
const PHASES: Phase[] = [
  firstNight as Phase,
  woodAge as Phase,
  stoneAge as Phase,
  ironAge as Phase,
  farming as Phase,
  mining as Phase,
  diamondAge as Phase,
  nether as Phase,
  enchanting as Phase,
  brewing as Phase,
  endPrep as Phase,
  theEnd as Phase,
  automation as Phase,
  building as Phase,
  collection as Phase,
  mastery as Phase,
];

// All collection categories in order
const COLLECTION_CATEGORIES: CollectionCategory[] = [
  toolsCollection as CollectionCategory,
  weaponsCollection as CollectionCategory,
  armorCollection as CollectionCategory,
  foodCollection as CollectionCategory,
  materialsCollection as CollectionCategory,
  dyesCollection as CollectionCategory,
  potionsCollection as CollectionCategory,
  musicDiscsCollection as CollectionCategory,
  enchantedBooksCollection as CollectionCategory,
  bannerPatternsCollection as CollectionCategory,
  potterySherdsCollection as CollectionCategory,
  smithingTemplatesCollection as CollectionCategory,
  transportationCollection as CollectionCategory,
  redstoneCollection as CollectionCategory,
  decorationsCollection as CollectionCategory,
  buildingBlocksCollection as CollectionCategory,
  woodBlocksCollection as CollectionCategory,
  slabsStairsWallsCollection as CollectionCategory,
  functionalBlocksCollection as CollectionCategory,
  miscellaneousCollection as CollectionCategory,
];

// Storage key
const STORAGE_KEY = 'minecraft-forever-world-tracker';

// State
let state: AppState = {
  worlds: [],
  activeWorldId: null,
};

let collapsedPhases: Set<string> = new Set();
let collapsedCategories: Set<string> = new Set();
let searchQuery = '';
let filterMode: FilterMode = 'all';
let activeTab: TabMode = 'progress';
let collectionSearchQuery = '';
let collectionFilterMode: FilterMode = 'all';

// DOM Elements
const app = document.getElementById('app')!;

// Helper: Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Items that use GIF format on the wiki (animated icons)
const GIF_ITEMS = new Set([
  'nether_star', 'clock', 'compass', 'stonecutter', 'end_crystal',
  'enchanted_book', 'sculk', 'sculk_shrieker', 'magma_block', 'prismarine',
  'experience_bottle', 'crimson_stem', 'warped_stem',
  // Additional animated items for collection
  'sculk_sensor', 'calibrated_sculk_sensor', 'sea_lantern', 'recovery_compass',
  'enchanted_golden_apple', 'sculk_vein',
]);

// Wiki icon name mappings for items with different names
const WIKI_NAME_MAP: Record<string, string> = {
  // Blocks with "Block_of_X" naming
  'iron_block': 'Block_of_Iron',
  'gold_block': 'Block_of_Gold',
  'diamond_block': 'Block_of_Diamond',
  'emerald_block': 'Block_of_Emerald',
  'netherite_block': 'Block_of_Netherite',
  'quartz_block': 'Block_of_Quartz',
  'coal_block': 'Block_of_Coal',
  'copper_block': 'Block_of_Copper',
  'lapis_block': 'Block_of_Lapis_Lazuli',
  'redstone_block': 'Block_of_Redstone',

  // Raw meats
  'beef': 'Raw_Beef',
  'porkchop': 'Raw_Porkchop',
  'chicken': 'Raw_Chicken',
  'cod': 'Raw_Cod',
  'salmon': 'Raw_Salmon',
  'rabbit': 'Raw_Rabbit',
  'mutton': 'Raw_Mutton',

  // Items with different names
  'ender_eye': 'Eye_of_Ender',
  'spawner': 'Monster_Spawner',
  'tnt': 'TNT',
  'slime_ball': 'Slimeball',
  'totem_of_undying': 'Totem_of_Undying',
  'heart_of_the_sea': 'Heart_of_the_Sea',
  'hay_block': 'Hay_Bale',
  'repeater': 'Redstone_Repeater',
  'comparator': 'Redstone_Comparator',
  'dragon_breath': "Dragon's_Breath",
  'filled_map': 'Map',
  'writable_book': 'Book_and_Quill',
  'quartz': 'Nether_Quartz',
  'rabbit_foot': "Rabbit's_Foot",
  'turtle_helmet': 'Turtle_Shell',
  'axolotl_bucket': 'Bucket_of_Axolotl',
  'flint_and_steel': 'Flint_and_Steel',
  'carrot_on_a_stick': 'Carrot_on_a_Stick',
  'warped_fungus_on_a_stick': 'Warped_Fungus_on_a_Stick',
  'chest_minecart': 'Minecart_with_Chest',
  'hopper_minecart': 'Minecart_with_Hopper',
  'furnace_minecart': 'Minecart_with_Furnace',
  'tnt_minecart': 'Minecart_with_TNT',
  'command_block_minecart': 'Minecart_with_Command_Block',

  // Potions - use healing as default icon
  'potion': 'Potion_of_Healing',
  'splash_potion': 'Splash_Potion_of_Healing',
  'lingering_potion': 'Lingering_Potion_of_Healing',
  'tipped_arrow': 'Arrow_of_Healing',

  // Books and bottles
  'enchanted_book': 'Enchanted_Book',
  'knowledge_book': 'Knowledge_Book',
  'experience_bottle': "Bottle_o'_Enchanting",

  // Music discs
  'music_disc_13': 'Music_Disc_13',
  'music_disc_cat': 'Music_Disc_Cat',
  'music_disc_blocks': 'Music_Disc_Blocks',
  'music_disc_chirp': 'Music_Disc_Chirp',
  'music_disc_far': 'Music_Disc_Far',
  'music_disc_mall': 'Music_Disc_Mall',
  'music_disc_mellohi': 'Music_Disc_Mellohi',
  'music_disc_stal': 'Music_Disc_Stal',
  'music_disc_strad': 'Music_Disc_Strad',
  'music_disc_ward': 'Music_Disc_Ward',
  'music_disc_11': 'Music_Disc_11',
  'music_disc_wait': 'Music_Disc_Wait',
  'music_disc_pigstep': 'Music_Disc_Pigstep',
  'music_disc_otherside': 'Music_Disc_Otherside',
  'music_disc_5': 'Music_Disc_5',
  'music_disc_relic': 'Music_Disc_Relic',

  // Skulls/heads
  'skeleton_skull': 'Skeleton_Skull',
  'wither_skeleton_skull': 'Wither_Skeleton_Skull',
  'zombie_head': 'Zombie_Head',
  'creeper_head': 'Creeper_Head',
  'dragon_head': 'Dragon_Head',
  'player_head': 'Player_Head',
  'piglin_head': 'Piglin_Head',

  // Ominous items
  'ominous_banner': 'Ominous_Banner',

  // Templates
  'netherite_upgrade_smithing_template': 'Netherite_Upgrade',
  'sentry_armor_trim_smithing_template': 'Sentry_Armor_Trim',

};

// Helper: Convert item ID to Title Case for Wiki URLs
function toTitleCase(str: string): string {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('_');
}

// Helper: Get Minecraft item icon URL from official Wiki
function getIconUrl(itemId: string): string {
  const cleanId = itemId.replace('minecraft:', '').toLowerCase();
  const ext = GIF_ITEMS.has(cleanId) ? 'gif' : 'png';

  // Check if there's a special mapping
  if (WIKI_NAME_MAP[cleanId]) {
    return `https://minecraft.wiki/images/Invicon_${WIKI_NAME_MAP[cleanId]}.${ext}`;
  }

  // Default: convert to title case
  const titleCase = toTitleCase(cleanId);
  return `https://minecraft.wiki/images/Invicon_${titleCase}.${ext}`;
}

// Helper: Create fallback icon
function getFallbackIcon(itemId: string): string {
  const fallbacks: Record<string, string> = {
    'pickaxe': '⛏️',
    'axe': '🪓',
    'sword': '🗡️',
    'shovel': '🔧',
    'hoe': '🌾',
    'helmet': '🪖',
    'chestplate': '🛡️',
    'leggings': '👖',
    'boots': '👢',
    'bow': '🏹',
    'arrow': '➡️',
    'crossbow': '🏹',
    'shield': '🛡️',
    'bed': '🛏️',
    'torch': '🔦',
    'lantern': '🏮',
    'crafting': '🔨',
    'furnace': '🔥',
    'chest': '📦',
    'barrel': '🛢️',
    'bucket': '🪣',
    'water': '💧',
    'lava': '🌋',
    'diamond': '💎',
    'emerald': '💚',
    'gold': '🪙',
    'iron': '⚙️',
    'coal': '⬛',
    'redstone': '🔴',
    'lapis': '🔵',
    'nether': '🔥',
    'end': '🌌',
    'dragon': '🐉',
    'wither': '💀',
    'skull': '💀',
    'bone': '🦴',
    'egg': '🥚',
    'wheat': '🌾',
    'carrot': '🥕',
    'potato': '🥔',
    'melon': '🍈',
    'pumpkin': '🎃',
    'apple': '🍎',
    'bread': '🍞',
    'cake': '🎂',
    'cookie': '🍪',
    'fish': '🐟',
    'cod': '🐟',
    'salmon': '🐟',
    'beef': '🥩',
    'pork': '🥓',
    'chicken': '🍗',
    'rabbit': '🐰',
    'stew': '🍲',
    'potion': '🧪',
    'bottle': '🧴',
    'book': '📖',
    'paper': '📄',
    'map': '🗺️',
    'compass': '🧭',
    'clock': '🕐',
    'star': '⭐',
    'pearl': '🔮',
    'eye': '👁️',
    'blaze': '🔥',
    'ghast': '👻',
    'slime': '🟢',
    'spider': '🕷️',
    'string': '🧵',
    'leather': '🟤',
    'feather': '🪶',
    'wool': '🧶',
    'dye': '🎨',
    'banner': '🚩',
    'flower': '🌸',
    'sapling': '🌱',
    'seed': '🌱',
    'mushroom': '🍄',
    'log': '🪵',
    'planks': '🪵',
    'stone': '🪨',
    'cobble': '🪨',
    'brick': '🧱',
    'glass': '🪟',
    'sand': '🏖️',
    'gravel': '⚪',
    'dirt': '🟫',
    'grass': '🌿',
    'snow': '❄️',
    'ice': '🧊',
    'obsidian': '⬛',
    'crying': '😢',
    'portal': '🌀',
    'ender': '🔮',
    'shulker': '📦',
    'elytra': '🪽',
    'firework': '🎆',
    'rocket': '🚀',
    'tnt': '💣',
    'minecart': '🚃',
    'rail': '🛤️',
    'boat': '🚣',
    'saddle': '🐴',
    'lead': '🪢',
    'name_tag': '🏷️',
    'totem': '🗿',
    'trident': '🔱',
    'shell': '🐚',
    'coral': '🪸',
    'sponge': '🧽',
    'prismarine': '🔷',
    'honey': '🍯',
    'wax': '🕯️',
    'candle': '🕯️',
    'amethyst': '💜',
    'copper': '🟠',
    'spyglass': '🔭',
    'brush': '🖌️',
    'pottery': '🏺',
    'armor_stand': '🧍',
    'item_frame': '🖼️',
    'painting': '🖼️',
    'sign': '🪧',
    'default': '📦'
  };

  const id = itemId.toLowerCase();
  for (const [key, emoji] of Object.entries(fallbacks)) {
    if (id.includes(key)) return emoji;
  }
  return fallbacks.default;
}

// Storage functions
function loadState(): void {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
}

function saveState(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

// World management
function createWorld(name: string): World {
  const world: World = {
    id: generateId(),
    name: name.trim() || `World ${state.worlds.length + 1}`,
    createdAt: Date.now(),
    progress: {},
    collectionProgress: {},
  };
  state.worlds.push(world);
  state.activeWorldId = world.id;
  saveState();
  return world;
}

function deleteWorld(worldId: string): void {
  state.worlds = state.worlds.filter(w => w.id !== worldId);
  if (state.activeWorldId === worldId) {
    state.activeWorldId = state.worlds.length > 0 ? state.worlds[0].id : null;
  }
  saveState();
}

function getActiveWorld(): World | null {
  return state.worlds.find(w => w.id === state.activeWorldId) || null;
}

// Progress functions
function toggleTask(taskId: string): void {
  const world = getActiveWorld();
  if (!world) return;

  world.progress[taskId] = !world.progress[taskId];
  saveState();
  render();

  // Show toast
  if (world.progress[taskId]) {
    showToast('Task completed!', 'success');
  }
}

function isTaskCompleted(taskId: string): boolean {
  const world = getActiveWorld();
  if (!world) return false;
  return world.progress[taskId] === true;
}

function getPhaseProgress(phase: Phase): { completed: number; total: number; percentage: number } {
  const total = phase.tasks.length;
  const completed = phase.tasks.filter(t => isTaskCompleted(t.id)).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

function getTotalProgress(): { completed: number; total: number; percentage: number } {
  let completed = 0;
  let total = 0;

  for (const phase of PHASES) {
    total += phase.tasks.length;
    completed += phase.tasks.filter(t => isTaskCompleted(t.id)).length;
  }

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

// Filter tasks
function filterTasks(tasks: Task[]): Task[] {
  let filtered = tasks;

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(t => t.text.toLowerCase().includes(query));
  }

  // Apply completion filter
  if (filterMode === 'completed') {
    filtered = filtered.filter(t => isTaskCompleted(t.id));
  } else if (filterMode === 'incomplete') {
    filtered = filtered.filter(t => !isTaskCompleted(t.id));
  }

  return filtered;
}

// Collection functions
function toggleCollectionItem(itemId: string): void {
  const world = getActiveWorld();
  if (!world) return;

  // Initialize collectionProgress if it doesn't exist (backwards compatibility)
  if (!world.collectionProgress) {
    world.collectionProgress = {};
  }

  world.collectionProgress[itemId] = !world.collectionProgress[itemId];
  saveState();

  // Optimized: Update only the clicked item instead of full re-render
  const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
  if (itemElement) {
    itemElement.classList.toggle('collected', world.collectionProgress[itemId]);
  }

  // Update category progress for the category containing this item
  updateCollectionProgressUI();

  if (world.collectionProgress[itemId]) {
    showToast('Item collected!', 'success');
  }
}

// Update only the progress bars and stats without re-rendering items
function updateCollectionProgressUI(): void {
  // Update total stats
  const totalProgress = getTotalCollectionProgress();
  const categoriesCompleted = COLLECTION_CATEGORIES.filter(c => getCategoryProgress(c).percentage === 100).length;

  const statsCollected = document.querySelector('.collection-stats-collected .stats-value');
  const statsRemaining = document.querySelector('.collection-stats-remaining .stats-value');
  const statsCategories = document.querySelector('.collection-stats-categories .stats-value');
  const progressBarFill = document.querySelector('.collection-progress-bar .xp-bar-fill') as HTMLElement;
  const progressCount = document.querySelector('.collection-progress-count');
  const progressPercent = document.querySelector('.collection-progress-percent');

  if (statsCollected) statsCollected.textContent = totalProgress.collected.toString();
  if (statsRemaining) statsRemaining.textContent = (totalProgress.total - totalProgress.collected).toString();
  if (statsCategories) statsCategories.textContent = `${categoriesCompleted}/${COLLECTION_CATEGORIES.length}`;
  if (progressBarFill) progressBarFill.style.width = `${totalProgress.percentage}%`;
  if (progressCount) progressCount.textContent = `${totalProgress.collected} / ${totalProgress.total}`;
  if (progressPercent) progressPercent.textContent = `${totalProgress.percentage}%`;

  // Update each category's progress bar
  for (const category of COLLECTION_CATEGORIES) {
    const categoryElement = document.querySelector(`[data-category="${category.id}"]`);
    if (categoryElement) {
      const progress = getCategoryProgress(category);
      const categoryBarFill = categoryElement.querySelector('.xp-bar-fill') as HTMLElement;
      const categoryText = categoryElement.querySelector('.collection-category-progress-text');

      if (categoryBarFill) categoryBarFill.style.width = `${progress.percentage}%`;
      if (categoryText) categoryText.textContent = `${progress.collected}/${progress.total}`;
    }
  }
}

function isItemCollected(itemId: string): boolean {
  const world = getActiveWorld();
  if (!world || !world.collectionProgress) return false;
  return world.collectionProgress[itemId] === true;
}

function getCategoryProgress(category: CollectionCategory): { collected: number; total: number; percentage: number } {
  const total = category.items.length;
  const collected = category.items.filter(item => isItemCollected(item.id)).length;
  const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;
  return { collected, total, percentage };
}

function getTotalCollectionProgress(): { collected: number; total: number; percentage: number } {
  let collected = 0;
  let total = 0;

  for (const category of COLLECTION_CATEGORIES) {
    total += category.items.length;
    collected += category.items.filter(item => isItemCollected(item.id)).length;
  }

  const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;
  return { collected, total, percentage };
}

function filterCollectionItems(category: CollectionCategory): CollectionCategory['items'] {
  let filtered = category.items;

  // Apply search filter
  if (collectionSearchQuery) {
    const query = collectionSearchQuery.toLowerCase();
    filtered = filtered.filter(item => item.name.toLowerCase().includes(query));
  }

  // Apply completion filter
  if (collectionFilterMode === 'completed') {
    filtered = filtered.filter(item => isItemCollected(item.id));
  } else if (collectionFilterMode === 'incomplete') {
    filtered = filtered.filter(item => !isItemCollected(item.id));
  }

  return filtered;
}

// Helper: Get collection icon URL (uses pre-mapped wiki names)
function getCollectionIconUrl(iconName: string): string {
  const ext = GIF_ITEMS.has(iconName.toLowerCase().replace(/_/g, '_')) ? 'gif' : 'png';
  return `https://minecraft.wiki/images/Invicon_${iconName}.${ext}`;
}

// Toast notification
function showToast(message: string, type: 'success' | 'error' = 'success'): void {
  const container = document.querySelector('.toast-container') || createToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast mc-panel toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : '✗'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function createToastContainer(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Modal handling
function showNewWorldModal(): void {
  const modal = document.querySelector('.modal-overlay') as HTMLElement;
  if (modal) {
    modal.classList.add('visible');
    const input = modal.querySelector('.modal-input') as HTMLInputElement;
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}

function hideModal(): void {
  const modal = document.querySelector('.modal-overlay') as HTMLElement;
  if (modal) {
    modal.classList.remove('visible');
  }
}

// Render functions
function renderHeader(): string {
  return `
    <header class="header">
      <h1 class="header-title mc-text">Minecraft Forever World Tracker</h1>
      <p class="header-subtitle">Track your journey from first night to full completion</p>
    </header>
  `;
}

function renderWorldSelector(): string {
  const activeWorld = getActiveWorld();

  return `
    <div class="world-selector mc-panel">
      <select class="world-select" id="world-select">
        ${state.worlds.length === 0
          ? '<option value="">No worlds yet...</option>'
          : state.worlds.map(w => `
              <option value="${w.id}" ${w.id === state.activeWorldId ? 'selected' : ''}>
                ${w.name}
              </option>
            `).join('')
        }
      </select>
      <button class="mc-button mc-button-primary" id="new-world-btn">
        + New World
      </button>
      ${activeWorld ? `
        <button class="mc-button delete-world-btn" id="delete-world-btn" title="Delete World">
          Delete
        </button>
      ` : ''}
    </div>
  `;
}

function renderStats(): string {
  const total = getTotalProgress();
  const phasesCompleted = PHASES.filter(p => getPhaseProgress(p).percentage === 100).length;

  return `
    <div class="stats-overview">
      <div class="stat-card mc-panel">
        <div class="stat-value">${total.percentage}%</div>
        <div class="stat-label">Overall Progress</div>
      </div>
      <div class="stat-card mc-panel">
        <div class="stat-value">${total.completed}</div>
        <div class="stat-label">Tasks Completed</div>
      </div>
      <div class="stat-card mc-panel">
        <div class="stat-value">${total.total - total.completed}</div>
        <div class="stat-label">Tasks Remaining</div>
      </div>
      <div class="stat-card mc-panel">
        <div class="stat-value">${phasesCompleted}/${PHASES.length}</div>
        <div class="stat-label">Phases Complete</div>
      </div>
    </div>

    <div class="main-progress mc-panel">
      <div class="main-progress-label">
        <span class="mc-text">Total Completion</span>
        <span>${total.completed} / ${total.total}</span>
      </div>
      <div class="xp-bar">
        <div class="xp-bar-fill" style="width: ${total.percentage}%"></div>
        <span class="xp-bar-text">${total.percentage}%</span>
      </div>
    </div>
  `;
}

function renderSearchFilter(): string {
  return `
    <div class="search-filter">
      <input
        type="text"
        class="search-input"
        id="search-input"
        placeholder="Search tasks..."
        value="${searchQuery}"
      >
      <div class="filter-buttons">
        <button class="mc-button filter-btn ${filterMode === 'all' ? 'active' : ''}" data-filter="all">
          All
        </button>
        <button class="mc-button filter-btn ${filterMode === 'incomplete' ? 'active' : ''}" data-filter="incomplete">
          Incomplete
        </button>
        <button class="mc-button filter-btn ${filterMode === 'completed' ? 'active' : ''}" data-filter="completed">
          Completed
        </button>
      </div>
    </div>
  `;
}

function renderTask(task: Task): string {
  const completed = isTaskCompleted(task.id);
  const iconUrl = task.icon ? getIconUrl(task.icon) : '';
  const fallbackIcon = task.icon ? getFallbackIcon(task.icon) : '';

  return `
    <div class="task mc-slot ${completed ? 'completed' : ''}" data-task-id="${task.id}">
      <label class="task-checkbox">
        <input type="checkbox" ${completed ? 'checked' : ''}>
        <span class="task-checkbox-visual">✓</span>
      </label>
      ${task.icon ? `
        <div class="task-icon mc-slot-inset">
          <img
            src="${iconUrl}"
            alt="${task.icon}"
            onerror="this.style.display='none';this.parentElement.textContent='${fallbackIcon}'"
            loading="lazy"
          >
        </div>
      ` : ''}
      <span class="task-text" title="${task.description || task.text}">${task.text}</span>
    </div>
  `;
}

function renderPhase(phase: Phase): string {
  const progress = getPhaseProgress(phase);
  const isCollapsed = collapsedPhases.has(phase.id);
  const filteredTasks = filterTasks(phase.tasks);

  // Skip phases with no matching tasks when filtering
  if (filteredTasks.length === 0 && (searchQuery || filterMode !== 'all')) {
    return '';
  }

  const iconUrl = getIconUrl(phase.icon);
  const fallbackIcon = getFallbackIcon(phase.icon);

  return `
    <section class="phase mc-panel ${isCollapsed ? 'collapsed' : ''}" data-phase="${phase.id}">
      <div class="phase-header" data-phase-toggle="${phase.id}">
        <div class="phase-icon mc-slot">
          <img
            src="${iconUrl}"
            alt="${phase.icon}"
            onerror="this.style.display='none';this.parentElement.textContent='${fallbackIcon}'"
          >
        </div>
        <div class="phase-info">
          <h2 class="phase-title mc-text">
            <span class="chevron">▼</span>
            ${phase.title}
          </h2>
          <div class="phase-progress">
            <div class="xp-bar">
              <div class="xp-bar-fill" style="width: ${progress.percentage}%"></div>
            </div>
            <span class="phase-progress-text">${progress.completed}/${progress.total}</span>
          </div>
        </div>
      </div>
      <div class="phase-content">
        ${filteredTasks.map(task => renderTask(task)).join('')}
      </div>
    </section>
  `;
}

function renderPhases(): string {
  const world = getActiveWorld();

  if (!world) {
    return `
      <div class="empty-state mc-panel">
        <div class="empty-state-icon">🌍</div>
        <p class="empty-state-text">Create a new world to start tracking your progress!</p>
      </div>
    `;
  }

  return `
    <div class="phases-container">
      ${PHASES.map(phase => renderPhase(phase)).join('')}
    </div>
  `;
}

// Tab Navigation
function renderTabNavigation(): string {
  return `
    <nav class="tab-navigation">
      <button class="tab-btn ${activeTab === 'progress' ? 'active' : ''}" data-tab="progress">
        <span class="tab-icon">
          <img src="${getIconUrl('diamond_pickaxe')}" alt="Progress" onerror="this.parentElement.textContent='⛏️'">
        </span>
        Progress
      </button>
      <button class="tab-btn ${activeTab === 'collection' ? 'active' : ''}" data-tab="collection">
        <span class="tab-icon">
          <img src="${getIconUrl('chest')}" alt="Collection" onerror="this.parentElement.textContent='📦'">
        </span>
        Collection
      </button>
    </nav>
  `;
}

// Collection render functions
function renderCollectionStats(): string {
  const total = getTotalCollectionProgress();
  const categoriesCompleted = COLLECTION_CATEGORIES.filter(c => getCategoryProgress(c).percentage === 100).length;

  return `
    <div class="collection-stats">
      <div class="collection-stat-card collection-stats-collected mc-panel">
        <div class="collection-stat-value stats-value">${total.collected}</div>
        <div class="collection-stat-label">Items Collected</div>
      </div>
      <div class="collection-stat-card collection-stats-remaining mc-panel">
        <div class="collection-stat-value stats-value">${total.total - total.collected}</div>
        <div class="collection-stat-label">Items Remaining</div>
      </div>
      <div class="collection-stat-card collection-stats-categories mc-panel">
        <div class="collection-stat-value stats-value">${categoriesCompleted}/${COLLECTION_CATEGORIES.length}</div>
        <div class="collection-stat-label">Categories Complete</div>
      </div>
    </div>

    <div class="collection-progress collection-progress-bar mc-panel">
      <div class="collection-progress-label">
        <span class="mc-text">Total Collection</span>
        <span class="items-count collection-progress-count">${total.collected} / ${total.total}</span>
      </div>
      <div class="xp-bar">
        <div class="xp-bar-fill" style="width: ${total.percentage}%"></div>
        <span class="xp-bar-text collection-progress-percent">${total.percentage}%</span>
      </div>
    </div>
  `;
}

function renderCollectionSearchFilter(): string {
  return `
    <div class="collection-search">
      <input
        type="text"
        class="search-input"
        id="collection-search-input"
        placeholder="Search items..."
        value="${collectionSearchQuery}"
      >
      <div class="collection-filter-buttons">
        <button class="mc-button filter-btn ${collectionFilterMode === 'all' ? 'active' : ''}" data-collection-filter="all">
          All
        </button>
        <button class="mc-button filter-btn ${collectionFilterMode === 'incomplete' ? 'active' : ''}" data-collection-filter="incomplete">
          Missing
        </button>
        <button class="mc-button filter-btn ${collectionFilterMode === 'completed' ? 'active' : ''}" data-collection-filter="completed">
          Collected
        </button>
      </div>
    </div>
  `;
}

function renderCollectionItem(item: { id: string; name: string; icon: string }): string {
  const collected = isItemCollected(item.id);
  const iconUrl = getCollectionIconUrl(item.icon);
  const fallbackIcon = getFallbackIcon(item.id);

  return `
    <div
      class="collection-item ${collected ? 'collected' : ''}"
      data-item-id="${item.id}"
      data-tooltip="${item.name}"
    >
      <div class="collection-item-icon">
        <img
          src="${iconUrl}"
          alt="${item.name}"
          onerror="this.style.display='none';this.parentElement.textContent='${fallbackIcon}'"
          loading="lazy"
        >
      </div>
    </div>
  `;
}

function renderCollectionCategory(category: CollectionCategory): string {
  const progress = getCategoryProgress(category);
  const isCollapsed = collapsedCategories.has(category.id);
  const filteredItems = filterCollectionItems(category);

  // Skip categories with no matching items when filtering
  if (filteredItems.length === 0 && (collectionSearchQuery || collectionFilterMode !== 'all')) {
    return '';
  }

  const iconUrl = getIconUrl(category.icon);
  const fallbackIcon = getFallbackIcon(category.icon);

  return `
    <section class="collection-category mc-panel ${isCollapsed ? 'collapsed' : ''}" data-category="${category.id}">
      <div class="collection-category-header" data-category-toggle="${category.id}">
        <div class="collection-category-icon mc-slot">
          <img
            src="${iconUrl}"
            alt="${category.icon}"
            onerror="this.style.display='none';this.parentElement.textContent='${fallbackIcon}'"
          >
        </div>
        <div class="collection-category-info">
          <h2 class="collection-category-title mc-text">
            <span class="chevron">▼</span>
            ${category.title}
          </h2>
          <div class="collection-category-progress">
            <div class="xp-bar">
              <div class="xp-bar-fill" style="width: ${progress.percentage}%"></div>
            </div>
            <span class="collection-category-progress-text">${progress.collected}/${progress.total}</span>
          </div>
        </div>
      </div>
      <div class="collection-grid-wrapper">
        <div class="collection-grid">
          ${filteredItems.map(item => renderCollectionItem(item)).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderCollection(): string {
  const world = getActiveWorld();

  if (!world) {
    return `
      <div class="empty-state mc-panel">
        <div class="empty-state-icon">📦</div>
        <p class="empty-state-text">Create a new world to start your collection!</p>
      </div>
    `;
  }

  return `
    ${renderCollectionStats()}
    ${renderCollectionSearchFilter()}
    <div class="collection-container">
      ${COLLECTION_CATEGORIES.map(category => renderCollectionCategory(category)).join('')}
    </div>
  `;
}

function renderModal(): string {
  return `
    <div class="modal-overlay" id="new-world-modal">
      <div class="modal mc-panel">
        <h2 class="modal-title mc-text">Create New World</h2>
        <input
          type="text"
          class="modal-input"
          id="world-name-input"
          placeholder="World name..."
          maxlength="30"
        >
        <div class="modal-buttons">
          <button class="mc-button" id="cancel-modal-btn">Cancel</button>
          <button class="mc-button mc-button-primary" id="create-world-btn">Create</button>
        </div>
      </div>
    </div>
  `;
}

function renderFooter(): string {
  return `
    <footer class="footer">
      <p>Made with ❤️ for Minecraft players everywhere</p>
      <p>
        <a href="https://github.com/ibimspumo/Minecraft-ForeverWorld-Tracker" target="_blank" rel="noopener">View on GitHub</a>
      </p>
    </footer>
  `;
}

function renderMainContent(): string {
  const world = getActiveWorld();

  if (!world) {
    return `
      <div class="empty-state mc-panel">
        <div class="empty-state-icon">🌍</div>
        <p class="empty-state-text">Create a new world to start tracking your progress!</p>
      </div>
    `;
  }

  if (activeTab === 'collection') {
    return renderCollection();
  }

  // Progress tab (default)
  return `
    ${renderStats()}
    ${renderSearchFilter()}
    ${renderPhases()}
  `;
}

function render(): void {
  app.innerHTML = `
    ${renderHeader()}
    ${renderWorldSelector()}
    ${getActiveWorld() ? renderTabNavigation() : ''}
    ${renderMainContent()}
    ${renderFooter()}
    ${renderModal()}
  `;

  attachEventListeners();
}

function attachEventListeners(): void {
  // World selector
  const worldSelect = document.getElementById('world-select') as HTMLSelectElement;
  if (worldSelect) {
    worldSelect.addEventListener('change', (e) => {
      state.activeWorldId = (e.target as HTMLSelectElement).value || null;
      saveState();
      render();
    });
  }

  // New world button
  const newWorldBtn = document.getElementById('new-world-btn');
  if (newWorldBtn) {
    newWorldBtn.addEventListener('click', showNewWorldModal);
  }

  // Delete world button
  const deleteWorldBtn = document.getElementById('delete-world-btn');
  if (deleteWorldBtn) {
    deleteWorldBtn.addEventListener('click', () => {
      if (state.activeWorldId && confirm('Are you sure you want to delete this world? This cannot be undone.')) {
        deleteWorld(state.activeWorldId);
        render();
        showToast('World deleted', 'success');
      }
    });
  }

  // Modal handlers
  const cancelModalBtn = document.getElementById('cancel-modal-btn');
  if (cancelModalBtn) {
    cancelModalBtn.addEventListener('click', hideModal);
  }

  const createWorldBtn = document.getElementById('create-world-btn');
  if (createWorldBtn) {
    createWorldBtn.addEventListener('click', () => {
      const input = document.getElementById('world-name-input') as HTMLInputElement;
      if (input) {
        createWorld(input.value);
        hideModal();
        render();
        showToast('World created!', 'success');
      }
    });
  }

  const worldNameInput = document.getElementById('world-name-input') as HTMLInputElement;
  if (worldNameInput) {
    worldNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        createWorld(worldNameInput.value);
        hideModal();
        render();
        showToast('World created!', 'success');
      } else if (e.key === 'Escape') {
        hideModal();
      }
    });
  }

  // Modal overlay click to close
  const modalOverlay = document.getElementById('new-world-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        hideModal();
      }
    });
  }

  // Search input
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = (e.target as HTMLInputElement).value;
      render();
      // Re-focus input and restore cursor position
      const newInput = document.getElementById('search-input') as HTMLInputElement;
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(searchQuery.length, searchQuery.length);
      }
    });
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterMode = (e.target as HTMLElement).dataset.filter as FilterMode;
      render();
    });
  });

  // Phase toggle
  document.querySelectorAll('[data-phase-toggle]').forEach(header => {
    header.addEventListener('click', () => {
      const phaseId = (header as HTMLElement).dataset.phaseToggle!;
      if (collapsedPhases.has(phaseId)) {
        collapsedPhases.delete(phaseId);
      } else {
        collapsedPhases.add(phaseId);
      }
      render();
    });
  });

  // Task checkboxes
  document.querySelectorAll('.task').forEach(task => {
    task.addEventListener('click', (e) => {
      // Prevent double-trigger from checkbox itself
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      const taskId = (task as HTMLElement).dataset.taskId!;
      toggleTask(taskId);
    });

    const checkbox = task.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.addEventListener('change', () => {
        const taskId = (task as HTMLElement).dataset.taskId!;
        toggleTask(taskId);
      });
    }
  });

  // Tab navigation
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = (btn as HTMLElement).dataset.tab as TabMode;
      render();
    });
  });

  // Collection category toggle
  document.querySelectorAll('[data-category-toggle]').forEach(header => {
    header.addEventListener('click', () => {
      const categoryId = (header as HTMLElement).dataset.categoryToggle!;
      if (collapsedCategories.has(categoryId)) {
        collapsedCategories.delete(categoryId);
      } else {
        collapsedCategories.add(categoryId);
      }
      render();
    });
  });

  // Collection item click
  document.querySelectorAll('.collection-item').forEach(item => {
    item.addEventListener('click', () => {
      const itemId = (item as HTMLElement).dataset.itemId!;
      toggleCollectionItem(itemId);
    });
  });

  // Collection search input
  const collectionSearchInput = document.getElementById('collection-search-input') as HTMLInputElement;
  if (collectionSearchInput) {
    collectionSearchInput.addEventListener('input', (e) => {
      collectionSearchQuery = (e.target as HTMLInputElement).value;
      render();
      // Re-focus input and restore cursor position
      const newInput = document.getElementById('collection-search-input') as HTMLInputElement;
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(collectionSearchQuery.length, collectionSearchQuery.length);
      }
    });
  }

  // Collection filter buttons
  document.querySelectorAll('[data-collection-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      collectionFilterMode = (btn as HTMLElement).dataset.collectionFilter as FilterMode;
      render();
    });
  });
}

// Register Service Worker for icon caching
function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed, icons will still work but won't be cached
    });
  }
}

// Initialize
function init(): void {
  loadState();
  render();
  createToastContainer();
  registerServiceWorker();
}

// Start the app
init();
