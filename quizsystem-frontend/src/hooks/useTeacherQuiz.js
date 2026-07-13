import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getMyQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  updateQuizStatus,
} from "../api/teacherApi";

/*
|--------------------------------------------------------------------------
| Get All Teacher Quizzes
|--------------------------------------------------------------------------
*/

export const useMyQuizzes = () =>
  useQuery({
    queryKey: ["teacher-quizzes"],
    queryFn: getMyQuizzes,
  });

export const useQuiz = (id) =>
  useQuery({
    queryKey: ["quiz", id],
    queryFn: () => getQuizById(id),
    enabled: !!id,
  });

// export const useMyQuizzes = () => {
//   return useQuery({
//     queryKey: ["teacher-quizzes"],
//     queryFn: async () => {
//       const response = await getMyQuizzes();
//       return response.data.data;
//     },
//   });
// };

// /*
// |--------------------------------------------------------------------------
// | Get Quiz By Id
// |--------------------------------------------------------------------------
// */


// export const useQuiz = (id) => {
//   return useQuery({
//     queryKey: ["quiz", id],
//     queryFn: async () => {
//       const response = await getQuizById(id);
//       return response.data.data;
//     },
//     enabled: !!id,
//   });
// };

/*
|--------------------------------------------------------------------------
| Create Quiz
|--------------------------------------------------------------------------
*/

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuiz,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-quizzes"],
      });
      return response;
    },
  });
};

/*
|--------------------------------------------------------------------------
| Update Quiz
|--------------------------------------------------------------------------
*/

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      updateQuiz(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-quizzes"],
      });

      queryClient.invalidateQueries({
        queryKey: ["quiz", variables.id],
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| Delete Quiz
|--------------------------------------------------------------------------
*/

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuiz,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-quizzes"],
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| Update Quiz Status
|--------------------------------------------------------------------------
*/

export const useUpdateQuizStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      updateQuizStatus(id, status),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-quizzes"],
      });

      queryClient.invalidateQueries({
        queryKey: ["quiz", variables.id],
      });
    },
  });
};