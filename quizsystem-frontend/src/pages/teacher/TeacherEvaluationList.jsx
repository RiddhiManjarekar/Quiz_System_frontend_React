import { useNavigate } from "react-router-dom";

import { usePendingEvaluations } from "../../hooks/useTeacherEvaluation";

function TeacherEvaluationList() {
  const navigate = useNavigate();

  const {
    data: evaluations,
    isLoading,
    isError,
    error,
  } = usePendingEvaluations();

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading pending evaluations...
        </h2>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (isError) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Failed to load evaluations.
          </h2>

          <p className="mt-2 text-gray-600">
            {error?.response?.data?.message ||
              "Something went wrong."}
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty
  |--------------------------------------------------------------------------
  */

  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600">
            🎉 No Pending Evaluations
          </h2>

          <p className="mt-3 text-gray-500">
            All descriptive answers have been evaluated.
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Pending Evaluations ({evaluations.length})
        </h1>

        <p className="mt-2 text-gray-600">
          Evaluate descriptive answers submitted by students.
        </p>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-6 py-4 text-left">
                Student
              </th>

              <th className="px-6 py-4 text-left">
                Quiz
              </th>

              <th className="px-6 py-4 text-center">
                Pending Answers
              </th>

              <th className="px-6 py-4 text-center">
                Current Score
              </th>

              <th className="px-6 py-4 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {evaluations.map((item) => (

              <tr
                key={item.attemptId}
                className="border-t"
              >

                <td className="px-6 py-4 font-medium">
                  {item.studentName}
                </td>

                <td className="px-6 py-4">
                  {item.quizTitle}
                </td>

                <td className="px-6 py-4 text-center">

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                    {item.pendingAnswers}
                  </span>

                </td>

                <td className="px-6 py-4 text-center">
                  {item.currentScore ?? 0}
                </td>

                <td className="px-6 py-4 text-center">

                  <button
                    onClick={() =>
                      navigate(
                        `/teacher/evaluations/${item.attemptId}`
                      )
                    }
                    className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                  >
                    Evaluate
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default TeacherEvaluationList;