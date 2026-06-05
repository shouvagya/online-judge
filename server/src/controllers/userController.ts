import { Request, Response } from "express";
import {prisma} from "../lib/prisma";

export const createUser = async(
    req:Request,
    res:Response
)=>{
    try{
        const { username, email, password } = req.body;

        const user = await prisma.user.create({
        data: {
            username,
            email,
            password,
        },
        });

        res.status(201).json(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Error creating user",
        });
    }
};