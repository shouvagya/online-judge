import { Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "../lib/prisma";
import { Status } from "../../generated/prisma/enums";
import { judgeSubmission } from "../services/judgeService";

const connection= new IORedis({
    host:"127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null
});

const worker =new Worker(
    "submissionQueue",

    async(job)=>{
        //console.log("Processing submission",job.data.submissionId);
        const submissionId = job.data.submissionId;
        const submission = await prisma.submission.findUnique({
            where:{
                id:submissionId,
            },
        });

        if(!submission){
            throw new Error(`Submission ${submissionId} not found`);
        }

        const verdict= await judgeSubmission(submission.code,submission.language);

        await prisma.submission.update({
            where:{
                id:submissionId,
            },
            data:{
                status:verdict,
            }
        });

        const problem =await prisma.problem.findUnique({
            where:{
                id:submission.problemId,
            },
            include:{
                testCases:true,
            },
        });

        if(!problem){
            throw new Error(`Problem ${submission.problemId} not found`);
        }

        console.log({
            submissionId: submission.id,
            language: submission.language,
            problemTitle: problem.title,
            totalTestCases: problem.testCases.length,
        });
    },

    {connection}
);

worker.on("completed",(job)=>{
    console.log(`Job ${job?.id} completed`);
});

worker.on("failed",(job,err)=>{
    console.log(`Job ${job?.id} failed`,err);
});