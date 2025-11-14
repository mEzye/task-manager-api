import { type Task } from "./tasks.types.js";
//Service for Tasks
export class TasksService{
    private tasks: Task[] = [
        {id: 1, title: "Вивчити Node.js", isCompleted: false},
        {id: 2, title: "Встановити Postman", isCompleted: true}
    ];

    private nextId: number = 3;

    public getAll(): Task[]{
        return this.tasks
    }

    public create(title: string): Task{
        const newTask: Task = {
            id: this.nextId++,
            title: title,
            isCompleted: false,
            createAt: new Date()
        };
        this.tasks.push(newTask);
        return newTask;
    }

    public update(id: number, title?: string, isCompleted?: boolean): Task | null{
        const task = this.tasks.find(t => t.id === id);
        if(!task){
            return null;
        }

        if(title !== undefined){
            task.title = title;
        }
        if (isCompleted !== undefined){
            task.isCompleted = isCompleted;
        }
        return task;
    }

    public delete(id: number): boolean{
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if(taskIndex === -1){
            return false;
        }

        this.tasks.splice(taskIndex, 1);
        return true;
    }
}