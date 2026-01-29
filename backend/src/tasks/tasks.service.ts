import { TaskStatus, type Task } from "./tasks.types.js";
import usersService, { UsersService } from "../users/users.service.js";
import { TaskController } from "./tasks.controller.js";
import usersRouter from "../users/users.routes.js";

//Service for Tasks
export class TasksService{
    private tasksByUserId = new Map<number, Task[]>();

    private nextTaskIds = new Map<number, number>();

    private usersService : UsersService;

    constructor(usersService: UsersService){
        this.usersService = usersService;
    }

    public getAll(userID: number): Task[]{
        return this.tasksByUserId.get(userID) || [];
    }

    public create(userID: number, data: {title: string, description?: string, deadline?: Date, status?: TaskStatus}): Task | null{
        const userExists = this.usersService.getById(userID);
        if(!userExists){
            return null;
        }
        
        if(!this.tasksByUserId.has(userID)){
            this.tasksByUserId.set(userID, []);
            this.nextTaskIds.set(userID, 1);
        }

        const newTaskId = this.nextTaskIds.get(userID)!;
        const newStatus = data.status ? data.status : TaskStatus.TODO;
        const newTask: Task = {
            id: newTaskId,
            title: data.title,
            description: data.description,
            deadline: data.deadline,
            status: newStatus,
            createdAt: new Date()
        };

        this.tasksByUserId.get(userID)!.push(newTask);

        this.nextTaskIds.set(userID, newTaskId + 1);
        return newTask;
    }

    public update(userId:number, taskId: number, data:{title?: string, description?: string, status?:TaskStatus, deadline?: Date}): Task | null{
        const userTasks = this.tasksByUserId.get(userId);
        if(!userTasks){
            return null;
        }

        const task = userTasks.find(t => t.id === taskId);

        if(!task){
            return null;
        }
        if(data.title !== undefined){
            task.title = data.title;
        }
        if (data.status !== undefined){
            task.status = data.status;
        }
        if(data.description !== undefined){
            task.description = data.description;
        }
        if(data.deadline !== undefined){
            task.deadline = data.deadline;
        }
        task.updatedAt = new Date();
        return task;
    }

    public delete(userId:number, taskId: number): boolean{
        const userTasks = this.tasksByUserId.get(userId);
        if(!userTasks){
            return false;
        }
        const taskIndex = userTasks.findIndex(t => t.id === taskId);
        if(taskIndex === -1){
            return false;
        }

        userTasks.splice(taskIndex, 1);
        return true;
    }
}

export default new TasksService(usersService);