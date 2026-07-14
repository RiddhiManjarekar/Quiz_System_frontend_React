import React from "react";

function QuestionPalette({
  questions,
  answers,
  currentQuestion,
  onJump,
  disabled = false,
}) {
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

  return (
    <div className="rounded-xl bg-white p-5 shadow lg:sticky lg:top-6">
      <h3 className="mb-4 text-lg font-semibold">Question Palette</h3>

      {/* Summary */}
      <div className="mb-5 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-medium">{questions.length}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Answered</span>
          <span className="font-medium">{answeredCount}</span>
        </div>

        <div className="flex justify-between text-red-500">
          <span>Remaining</span>
          <span className="font-medium">{questions.length - answeredCount}</span>
        </div>
      </div>

      {/* Palette */}
      <div className="grid grid-cols-5 gap-3">
        {questions.map((question, index) => {
          const answered = isAnswered(question);
          const active = currentQuestion === index;

          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onJump(index)}
              disabled={disabled}
              className={`
                h-11 w-11 rounded-lg font-semibold transition-all
                ${
                  active
                    ? "ring-2 ring-blue-600 ring-offset-2"
                    : ""
                }
                ${
                  answered
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
                ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              `}
              title={`Question ${index + 1} - ${answered ? "Answered" : "Unanswered"}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-green-600"></span>
          <span>Answered</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-gray-200"></span>
          <span>Unanswered</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded border-2 border-blue-600"></span>
          <span>Current Question</span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(QuestionPalette);