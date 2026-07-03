import api from "./axios";

export async function getMySubmissions() {
  const res = await api.get("/submissions/me");
  return res.data;
}