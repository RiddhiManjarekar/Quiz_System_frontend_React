import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { optionSchema } from "../../../utils/optionSchema";

function OptionForm({
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
    resolver: zodResolver(optionSchema),

    defaultValues: {
      optionText: "",
      correctAnswer: false,
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
      optionText: defaultValues.optionText ?? "",
      correctAnswer: defaultValues.correctAnswer ?? false,
    });
  }, [defaultValues, reset]);

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-8 text-3xl font-bold text-gray-800">
        {isEdit ? "Edit Option" : "Create Option"}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-2xl bg-white p-6 shadow-lg md:p-8"
      >
        {/* Option Text */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Option Text
          </label>

          <input
            type="text"
            placeholder="Enter option text"
            disabled={loading}
            {...register("optionText")}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
          />

          {errors.optionText && (
            <p className="mt-1 text-sm text-red-500">
              {errors.optionText.message}
            </p>
          )}
        </div>

        {/* Correct Answer */}

        <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
          <input
            id="correctAnswer"
            type="checkbox"
            disabled={loading}
            {...register("correctAnswer")}
            className="h-5 w-5 cursor-pointer"
          />

          <label
            htmlFor="correctAnswer"
            className="cursor-pointer font-medium text-gray-700"
          >
            Mark as Correct Answer
          </label>
        </div>

        {errors.correctAnswer && (
          <p className="text-sm text-red-500">
            {errors.correctAnswer.message}
          </p>
        )}

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading
            ? "Saving..."
            : isEdit
            ? "Update Option"
            : "Create Option"}
        </button>
      </form>
    </div>
  );
}

export default OptionForm;