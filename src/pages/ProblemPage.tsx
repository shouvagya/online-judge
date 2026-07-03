import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Editor from "@monaco-editor/react";

import { getProblem } from "../api/problem";
import { starterCode } from "../utils/starterCode";
import { runCode } from "../api/run";

import { submitCode, getSubmission } from "../api/submission";

function ProblemPage() {
  const { slug } = useParams();

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(starterCode.cpp);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [verdict, setVerdict] = useState("");

  const { data: problem, isLoading } = useQuery({
    queryKey: ["problem", slug],
    queryFn: () => getProblem(slug!),
    enabled: !!slug,
  });

  async function handleRun() {
    setRunning(true);
    setOutput("");

    try {
      const result = await runCode({
        language,
        code,
        input,
      });

      if (result.success) {
        setOutput(result.output);
      } else {
        setOutput(result.error);
      }
    } catch {
      setOutput("Failed to execute.");
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setVerdict("Submitting...");

    const NON_TERMINAL_STATUSES = ["PENDING", "PROCESSING"];
    const MAX_ATTEMPTS = 30; // ~30s of polling, tune as needed

    try {
      const submission = await submitCode({
        problemId: problem.id,
        language,
        code,
      });

      const submissionId = submission.id;
      let attempts = 0;

      while (true) {
        const latest = await getSubmission(submissionId);

        if (!NON_TERMINAL_STATUSES.includes(latest.status)) {
          setVerdict(latest.status);
          break;
        }

        attempts++;
        if (attempts >= MAX_ATTEMPTS) {
          setVerdict("Timed out waiting for verdict");
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setSubmitting(false);
    } catch {
      setSubmitting(false);
      setVerdict("Submission Failed");
    }
  }

  function changeLanguage(lang: string) {
    setLanguage(lang);
    setCode(starterCode[lang]);
  }



  if (isLoading) return <h2>Loading...</h2>;

  if (!problem) return <h2>Problem not found.</h2>;

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">{problem.title}</h1>

          <p className="mt-2">{problem.difficulty}</p>

          <p>{problem.tags}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Description</h2>

          <div className="mt-3 whitespace-pre-wrap">
            {problem.description}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Sample Testcases</h2>

          {problem.testCases.map((test: any) => (
            <div
              key={test.id}
              className="mt-4 rounded bg-slate-200 p-4"
            >
              <b>Input</b>

              <pre>{test.input}</pre>

              <b>Output</b>

              <pre>{test.expectedOutput}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div>
        <div className="mb-4 flex justify-between">
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="rounded border p-2"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        <Editor
          height="60vh"
          language={language}
          value={code}
          onChange={(value) => setCode(value ?? "")}
        />

        <div className="mt-4">
          <label className="font-semibold">Custom Input</label>

          <textarea
            className="mt-2 h-28 w-full rounded border p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter custom input..."
          />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={handleRun}
            disabled={running}
            className="rounded bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
          >
            {running ? "Running..." : "Run"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        <div className="mt-6">
          <h2 className="mb-2 text-xl font-bold">Output</h2>

          <pre className="min-h-[120px] rounded bg-slate-900 p-4 text-green-400 whitespace-pre-wrap">
            {output || "Output will appear here..."}
          </pre>
        </div>

        <div className="mt-4 rounded bg-slate-100 p-4">
          <h2 className="font-bold">Submission Status</h2>

          <p className="mt-2">
            {verdict || "No submissions yet."}
          </p>
        </div>

      </div>
    </div>
  );
}

export default ProblemPage;