import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = 'access-secret-key-123';

interface TokenPayload{
    id: number;
    email: string;
    iat: number;
    exp: number;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message: "Not authorized(no token)"});
    }

    const token = authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message:"Not authorized (invalid format)"});
    }

    try {
        const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;

        req.user = {id: payload.id, email: payload.email};
        
        next();
    } catch(e){
        return res.status(401).json({message: "Not authorized (invalid token)"});
    }
};