import { executeInDocker } from "./dockerExecutor";

export function executePythonDocker(
    code: string,
    input: string
) {
    return executeInDocker(code, input, {
        sourceFile: "main.py",
        runCommand: "python3 main.py < input.txt",
    });
}