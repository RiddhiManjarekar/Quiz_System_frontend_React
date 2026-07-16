import axiosInstance from "./axios";

/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

// GET /api/admin/dashboard
export const getDashboard = async () => {
  const { data } = await axiosInstance.get("/admin/dashboard");

  return data.data;
};

/*
|--------------------------------------------------------------------------
| Students
|--------------------------------------------------------------------------
*/

// GET /api/admin/students
export const getStudents = async () => {
  const { data } = await axiosInstance.get("/admin/students");

  return data.data;
};

export const getStudent = async (id) => {
  const { data } = await axiosInstance.get(`/admin/students/${id}`);
  return data.data;
};

// PATCH /api/admin/students/{id}/status
export const updateStudentStatus = async ({ id, status }) => {
  const { data } = await axiosInstance.patch(`/admin/students/${id}/status`, {
    status,
  });

  return data.data;
};

export const deleteStudent = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/students/${id}`);
  return data.data;
};

/*
|--------------------------------------------------------------------------
| Teachers
|--------------------------------------------------------------------------
*/

// GET /api/admin/teachers
export const getTeachers = async () => {
  const { data } = await axiosInstance.get("/admin/teachers");

  return data.data;
};

// PATCH /api/admin/teachers/{id}/status
export const updateTeacherStatus = async ({ id, status }) => {
  const { data } = await axiosInstance.patch(`/admin/teachers/${id}/status`, {
    status,
  });

  return data.data;
};

export const getTeacher = async (id) => {
  const { data } = await axiosInstance.get(`/admin/teachers/${id}`);
  return data.data;
};

export const deleteTeacher = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/teachers/${id}`);
  return data;
};

/*
|--------------------------------------------------------------------------
| Quizzes
|--------------------------------------------------------------------------
*/

// GET /api/admin/quizzes
export const getQuizzes = async () => {
  const { data } = await axiosInstance.get("/admin/quizzes");

  return data.data;
};

// PATCH /api/admin/quizzes/{id}/status
export const updateQuizStatus = async ({ id, status }) => {
  const { data } = await axiosInstance.patch(`/admin/quizzes/${id}/status`, {
    status,
  });

  return data.data;
};

// GET /api/admin/quizzes/{id}
export const getQuiz = async (id) => {
  const { data } = await axiosInstance.get(
    `/admin/quizzes/${id}`
  );

  return data.data;
};

// GET /api/admin/quizzes/status/{status}
export const getQuizzesByStatus = async (status) => {
  const { data } = await axiosInstance.get(
    `/admin/quizzes/status/${status}`
  );

  return data.data;
};

// DELETE /api/admin/quizzes/{id}
export const deleteQuiz = async (id) => {
  const { data } = await axiosInstance.delete(
    `/admin/quizzes/${id}`
  );

  return data.data;
};
