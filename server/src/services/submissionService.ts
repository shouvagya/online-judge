import {prisma} from "../lib/prisma";
import {Status} from "../../generated/prisma/enums";

export const updateSubmissionStatus = async (
    submissionId:number,
    status:Status,
    runtimeMs?:number,
    memoryKb?:number
)=>{
    return prisma.submission.update({
        where:{
            id:submissionId,
        },
        data:{
            status,
            runtimeMs,
            memoryKb,
        },
    });
};