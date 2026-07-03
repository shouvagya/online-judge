import api from "./axios";

export interface RunRequest {
  language: string;
  code: string;
  input: string;
}

export async function runCode(body: RunRequest) {
  const res = await api.post("/run", body);
  return res.data;
}