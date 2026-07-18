import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getPendingEvaluations,
  getEvaluationAttempt,
  evaluateAnswer,
} from "../api/teacherEvaluationApi";

/*
|--------------------------------------------------------------------------
| Pending Evaluation List
|--------------------------------------------------------------------------
*/

export function usePendingEvaluations() {
  return useQuery({
    queryKey: ["teacher", "evaluations"],
    queryFn: getPendingEvaluations,
  });
}

/*
|--------------------------------------------------------------------------
| Single Attempt for Evaluation
|--------------------------------------------------------------------------
*/

export function useEvaluationAttempt(attemptId) {
  return useQuery({
    queryKey: ["teacher", "evaluation", attemptId],
    queryFn: () => getEvaluationAttempt(attemptId),
    enabled: !!attemptId,
  });
}

/*
|--------------------------------------------------------------------------
| Evaluate Answer
|--------------------------------------------------------------------------
*/

export function useEvaluateAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluateAnswer,

    onSuccess: (_, variables) => {
      // Refresh the attempt details
      queryClient.invalidateQueries({
        queryKey: ["teacher", "evaluation", variables.attemptId],
      });

      queryClient.invalidateQueries({
        queryKey: ["pending-evaluations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["evaluation-attempt", attemptId],
      });

      // Refresh pending evaluations list
      queryClient.invalidateQueries({
        queryKey: ["teacher", "evaluations"],
      });
    },
  });
}
