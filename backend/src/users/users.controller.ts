import {type Request, type Response} from 'express';
import usersService from './users.service.js';
import usersRouter from './users.routes.js';

export class UserController{
    private usersService = usersService;

    //GET /api/users
    getAll = async (req: Request, res: Response) =>{
        const users = await this.usersService.getAll();
        res.json(users);
    }
    //GET /api/users/me
    getMe = async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if(userId === undefined){
            return res.status(401).json({message: "Not autthorized"});
        }
        const user = await this.usersService.getById(userId);
        if (user == null){
            return res.status(404).json({message: "User not found"});
        }
        
        const {email, name} = user;

        res.json({email, name});
        
    }
    
    // GET /api/users/:id
    getById = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const user = await this.usersService.getById(parseInt(id));

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json(user);
    }

    //POST /api/users
    create = async (req: Request, res:Response) =>{
        const {email,password , name} = req.body || {};
        if(!email){
            return res.status(400).json({message: "Email is required"});
        }

        const newUser = await this.usersService.create(email, password, name);
        res.status(201).json(newUser);
    }

    //PUT /api/users/:id
    update = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const {email, name} = req.body || {};

        const updateUser = await this.usersService.update(parseInt(id), email, name);
        if(!updateUser){
            return res.status(404).json({message: "User not found"});
        }
        res.json(updateUser);
    }
    //DELETE /api/users/:id
    delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const success = await this.usersService.delete(parseInt(id));
        
        if(!success){
            return res.status(404).json({message: "User not found"});
        }
        res.status(204).send();
    }
}