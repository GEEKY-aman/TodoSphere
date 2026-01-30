
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Board {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Recurrence {
  enabled: boolean;
  pattern: 'daily' | 'weekly' | 'monthly' | 'custom' | null;
  interval: number;
  endDate: string | null;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  boardId: string;
  userId: string;
  dueDate: string | null;
  subtasks: Subtask[];
  dependencies: string[];
  recurrence: Recurrence;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  todoId: string;
  userId: string;
  userName: string;
  type: 'comment' | 'activity';
  createdAt: string;
}

export type ViewType = 'list' | 'kanban' | 'calendar' | 'gantt' | 'grid';

export type StatusType = 'pending' | 'in-progress' | 'completed' | 'on-hold';

export type PriorityType = 'low' | 'medium' | 'high' | 'urgent';

