import React from "react";

function QuestionCard({
  question,
  index,
  answer,
  isActive = false,
  onSingleChoice,
  onMultipleChoice,
  onDescriptive,
}) {
  return (
    <div
      id={`question-${question.id}`}
      className={`rounded-xl bg-white p-6 shadow transition-all duration-200 ${
        isActive
          ? "ring-2 ring-green-500"
          : ""
      }`}
    >
      {/* Header */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Q{index + 1}. {question.questionText}
        </h2>

        <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          {question.marks} Marks
        </span>
      </div>

      {/* SINGLE CHOICE / TRUE FALSE */}

      {(question.questionType ===
        "SINGLE_CHOICE" ||
        question.questionType ===
          "TRUE_FALSE") && (
        <div className="space-y-3">
          {question.options.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition hover:bg-gray-50"
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={
                  answer?.selectedOptionIds?.includes(
                    option.id
                  ) || false
                }
                onChange={() =>
                  onSingleChoice(
                    question.id,
                    option.id
                  )
                }
              />

              <span>{option.optionText}</span>
            </label>
          ))}
        </div>
      )}

      {/* MULTIPLE CHOICE */}

      {question.questionType ===
        "MULTIPLE_CHOICE" && (
        <div className="space-y-3">
          {question.options.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={
                  answer?.selectedOptionIds?.includes(
                    option.id
                  ) || false
                }
                onChange={() =>
                  onMultipleChoice(
                    question.id,
                    option.id
                  )
                }
              />

              <span>{option.optionText}</span>
            </label>
          ))}
        </div>
      )}

      {/* DESCRIPTIVE */}

      {question.questionType ===
        "DESCRIPTIVE" && (
        <textarea
          rows={6}
          placeholder="Write your answer here..."
          className="w-full rounded-lg border p-3 focus:border-green-500 focus:outline-none"
          value={
            answer?.descriptiveAnswer || ""
          }
          onChange={(e) =>
            onDescriptive(
              question.id,
              e.target.value
            )
          }
        />
      )}
    </div>
  );
}

export default React.memo(QuestionCard);