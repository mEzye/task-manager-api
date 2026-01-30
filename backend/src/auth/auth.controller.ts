import { type Request, type Response } from "express";
import authService from "./auth.service.js";

export class AuthController{
    private authService = authService;

    //POST /api/auth/register
    register = async (req: Request, res: Response) => {
        const {email, password, name} = req.body;

        try{
            const newUser = await this.authService.register(email, password, name);

            if(!newUser){
                return res.status(400).json({message:"User with this email already exists"});
            }
            res.status(201).json(newUser);

        } catch (error){
            return res.status(500).json({message: "Internal server error during registration"});
        }
    };

    //POST /api/auth/login
    login = async (req: Request, res: Response) =>{
        const {email, password} = req.body;

        const tokens = await this.authService.login(email, password);

        if(!tokens){
            return res.status(401).json({message: "Invalid email or password"});
        }
        res.json(tokens);
    };

    //POST /api/auth/refresh
    refresh = async (req: Request, res: Response) =>{
        const {refreshToken} = req.body;

        if(!refreshToken){
            return res.status(400).json({message: "Refresh token is required"});
        }

        const newTokens = await this.authService.refresh(refreshToken);

        if(!newTokens) {
            return res.status(401).json({message: "Invalid or expired refresh token"});
        }

        res.json(newTokens);
    };
}

export const authController = new AuthController();