import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { questionSchema } from "../../../utils/questionSchema";

function QuestionForm({
  defaultValues = {},
  onSubmit,
  loading = false,
  isEdit = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(questionSchema),

    defaultValues: {
      questionText: "",
      questionType: "",
      marks: "",
      negativeMarks: 0,
      displayOrder: "",
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Populate Edit Form
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!defaultValues?.id) return;

    reset({
      questionText: defaultValues.questionText ?? "",
      questionType: defaultValues.questionType ?? "",
      marks: defaultValues.marks ?? "",
      negativeMarks: defaultValues.negativeMarks ?? 0,
      displayOrder: defaultValues.displayOrder ?? "",
    });
  }, [defaultValues, reset]);

  const questionType = watch("questionType");

  return (
    <div className="max-w-4xl mx-auto">

      <h2 className="mb-8 text-3xl font-bold text-gray-800">
        {isEdit ? "Edit Question" : "Create Question"}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-2xl bg-white p-6 shadow-lg md:p-8"
      >
        {/* Question */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Question
          </label>

          <textarea
            rows={5}
            placeholder="Enter question"
            disabled={loading}
            {...register("questionText")}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
          />

          {errors.questionText && (
            <p className="mt-1 text-sm text-red-500">
              {errors.questionText.message}
            </p>
          )}
        </div>

        {/* Question Type */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Question Type
          </label>

          <select
            disabled={loading}
            {...register("questionType")}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
          >
            <option value="">
              Select Question Type
            </option>

            <option value="SINGLE_CHOICE">
              Single Choice
            </option>

            <option value="MULTIPLE_CHOICE">
              Multiple Choice
            </option>

            <option value="TRUE_FALSE">
              True / False
            </option>

            <option value="DESCRIPTIVE">
              Descriptive
            </option>
          </select>

          {errors.questionType && (
            <p className="mt-1 text-sm text-red-500">
              {errors.questionType.message}
            </p>
          )}
        </div>

        {/* Marks */}

        <div className="grid gap-6 md:grid-cols-3">

          <div>

            <label className="mb-2 block font-medium text-gray-700">
              Marks
            </label>

            <input
              type="number"
              min={1}
              step="0.5"
              disabled={loading}
              {...register("marks", {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
            />

            {errors.marks && (
              <p className="mt-1 text-sm text-red-500">
                {errors.marks.message}
              </p>
            )}

          </div>

          <div>

            <label className="mb-2 block font-medium text-gray-700">
              Negative Marks
            </label>

            <input
              type="number"
              min={0}
              step="0.5"
              disabled={loading}
              {...register("negativeMarks", {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
            />

            {errors.negativeMarks && (
              <p className="mt-1 text-sm text-red-500">
                {errors.negativeMarks.message}
              </p>
            )}

          </div>

          <div>

            <label className="mb-2 block font-medium text-gray-700">
              Display Order
            </label>

            <input
              type="number"
              min={1}
              disabled={loading}
              {...register("displayOrder", {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
            />

            {errors.displayOrder && (
              <p className="mt-1 text-sm text-red-500">
                {errors.displayOrder.message}
              </p>
            )}

          </div>

        </div>

        {/* Info */}

        {questionType === "DESCRIPTIVE" && (
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
            Descriptive questions do not support answer options.
          </div>
        )}

        {/* Buttons */}

        <div className="flex justify-end gap-4">

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Question"
              : "Create Question"}
          </button>

        </div>
      </form>
    </div>
  );
}

export default QuestionForm;