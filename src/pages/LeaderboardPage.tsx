import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getLeaderboard } from "../api/contest";

function LeaderboardPage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", id],
    queryFn: () => getLeaderboard(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold">
        Leaderboard
      </h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Rank</th>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-left">Solved</th>
            <th className="p-3 text-left">Score</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((user: any) => (
            <tr
              key={user.userId}
              className="border-b"
            >
              <td className="p-3">
                {user.rank}
              </td>

              <td className="p-3">
                {user.username}
              </td>

              <td className="p-3">
                {user.solvedCount}
              </td>

              <td className="p-3">
                {user.totalScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderboardPage;