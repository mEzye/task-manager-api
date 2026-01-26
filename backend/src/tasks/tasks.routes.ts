import { Router } from "express";
import { TaskController } from "./tasks.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const tasksRouter = Router();

const controller = new TaskController();

tasksRouter.get('/', protect, controller.getAll);
tasksRouter.post('/', protect, controller.create);
tasksRouter.put('/:id', protect, controller.update);
tasksRouter.delete('/:id', protect, controller.delete);

export default tasksRouter;