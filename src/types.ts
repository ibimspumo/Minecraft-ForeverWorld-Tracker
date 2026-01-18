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

// World/Save data types
export interface WorldProgress {
  [taskId: string]: boolean;
}

export interface World {
  id: string;
  name: string;
  createdAt: number;
  progress: WorldProgress;
}

export interface AppState {
  worlds: World[];
  activeWorldId: string | null;
}

// Filter types
export type FilterMode = 'all' | 'incomplete' | 'completed';
