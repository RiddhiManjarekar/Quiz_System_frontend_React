import React from "react";

function ReviewModal({
  open,
  questions,
  answers,
  onClose,
  onJump,
  onSubmit,
  isSubmitting = false,
}) {
  if (!open) return null;

  const isAnswered = (question) => {
    const answer = answers[question.id];

    if (!answer) return false;

    if (question.questionType === "DESCRIPTIVE") {
      return (
        answer.descriptiveAnswer &&
        answer.descriptiveAnswer.trim() !== ""
      );
    }

    return (
      answer.selectedOptionIds &&
      answer.selectedOptionIds.length > 0
    );
  };

  const answeredCount = questions.filter(isAnswered).length;

  const unansweredCount =
    questions.length - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">

        {/* Header */}

        <div className="border-b p-5">
          <h2 className="text-2xl font-bold">
            Review Your Quiz
          </h2>

          <p className="mt-1 text-gray-600">
            Please review your answers before submitting.
          </p>
        </div>

        {/* Summary */}

        <div className="grid grid-cols-3 gap-4 border-b p-5 text-center">
          <div>
            <p className="text-2xl font-bold">
              {questions.length}
            </p>

            <p className="text-gray-500">
              Total
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-green-600">
              {answeredCount}
            </p>

            <p className="text-gray-500">
              Answered
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-red-600">
              {unansweredCount}
            </p>

            <p className="text-gray-500">
              Unanswered
            </p>
          </div>
        </div>

        {/* Question List */}

        <div className="max-h-[350px] overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {questions.map((question, index) => {
              const answered =
                isAnswered(question);

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => {
                    onJump(index);
                    onClose();
                  }}
                  className={`rounded-lg border p-3 text-sm font-medium transition
                    ${
                      answered
                        ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                        : "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                >
                  <div>
                    Question {index + 1}
                  </div>

                  <div className="mt-1 text-xs">
                    {answered
                      ? "Answered"
                      : "Not Answered"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}

        <div className="flex flex-col gap-3 border-t p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-6 py-2 hover:bg-gray-100"
          >
            Continue Quiz
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ReviewModal);