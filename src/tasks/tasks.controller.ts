import { type Request, type Response } from "express";
import { TasksService } from "./tasks.service.js";

export class TaskController{
    private taskService = new TasksService();

    //GET /api/tasks
    getAll = (req: Request, res: Response) =>{
        const tasks = this.taskService.getAll();
        res.json(tasks);
    }
    //POST /api/tasks
    create = (req: Request, res: Response) => {
        const { title } = req.body;
        if(!title){
            return res.status(400).json({message: "Title is required"});
        }

        const newTask = this.taskService.create(title);
        res.status(201).json(newTask);
    }

    //PUT /api/tasks/:id
    update = (req: Request, res: Response) => {
        const {id} = req.params;
        const {title, isCompleted} = req.body;

        const updateTask = this.taskService.update(parseInt(id), title, isCompleted);

        if (!updateTask){
            return res.status(404).json({message: "Task not found"});
        }
        res.json(updateTask);
    }

    //DELETE /api/tasks/:id
    delete = (req: Request, res: Response) =>{
        const {id} = req.params;
        const success = this.taskService.delete(parseInt(id));

        if(!success){
            return res.status(404).json({message:"Task not found"});
        }
        res.status(204).send();
    }
}