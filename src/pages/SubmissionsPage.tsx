import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getMySubmissions } from "../api/submissions";

function SubmissionsPage() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["my-submissions"],
    queryFn: getMySubmissions,
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold">
        My Submissions
      </h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Problem</th>
            <th className="p-3 text-left">Language</th>
            <th className="p-3 text-left">Verdict</th>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-left">Submitted</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((sub: any) => (
            <tr
              key={sub.id}
              onClick={() =>
                navigate(`/submissions/${sub.id}`)
              }
              className="cursor-pointer border-b hover:bg-slate-100"
            >
              <td className="p-3">
                {sub.problem.title}
              </td>

              <td className="p-3">
                {sub.language}
              </td>

              <td className="p-3">
                {sub.status}
              </td>

              <td className="p-3">
                {sub.runtimeMs} ms
              </td>

              <td className="p-3">
                {new Date(
                  sub.submittedAt
                ).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SubmissionsPage;