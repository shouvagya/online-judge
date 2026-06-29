import { executeCppDocker } from "./executeCppDocker";
import { executeJavaDocker } from "./executeJavaDocker";
import { executePythonDocker } from "./executePythonDocker";
import { ExecutionResult } from "./dockerExecutor";

export async function executeCode(
    language: string,
    code: string,
    input: string
): Promise<ExecutionResult> {

    switch (language) {

        case "cpp":
            return executeCppDocker(code, input);
        case "java":
            return executeJavaDocker(code, input);
        case "python":
            return executePythonDocker(code, input);

        default:
            throw new Error(`Unsupported language: ${language}`);
    }
}