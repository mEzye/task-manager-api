import { type Request, type Response } from "express";
import tasksService from "./tasks.service.js";

export class TaskController{
    private taskService = tasksService;

    //GET /api/tasks?userId=1
    getAll = (req: Request, res: Response) =>{
        const { userId } = req.query;
        if(!userId){
            return res.status(400).json({message: "userId is required as a query parameter"})
        }
        const tasks = this.taskService.getAll(parseInt(userId as string));
        res.json(tasks);
    }
    //POST /api/tasks
    create = (req: Request, res: Response) => {
        const { title, userId } = req.body || {};
        if(!title){
            return res.status(400).json({ message: "title and userId are required in the body" });
        }

        const newTask = this.taskService.create(title, userId);
        if (!newTask) {
            return res.status(404).json({ message: "User not found, cannot create task" });
        }

        res.status(201).json(newTask);
    }

    //PUT /api/tasks/:id
    update = (req: Request, res: Response) => {
        const { id: taskId } = req.params;
        const { userId } = req.query;
        const { title, isCompleted } = req.body || {};

        if (!userId) {
            return res.status(400).json({ message: "userId is required as a query parameter" });
        }

        const updatedTask = this.taskService.update(
            parseInt(userId as string),
            parseInt(taskId),
            title,
            isCompleted
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found or user does not own this task" });
        }
        res.json(updatedTask);
    }

    //DELETE /api/tasks/:id
    delete = (req: Request, res: Response) =>{
        const { id: taskId } = req.params;
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: "userId is required as a query parameter" });
        }
        const success = this.taskService.delete(
            parseInt(userId as string),
            parseInt(taskId)
        );

        if (!success) {
            return res.status(404).json({ message: "Task not found or user does not own this task" });
        }

        res.status(204).send();
    }
}