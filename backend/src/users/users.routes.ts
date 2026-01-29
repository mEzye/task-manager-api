import { Router } from "express";
import { UserController } from "./users.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const usersRouter = Router();

const controller = new UserController();

usersRouter.get('/',controller.getAll);
usersRouter.get('/me', protect, controller.getMe);
usersRouter.get('/:id', controller.getById);
usersRouter.post('/',controller.create);
usersRouter.put('/:id',controller.update);
usersRouter.delete('/:id',controller.delete);

export default usersRouter;