import { stringify } from "querystring";
import usersService from "../users/users.service.js";
import { User } from "../users/users.types.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ref } from "process";

const ACCESS_TOKEN_SECRET = 'access-secret-key-123';
const REFRESH_TOKEN_SECRET = 'refresh-secret-key-789';

export class AuthService{
    private usersService = usersService;
    public async register(email: string, password: string, name?: string): Promise<Omit<User, 'password'> | null>{
        const candidate = this.usersService.findByEmail(email);
        if (candidate){
            return null;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.usersService.create(email, hashedPassword, name);
        const {password: _, ...userWithoutPassword} = newUser;

        return userWithoutPassword;
    }
    //TODO LOGIN
    public async login(email: string, password: string): Promise<{accessToken: string, refreshToken: string} | null>{
        if(!email || !password){
            return null;
        }
        const user = this.usersService.findByEmail(email);
        if(!user){
            return null;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return null;
        }

        return this.generateTokens(user.id, user.email);
    }

    public async refresh(refreshToken: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        try{
            const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {id:number, email:string};

            const user = this.usersService.findByEmail(payload.email);
            if(!user){
                return null;
            }

            return this.generateTokens(user.id, user.email);
        } catch(e){
            return null;
        }
    }

    private generateTokens(userId: number, email:string){
        const payload = {
            id: userId,
            email: email,

            jti: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
        };

        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        return { accessToken, refreshToken};
    }
}

export default new AuthService();