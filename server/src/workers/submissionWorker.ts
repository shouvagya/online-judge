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

        const submissionId = job.data.submissionId;

        console.log(`Processing submission ${submissionId}`);

        const submission = await prisma.submission.findUnique({
            where:{
                id:submissionId,
            },
        });

        if(!submission){
            throw new Error(`Submission ${submissionId} not found`);
        }

        await prisma.submission.update({
            where:{
                id:submissionId,
            },
            data:{
                status:Status.PROCESSING,
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

        if(problem.testCases.length===0){
            throw new Error("No testcases found");
        }

        const verdict= await judgeSubmission(
            submission.code,
            submission.language,
            problem.testCases
        );


        await prisma.submission.update({
            where:{
                id:submissionId,
            },
            data:{
                status:verdict,
            }
        });


        console.log(`Submission ${submissionId} => ${verdict}`);
    },

    {connection}
);


worker.on("completed",(job, result) => {
    console.log(`Job ${job?.id} completed`,result);
});

worker.on("failed",(job, err) => {
    console.log(`Job ${job?.id} failed`,err.message);
});

worker.on("error", (err) => {
    console.error(err);
});