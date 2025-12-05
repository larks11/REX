export enum FilterType {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  subtasks?: SubTask[];
  isExpanded?: boolean; // For UI state
}

export interface GeminiResponse {
  subtasks: string[];
}
