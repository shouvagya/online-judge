import api from "./axios";

export async function getProblem(slug: string) {
  const res = await api.get(`/problems/${slug}`);
  return res.data;
}