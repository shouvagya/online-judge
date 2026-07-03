import api from "./axios";
import type { Problem } from "../types/problem";

export async function getProblems(): Promise<Problem[]> {
  const res = await api.get("/problems");
  return res.data;
}