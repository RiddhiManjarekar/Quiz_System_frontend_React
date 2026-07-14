import { useNavigate, useParams } from "react-router-dom";

import { useQuiz } from "../../hooks/useStudentQuiz";
import {
  useCheckExistingAttempt,
  useResumeAttempt,
  useStartQuiz,
} from "../../hooks/useQuizAttempt";

function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const { data: quiz, isLoading } = useQuiz(quizId);
  const { data: existingAttempt, isLoading: checkingAttempt } =
    useCheckExistingAttempt(quizId);
  const { mutateAsync: resumeQuiz, isPending: isResuming } = useResumeAttempt();
  const { mutateAsync: startQuiz, isPending } = useStartQuiz();

  const handleStart = async () => {
    try {
      const attempt = await startQuiz(quiz.id);

      navigate(`/student/attempts/${attempt.attemptId}`, {
        state: {
          quiz,
          attempt,
          remainingSeconds: quiz.durationMinutes * 60,
        },
      });
    } catch (error) {
      console.error("Failed to start quiz:", error);
      alert("Failed to start quiz. Please try again.");
    }
  };

  // QuizPage.jsx - handleResume
const handleResume = async () => {
  try {
    const resumedAttempt = await resumeQuiz(existingAttempt.attemptId);
    
    navigate(`/student/attempts/${resumedAttempt.attemptId}`, {
      state: {
        quiz: resumedAttempt.quiz || quiz,
        attempt: {
          attemptId: resumedAttempt.attemptId,
        },
        remainingSeconds: resumedAttempt.remainingSeconds, // ✅ Server returns actual remaining time
      },
    });
  } catch (error) {
    console.error("Failed to resume quiz:", error);
    alert("Failed to resume quiz. Please try again.");
  }
};

  if (isLoading || checkingAttempt) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading quiz...</h2>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-600">Quiz not found.</h2>
          <button
            onClick={() => navigate("/student/quizzes")}
            className="mt-4 rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const hasExistingAttempt = existingAttempt?.exists;
  const canAttempt = quiz.status === "PUBLISHED" || quiz.status === "ACTIVE";
  const isUpcoming = quiz.startTime && new Date(quiz.startTime) > new Date();
  const isExpired = quiz.endTime && new Date(quiz.endTime) < new Date();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}

      <div>
        <button
          onClick={() => navigate("/student/quizzes")}
          className="mb-4 text-green-600 hover:underline flex items-center gap-2"
        >
          ← Back to Available Quizzes
        </button>

        <h1 className="text-3xl font-bold">{quiz.title}</h1>

        <p className="mt-3 text-gray-600">{quiz.description}</p>

        {/* Quiz Status Badge */}
        <div className="mt-3 flex gap-2">
          {!canAttempt && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
              {isUpcoming ? "Upcoming" : isExpired ? "Expired" : "Unavailable"}
            </span>
          )}
          {hasExistingAttempt && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
              In Progress
            </span>
          )}
        </div>
      </div>

      {/* Details */}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-lg bg-white p-5 shadow">
          <h3 className="mb-3 text-lg font-semibold">Quiz Details</h3>

          <div className="space-y-2 text-gray-700">
            <p className="flex justify-between">
              <strong>Total Marks:</strong>
              <span>{quiz.totalMarks}</span>
            </p>

            <p className="flex justify-between">
              <strong>Passing Marks:</strong>
              <span>{quiz.passingMarks}</span>
            </p>

            <p className="flex justify-between">
              <strong>Duration:</strong>
              <span>{quiz.durationMinutes} Minutes</span>
            </p>

            <p className="flex justify-between">
              <strong>Questions:</strong>
              <span>{quiz.questions?.length || 0}</span>
            </p>

            {quiz.startTime && (
              <p className="flex justify-between">
                <strong>Starts:</strong>
                <span>{new Date(quiz.startTime).toLocaleString()}</span>
              </p>
            )}

            {quiz.endTime && (
              <p className="flex justify-between">
                <strong>Ends:</strong>
                <span>{new Date(quiz.endTime).toLocaleString()}</span>
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow">
          <h3 className="mb-3 text-lg font-semibold">Instructions</h3>

          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>Read every question carefully before answering.</li>
            <li>Submit your answers before the timer ends.</li>
            <li>Do not refresh or close the page during the quiz.</li>
            <li>Your progress will be saved automatically.</li>
            <li>Once submitted, answers cannot be changed.</li>
            <li>Make sure you have a stable internet connection.</li>
          </ul>
        </div>
      </div>

      {/* Existing Attempt Warning */}

      {hasExistingAttempt && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-amber-700">
                You have an ongoing attempt.
              </h3>
              <p className="mt-1 text-sm text-gray-700">
                Continue your quiz from where you left off. You have{" "}
                <strong>{existingAttempt.remainingSeconds || "some"}</strong>{" "}
                minutes remaining.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}

      <div className="rounded-lg bg-white p-6 text-center shadow">
        {!canAttempt ? (
          <div className="text-gray-500">
            <p className="text-lg">
              {isUpcoming 
                ? "This quiz hasn't started yet." 
                : isExpired 
                ? "This quiz has expired." 
                : "This quiz is not available."}
            </p>
          </div>
        ) : hasExistingAttempt ? (
          <button
            onClick={handleResume}
            disabled={isResuming}
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isResuming ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></span>
                Resuming...
              </>
            ) : (
              "Resume Quiz"
            )}
          </button>
        ) : (
          <button
            onClick={handleStart}
            disabled={isPending}
            className="rounded-lg bg-green-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isPending ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></span>
                Starting...
              </>
            ) : (
              "Start Quiz"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizPage;