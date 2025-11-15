import { Router } from "express";
import { TaskController } from "./tasks.controller.js";

const tasksRouter = Router();

const controller = new TaskController();

tasksRouter.get('/', controller.getAll);
tasksRouter.post('/', controller.create);
tasksRouter.put('/:id', controller.update);
tasksRouter.delete('/:id', controller.delete);

export default tasksRouter;