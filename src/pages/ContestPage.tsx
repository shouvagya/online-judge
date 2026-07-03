import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getContest, registerContest } from "../api/contest";

function ContestPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: contest, isLoading, refetch } = useQuery({
    queryKey: ["contest", id],
    queryFn: () => getContest(Number(id)),
    enabled: !!id,
  });

  async function handleRegister() {
    try {
      await registerContest(Number(id));

      alert("Registered Successfully");

      refetch();
    } catch {
      alert("Already registered or registration failed.");
    }
  }

  if (isLoading) return <h2>Loading...</h2>;

  if (!contest) return <h2>Contest not found.</h2>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">
          {contest.title}
        </h1>

        <p className="mt-2">
          {contest.description}
        </p>
      </div>

      <div className="rounded border p-5 space-y-2">
        <p>
          <b>Status:</b> {contest.status}
        </p>

        <p>
          <b>Starts:</b>{" "}
          {new Date(contest.startTime).toLocaleString()}
        </p>

        <p>
          <b>Ends:</b>{" "}
          {new Date(contest.endTime).toLocaleString()}
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-2xl font-bold">
          Problems
        </h2>

        <div className="space-y-2">
          {contest.contestProblems.map((cp: any) => (
            <div
              key={cp.problem.id}
              className="rounded border p-4"
            >
              {cp.problem.title}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleRegister}
          className="rounded bg-blue-600 px-5 py-2 text-white"
        >
          Register
        </button>

        <button
          onClick={() =>
            navigate(`/contests/${id}/leaderboard`)
          }
          className="rounded bg-green-600 px-5 py-2 text-white"
        >
          Leaderboard
        </button>
      </div>
    </div>
  );
}

export default ContestPage;