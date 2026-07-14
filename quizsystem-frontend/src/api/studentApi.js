import axiosInstance from "./axios";

/*
|--------------------------------------------------------------------------
| Student Quiz APIs
|--------------------------------------------------------------------------
*/

// GET /api/student/quizzes
export const getAvailableQuizzes = async () => {
  const { data } = await axiosInstance.get("/student/quizzes");
  return data.data;
};

// GET /api/student/quizzes/{quizId}
export const getQuizById = async (quizId) => {
  const { data } = await axiosInstance.get(
    `/student/quizzes/${quizId}`
  );

  return data.data;
};

/*
|--------------------------------------------------------------------------
| Quiz Attempt APIs
|--------------------------------------------------------------------------
*/

// POST /api/student/quizzes/{quizId}/start
export const startQuiz = async (quizId) => {
  const { data } = await axiosInstance.post(
    `/student/quizzes/${quizId}/start`
  );

  return data.data;
};

// POST /api/student/attempts/{attemptId}/submit
export const submitQuiz = async (
  attemptId,
  payload
) => {
  const { data } = await axiosInstance.post(
    `/student/attempts/${attemptId}/submit`,
    payload
  );

  return data.data;
};

// GET /api/student/quizzes/{quizId}/existing
export const checkExistingAttempt = async (
  quizId
) => {
  const { data } = await axiosInstance.get(
    `/student/quizzes/${quizId}/existing`
  );

  return data.data;
};

// GET /api/student/attempts/{attemptId}
export const resumeAttempt = async (
  attemptId
) => {
  const { data } = await axiosInstance.get(
    `/student/attempts/${attemptId}`
  );

  return data.data;
};

/*
|--------------------------------------------------------------------------
| Result APIs
|--------------------------------------------------------------------------
*/

// GET /api/student/results
export const getResults = async () => {
  const { data } = await axiosInstance.get(
    "/student/results"
  );

  return data.data;
};

// GET /api/student/results/{attemptId}
export const getResultDetails = async (
  attemptId
) => {
  const { data } = await axiosInstance.get(
    `/student/results/${attemptId}`
  );

  return data.data;
};