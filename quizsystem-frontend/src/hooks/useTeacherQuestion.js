import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getQuestionsByQuiz,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../api/teacherApi";

/*
|--------------------------------------------------------------------------
| Get Questions By Quiz
|--------------------------------------------------------------------------
*/

export const useQuestions = (quizId) =>
  useQuery({
    queryKey: ["questions", quizId],

    queryFn: () => getQuestionsByQuiz(quizId),

    enabled: !!quizId,
  });

/*
|--------------------------------------------------------------------------
| Get Question By Id
|--------------------------------------------------------------------------
*/

export const useQuestion = (questionId) =>
  useQuery({
    queryKey: ["question", questionId],

    queryFn: () => getQuestionById(questionId),

    enabled: !!questionId,
  });

/*
|--------------------------------------------------------------------------
| Create Question
|--------------------------------------------------------------------------
*/

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, data }) =>
      createQuestion(quizId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["questions", variables.quizId],
      });

      queryClient.invalidateQueries({
        queryKey: ["teacher-quizzes"],
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| Update Question
|--------------------------------------------------------------------------
*/

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, data }) =>
      updateQuestion(questionId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["question", variables.questionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["questions", variables.quizId],
      });

      queryClient.invalidateQueries({
        queryKey: ["teacher-quizzes"],
      });
    },
  });
};


/*
|--------------------------------------------------------------------------
| Delete Question
|--------------------------------------------------------------------------
*/

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId }) =>
      deleteQuestion(questionId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["questions", variables.quizId],
      });

      queryClient.invalidateQueries({
        queryKey: ["teacher-quizzes"],
      });
    },
  });

};