import { Link, useNavigate } from "react-router-dom";

import {
  useMyQuizzes,
  useDeleteQuiz,
  useUpdateQuizStatus,
} from "../../hooks/useTeacherQuiz";

function QuizList() {
  const navigate = useNavigate();

  const { data: quizzes = [], isLoading } = useMyQuizzes();

  const { mutateAsync: deleteQuiz } = useDeleteQuiz();

  const { mutateAsync: changeStatus } = useUpdateQuizStatus();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?",
    );

    if (!confirmDelete) return;

    await deleteQuiz(id);
  };

  const handleStatus = async (id, status) => {
    await changeStatus({
      id,
      status,
    });
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "DRAFT":
        return "bg-yellow-100 text-yellow-700";

      case "INACTIVE":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100";
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-lg">Loading quizzes...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">My Quizzes</h1>

        <Link
          to="/teacher/quizzes/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Create Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <h2 className="text-xl font-semibold">No quizzes created yet.</h2>

          <p className="text-gray-500 mt-2">Click Create Quiz to start.</p>
        </div>
      ) : (
        <>
          {/* Desktop */}

          <div className="hidden lg:block overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Title</th>

                  <th className="p-4">Duration</th>

                  <th className="p-4">Total Marks</th>

                  <th className="p-4">Passing</th>

                  <th className="p-4">Status</th>

                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="border-t">
                    <td className="p-4">
                      <h3 className="font-semibold">{quiz.title}</h3>

                      <p className="text-sm text-gray-500">
                        {quiz.description}
                      </p>
                    </td>

                    <td className="text-center">{quiz.durationMinutes} min</td>

                    <td className="text-center">{quiz.totalMarks}</td>

                    <td className="text-center">{quiz.passingMarks}</td>

                    <td className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(
                          quiz.status,
                        )}`}
                      >
                        {quiz.status}
                      </span>
                    </td>

                    <td>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() =>
                            navigate(`/teacher/quizzes/edit/${quiz.id}`)
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/teacher/quizzes/${quiz.id}/questions`)
                          }
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                        >
                          Questions
                        </button>

                        <button
                          onClick={() => handleDelete(quiz.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                        {quiz.status !== "ACTIVE" && (
                          <button
                            onClick={() => handleStatus(quiz.id, "ACTIVE")}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                          >
                            Activate
                          </button>
                        )}

                        {quiz.status !== "DRAFT" && (
                          <button
                            onClick={() => handleStatus(quiz.id, "DRAFT")}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded"
                          >
                            Draft
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}

          <div className="grid gap-5 lg:hidden">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-bold text-lg">{quiz.title}</h2>

                    <p className="text-gray-500 text-sm mt-1">
                      {quiz.description}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getBadgeColor(
                      quiz.status,
                    )}`}
                  >
                    {quiz.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 text-center mt-5">
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>

                    <p className="font-semibold">{quiz.durationMinutes}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Marks</p>

                    <p className="font-semibold">{quiz.totalMarks}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Passing</p>

                    <p className="font-semibold">{quiz.passingMarks}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-5">
                  <button
                    onClick={() => navigate(`/teacher/quizzes/edit/${quiz.id}`)}
                    className="bg-yellow-500 text-white rounded py-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => navigate(`/teacher/quizzes/${quiz.id}/questions`)}
                    className="bg-indigo-600 text-white rounded py-2"
                  >
                    Questions
                  </button>

                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="bg-red-600 text-white rounded py-2"
                  >
                    Delete
                  </button>

                  {quiz.status !== "ACTIVE" ? (
                    <button
                      onClick={() => handleStatus(quiz.id, "ACTIVE")}
                      className="bg-green-600 text-white rounded py-2"
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatus(quiz.id, "DRAFT")}
                      className="bg-gray-700 text-white rounded py-2"
                    >
                      Draft
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default QuizList;
