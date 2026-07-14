import { useNavigate, useParams } from "react-router-dom";

import { useResult } from "../../hooks/useStudentResult";

function Result() {
  const { attemptId } = useParams();

  const navigate = useNavigate();

  const {
    data: result,
    isLoading,
  } = useResult(attemptId);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading Result...
        </h2>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h2 className="text-xl text-red-600">
          Result not found.
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* Header */}

      <div className="rounded-xl bg-white p-6 shadow">

        <button
          onClick={() => navigate("/student/quizzes")}
          className="mb-4 text-green-600 hover:underline"
        >
          ← Back to Quizzes
        </button>

        <h1 className="text-3xl font-bold">
          {result.quizTitle}
        </h1>

        <p className="mt-2 text-gray-500">
          Quiz Result
        </p>

      </div>

      {/* Summary */}

      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-gray-500">
            Score
          </h3>

          <p className="mt-2 text-3xl font-bold">
            {result.score}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-gray-500">
            Percentage
          </h3>

          <p className="mt-2 text-3xl font-bold">
            {result.percentage.toFixed(2)}%
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-gray-500">
            Status
          </h3>

          <p
            className={`mt-2 text-3xl font-bold ${
              result.passed
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {result.passed
              ? "Passed"
              : "Failed"}
          </p>
        </div>

      </div>

      {/* Questions */}

      <div className="space-y-6">

        {result.questions.map(
          (question, index) => (
            <div
              key={question.questionId}
              className="rounded-xl bg-white p-6 shadow"
            >

              <div className="mb-4 flex items-center justify-between">

                <h2 className="text-lg font-semibold">
                  Q{index + 1}. {question.questionText}
                </h2>

                <span className="rounded bg-blue-100 px-3 py-1 text-sm">
                  Marks : {question.marksObtained ?? "-"} / {question.marks}
                </span>

              </div>

              {/* Objective */}

              {question.questionType !==
                "DESCRIPTIVE" && (
                <div className="space-y-2">

                  {question.options.map(
                    (option) => (
                      <div
                        key={option.id}
                        className={`rounded border p-3 ${
                          option.correct
                            ? "border-green-500 bg-green-50"
                            : option.selected
                            ? "border-red-500 bg-red-50"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between">

                          <span>
                            {option.optionText}
                          </span>

                          <div className="space-x-2">

                            {option.selected && (
                              <span className="rounded bg-blue-100 px-2 py-1 text-xs">
                                Selected
                              </span>
                            )}

                            {option.correct && (
                              <span className="rounded bg-green-100 px-2 py-1 text-xs">
                                Correct
                              </span>
                            )}

                          </div>

                        </div>
                      </div>
                    )
                  )}

                  <div className="pt-3">

                    {question.correct ===
                    true ? (
                      <span className="font-semibold text-green-600">
                        ✔ Correct Answer
                      </span>
                    ) : (
                      <span className="font-semibold text-red-600">
                        ✘ Wrong Answer
                      </span>
                    )}

                  </div>

                </div>
              )}

              {/* Descriptive */}

              {question.questionType ===
                "DESCRIPTIVE" && (
                <div>

                  <h3 className="mb-2 font-semibold">
                    Your Answer
                  </h3>

                  <div className="rounded-lg border bg-gray-50 p-4 whitespace-pre-wrap">
                    {question.descriptiveAnswer ||
                      "No answer submitted"}
                  </div>

                  <p className="mt-4 text-sm text-gray-500">
                    This answer will be evaluated by the teacher.
                  </p>

                </div>
              )}

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default Result;