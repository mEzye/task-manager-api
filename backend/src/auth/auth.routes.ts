import { Router } from "express";
import { authController } from "./auth.controller.js";

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refresh);

export default authRouter;