import {
  useQuery,
} from "@tanstack/react-query";

import {
  getAvailableQuizzes,
  getQuizById,
} from "../api/studentApi";

/*
|--------------------------------------------------------------------------
| Get Available Quizzes
|--------------------------------------------------------------------------
*/

export const useAvailableQuizzes = () => {
  return useQuery({
    queryKey: ["student-quizzes"],

    queryFn: getAvailableQuizzes,
  });
};

/*
|--------------------------------------------------------------------------
| Get Quiz By Id
|--------------------------------------------------------------------------
*/

export const useQuiz = (quizId) => {
  return useQuery({
    queryKey: ["student-quiz", quizId],

    queryFn: () => getQuizById(quizId),

    enabled: !!quizId,
  });
};