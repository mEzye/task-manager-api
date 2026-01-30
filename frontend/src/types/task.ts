// src/types/task.ts

// ВИПРАВЛЕНИЙ КОД: Значення мають бути ВЕЛИКИМИ літерами, як в базі даних
export const TaskStatus = {
  TODO: 'TODO',              // Було 'todo'
  IN_PROGRESS: 'IN_PROGRESS', // Було 'in_progress'
  DONE: 'DONE'               // Було 'done'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  deadline?: string; 
  createdAt?: string;
  updatedAt?: string;
}