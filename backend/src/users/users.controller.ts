import {type Request, type Response} from 'express';
import usersService from './users.service.js';

export class UserController{
    private usersService = usersService;

    //GET /api/users
    getAll = (req: Request, res: Response) =>{
        const users = this.usersService.getAll();
        res.json(users);
    }
    
    // GET /api/users/:id
    getById = (req: Request, res: Response) => {
        const { id } = req.params;
        const user = this.usersService.getById(parseInt(id));

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json(user);
    }

    //POST /api/users
    create = (req: Request, res:Response) =>{
        const {email,password , name} = req.body || {};
        if(!email){
            return res.status(400).json({message: "Email is required"});
        }

        const newUser = this.usersService.create(email, password, name);
        res.status(201).json(newUser);
    }

    //PUT /api/users/:id
    update = (req: Request, res: Response) => {
        const {id} = req.params;
        const {email, name} = req.body || {};

        const updateUser = this.usersService.update(parseInt(id), email, name);
        if(!updateUser){
            return res.status(404).json({message: "User not found"});
        }
        res.json(updateUser);
    }
    //DELETE /api/users/:id
    delete = (req: Request, res: Response) => {
        const {id} = req.params;
        const success = this.usersService.delete(parseInt(id));
        
        if(!success){
            return res.status(404).json({message: "User not found"});
        }
        res.status(204).send();
    }
}