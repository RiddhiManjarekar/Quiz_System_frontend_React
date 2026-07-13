import { useNavigate, useParams } from "react-router-dom";

import OptionForm from "../../components/teacher/option/OptionForm";
import {
  useOption,
  useUpdateOption,
} from "../../hooks/useTeacherOption";

function EditOption() {
  const navigate = useNavigate();

  const { quizId, questionId, optionId } = useParams();

  const {
    data: option,
    isLoading,
  } = useOption(optionId);

  const {
    mutateAsync: updateOption,
    isPending,
  } = useUpdateOption();

  const handleUpdate = async (formData) => {
    try {
      await updateOption({
        optionId,
        questionId,
        data: formData,
      });

      navigate(
        `/teacher/quizzes/${quizId}/questions/${questionId}/options`
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading option...
        </h2>
      </div>
    );
  }

  if (!option) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h2 className="text-xl text-red-600">
          Option not found.
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">

      <div className="mb-8">

        <button
          onClick={() =>
            navigate(
              `/teacher/quizzes/${quizId}/questions/${questionId}/options`
            )
          }
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Options
        </button>

        <h1 className="text-3xl font-bold">
          Edit Option
        </h1>

        <p className="mt-2 text-gray-500">
          Update option details below.
        </p>

      </div>

      <OptionForm
        defaultValues={option}
        onSubmit={handleUpdate}
        loading={isPending}
        isEdit={true}
      />

    </div>
  );
}

export default EditOption;