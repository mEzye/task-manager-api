import { type User } from "./users.types.js";
import  prisma from "../prisma.js"
export class UsersService{
    // private users: User[] = [];

    // private nextID: number = 0;

    public async getById(id: number): Promise<User | null> {
        const user = await prisma.user.findUnique({where: {id}});
        if(!user){
            return null;
        }

        return user;
    }

    public async findByEmail(email:string) : Promise<User | null>{
        if(!email){
            return null;
        }
        const user = await prisma.user.findUnique({
            where : { email }
        })
        if(!user){
            return null;
        }
        return user;
    }

    public async getAll(): Promise<User[]> {
        return await prisma.user.findMany();
    }

    public async create(email: string, password:string, name?:string) : Promise<User>{
        return await prisma.user.create({
            data: {
                email,
                password,
                name
            }
        });
    }

    public async update(id:number, email?: string, name?: string) : Promise<User | null>{
        const user = prisma.user.findUnique({where : {id}});
        if(!user){
            return null;
        }

        return await prisma.user.update({
            where: {id},
            data: {
                email,
                name
            }
        });
    }
    public async delete(id: number): Promise<boolean>{
        try{
            await prisma.user.delete({
                where: {id}
            });
            return true;
        }
        catch(error){
            return false;
        }
    }
}

export default new UsersService();