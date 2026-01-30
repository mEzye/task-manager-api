import { type Request, type Response } from "express";
import tasksService from "./tasks.service.js";
import { TaskStatus } from "./tasks.types.js";
import { stat } from "fs";

export class TaskController{
    private taskService = tasksService;

    //GET /api/tasks?userId=1
    getAll = async (req: Request, res: Response) =>{
        const userId = req.user!.id;
        if(userId === undefined){
            return res.status(400).json({message: "userId is required as a query parameter"})
        }
        const tasks = await this.taskService.getAll(userId);
        res.json(tasks);
    }
    //POST /api/tasks
    create = async (req: Request, res: Response) => {
        try {
            const { title, description, deadline, status } = req.body || {};
            const userId = req.user!.id;

            if (!title) {
                return res.status(400).json({ message: "Title is required" });
            }

            const parsedDeadline = deadline ? new Date(deadline) : undefined;

            const newTask = await this.taskService.create(userId, {
                title,
                description,
                deadline: parsedDeadline,
                status: status as TaskStatus
            });

            res.status(201).json(newTask);
        } catch (error) {
            console.error("Create Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    //PUT /api/tasks/:id
    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const taskId = Number(id);
            const userId = req.user!.id;
            const { title, description, status, deadline } = req.body || {};

            if (isNaN(taskId)) {
                return res.status(400).json({ message: "Invalid Task ID" });
            }

            const parsedDeadline = deadline ? new Date(deadline) : undefined;

            const updatedTask = await this.taskService.update(
                userId,
                taskId,
                {
                    title,
                    description,
                    status,
                    deadline: parsedDeadline
                }
            );

            if (!updatedTask) {
                return res.status(404).json({ message: "Task not found or user does not own this task" });
            }
            res.json(updatedTask);
        } catch (error) {
            console.error("Update Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    //DELETE /api/tasks/:id
    delete = async (req: Request, res: Response) =>{
        try {
            const { id } = req.params;
            const taskId = Number(id);
            const userId = req.user!.id;

            if (isNaN(taskId)) {
                return res.status(400).json({ message: "Invalid Task ID" });
            }

            const success = await this.taskService.delete(
                userId,
                taskId
            );

            if (!success) {
                return res.status(404).json({ message: "Task not found" });
            }

            res.status(204).send();
        } catch (error) {
            console.error("Delete Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}