import { useNavigate, useParams } from "react-router-dom";

import QuizForm from "../../components/teacher/quiz/QuizForm";
import { useQuiz, useUpdateQuiz } from "../../hooks/useTeacherQuiz";
import { ArrowLeft } from "lucide-react";

function EditQuiz() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { data: quiz, isLoading } = useQuiz(id);

  const { mutateAsync: updateQuiz, isPending } = useUpdateQuiz();

  

  const handleUpdate = async (formData) => {
    try {
      await updateQuiz({
        id,
        data: formData,
      });

      navigate("/teacher/quizzes");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-xl font-semibold">Loading quiz...</h2>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-xl text-red-600">Quiz not found.</h2>
      </div>
    );
  }

  return (
    
    <div className="max-w-5xl mx-auto">
            <button
  onClick={() => navigate("/teacher/quizzes")}
  className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800"
>
  <ArrowLeft size={20} />
  Back to Quizzes
</button>
      <div className="mb-8">
  
        <h1 className="text-3xl font-bold">Edit Quiz</h1>

        <p className="text-gray-500 mt-2">Update quiz details below.</p>
      </div>

      <QuizForm
        defaultValues={quiz}
        onSubmit={handleUpdate}
        loading={isPending}
        isEdit={true}
      />
    </div>
  );
}

export default EditQuiz;
