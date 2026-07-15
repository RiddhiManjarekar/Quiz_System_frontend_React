import axiosInstance from "./axios";

/*
|--------------------------------------------------------------------------
| Teacher Evaluation APIs
|--------------------------------------------------------------------------
*/

// GET /api/teacher/evaluations
export const getPendingEvaluations = async () => {
  const { data } = await axiosInstance.get(
    "/teacher/evaluations"
  );

  return data.data;
};

// GET /api/teacher/evaluations/{attemptId}
export const getEvaluationAttempt = async (attemptId) => {
  const { data } = await axiosInstance.get(
    `/teacher/evaluations/${attemptId}`
  );

  return data.data;
};

// PATCH /api/teacher/evaluations/{studentAnswerId}
export const evaluateAnswer = async ({
  studentAnswerId,
  marksObtained,
}) => {
  const { data } = await axiosInstance.patch(
    `/teacher/evaluations/${studentAnswerId}`,
    {
      marksObtained,
    }
  );

  return data.data;
};