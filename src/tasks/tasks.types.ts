//Tasks interface
export interface Task{
    id: number;
    title: string;
    isCompleted: boolean;
    createAt?: Date;
}