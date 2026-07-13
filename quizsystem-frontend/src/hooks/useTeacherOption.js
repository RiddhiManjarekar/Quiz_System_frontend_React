import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getOptions,
  getOptionById,
  createOption,
  updateOption,
  deleteOption,
} from "../api/teacherApi";

/*
|--------------------------------------------------------------------------
| Get All Options
|--------------------------------------------------------------------------
*/

export const useOptions = (questionId) =>
  useQuery({
    queryKey: ["options", questionId],
    queryFn: () => getOptions(questionId),
    enabled: !!questionId,
  });

/*
|--------------------------------------------------------------------------
| Get Single Option
|--------------------------------------------------------------------------
*/

export const useOption = (optionId) =>
  useQuery({
    queryKey: ["option", optionId],
    queryFn: () => getOptionById(optionId),
    enabled: !!optionId,
  });

/*
|--------------------------------------------------------------------------
| Create Option
|--------------------------------------------------------------------------
*/

export const useCreateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOption,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["options", variables.questionId],
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| Update Option
|--------------------------------------------------------------------------
*/

export const useUpdateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOption,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["option", variables.optionId],
      });

      // Refresh option list
      if (variables.questionId) {
        queryClient.invalidateQueries({
          queryKey: ["options", variables.questionId],
        });
      }
    },
  });
};

/*
|--------------------------------------------------------------------------
| Delete Option
|--------------------------------------------------------------------------
*/

export const useDeleteOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ optionId }) => deleteOption(optionId),

onSuccess: (_, variables) => {
  queryClient.invalidateQueries({
    queryKey: ["options", variables.questionId],
  });

    },
  });
};