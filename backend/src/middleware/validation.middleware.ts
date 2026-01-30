import { Request, Response, NextFunction } from "express";
import {ZodType, ZodError} from 'zod';

export const validate = (shema: ZodType) =>
    async (req: Request, res: Response, next: NextFunction) =>{
        const result = await shema.safeParseAsync(req.body);

        if(!result.success){
            return res.status(400).json({
                message: "Validation Error",
                errors: result.error.issues.map((e) =>({
                    field: e.path.join('.'),
                    message: e.message,
                })),
            });
        }

        req.body = result.data;
        
        next();
    }