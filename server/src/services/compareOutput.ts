export function compareOutput(
    actual:string,
    expected:string
):boolean{
    return actual.trim() === expected.trim();
}