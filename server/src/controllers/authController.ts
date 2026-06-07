import { Request, Response} from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

import {prisma} from "../lib/prisma";

export const register = async(
    req:Request,
    res:Response
)=>{

    try{
        const {username,email,password} =req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            }
        )};


        const existingUser = await prisma.user.findFirst({
            where:{
                OR:[
                    {username},
                    {email},
                ],
            },
        });

        if(existingUser){
            return res.status(400).json({
                message:"Username or email already exists",
            });
        }

        const passwordHash = await bcrypt.hash(password,10);

        const user = await prisma.user.create({
            data:{
                username,
                email,
                passwordHash,
            },
        });

        res.status(201).json({
            id:user.id,
            username: user.username,
            email: user.email,
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            message:"Registration failed",
        });
    }
};


export const login= async(
    req:Request,
    res:Response
)=>{

    try{
        const { email, password} =req.body;

        if(!email || ! password){
            return res.status(400).json({
                message:"Email and password required",
            });
        }

        const user = await prisma.user.findUnique({
            where:{
                email,
            },
        });

        if(!user){
            return res.status(401).json({
                message:"Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password,user.passwordHash);

        if(!isMatch){
            return res.status(401).json({
                message:"Invalid credentials",
            });
        }

        const token= generateToken(
            user.id,
            user.role
        );

        res.status(200).json({
            token,
        });

    }catch(error){
        console.log(error);

        res.status(500).json({
            message:"Login failed",
        });
    }
    

};
