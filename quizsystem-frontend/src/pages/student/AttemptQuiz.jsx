import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useSubmitQuiz } from "../../hooks/useQuizAttempt";
import useNavigationGuard from "../../hooks/useNavigationGuard";
import useQuizTimer from "../../hooks/useQuizTimer";

import QuestionCard from "../../components/quiz/QuestionCard";
import QuestionPalette from "../../components/quiz/QuestionPalette";
import ReviewModal from "../../components/quiz/ReviewModal";
import SubmitConfirmModal from "../../components/quiz/SubmitConfirmModal";

function AttemptQuiz() {
  /*
  |--------------------------------------------------------------------------
  | Router
  |--------------------------------------------------------------------------
  */

  const location = useLocation();
  const navigate = useNavigate();

  const {
    quiz,
    attempt,
    remainingSeconds: serverRemainingSeconds,
  } = location.state || {};

  /*
  |--------------------------------------------------------------------------
  | Mutation
  |--------------------------------------------------------------------------
  */

  const {
    mutateAsync: submitQuiz,
    isPending,
  } = useSubmitQuiz();

  /*
  |--------------------------------------------------------------------------
  | Navigation Guard
  |--------------------------------------------------------------------------
  */

  useNavigationGuard(true);

  /*
  |--------------------------------------------------------------------------
  | States
  |--------------------------------------------------------------------------
  */

  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState("saved");

  /*
  |--------------------------------------------------------------------------
  | Timer
  | Server remains source of truth.
  |--------------------------------------------------------------------------
  */

  const {
    remainingSeconds,
    formattedTime,
    progressPercentage: timerProgress,
    isWarning,
    isCritical,
  } = useQuizTimer({
    initialSeconds: serverRemainingSeconds ?? quiz?.durationMinutes * 60,
    onExpire: () => {
      if (autoSubmitted.current) return;
      autoSubmitted.current = true;
      handleSubmit(false);
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Refs
  |--------------------------------------------------------------------------
  */

  const autoSubmitted = useRef(false);
  const channelRef = useRef(null);
  const instanceId = useRef(crypto.randomUUID());

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  if (!quiz || !attempt) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold text-red-600">
          Quiz data not found.
        </h2>
        <button
          type="button"
          onClick={() => navigate("/student/dashboard")}
          className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Questions
  |--------------------------------------------------------------------------
  */

  const sortedQuestions = useMemo(() => {
    return [...quiz.questions].sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
  }, [quiz.questions]);

  // =============================================
  // ❌ REMOVE THIS BLOCK - It will cause an error
  // =============================================
  /*
  useEffect(() => {
    const validateAttempt = async () => {
      try {
        const isValid = await checkAttemptStatus(attempt.attemptId);
        if (!isValid) {
          alert("This attempt is no longer valid.");
          navigate("/student/dashboard");
        }
      } catch (error) {
        console.error("Failed to validate attempt:", error);
      }
    };
    
    validateAttempt();
  }, [attempt.attemptId, navigate]);
  */

  /*
  |--------------------------------------------------------------------------
  | Multi Tab Lock
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const lockKey = `quiz-lock-${attempt.attemptId}`;

    if (localStorage.getItem(lockKey)) {
      alert("This quiz is already open in another tab.");
      navigate("/student/dashboard");
      return;
    }

    localStorage.setItem(lockKey, instanceId.current);

    return () => {
      if (localStorage.getItem(lockKey) === instanceId.current) {
        localStorage.removeItem(lockKey);
      }
    };
  }, [attempt.attemptId, navigate]);

  /*
  |--------------------------------------------------------------------------
  | Broadcast Channel
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const hasBroadcast = typeof BroadcastChannel !== "undefined";
    if (!hasBroadcast) return;

    const channel = new BroadcastChannel(`quiz-${attempt.attemptId}`);
    channelRef.current = channel;

    channel.postMessage({
      type: "OPEN",
      id: instanceId.current,
    });

    channel.onmessage = (event) => {
      if (event.data.type === "OPEN" && event.data.id !== instanceId.current) {
        alert("Quiz already opened in another tab.");
        navigate("/student/dashboard");
      }
    };

    return () => {
      channel.close();
    };
  }, [attempt.attemptId, navigate]);

  /*
  |--------------------------------------------------------------------------
  | Restore Session
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const saved = sessionStorage.getItem(`quiz-${attempt.attemptId}`);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers || {});
      setCurrentQuestion(parsed.currentQuestion ?? 0);

      setTimeout(() => {
        const element = document.getElementById(
          `question-${sortedQuestions[parsed.currentQuestion ?? 0]?.id}`
        );
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 200);
    } catch (error) {
      console.error("Failed to restore session:", error);
    }
  }, [attempt.attemptId, sortedQuestions]);

  /*
  |--------------------------------------------------------------------------
  | Save Session (Debounced)
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setSaveStatus("saving");

    const timeout = setTimeout(() => {
      sessionStorage.setItem(
        `quiz-${attempt.attemptId}`,
        JSON.stringify({
          answers,
          currentQuestion,
        })
      );
      setSaveStatus("saved");
    }, 300);

    return () => {
      clearTimeout(timeout);
      setSaveStatus("saved");
    };
  }, [answers, currentQuestion, attempt.attemptId]);

  /*
  |--------------------------------------------------------------------------
  | Answer Count
  |--------------------------------------------------------------------------
  */

  const answeredCount = useMemo(() => {
    return sortedQuestions.filter((question) => {
      const answer = answers[question.id];
      if (!answer) return false;

      if (question.questionType === "DESCRIPTIVE") {
        return answer.descriptiveAnswer && answer.descriptiveAnswer.trim() !== "";
      }

      return answer.selectedOptionIds && answer.selectedOptionIds.length > 0;
    }).length;
  }, [answers, sortedQuestions]);

  /*
  |--------------------------------------------------------------------------
  | Progress
  |--------------------------------------------------------------------------
  */

  const progressPercentage = useMemo(() => {
    if (!sortedQuestions.length) return 0;
    return (answeredCount / sortedQuestions.length) * 100;
  }, [answeredCount, sortedQuestions.length]);

  /*
  |--------------------------------------------------------------------------
  | Build Payload
  |--------------------------------------------------------------------------
  */

  const buildPayload = useCallback(() => {
    return {
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        ...answer,
      })),
    };
  }, [answers]);

  /*
  |--------------------------------------------------------------------------
  | Submit Quiz
  |--------------------------------------------------------------------------
  */

  const handleSubmit = useCallback(
    async (askConfirmation = true) => {
      if (autoSubmitted.current || isPending) {
        return;
      }

      if (askConfirmation) {
        setShowSubmitConfirm(true);
        return;
      }

      setShowSubmitConfirm(false);
      autoSubmitted.current = true;

      try {
        const result = await submitQuiz({
          attemptId: attempt.attemptId,
          data: buildPayload(),
        });

        sessionStorage.removeItem(`quiz-${attempt.attemptId}`);
        localStorage.removeItem(`quiz-lock-${attempt.attemptId}`);
        channelRef.current?.close();

        navigate(`/student/results/${result.attemptId}`);
      } catch (error) {
        autoSubmitted.current = false;
        console.error("Failed to submit quiz:", error);
        alert("Failed to submit quiz. Please try again.");
      }
    },
    [attempt, buildPayload, navigate, submitQuiz, isPending]
  );

  /*
  |--------------------------------------------------------------------------
  | Single Choice
  |--------------------------------------------------------------------------
  */

  const handleSingleChoice = useCallback((questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedOptionIds: [optionId],
      },
    }));
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Multiple Choice
  |--------------------------------------------------------------------------
  */

  const handleMultipleChoice = useCallback((questionId, optionId) => {
    setAnswers((prev) => {
      const previous = prev[questionId]?.selectedOptionIds || [];
      const updated = previous.includes(optionId)
        ? previous.filter((id) => id !== optionId)
        : [...previous, optionId];

      return {
        ...prev,
        [questionId]: {
          selectedOptionIds: updated,
        },
      };
    });
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Descriptive
  |--------------------------------------------------------------------------
  */

  const handleDescriptive = useCallback((questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        descriptiveAnswer: value,
      },
    }));
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Jump To Question
  |--------------------------------------------------------------------------
  */

  const handleJump = useCallback(
    (index) => {
      setCurrentQuestion(index);

      setTimeout(() => {
        const element = document.getElementById(
          `question-${sortedQuestions[index]?.id}`
        );
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    },
    [sortedQuestions]
  );

  /*
  |--------------------------------------------------------------------------
  | Detect Tab Switch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          if (next >= 3) {
            alert("You have switched tabs 3 times. Quiz will be auto-submitted.");
            handleSubmit(false);
          }
          return next;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [handleSubmit]);

  /*
  |--------------------------------------------------------------------------
  | Prevent Copy / Paste
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const prevent = (event) => {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };

    const events = ["copy", "cut", "paste", "contextmenu"];
    events.forEach((event) => {
      document.addEventListener(event, prevent);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, prevent);
      });
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Keyboard Shortcuts
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handler = (event) => {
      // Block F5, F12
      if (event.key === "F5" || event.key === "F12") {
        event.preventDefault();
        return;
      }

      // Block Ctrl+R, Ctrl+P, Ctrl+S
      if (event.ctrlKey && ["r", "p", "s"].includes(event.key.toLowerCase())) {
        event.preventDefault();
        return;
      }

      // Block Ctrl+Shift+I, Ctrl+Shift+C
      if (event.ctrlKey && event.shiftKey && ["i", "c"].includes(event.key.toLowerCase())) {
        event.preventDefault();
        return;
      }

      // Block Ctrl+U
      if (event.ctrlKey && event.key.toLowerCase() === "u") {
        event.preventDefault();
        return;
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Disable scrolling when modal is open
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (reviewOpen || showSubmitConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [reviewOpen, showSubmitConfirm]);

  /*
  |--------------------------------------------------------------------------
  | JSX
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <ReviewModal
        open={reviewOpen}
        questions={sortedQuestions}
        answers={answers}
        onClose={() => setReviewOpen(false)}
        onJump={handleJump}
        onSubmit={() => handleSubmit(false)}
        isSubmitting={isPending}
      />

      <SubmitConfirmModal
        open={showSubmitConfirm}
        answeredCount={answeredCount}
        totalQuestions={sortedQuestions.length}
        onConfirm={() => handleSubmit(false)}
        onCancel={() => setShowSubmitConfirm(false)}
        isSubmitting={isPending}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        {/* Header */}
        <div className="sticky top-0 z-30 rounded-xl bg-white shadow-lg">
          <div className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {quiz.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {quiz.description || "Quiz in progress"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">⏱</span>
                  <span
                    className={`font-mono text-lg font-bold ${
                      isCritical
                        ? "text-red-600 animate-pulse"
                        : isWarning
                        ? "text-orange-500"
                        : "text-green-600"
                    }`}
                  >
                    {formattedTime}
                  </span>
                </div>

                <div className="hidden sm:block w-32">
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-600 transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="mt-1 text-right text-xs text-gray-500">
                    {Math.round(progressPercentage)}%
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {sortedQuestions.length}
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      saveStatus === "saved" ? "bg-green-500" : "bg-yellow-500 animate-pulse"
                    }`}
                  />
                  <span className="text-gray-500">
                    {saveStatus === "saved" ? "Saved" : "Saving..."}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 sm:hidden">
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-600 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>{Math.round(progressPercentage)}% Complete</span>
                <span>
                  {answeredCount}/{sortedQuestions.length} Answered
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            {sortedQuestions.length > 0 && (
              <QuestionCard
                key={sortedQuestions[currentQuestion].id}
                question={sortedQuestions[currentQuestion]}
                index={currentQuestion}
                answer={answers[sortedQuestions[currentQuestion].id]}
                isActive={true}
                onSingleChoice={handleSingleChoice}
                onMultipleChoice={handleMultipleChoice}
                onDescriptive={handleDescriptive}
              />
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                disabled={currentQuestion === 0 || isPending}
                onClick={() => handleJump(currentQuestion - 1)}
                className="rounded-lg border px-6 py-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ← Previous
              </button>

              <button
                type="button"
                disabled={currentQuestion === sortedQuestions.length - 1 || isPending}
                onClick={() => handleJump(currentQuestion + 1)}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-5 lg:sticky lg:top-32">
              <QuestionPalette
                questions={sortedQuestions}
                answers={answers}
                currentQuestion={currentQuestion}
                onJump={handleJump}
                disabled={isPending}
              />

              <div className="rounded-xl bg-white p-5 shadow">
                <h3 className="mb-4 text-lg font-semibold">Quiz Actions</h3>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setReviewOpen(true)}
                    disabled={isPending}
                    className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    Review Answers
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleSubmit(true)}
                    className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {isPending ? "Submitting..." : "Submit Quiz"}
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-white p-5 shadow">
                <h3 className="mb-4 text-lg font-semibold">Quiz Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total Questions</span>
                    <span className="font-medium">{sortedQuestions.length}</span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Answered</span>
                    <span className="font-medium">{answeredCount}</span>
                  </div>

                  <div className="flex justify-between text-red-600">
                    <span>Remaining</span>
                    <span className="font-medium">
                      {sortedQuestions.length - answeredCount}
                    </span>
                  </div>

                  <div className="flex justify-between text-blue-600">
                    <span>Completion</span>
                    <span className="font-medium">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AttemptQuiz;