import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { quizSchema } from "../../../utils/quizSchema";

function QuizForm({
  defaultValues = {},
  onSubmit,
  loading = false,
  isEdit = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quizSchema),

    defaultValues: {
      title: "",
      description: "",
      durationMinutes: "",
      passingMarks: "",
      startTime: "",
      endTime: "",
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
      ...defaultValues,

      durationMinutes: defaultValues.durationMinutes ?? "",

      passingMarks: defaultValues.passingMarks ?? "",

      startTime: defaultValues.startTime
        ? defaultValues.startTime.slice(0, 16)
        : "",

      endTime: defaultValues.endTime
        ? defaultValues.endTime.slice(0, 16)
        : "",
    });
  }, [defaultValues, reset]);

  return (
    <div className="max-w-4xl mx-auto">

      {/* <h2 className="mb-8 text-3xl font-bold text-gray-800">
        {isEdit ? "Edit Quiz" : "Create Quiz"}
      </h2> */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-2xl bg-white p-6 shadow-lg md:p-8"
      >
        {/* Title */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Quiz Title
          </label>

          <input
            type="text"
            placeholder="Enter quiz title"
            disabled={loading}
            {...register("title")}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
          />

          {errors.title && (
            <p className="mt-1 text-sm text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Description
          </label>

          <textarea
            rows={4}
            placeholder="Enter quiz description"
            disabled={loading}
            {...register("description")}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Duration & Passing Marks */}

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium text-gray-700">
              Duration (Minutes)
            </label>

            <input
              type="number"
              min={1}
              placeholder="30"
              disabled={loading}
              {...register("durationMinutes", {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
            />

            {errors.durationMinutes && (
              <p className="mt-1 text-sm text-red-500">
                {errors.durationMinutes.message}
              </p>
            )}

          </div>

          <div>

            <label className="mb-2 block font-medium text-gray-700">
              Passing Marks
            </label>

            <input
              type="number"
              min={0}
              placeholder="20"
              disabled={loading}
              {...register("passingMarks", {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
            />

            {errors.passingMarks && (
              <p className="mt-1 text-sm text-red-500">
                {errors.passingMarks.message}
              </p>
            )}

          </div>

        </div>

        {/* Start Time & End Time */}

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium text-gray-700">
              Start Time
            </label>

            <input
              type="datetime-local"
              disabled={loading}
              {...register("startTime")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
            />

            {errors.startTime && (
              <p className="mt-1 text-sm text-red-500">
                {errors.startTime.message}
              </p>
            )}

          </div>

          <div>

            <label className="mb-2 block font-medium text-gray-700">
              End Time
            </label>

            <input
              type="datetime-local"
              disabled={loading}
              {...register("endTime")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
            />

            {errors.endTime && (
              <p className="mt-1 text-sm text-red-500">
                {errors.endTime.message}
              </p>
            )}

          </div>

        </div>

        {/* Submit Button */}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading
            ? "Saving..."
            : isEdit
            ? "Update Quiz"
            : "Create Quiz"}
        </button>
      </form>
    </div>
  );
}

export default QuizForm;