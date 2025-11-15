import {type Request, type Response} from 'express';
import { UserService } from './users.service.js';
import { networkInterfaces } from 'os';

export class UserController{
    private userService = new UserService();

    //GET /api/users
    getAll = (req: Request, res: Response) =>{
        const users = this.userService.getAll();
        res.json(users);
    }

    //POST /api/users
    create = (req: Request, res:Response) =>{
        const {email, name} = req.body || {};
        if(!email){
            return res.status(400).json({message: "Email is required"});
        }

        const newUser = this.userService.create(email, name);
        res.status(201).json(newUser);
    }

    //PUT /api/users/:id
    update = (req: Request, res: Response) => {
        const {id} = req.params;
        const {email, name} = req.body || {};

        const updateUser = this.userService.update(parseInt(id), email, name);
        if(!updateUser){
            return res.status(404).json({message: "User not found"});
        }
        res.json(updateUser);
    }
    //DELETE /api/users/:id
    delete = (req: Request, res: Response) => {
        const {id} = req.params;
        const success = this.userService.delete(parseInt(id));
        
        if(!success){
            return res.status(404).json({message: "User not found"});
        }
        res.status(204).send();
    }
}