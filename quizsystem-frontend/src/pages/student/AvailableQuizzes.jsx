import { useNavigate } from "react-router-dom";

import { useAvailableQuizzes } from "../../hooks/useStudentQuiz";

function AvailableQuizzes() {
  const navigate = useNavigate();

  const {
    data: quizzes = [],
    isLoading,
  } = useAvailableQuizzes();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading quizzes...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Available Quizzes
        </h1>

        <p className="mt-2 text-gray-500">
          Select a quiz and start your attempt.
        </p>
      </div>

      {/* Empty State */}

      {quizzes.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <h2 className="text-xl font-semibold">
            No quizzes available.
          </h2>

          <p className="mt-2 text-gray-500">
            Please check again later.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
            >
              <h2 className="text-xl font-bold">
                {quiz.title}
              </h2>

              <p className="mt-3 text-gray-600">
                {quiz.description}
              </p>

              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Total Marks:</strong>{" "}
                  {quiz.totalMarks}
                </p>

                <p>
                  <strong>Passing Marks:</strong>{" "}
                  {quiz.passingMarks}
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {quiz.durationMinutes} mins
                </p>

                {quiz.startTime && (
                  <p>
                    <strong>Starts:</strong>{" "}
                    {new Date(
                      quiz.startTime
                    ).toLocaleString()}
                  </p>
                )}

                {quiz.endTime && (
                  <p>
                    <strong>Ends:</strong>{" "}
                    {new Date(
                      quiz.endTime
                    ).toLocaleString()}
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  navigate(`/student/quizzes/${quiz.id}`)
                }
                className="mt-6 w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
              >
                View Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AvailableQuizzes;