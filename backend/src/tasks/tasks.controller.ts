import { type Request, type Response } from "express";
import tasksService from "./tasks.service.js";
import { TaskStatus } from "./tasks.types.js";
import { stat } from "fs";

export class TaskController{
    private taskService = tasksService;

    //GET /api/tasks?userId=1
    getAll = (req: Request, res: Response) =>{
        const userId = req.user!.id;
        if(userId === undefined){
            return res.status(400).json({message: "userId is required as a query parameter"})
        }
        const tasks = this.taskService.getAll(userId);
        res.json(tasks);
    }
    //POST /api/tasks
    create = (req: Request, res: Response) => {
        const { title, description, deadline,status} = req.body || {};
        const userId = req.user!.id;
        if(!title){
            return res.status(400).json({ message: "title and userId are required in the body" });
        }

        const parsedDeadline = deadline ? new Date(deadline) : undefined;
        if (parsedDeadline && isNaN(parsedDeadline.getTime())){
            return res.status(400).json({ message: "Invalid date format" });
        }

        const newTask = this.taskService.create(userId, {
            title,
            description,
            deadline: parsedDeadline,
            status: status
        });
        if (!newTask) {
            return res.status(404).json({ message: "User not found, cannot create task" });
        }

        res.status(201).json(newTask);
    }

    //PUT /api/tasks/:id
    update = (req: Request, res: Response) => {
        const { id: taskId } = req.params;
        const userId = req.user!.id;
        const { title, description, status, deadline } = req.body || {};

        if (userId === undefined) {
            return res.status(400).json({ message: "userId is required as a query parameter" });
        }

        if (title !== undefined && title.trim() === "") {
             return res.status(400).json({ message: "Title cannot be empty" });
        }

        if(status && !Object.values(TaskStatus).includes(status)){
            return res.status(400).json({ message: "Invalid status value" });
        }
        const parsedDeadline = deadline ? new Date(deadline) : undefined;
        if(parsedDeadline && isNaN(parsedDeadline.getTime())){
            return res.status(400).json({ message: "Invalid deadline format" });
        }

        const updatedTask = this.taskService.update(
            userId,
            parseInt(taskId),
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
    }

    //DELETE /api/tasks/:id
    delete = (req: Request, res: Response) =>{
        const { id: taskId } = req.params;
        const userId = req.user!.id;
        if (userId === undefined) {
            return res.status(400).json({ message: "userId is required as a query parameter" });
        }
        const success = this.taskService.delete(
            userId,
            parseInt(taskId)
        );

        if (!success) {
            return res.status(404).json({ message: "Task not found or user does not own this task" });
        }

        res.status(204).send();
    }
}