import { Status } from "../../generated/prisma/enums";

export async function judgeSubmission(
    code:string,
    language:string
):Promise<Status>{
    console.log("Judging submission...");
    return Status.ACCEPTED;
}