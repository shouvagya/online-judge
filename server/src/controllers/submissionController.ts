import {Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {prisma} from "../lib/prisma";
import { SUPPORTED_LANGUAGES } from "../constants/languages";

export const createSubmission = async(
    req:AuthRequest,
    res:Response
)=>{
    try{
        const { problemId, language, code} = req.body;

        if(!problemId || !language || !code){
            return res.status(400).json({
                message:"Missing required fields",
            });
        }

        const problem = await prisma.problem.findUnique({
            where:{
                id:Number(problemId),
            },
        });

        if(!problem){
            return res.status(400).json({
                message:"Problem not found",
            });
        }


        if(!SUPPORTED_LANGUAGES.includes(language.toLowerCase())){
            return res.status(400).json({
                message:"Unsupported language"
            });
        }

        const submission = await prisma.submission.create({
            data:{
                userId:req.user!.userId,
                problemId:Number(problemId),
                language,
                code,
                status:"PENDING",
            },
        });

        res.status(201).json(submission);

    }
    catch(error){
        res.status(500).json({
            error:error,
            message:"Failed to create submission",
        });
    }
}

export const getSubmissionById = async(
    req:AuthRequest,
    res:Response
)=>{
    try{
        const { id } =req.params;

        const submission = await prisma.submission.findUnique({
            where:{
                id:Number(id),
            },
            include:{
                problem:{
                    select:{
                        title:true,
                        slug:true,
                    }
                },

                user:{
                    select:{
                        username:true,
                    },
                },
            },
        });

        if(!submission){
            return res.status(400).json({
                message:"Submission not found",
            });
        }

        if(submission.userId !== req.user!.userId && req.user!.role !== "ADMIN"){
            return res.status(403).json({
                message:"Forbidden",
            });
        }

        res.json(submission);
    }
    catch(error){
        res.status(500).json({
            error:error,
            message:"Failed to fetch submission",
        });
    }
};


export const getMySubmissions = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const submissions =
        await prisma.submission.findMany({
            where: {
            userId: req.user!.userId,
            },

            include: {
                problem: {
                    select: {
                    title: true,
                    slug: true,
                    },
                },

                user:{
                    select:{
                        username:true,
                    },
                },
            },

            orderBy: {
            submittedAt: "desc",
            },
        });

        res.json(submissions);

    } 
    catch (error) {

        res.status(500).json({
            error:error,
            message: "Failed to fetch submissions",
        });
    }
};