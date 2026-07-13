import { Link, useNavigate, useParams } from "react-router-dom";

import {
  useQuestions,
  useDeleteQuestion,
} from "../../hooks/useTeacherQuestion";

function QuestionList() {
  const navigate = useNavigate();

  const { quizId } = useParams();

  const { data: questions = [], isLoading } = useQuestions(quizId);

  const { mutateAsync: deleteQuestion } = useDeleteQuestion();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?",
    );

    if (!confirmDelete) return;

    try {
      await deleteQuestion({
  quizId,
  questionId: id,
});
    } catch (error) {
      console.error(error);
    }
  };

  const getQuestionTypeBadge = (type) => {
    switch (type) {
      case "SINGLE_CHOICE":
        return "bg-blue-100 text-blue-700";

      case "MULTIPLE_CHOICE":
        return "bg-purple-100 text-purple-700";

      case "TRUE_FALSE":
        return "bg-green-100 text-green-700";

      case "DESCRIPTIVE":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center text-lg">Loading questions...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <button
            onClick={() => navigate("/teacher/quizzes")}
            className="mb-3 text-blue-600 hover:underline"
          >
            ← Back to Quizzes
          </button>

          <h1 className="text-3xl font-bold">Questions</h1>

          <p className="text-gray-500">Manage quiz questions.</p>
        </div>

        <Link
          to={`/teacher/quizzes/${quizId}/questions/create`}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          + Add Question
        </Link>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <h2 className="text-xl font-semibold">No questions added yet.</h2>

          <p className="mt-2 text-gray-500">Create your first question.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {questions.map((question) => (
            <div key={question.id} className="rounded-xl bg-white p-6 shadow">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {question.questionText}
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${getQuestionTypeBadge(
                        question.questionType,
                      )}`}
                    >
                      {question.questionType}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                      Marks : {question.marks}
                    </span>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                      Negative : {question.negativeMarks}
                    </span>

                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm">
                      Order : {question.displayOrder}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      navigate(
                        `/teacher/quizzes/${quizId}/questions/${question.id}/edit`,
                      )
                    }
                    className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  {question.questionType !== "DESCRIPTIVE" && (
                    <button
                      onClick={() =>
                        navigate(
                          `/teacher/quizzes/${quizId}/questions/${question.id}/options`,
                        )
                      }
                      className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    >
                      Options
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(question.id)}
                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Delete
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

export default QuestionList;
