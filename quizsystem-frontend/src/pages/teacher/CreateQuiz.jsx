import { useNavigate } from "react-router-dom";

import QuizForm from "../../components/teacher/quiz/QuizForm";
import { useCreateQuiz } from "../../hooks/useTeacherQuiz";
import { ArrowLeft } from "lucide-react";

function CreateQuiz() {
  const navigate = useNavigate();

  const {
    mutateAsync: createQuiz,
    isPending,
  } = useCreateQuiz();

  const handleSubmit = async (data) => {
    try {
      await createQuiz(data);

      navigate("/teacher/quizzes");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button
  onClick={() => navigate("/teacher/quizzes")}
  className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800"
>
  <ArrowLeft size={20} />
  Back to Quizzes
</button>
        <div>
          <h1 className="text-3xl font-bold">
            Create Quiz
          </h1>

          <p className="mt-1 text-gray-500">
            Create a new quiz for your students.
          </p>
        </div>
      </div>

      <QuizForm
        onSubmit={handleSubmit}
        loading={isPending}
        buttonText="Create Quiz"
      />
    </div>
  );
}

export default CreateQuiz;