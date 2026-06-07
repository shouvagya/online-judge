import { Request, Response, NextFunction} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface AuthRequest extends Request{
    user?: {
        userId: number;
        role:string;
    };
}

export const authMiddleware =(
    req:Request,
    res:Response,
    next: NextFunction
)=>{

    try{
        const authHeader= req.headers.authorization;

        if(!authHeader?.startsWith("Bearer ")){
            return res.status(401).json({
                message:"Unauthorized",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload & {
            userId: number;
            role: string;
        };

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();

    }catch(error){
        //console.log(error);
        return res.status(401).json({
            error: error,
            message:"Invalid token",
        })
    }
}