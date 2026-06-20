import { Status } from "../../generated/prisma/enums";
import { executeCpp } from "./executeCpp";
import { compareOutput } from "./compareOutput";

type TestCaseType = {
    input: string,
    expectedOutput: string,
}

export async function judgeSubmission(
    code:string,
    language:string,
    testCases: TestCaseType[],

):Promise<Status>{

    for(const testCase of testCases){
        const result = await executeCpp(code,testCase.input);

        if(!result.success){
            if(result.errorType==="COMPILATION_ERROR") return Status.COMPILATION_ERROR;
            else if(result.errorType==="RUNTIME_ERROR") return Status.RUNTIME_ERROR;
            else if(result.errorType==="TIME_LIMIT_EXCEEDED") return Status.TIME_LIMIT_EXCEEDED;
        }

        const accepted = compareOutput(result.output!, testCase.expectedOutput);

        if(!accepted){
            return Status.WRONG_ANSWER;
        }
    }

    return Status.ACCEPTED;
}