import { useNavigate } from "react-router-dom";

import { useResults } from "../../hooks/useStudentResult";

function Results() {
  const navigate = useNavigate();

  const {
    data: results = [],
    isLoading,
  } = useResults();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading Results...
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          My Results
        </h1>

        <p className="mt-2 text-gray-500">
          View all your quiz attempts.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <h2 className="text-xl font-semibold">
            No quiz attempts found.
          </h2>

          <p className="mt-2 text-gray-500">
            Attempt a quiz to see your results here.
          </p>

          <button
            onClick={() => navigate("/student/quizzes")}
            className="mt-6 rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
          >
            Browse Quizzes
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {results.map((result) => (
            <div
              key={result.attemptId}
              className="rounded-xl bg-white p-6 shadow"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">
                    {result.quizTitle}
                  </h2>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="rounded bg-blue-100 px-3 py-1">
                      Score : {result.score}
                    </span>

                    <span className="rounded bg-purple-100 px-3 py-1">
                      {result.percentage.toFixed(2)}%
                    </span>

                    <span
                      className={`rounded px-3 py-1 ${
                        result.passed
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {result.passed
                        ? "Passed"
                        : "Failed"}
                    </span>

                    <span
                      className={`rounded px-3 py-1 ${
                        result.status === "SUBMITTED"
                          ? "bg-gray-200"
                          : "bg-yellow-100"
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>

                  {result.submittedAt && (
                    <p className="text-sm text-gray-500">
                      Submitted :
                      {" "}
                      {new Date(
                        result.submittedAt
                      ).toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    onClick={() =>
                      navigate(
                        `/student/results/${result.attemptId}`
                      )
                    }
                    className="rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
                  >
                    View Result
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Results;