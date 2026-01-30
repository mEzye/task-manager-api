import { Router } from "express";
import { TaskController } from "./tasks.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { createTaskSchema, updateTaskSchema } from "./tasks.shema.js";

const tasksRouter = Router();

const controller = new TaskController();

tasksRouter.get('/', protect, controller.getAll);
tasksRouter.post('/', protect, validate(createTaskSchema), controller.create);
tasksRouter.put('/:id', protect, validate(updateTaskSchema), controller.update);
tasksRouter.delete('/:id', protect, controller.delete);

export default tasksRouter;