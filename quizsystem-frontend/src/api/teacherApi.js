import axiosInstance from "./axios";

/*
|--------------------------------------------------------------------------
| Quiz APIs
|--------------------------------------------------------------------------
*/

// GET /api/teacher/quizzes
export const getMyQuizzes = async () => {
  const { data } = await axiosInstance.get("/teacher/quizzes");
  return data.data;
};

// GET /api/teacher/quizzes/{id}
export const getQuizById = async (id) => {
  const { data } = await axiosInstance.get(`/teacher/quizzes/${id}`);
  return data.data;
};

// POST /api/teacher/quizzes
export const createQuiz = async (payload) => {
  const { data } = await axiosInstance.post("/teacher/quizzes", payload);

  return data.data;
};

// PUT /api/teacher/quizzes/{id}
export const updateQuiz = async (id, payload) => {
  const { data } = await axiosInstance.put(`/teacher/quizzes/${id}`, payload);

  return data.data;
};

// DELETE /api/teacher/quizzes/{id}
export const deleteQuiz = async (id) => {
  const { data } = await axiosInstance.delete(`/teacher/quizzes/${id}`);

  return data;
};

// PATCH /api/teacher/quizzes/{id}/status
export const updateQuizStatus = async (id, status) => {
  const { data } = await axiosInstance.patch(`/teacher/quizzes/${id}/status`, {
    status,
  });

  return data.data;
};

/*
|--------------------------------------------------------------------------
| Question APIs
|--------------------------------------------------------------------------
*/

// GET /api/teacher/quizzes/{quizId}/questions
export const getQuestionsByQuiz = async (quizId) => {
  const { data } = await axiosInstance.get(
    `/teacher/quizzes/${quizId}/questions`,
  );

  return data.data;
};

// GET /api/teacher/questions/{questionId}
export const getQuestionById = async (questionId) => {
  const { data } = await axiosInstance.get(`/teacher/questions/${questionId}`);

  return data.data;
};

// POST /api/teacher/quizzes/{quizId}/questions
export const createQuestion = async (quizId, payload) => {
  const { data } = await axiosInstance.post(
    `/teacher/quizzes/${quizId}/questions`,
    payload,
  );

  return data.data;
};

// PUT /api/teacher/questions/{questionId}
export const updateQuestion = async (questionId, payload) => {
  const { data } = await axiosInstance.put(
    `/teacher/questions/${questionId}`,
    payload,
  );

  return data.data;
};

// DELETE /api/teacher/questions/{questionId}
export const deleteQuestion = async (questionId) => {
  const { data } = await axiosInstance.delete(
    `/teacher/questions/${questionId}`,
  );

  return data;
};

/*
|--------------------------------------------------------------------------
| Option APIs
|--------------------------------------------------------------------------
*/

// GET /teacher/questions/{questionId}/options
export const getOptions = async (questionId) => {
  const { data } = await axiosInstance.get(
    `/teacher/questions/${questionId}/options`,
  );

  return data.data;
};

// GET /teacher/options/{optionId}
export const getOptionById = async (optionId) => {
  const { data } = await axiosInstance.get(`/teacher/options/${optionId}`);

  return data.data;
};

// POST /teacher/questions/{questionId}/options
export const createOption = async ({ questionId, data: payload }) => {
  const { data } = await axiosInstance.post(
    `/teacher/questions/${questionId}/options`,
    payload,
  );

  return data.data;
};

// PUT /teacher/options/{optionId}
export const updateOption = async ({ optionId, data: payload }) => {
  const { data } = await axiosInstance.put(
    `/teacher/options/${optionId}`,
    payload,
  );

  return data.data;
};

// DELETE /teacher/options/{optionId}
export const deleteOption = async (optionId) => {
  const { data } = await axiosInstance.delete(`/teacher/options/${optionId}`);

  return data;
};
