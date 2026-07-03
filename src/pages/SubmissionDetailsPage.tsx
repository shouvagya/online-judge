import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getSubmissionById } from "../api/submissionDetails";

function SubmissionDetailsPage() {
  const { id } = useParams();

  const { data: submission, isLoading } = useQuery({
    queryKey: ["submission", id],
    queryFn: () => getSubmissionById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (!submission) {
    return <h2>Submission not found.</h2>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">
          Submission #{submission.id}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-6 rounded border p-5">
        <div>
          <p className="font-semibold">Problem</p>
          <p>{submission.problem.title}</p>
        </div>

        <div>
          <p className="font-semibold">User</p>
          <p>{submission.user.username}</p>
        </div>

        <div>
          <p className="font-semibold">Verdict</p>
          <p>{submission.status}</p>
        </div>

        <div>
          <p className="font-semibold">Language</p>
          <p>{submission.language}</p>
        </div>

        <div>
          <p className="font-semibold">Runtime</p>
          <p>
            {submission.runtimeMs != null
              ? `${submission.runtimeMs} ms`
              : "-"}
          </p>
        </div>

        <div>
          <p className="font-semibold">Memory</p>
          <p>
            {submission.memoryKb != null
              ? `${submission.memoryKb} KB`
              : "-"}
          </p>
        </div>

        <div>
          <p className="font-semibold">Submitted At</p>
          <p>
            {new Date(
              submission.submittedAt
            ).toLocaleString()}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-2xl font-bold">
          Source Code
        </h2>

        <pre className="overflow-x-auto rounded bg-slate-900 p-5 text-green-400">
          <code>{submission.code}</code>
        </pre>
      </div>
    </div>
  );
}

export default SubmissionDetailsPage;