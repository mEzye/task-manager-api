import { type User } from "./users.types.js";

export class UsersService{
    private users: User[] = [];

    private nextID: number = 0;

    public getById(id: number): User | null {
        const user = this.users.find(u => u.id === id);
        if(!user){
            return null;
        }

        return user;
    }

    public getAll(): User[]{
        return this.users;
    }

    public create(email: string, name?:string) : User{
        const newUser: User = {
            id: this.nextID++,
            email: email,
            name: name
        };
        this.users.push(newUser);
        return newUser;
    }

    public update(id:number, email: string, name?: string) : User | null{
        const user = this.users.find(t => t.id === id);
        if(!user){
            return null;
        }

        if(email !== undefined){
            user.email = email;
        }
        if(name !== undefined){
            user.name = name;
        }
        return user;
    }
    public delete(id: number): boolean{
        const userIndex = this.users.findIndex(t => t.id === id);
        if(userIndex === -1){
            return false
        }
        this.users.splice(userIndex, 1);
        return true;
    }
}

export default new UsersService();