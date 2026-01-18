// Task data types
export interface Task {
  id: string;
  text: string;
  icon?: string; // Minecraft item/block ID for icon
  description?: string;
}

export interface Phase {
  id: string;
  title: string;
  icon: string;
  description: string;
  tasks: Task[];
}

// Collection item types
export interface CollectionItem {
  id: string;
  name: string;
  icon: string;
}

export interface CollectionCategory {
  id: string;
  title: string;
  icon: string;
  items: CollectionItem[];
}

// World/Save data types
export interface WorldProgress {
  [taskId: string]: boolean;
}

export interface CollectionProgress {
  [itemId: string]: boolean;
}

export interface World {
  id: string;
  name: string;
  createdAt: number;
  progress: WorldProgress;
  collectionProgress?: CollectionProgress; // Optional for backwards compatibility
}

export interface AppState {
  worlds: World[];
  activeWorldId: string | null;
}

// Filter types
export type FilterMode = 'all' | 'incomplete' | 'completed';

// Tab types
export type TabMode = 'progress' | 'collection';
