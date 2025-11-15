import { Router } from "express";
import { UserController } from "./users.controller.js";

const usersRouter = Router();

const controller = new UserController();

usersRouter.get('/',controller.getAll);
usersRouter.post('/',controller.create);
usersRouter.put('/:id',controller.update);
usersRouter.delete('/:id',controller.delete);

export default usersRouter;