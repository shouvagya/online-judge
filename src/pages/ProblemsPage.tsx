import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { getProblems } from "../api/problems";

function ProblemsPage() {
  const {
    data: problems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["problems"],
    queryFn: getProblems,
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Failed to load problems.</h2>;
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Problems
      </h1>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="w-full">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-3 text-left">
                Title
              </th>

              <th className="p-3 text-left">
                Difficulty
              </th>

              <th className="p-3 text-left">
                Tags
              </th>

              <th className="p-3 text-left">
                Author
              </th>
            </tr>
          </thead>

          <tbody>
            {problems?.map((problem) => (
              <tr
                key={problem.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-3">
                  <Link
                    to={`/problems/${problem.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {problem.title}
                  </Link>
                </td>

                <td className="p-3">
                  {problem.difficulty}
                </td>

                <td className="p-3">
                  {problem.tags}
                </td>

                <td className="p-3">
                  {problem.author.username}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProblemsPage;