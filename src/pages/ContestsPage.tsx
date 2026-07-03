import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getContests } from "../api/contest";

function ContestsPage() {
  const navigate = useNavigate();

  const { data: contests, isLoading } = useQuery({
    queryKey: ["contests"],
    queryFn: getContests,
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold">
        Contests
      </h1>

      <div className="space-y-4">
        {contests?.map((contest: any) => (
          <div
            key={contest.id}
            onClick={() =>
              navigate(`/contests/${contest.id}`)
            }
            className="cursor-pointer rounded border p-5 hover:bg-slate-100"
          >
            <h2 className="text-2xl font-semibold">
              {contest.title}
            </h2>

            <p className="mt-2">
              Status: {contest.status}
            </p>

            <p>
              Start:{" "}
              {new Date(
                contest.startTime
              ).toLocaleString()}
            </p>

            <p>
              End:{" "}
              {new Date(
                contest.endTime
              ).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContestsPage;