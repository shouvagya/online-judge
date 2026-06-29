import { executeInDocker } from "./dockerExecutor";

export function executeJavaDocker(
    code:string,
    input:string
){

    return executeInDocker(
        code,
        input,
        {
            sourceFile:"Main.java",
            compileCommand:"javac Main.java",
            runCommand: "java Main < input.txt"
        }
    );

}