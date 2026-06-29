import { executeInDocker } from "./dockerExecutor";

export function executeCppDocker(
    code:string,
    input:string
){

    return executeInDocker(
        code,
        input,
        {
            sourceFile:"main.cpp",
            compileCommand:"g++ main.cpp -o /workspace/main",
            runCommand:"./main < input.txt"
        }
    );
}