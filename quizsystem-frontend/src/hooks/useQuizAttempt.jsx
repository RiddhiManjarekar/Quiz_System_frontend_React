import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  startQuiz,
  submitQuiz,
  checkExistingAttempt,
  resumeAttempt,
} from "../api/studentApi";

/*
|--------------------------------------------------------------------------
| Start Quiz
|--------------------------------------------------------------------------
*/

export function useStartQuiz() {
  return useMutation({
    mutationFn: startQuiz,
  });
}

/*
|--------------------------------------------------------------------------
| Submit Quiz
|--------------------------------------------------------------------------
*/

export function useSubmitQuiz() {
  return useMutation({
    mutationFn: ({ attemptId, data }) =>
      submitQuiz(attemptId, data),
  });
}

/*
|--------------------------------------------------------------------------
| Check Existing Attempt
|--------------------------------------------------------------------------
*/

export function useCheckExistingAttempt(
  quizId,
  enabled = true
) {
  return useQuery({
    queryKey: ["existing-attempt", quizId],
    queryFn: () => checkExistingAttempt(quizId),
    enabled: enabled && !!quizId,
    staleTime: 0,
  });
}

/*
|--------------------------------------------------------------------------
| Resume Attempt
|--------------------------------------------------------------------------
*/

export function useResumeAttempt() {
  return useMutation({
    mutationFn: resumeAttempt,
  });
}