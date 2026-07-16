import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getDashboard,
  getStudents,
  getStudent,
  updateStudentStatus,
  deleteStudent,
  getTeachers,
  updateTeacherStatus,
  getTeacher,
  deleteTeacher,
  getQuizzes,
  getQuiz,
  deleteQuiz,
  updateQuizStatus,
  getQuizzesByStatus
} from "../api/adminApi";

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getDashboard,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/*
|--------------------------------------------------------------------------
| Students
|--------------------------------------------------------------------------
*/

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });
}

export function useStudent(id) {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(id),
    enabled: !!id,
  });
}

export function useUpdateStudentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
  });
}


/*
|--------------------------------------------------------------------------
| Teachers
|--------------------------------------------------------------------------
*/

export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });
}


export function useTeacher(id) {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: () => getTeacher(id),
    enabled: !!id,
  });
}

export function useUpdateTeacherStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacherStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeacher,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
  });
}

/*
|--------------------------------------------------------------------------
| Quizzes
|--------------------------------------------------------------------------
*/

export function useQuizzes() {
  return useQuery({
    queryKey: ["admin-quizzes"],
    queryFn: getQuizzes,
  });
}

export function useQuiz(id) {
  return useQuery({
    queryKey: ["admin-quiz", id],
    queryFn: () => getQuiz(id),
    enabled: !!id,
  });
}

export function useQuizzesByStatus(status) {
  return useQuery({
    queryKey: ["admin-quizzes", status],
    queryFn: () => getQuizzesByStatus(status),
    enabled: !!status,
  });
}

export function useUpdateQuizStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuizStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-quizzes"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuiz,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-quizzes"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
  });
}