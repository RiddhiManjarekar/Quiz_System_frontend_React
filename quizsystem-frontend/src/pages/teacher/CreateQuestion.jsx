import { useNavigate, useParams } from "react-router-dom";

import QuestionForm from "../../components/teacher/question/QuestionForm";
import { useCreateQuestion } from "../../hooks/useTeacherQuestion";

function CreateQuestion() {
  const navigate = useNavigate();

  const { quizId } = useParams();

  const {
    mutateAsync: createQuestion,
    isPending,
  } = useCreateQuestion();

  const handleSubmit = async (formData) => {
    try {
      await createQuestion({
        quizId,
        data: formData,
      });

      navigate(`/teacher/quizzes/${quizId}/questions`);
    } catch (error) {
      console.error(error);
    }
  };

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
          Create Question
        </h1>

        <p className="mt-2 text-gray-500">
          Add a new question to this quiz.
        </p>

      </div>

      <QuestionForm
        onSubmit={handleSubmit}
        loading={isPending}
        isEdit={false}
      />

    </div>
  );
}

export default CreateQuestion;