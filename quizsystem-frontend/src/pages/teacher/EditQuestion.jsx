import { useNavigate, useParams } from "react-router-dom";

import QuestionForm from "../../components/teacher/question/QuestionForm";
import {
  useQuestion,
  useUpdateQuestion,
} from "../../hooks/useTeacherQuestion";

function EditQuestion() {
  const { quizId,questionId } = useParams();

  const navigate = useNavigate();

  const {
    data: question,
    isLoading,
  } = useQuestion(questionId);

  const {
    mutateAsync: updateQuestion,
    isPending,
  } = useUpdateQuestion();

  const handleUpdate = async (formData) => {
    try {
      await updateQuestion({quizId,
         questionId,
        data: formData,
      });

      navigate(`/teacher/quizzes/${quizId}/questions`);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading question...
        </h2>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h2 className="text-xl text-red-600">
          Question not found.
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">

      <div className="mb-8">

        <button
          onClick={() =>
            navigate(`/teacher/quizzes/${quizId}/questions`)
          }
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Questions
        </button>

        <h1 className="text-3xl font-bold">
          Edit Question
        </h1>

        <p className="mt-2 text-gray-500">
          Update question details below.
        </p>

      </div>

      <QuestionForm
        defaultValues={question}
        onSubmit={handleUpdate}
        loading={isPending}
        isEdit={true}
      />

    </div>
  );
}

export default EditQuestion;