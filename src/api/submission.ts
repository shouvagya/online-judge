import api from "./axios";

export async function submitCode(body: {
  problemId: number;
  language: string;
  code: string;
}) {
  const res = await api.post("/submissions", body);
  return res.data;
}

export async function getSubmission(id: number) {
  const res = await api.get(`/submissions/${id}`);
  return res.data;
}