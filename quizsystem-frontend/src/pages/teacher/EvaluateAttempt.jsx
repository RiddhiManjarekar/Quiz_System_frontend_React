import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast
 from "react-hot-toast";
import {
  useEvaluationAttempt,
  useEvaluateAnswer,
} from "../../hooks/useTeacherEvaluation";

function EvaluateAttempt() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useEvaluationAttempt(attemptId);

  const {
    mutateAsync: evaluateAnswer,
    isPending,
  } = useEvaluateAnswer();

  const [marks, setMarks] = useState({});

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading evaluation...
        </h2>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (isError || !data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-red-600 font-semibold">
          {error?.response?.data?.message || "Evaluation not found"}
        </h2>
      </div>
    );
  }

  const handleSave = async (answer) => {
    const enteredMarks = Number(
      marks[answer.studentAnswerId]
    );

    if (isNaN(enteredMarks)) {
      alert("Enter valid marks.");
      return;
    }

    if (
      enteredMarks < 0 ||
      enteredMarks > answer.questionMarks
    ) {
      alert(
        `Marks must be between 0 and ${answer.questionMarks}`
      );
      return;
    }

    try {
      await evaluateAnswer({
        studentAnswerId: answer.studentAnswerId,
        attemptId: data.attemptId,
        marksObtained: enteredMarks,
      });

      toast.success("Answer evaluated successfully.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to evaluate answer."
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      {/* Header */}

      <div>

        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-green-600 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold">
          Evaluate Attempt
        </h1>

      </div>

      {/* Summary */}

      <div className="grid gap-4 md:grid-cols-4">

        <div className="rounded-lg bg-white p-4 shadow">
          <h4 className="text-gray-500">
            Student
          </h4>

          <p className="font-semibold">
            {data.studentName}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h4 className="text-gray-500">
            Quiz
          </h4>

          <p className="font-semibold">
            {data.quizTitle}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h4 className="text-gray-500">
            Current Score
          </h4>

          <p className="font-semibold">
            {data.currentScore}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h4 className="text-gray-500">
            Total Marks
          </h4>

          <p className="font-semibold">
            {data.totalMarks}
          </p>
        </div>

      </div>

      {/* Answers */}

      <div className="space-y-6">

        {data.answers.map((answer, index) => (

          <div
            key={answer.studentAnswerId}
            className="rounded-xl bg-white p-6 shadow"
          >

            <h2 className="text-lg font-semibold">
              Question {index + 1}
            </h2>

            <p className="mt-3">
              {answer.questionText}
            </p>

            <div className="mt-5 rounded-lg bg-gray-100 p-4">

              <h4 className="font-medium mb-2">
                Student Answer
              </h4>

              <p className="whitespace-pre-wrap">
                {answer.answer}
              </p>

            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">

              <div>

                <label className="block text-sm font-medium mb-1">
                  Marks
                </label>

                <input
                  type="number"
                  min={0}
                  max={answer.questionMarks}
                  value={
                    marks[answer.studentAnswerId] ??
                    answer.marksObtained ??
                    ""
                  }
                  onChange={(e) =>
                    setMarks((prev) => ({
                      ...prev,
                      [answer.studentAnswerId]:
                        e.target.value,
                    }))
                  }
                  className="w-28 rounded-lg border border-gray-300 p-2 text-center"
                />

              </div>

              <button
                onClick={() => handleSave(answer)}
                disabled={
                  isPending ||
                  answer.marksObtained !== null
                }
                className="mt-6 rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
              >
                {answer.marksObtained !== null
                  ? "✓ Evaluated"
                  : "Save Marks"}
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default EvaluateAttempt;