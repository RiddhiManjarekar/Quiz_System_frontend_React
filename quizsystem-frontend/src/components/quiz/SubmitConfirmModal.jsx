import React from "react";

function SubmitConfirmModal({
  open,
  answeredCount,
  totalQuestions,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) {
  if (!open) return null;

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b p-5">
          <h2 className="text-2xl font-bold text-gray-800">Submit Quiz?</h2>
          <p className="mt-1 text-gray-600">
            Are you sure you want to submit your quiz?
          </p>
        </div>

        {/* Summary */}
        <div className="p-5">
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Total Questions</span>
              <span className="font-medium">{totalQuestions}</span>
            </div>

            <div className="flex justify-between border-b pb-2 text-green-600">
              <span>Answered</span>
              <span className="font-medium">{answeredCount}</span>
            </div>

            {unansweredCount > 0 && (
              <div className="flex justify-between border-b pb-2 text-red-600">
                <span>Unanswered</span>
                <span className="font-medium">{unansweredCount}</span>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <span className="font-medium text-gray-700">Completion</span>
              <span className="font-medium">
                {Math.round((answeredCount / totalQuestions) * 100)}%
              </span>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
              ⚠️ You have {unansweredCount} unanswered question
              {unansweredCount > 1 ? "s" : ""}.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border px-6 py-2 transition hover:bg-gray-100 disabled:opacity-50"
          >
            Continue Quiz
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(SubmitConfirmModal);