import path from "path";

export function getDockerCommand(
    dockerPath:string,
    command:string
){
    return `docker run \
    --rm \
    --network none \
    --memory=128m \
    --cpus=1 \
    --pids-limit=64 \
    -v "${dockerPath}:/workspace" \
    cpp-judge \
    bash -c "${command}"`;
}