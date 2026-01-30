import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import { registerSchema, loginSchema } from "./auth.schema.js";

const authRouter = Router();

authRouter.post('/register',validate(registerSchema), authController.register);
authRouter.post('/login',validate(loginSchema), authController.login);
authRouter.post('/refresh', authController.refresh);

export default authRouter;