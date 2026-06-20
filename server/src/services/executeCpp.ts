import { writeFile, mkdir, rm } from "fs/promises";
import { promisify } from "util";
import { exec } from "child_process";
import path from "path";


export type ExecutionResult= 
{
    success:true;
    output:string;
    executionTime:number;
}
|{
    success:false;
    errorType:
        | "COMPILATION_ERROR"
        | "RUNTIME_ERROR"
        | "TIME_LIMIT_EXCEEDED";
    error:string;
}

const execAsync = promisify(exec);

export async function executeCpp(
    code: string,
    input: string
): Promise<ExecutionResult>{
    const tempDir = path.join(process.cwd(), "temp");

    try {
        await mkdir(tempDir, { recursive: true });

        const cppFile = path.join(tempDir, "main.cpp");
        const exeFile = path.join(tempDir, "main.exe");
        const inputFile = path.join(tempDir, "input.txt");

        await writeFile(cppFile, code);
        await writeFile(inputFile, input);

        // Compile
        try{
            await execAsync(
                `g++ "${cppFile}" -o "${exeFile}"`
            );
        }
        catch(error:any){

            return {
                success:false,
                errorType: "COMPILATION_ERROR",
                error:error.stderr || error.message,
            }
        }
        
        // Run
        const start= Date.now();

        try{
            const { stdout } = await execAsync(
            `"${exeFile}" < "${inputFile}"`,
            { timeout:2000 },
            );

            const executionTime= Date.now() - start;

            return {
                success:true,
                output: stdout,
                executionTime:executionTime,
            };
        }
        catch(error:any){
            if(error.killed){
                return {
                    success:false,
                    errorType:"TIME_LIMIT_EXCEEDED",
                    error: "Execution exceeded time limit",
                }
            }

            return {
                success:false,
                errorType: "RUNTIME_ERROR",
                error: error.stderr || error.message,
            };
        }
        

    } 
    finally{

        try{
            await rm(tempDir, {
                recursive:true,
                force:true,
            });
        }
        catch{}
    }
}