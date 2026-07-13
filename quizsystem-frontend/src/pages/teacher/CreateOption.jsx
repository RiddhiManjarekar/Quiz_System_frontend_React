import { useNavigate, useParams } from "react-router-dom";

import OptionForm from "../../components/teacher/option/OptionForm";
import { useCreateOption } from "../../hooks/useTeacherOption";

function CreateOption() {
  const navigate = useNavigate();

  const { quizId, questionId } = useParams();

  const {
    mutateAsync: createOption,
    isPending,
  } = useCreateOption();

  const handleSubmit = async (formData) => {
    try {
      await createOption({
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
          Create Option
        </h1>

        <p className="mt-2 text-gray-500">
          Add a new option for this question.
        </p>
      </div>

      <OptionForm
        onSubmit={handleSubmit}
        loading={isPending}
      />
    </div>
  );
}

export default CreateOption;