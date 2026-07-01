import {Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {prisma} from "../lib/prisma";
import { SUPPORTED_LANGUAGES } from "../constants/languages";
import { submissionQueue } from "../queue/submissionQueue";

export const createSubmission = async(
    req:AuthRequest,
    res:Response
)=>{
    try{
        const { problemId, language, code, contestId} = req.body;

        if(!problemId || !language || !code){
            return res.status(400).json({
                message:"Missing required fields",
            });
        }

        const isPrivileged = req.user?.role === "ADMIN" || req.user?.role === "SETTER";

        const problem = await prisma.problem.findFirst({
            where: {
                id: Number(problemId),

                ...(isPrivileged
                ? {}
                : {
                    NOT: {
                        contestProblems: {
                        some: {
                            contest: {
                            startTime: {
                                gt: new Date(),
                            },
                            },
                        },
                        },
                    },
                }),
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

        let resolvedContestId: number | undefined=undefined;

        if(contestId){
            const contest = await prisma.contest.findUnique({
                where:{
                    id:Number(contestId),
                }
            });

            if(!contest){
                return res.status(400).json({
                    message:"Contest not found",
                });
            }

            const now:Date = new Date();

            if(now < contest.startTime || now> contest.endTime){
                return res.status(400).json({
                    message:"Contest is not currently live"
                });
            }

            

            const contestProblem = await prisma.contestProblem.findUnique({
                where:{
                    contestId_problemId:{
                        contestId: Number(contestId),
                        problemId: Number(problemId),
                    },
                },
            });

            // Note: we intentionally do NOT require registration to
            // submit. Once a contest is live, its problems are public
            // and anyone can attempt them - but only submissions from
            // users present in ContestRegistration are counted in the
            // leaderboard (see getLeaderboard in contestController).

            if(!contestProblem){
                return res.status(400).json({
                    message: "Problem is not a part of this contest",
                });
            }

            resolvedContestId = Number(contestId);

        }

        const submission = await prisma.submission.create({
            data:{
                userId:req.user!.userId,
                problemId:Number(problemId),
                contestId: resolvedContestId,
                language,
                code,
                status:"PENDING",
            },
        });

        try{
            await submissionQueue.add(
                "judgeSubmission",
                { submissionId: submission.id}
            );
        }
        catch(error){
            await prisma.submission.update({
                where:{
                    id: submission.id,
                },
                data:{
                    status:"FAILED",
                },
            });
            throw error;
        }
        

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
            return res.status(404).json({
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
        console.log(error);
        res.status(500).json({
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