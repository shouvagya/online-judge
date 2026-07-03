import api from "./axios";

export async function getContests() {
  const res = await api.get("/contests");
  return res.data;
}

export async function getContest(id: number) {
  const res = await api.get(`/contests/${id}`);
  return res.data;
}

export async function registerContest(id: number) {
  const res = await api.post(`/contests/${id}/register`);
  return res.data;
}

export async function getLeaderboard(id: number) {
  const res = await api.get(`/contests/${id}/leaderboard`);
  return res.data;
}