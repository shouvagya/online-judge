import api from "./axios";

export async function getSubmissionById(id: number) {
  const res = await api.get(`/submissions/${id}`);
  return res.data;
}