import { z } from 'zod';
import { TaskStatus } from './tasks.types.js';

export const createTaskSchema = z.object({
    title: z.string()
    .min(1, {error: "Title is requred"})
    .max(100, {error: "Title cannot exeed 100 characters"}),
    description: z.string().optional(),
    status: z.enum(TaskStatus).optional(),
    deadline: z.iso.datetime().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string()
        .min(1, { error: "Title is required" })
        .max(100, { error: "Title cannot exceed 100 characters" })
        .optional(),
    description: z.string().optional(),
    status: z.enum(TaskStatus).optional(),
    deadline: z.iso.datetime().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;