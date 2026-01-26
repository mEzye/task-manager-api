export enum TaskStatus{
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done'
}
//Tasks interface
export interface Task{
    id: number;
    title: string;
    status: TaskStatus;
    description?: string;
    deadline?: Date;
    updatedAt?: Date;
    createdAt?: Date;
}