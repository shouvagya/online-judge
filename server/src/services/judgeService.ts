import { Status } from "../../generated/prisma/enums";
import { executeCode } from "./executeCode";
import { compareOutput } from "./compareOutput";

type TestCaseType = {
    input: string,
    expectedOutput: string,
}

export type VerdictResult={
    status: Status;
    runtimeMs: number;
    memoryKb: number
}

export async function judgeSubmission(
    code:string,
    language:string,
    testCases: TestCaseType[],

):Promise<VerdictResult>{

    let maxRuntime=0;
    let memoryKb=0;

    for(const testCase of testCases){
        const result = await executeCode(language,code,testCase.input);

        if(!result.success){
            if(result.errorType==="COMPILATION_ERROR"){
                return {
                    status:Status.COMPILATION_ERROR,
                    runtimeMs: maxRuntime,
                    memoryKb: memoryKb
                }
            } 
            else if(result.errorType==="RUNTIME_ERROR") {
                return {
                    status: Status.RUNTIME_ERROR,
                    runtimeMs: maxRuntime,
                    memoryKb: memoryKb
                };
            }
            return {
                status: Status.TIME_LIMIT_EXCEEDED,
                runtimeMs: maxRuntime,
                memoryKb: memoryKb
            };
        }

        maxRuntime=Math.max(maxRuntime, result.executionTime);

        const accepted = compareOutput(result.output!, testCase.expectedOutput);

        if(!accepted){
            return {
                status: Status.WRONG_ANSWER,
                runtimeMs: maxRuntime,
                memoryKb: memoryKb
            };
        }
    }

    return {
        status: Status.ACCEPTED,
        runtimeMs: maxRuntime,
        memoryKb: memoryKb
    }
}