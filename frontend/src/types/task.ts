// Замість enum використовуємо об'єкт (Object Literal)
export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
} as const;

// Створюємо тип на основі значень цього об'єкта
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  deadline?: string; // Backend sends string (ISO)
  createdAt?: string;
  updatedAt?: string;
}