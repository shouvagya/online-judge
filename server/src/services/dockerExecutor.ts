import { mkdir, rm, writeFile } from "fs/promises";
import { promisify } from "util";
import { exec } from "child_process";
import path from "path";
import { getDockerCommand } from "./dockerCommand";
import crypto from "crypto";


export type DockerExecutionConfig = {
    sourceFile: string;
    compileCommand?: string;
    runCommand: string;
};

export type ExecutionResult =
{
    success: true;
    output: string;
    executionTime: number;
}
|{
    success: false;
    errorType:
        | "COMPILATION_ERROR"
        | "RUNTIME_ERROR"
        | "TIME_LIMIT_EXCEEDED";
    error: string;
};

//--------------------------------------//

const execAsync = promisify(exec);

export async function executeInDocker(
    code: string,
    input: string,
    config: DockerExecutionConfig
): Promise<ExecutionResult> {

    const tempDir = path.join(process.cwd(), "temp", crypto.randomUUID()); //every submission gets its own workspace

    try {

        await mkdir(tempDir, { recursive: true });

        await writeFile(
            path.join(tempDir, config.sourceFile),
            code
        );

        await writeFile(
            path.join(tempDir, "input.txt"),
            input
        );

        const dockerPath = tempDir.replace(/\\/g, "/");

        //Compile
        try{
            if(config.compileCommand){
                const compileCommand = getDockerCommand(dockerPath,config.compileCommand);

                await execAsync(compileCommand);
            }
        }
        catch(error:any){
            return {
                success:false,
                errorType:"COMPILATION_ERROR",
                error: String(error.stderr || error.message),
            }
        }

        //Run( if compile success )
        const start = Date.now();
        try{
            const runCommand = getDockerCommand(dockerPath, config.runCommand);

            const { stdout } = await execAsync(runCommand,{timeout:2000});

            return{
                success:true,
                output:stdout,
                executionTime: Date.now()-start,
            };
        }
        catch(error:any){
            if(error.killed){
                return {
                    success:false,
                    errorType:"TIME_LIMIT_EXCEEDED",
                    error:"Execution exceeded time limit",
                };
            }

            return{
                success:false,
                errorType:"RUNTIME_ERROR",
                error: String(error.stderr || error.message),
            }
            
        }

    
    } catch (error: any) {

        if (error.killed) {

            return {
                success: false,
                errorType: "TIME_LIMIT_EXCEEDED",
                error: "Execution exceeded time limit",
            };
        }

        return {
            success: false,
            errorType: "RUNTIME_ERROR",
            error: String(error.stderr || error.message),
        };

    } finally {

        await rm(tempDir, {
            recursive: true,
            force: true,
        });

    }
}

