import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import { useSubmitQuiz, useGetAttempt } from "../../hooks/useQuizAttempt";
import useNavigationGuard from "../../hooks/useNavigationGuard";
import useQuizTimer from "../../hooks/useQuizTimer";

import QuestionCard from "../../components/quiz/QuestionCard";
import QuestionPalette from "../../components/quiz/QuestionPalette";
import ReviewModal from "../../components/quiz/ReviewModal";
import SubmitConfirmModal from "../../components/quiz/SubmitConfirmModal";

function AttemptQuiz() {
  /*
  |--------------------------------------------------------------------------
  | Router - All hooks declared first (React Rules of Hooks)
  |--------------------------------------------------------------------------
  */

  const { attemptId } = useParams();
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | API Calls
  |--------------------------------------------------------------------------
  */

  const {
    data: attemptData,
    isLoading: isLoadingAttempt,
    error: attemptError,
  } = useGetAttempt(attemptId);

  /*
  |--------------------------------------------------------------------------
  | Mutation
  |--------------------------------------------------------------------------
  */

  const { mutateAsync: submitQuiz, isPending } = useSubmitQuiz();

  /*
  |--------------------------------------------------------------------------
  | States
  |--------------------------------------------------------------------------
  */

  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [submitted, setSubmitted] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Refs
  |--------------------------------------------------------------------------
  */

  const autoSubmitted = useRef(false);
  const channelRef = useRef(null);
  const instanceId = useRef(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now() + "-" + Math.random(),
  );
  const tabSwitchCount = useRef(0);
  const isFirstRender = useRef(true);

  /*
  |--------------------------------------------------------------------------
  | Extract Data - Backend is source of truth
  |--------------------------------------------------------------------------
  */

  const quiz = attemptData?.quiz;
  const attemptIdValue = attemptData?.attemptId ?? Number(attemptId);
  const serverRemainingSeconds = attemptData?.remainingSeconds;

  /*
  |--------------------------------------------------------------------------
  | Navigation Guard - Uses state instead of ref
  |--------------------------------------------------------------------------
  */

  useNavigationGuard(!submitted && !isPending);

  /*
  |--------------------------------------------------------------------------
  | Questions
  |--------------------------------------------------------------------------
  */

  const sortedQuestions = useMemo(() => {
    if (!quiz?.questions) return [];
    return [...quiz.questions].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [quiz?.questions]);

  /*
  |--------------------------------------------------------------------------
  | Build Payload - Filters out unanswered questions
  |--------------------------------------------------------------------------
  */

  const buildPayload = useCallback(() => {
    const answeredEntries = Object.entries(answers).filter(
      ([questionId, answer]) => {
        if (!answer) return false;
        if (answer.descriptiveAnswer) {
          return answer.descriptiveAnswer.trim() !== "";
        }
        return answer.selectedOptionIds && answer.selectedOptionIds.length > 0;
      },
    );

    return {
      answers: answeredEntries.map(([questionId, answer]) => ({
        questionId: Number(questionId),
        ...answer,
      })),
    };
  }, [answers]);

  /*
  |--------------------------------------------------------------------------
  | Submit Quiz - Declared before timer
  |--------------------------------------------------------------------------
  */

  const handleSubmit = useCallback(
    async (askConfirmation = true) => {
      if (autoSubmitted.current || isPending) return;

      if (askConfirmation) {
        setShowSubmitConfirm(true);
        return;
      }

      setShowSubmitConfirm(false);
      autoSubmitted.current = true;
      setSubmitted(true);

      const loadingToast = toast.loading("Submitting quiz...");
      try {
        const result = await submitQuiz({
          attemptId: attemptIdValue,
          data: buildPayload(),
        });
        toast.success("Quiz submitted successfully!", {
          id: loadingToast,
        });
        sessionStorage.removeItem(`quiz-${attemptIdValue}`);
        localStorage.removeItem(`quiz-lock-${attemptIdValue}`);
        channelRef.current?.close();
        channelRef.current = null;

        navigate(`/student/results/${result.attemptId}`);
      } catch (error) {
        autoSubmitted.current = false;
        setSubmitted(false);
        console.error("Failed to submit quiz:", error);
        toast.error(error.response?.data?.message ?? "Submission failed.", {
          id: loadingToast,
        });
      }
    },
    [attemptIdValue, buildPayload, navigate, submitQuiz, isPending],
  );

  /*
  |--------------------------------------------------------------------------
  | Timer - HandleSubmit is now defined
  |--------------------------------------------------------------------------
  */

  const { formattedTime, isWarning, isCritical } = useQuizTimer({
    initialSeconds: serverRemainingSeconds ?? quiz?.durationMinutes * 60,
    onExpire: () => {
      handleSubmit(false);
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Multi Tab Lock - With timestamp expiry
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!attemptIdValue) return;

    const lockKey = `quiz-lock-${attemptIdValue}`;
    const existingLock = localStorage.getItem(lockKey);

    if (existingLock) {
      try {
        const lockData = JSON.parse(existingLock);
        const lockAge = Date.now() - lockData.timestamp;

        // Expire lock after 30 seconds (browser crash recovery)
        if (lockAge > 30000) {
          localStorage.removeItem(lockKey);
        } else {
          toast.error("This quiz is already open in another tab.", "error");
          navigate("/student/quizzes");
          return;
        }
      } catch {
        localStorage.removeItem(lockKey);
      }
    }

    localStorage.setItem(
      lockKey,
      JSON.stringify({
        instanceId: instanceId.current,
        timestamp: Date.now(),
      }),
    );

    return () => {
      const currentLock = localStorage.getItem(lockKey);
      if (currentLock) {
        try {
          const lockData = JSON.parse(currentLock);
          if (lockData.instanceId === instanceId.current) {
            localStorage.removeItem(lockKey);
          }
        } catch {
          localStorage.removeItem(lockKey);
        }
      }
    };
  }, [attemptIdValue, navigate]);

  /*
  |--------------------------------------------------------------------------
  | Broadcast Channel
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!attemptIdValue) return;

    const hasBroadcast = typeof BroadcastChannel !== "undefined";
    if (!hasBroadcast) return;

    const channel = new BroadcastChannel(`quiz-${attemptIdValue}`);
    channelRef.current = channel;

    channel.postMessage({
      type: "OPEN",
      id: instanceId.current,
    });

    channel.onmessage = (event) => {
      if (event.data.type === "OPEN" && event.data.id !== instanceId.current) {
        toast.error("Quiz already opened in another tab.", "error");
        navigate("/student/quizzes");
      }
    };

    return () => {
      channel.close();
    };
  }, [attemptIdValue, navigate]);

  /*
  |--------------------------------------------------------------------------
  | Restore Session from sessionStorage
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!attemptIdValue) return;

    const saved = sessionStorage.getItem(`quiz-${attemptIdValue}`);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers || {});
      setCurrentQuestion(parsed.currentQuestion ?? 0);
    } catch (error) {
      console.error("Failed to restore session:", error);
    }
  }, [attemptIdValue]);

  /*
  |--------------------------------------------------------------------------
  | Save Session (Debounced - 800ms) - Skips first render
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!attemptIdValue) return;

    // Skip first render to avoid "Saving..." on mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus("saving");

    const timeout = setTimeout(() => {
      sessionStorage.setItem(
        `quiz-${attemptIdValue}`,
        JSON.stringify({
          answers,
          currentQuestion,
        }),
      );
      setSaveStatus("saved");
    }, 800);

    return () => {
      clearTimeout(timeout);
      setSaveStatus("saved");
    };
  }, [answers, currentQuestion, attemptIdValue]);

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
        return (
          answer.descriptiveAnswer && answer.descriptiveAnswer.trim() !== ""
        );
      }

      return answer.selectedOptionIds && answer.selectedOptionIds.length > 0;
    }).length;
  }, [answers, sortedQuestions]);

  /*
  |--------------------------------------------------------------------------
  | Answer Progress
  |--------------------------------------------------------------------------
  */

  const answerProgress = useMemo(() => {
    if (!sortedQuestions.length) return 0;
    return (answeredCount / sortedQuestions.length) * 100;
  }, [answeredCount, sortedQuestions.length]);

  /*
  |--------------------------------------------------------------------------
  | Answer Handlers
  |--------------------------------------------------------------------------
  */

  const handleSingleChoice = useCallback((questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { selectedOptionIds: [optionId] },
    }));
  }, []);

  const handleMultipleChoice = useCallback((questionId, optionId) => {
    setAnswers((prev) => {
      const previous = prev[questionId]?.selectedOptionIds || [];
      const updated = previous.includes(optionId)
        ? previous.filter((id) => id !== optionId)
        : [...previous, optionId];

      return {
        ...prev,
        [questionId]: { selectedOptionIds: updated },
      };
    });
  }, []);

  const handleDescriptive = useCallback((questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { descriptiveAnswer: value },
    }));
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Jump To Question
  |--------------------------------------------------------------------------
  */

  const handleJump = useCallback(
    (index) => {
      if (index < 0 || index >= sortedQuestions.length) return;
      setCurrentQuestion(index);
    },
    [sortedQuestions.length],
  );

  /*
  |--------------------------------------------------------------------------
  | Detect Tab Switch (with Toast Notification)
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        tabSwitchCount.current += 1;

        if (tabSwitchCount.current >= 3) {
          toast.error(
            "⚠️ You have switched tabs 3 times. Quiz will be auto-submitted.",
            "warning",
          );

          setTimeout(() => {
            handleSubmit(false);
          }, 2000);
        } else {
          toast.error(
            `⚠️ Tab switch ${tabSwitchCount.current}/3. 3 switches will auto-submit.`,
            "warning",
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [handleSubmit]);

  /*
  |--------------------------------------------------------------------------
  | Prevent Copy / Paste / Drag / Select
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const prevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const events = [
      "copy",
      "cut",
      "paste",
      "contextmenu",
      "dragstart",
      "selectstart",
    ];
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
  | Keyboard Shortcuts (UX deterrent only - backend enforces security)
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handler = (event) => {
      const blockedKeys = ["F5", "F12"];
      if (blockedKeys.includes(event.key)) {
        event.preventDefault();
        return;
      }

      if (event.ctrlKey && ["r", "p", "s"].includes(event.key.toLowerCase())) {
        event.preventDefault();
        return;
      }

      if (
        event.ctrlKey &&
        event.shiftKey &&
        ["i", "c"].includes(event.key.toLowerCase())
      ) {
        event.preventDefault();
        return;
      }

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
    document.body.style.overflow =
      reviewOpen || showSubmitConfirm ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [reviewOpen, showSubmitConfirm]);

  const current = sortedQuestions[currentQuestion];

  /*
  |--------------------------------------------------------------------------
  | Conditional Returns - AFTER all hooks (React Rules of Hooks)
  |--------------------------------------------------------------------------
  */

  if (isLoadingAttempt) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
          <h2 className="text-xl font-semibold">Loading your quiz...</h2>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we restore your attempt
          </p>
        </div>
      </div>
    );
  }

  if (attemptError || !attemptIdValue || !quiz) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold text-red-600">
          {attemptError?.message || "Quiz data not found."}
        </h2>
        <p className="mt-2 text-gray-600">
          The quiz attempt may have expired or been submitted.
        </p>
        <button
          type="button"
          onClick={() => navigate("/student/quizzes")}
          className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Go to Available Quizzes
        </button>
      </div>
    );
  }

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
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-xl font-bold text-gray-800">
                  {quiz.title}
                </h1>
                <p className="truncate text-sm text-gray-500">
                  {quiz.description || "Quiz in progress"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Timer */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">⏱</span>
                  <span
                    className={`font-mono text-lg font-bold ${
                      isCritical
                        ? "animate-pulse text-red-600"
                        : isWarning
                          ? "text-orange-500"
                          : "text-green-600"
                    }`}
                  >
                    {formattedTime}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="hidden w-32 sm:block">
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-600 transition-all duration-500"
                      style={{ width: `${answerProgress}%` }}
                    />
                  </div>
                  <div className="mt-1 text-right text-xs text-gray-500">
                    {Math.round(answerProgress)}% Complete
                  </div>
                </div>

                {/* Question Counter */}
                <div className="whitespace-nowrap text-sm text-gray-600">
                  Q{currentQuestion + 1}/{sortedQuestions.length}
                </div>

                {/* Save Status */}
                <div className="flex items-center gap-1 text-xs">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      saveStatus === "saved"
                        ? "bg-green-500"
                        : "animate-pulse bg-yellow-500"
                    }`}
                  />
                  <span className="text-gray-500">
                    {saveStatus === "saved" ? "Saved" : "Saving..."}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Progress Bar */}
            <div className="mt-3 sm:hidden">
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-600 transition-all duration-500"
                  style={{ width: `${answerProgress}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>{Math.round(answerProgress)}% Complete</span>
                <span>
                  {answeredCount}/{sortedQuestions.length} Answered
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Questions Column */}
          <div className="space-y-6 lg:col-span-8">
            {current && (
              <QuestionCard
                question={current}
                index={currentQuestion}
                answer={answers[current.id]}
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
                disabled={
                  currentQuestion === sortedQuestions.length - 1 || isPending
                }
                onClick={() => handleJump(currentQuestion + 1)}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Sidebar */}
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
                    <span className="font-medium">
                      {sortedQuestions.length}
                    </span>
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
                      {Math.round(answerProgress)}%
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
