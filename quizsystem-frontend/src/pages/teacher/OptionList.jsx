import { Link, useNavigate, useParams } from "react-router-dom";

import {
  useOptions,
  useDeleteOption,
} from "../../hooks/useTeacherOption";

function OptionList() {
  const navigate = useNavigate();

  const { quizId, questionId } = useParams();

  const {
    data: options = [],
    isLoading,
  } = useOptions(questionId);

  const {
    mutateAsync: deleteOption,
  } = useDeleteOption();

  const handleDelete = async (optionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this option?"
    );

    if (!confirmDelete) return;

    try {
      await deleteOption({
        questionId,
        optionId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center text-lg">
        Loading options...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <button
            onClick={() =>
              navigate(`/teacher/quizzes/${quizId}/questions`)
            }
            className="mb-3 text-blue-600 hover:underline"
          >
            ← Back to Questions
          </button>

          <h1 className="text-3xl font-bold">
            Question Options
          </h1>

          <p className="text-gray-500">
            Manage options for this question.
          </p>

        </div>

        <Link
          to={`/teacher/quizzes/${quizId}/questions/${questionId}/options/create`}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          + Add Option
        </Link>

      </div>

      {/* Empty State */}

      {options.length === 0 ? (

        <div className="rounded-xl bg-white p-10 text-center shadow">

          <h2 className="text-xl font-semibold">
            No options available.
          </h2>

          <p className="mt-2 text-gray-500">
            Create your first option.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {options.map((option, index) => (

            <div
              key={option.id}
              className="rounded-xl bg-white p-5 shadow"
            >

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <h2 className="text-lg font-semibold">
                    Option {index + 1}
                  </h2>

                  <p className="mt-2 text-gray-700">
                    {option.optionText}
                  </p>

                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                      option.correctAnswer
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {option.correctAnswer
                      ? "Correct Answer"
                      : "Incorrect"}
                  </span>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      navigate(
                        `/teacher/quizzes/${quizId}/questions/${questionId}/options/${option.id}/edit`
                      )
                    }
                    className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(option.id)}
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

export default OptionList;