import { TaskStatus, type Task } from "./tasks.types.js";
import usersService, { UsersService } from "../users/users.service.js";
import prisma from "../prisma.js";

//Service for Tasks
export class TasksService{
    // private tasksByUserId = new Map<number, Task[]>();

    // private nextTaskIds = new Map<number, number>();

    private usersService : UsersService;

    constructor(usersService: UsersService){
        this.usersService = usersService;
    }

    public async getAll(userID: number): Promise<Task[]>{
        return await prisma.task.findMany({
            where: { userId: userID },
            orderBy: { createdAt: 'desc'}
        });
    }

    public async create(userID: number, data: {title: string, description?: string, deadline?: Date, status?: TaskStatus}): Promise<Task | null>{
        return await prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                deadline: data.deadline,
                status: data.status || TaskStatus.TODO,
                userId: userID
            }
        });
    }

    public async update(userId:number, taskId: number, data:{title?: string, description?: string, status?:TaskStatus, deadline?: Date}): Promise<Task | null>{
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                userId: userId
            }
        });

        if (!task) {
            return null;
        }

        return await prisma.task.update({
            where: { id: taskId },
            data: {
                title: data.title,
                description: data.description,
                deadline: data.deadline,
                status: data.status
            }
        });
    }

    public async delete(userId:number, taskId: number): Promise<boolean>{
        try {
            const result = await prisma.task.deleteMany({
                where: {
                    id: taskId,
                    userId: userId
                }
            });

            return result.count > 0;
        }
        catch (error) {
            return false;
        }
    }
}

export default new TasksService(usersService);