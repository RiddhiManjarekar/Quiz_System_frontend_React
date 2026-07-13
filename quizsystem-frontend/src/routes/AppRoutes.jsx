import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import AuthLayout from "../layouts/AuthLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminLayout from "../layouts/AdminLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import StudentLayout from "../layouts/StudentLayout";

// import Dashboard from "../pages/admin/Dashboard";
// import Students from "../pages/admin/Students";
// import Teachers from "../pages/admin/Teachers";
// import Quizzes from "../pages/admin/Quizzes";

import TeacherDashboard from "../pages/teacher/Dashboard";
import QuizList from "../pages/teacher/QuizList";
import CreateQuiz from "../pages/teacher/CreateQuiz";
import EditQuiz from "../pages/teacher/EditQuiz";

import QuestionList from "../pages/teacher/QuestionList";
import CreateQuestion from "../pages/teacher/CreateQuestion";
import EditQuestion from "../pages/teacher/EditQuestion";



import OptionList from "../pages/teacher/OptionList";
import CreateOption from "../pages/teacher/CreateOption";
import EditOption from "../pages/teacher/EditOption";


// import Evaluation from "../pages/teacher/Evaluation";

// import StudentDashboard from "../pages/student/Dashboard";
// import AvailableQuizzes from "../pages/student/AvailableQuizzes";
// import QuizPage from "../pages/student/QuizPage";
// import Result from "../pages/student/Result";

function AppRoutes() {
  return (
    <Routes>
      {/* ================= AUTH ================= */}

      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= ADMIN ================= */}
      {/* 
            <Route
                element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
            >
                <Route element={<AdminLayout />}>

                    <Route
                        path="/admin/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/admin/students"
                        element={<Students />}
                    />

                    <Route
                        path="/admin/teachers"
                        element={<Teachers />}
                    />

                    <Route
                        path="/admin/quizzes"
                        element={<Quizzes />}
                    />

                </Route>
            </Route> */}

      {/* ================= TEACHER ================= */}

      <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
        <Route element={<TeacherLayout />}>
          <Route
                        path="/teacher/dashboard"
                        element={<TeacherDashboard />}
                    />

          <Route path="/teacher/quizzes" element={<QuizList />} />

          <Route path="/teacher/quizzes/create" element={<CreateQuiz />} />

          <Route path="/teacher/quizzes/edit/:id" element={<EditQuiz />} />
          <Route
            path="/teacher/quizzes/:quizId/questions"
            element={<QuestionList />}
          />

          <Route
            path="/teacher/quizzes/:quizId/questions/create"
            element={<CreateQuestion />}
          />

          <Route
            path="/teacher/quizzes/:quizId/questions/:questionId/edit"
            element={<EditQuestion />}
          />

          <Route
            path="/teacher/quizzes/:quizId/questions/:questionId/options"
            element={<OptionList />}
          />

          <Route
            path="/teacher/quizzes/:quizId/questions/:questionId/options/create"
            element={<CreateOption />}
          />

          <Route
            path="/teacher/quizzes/:quizId/questions/:questionId/options/:optionId/edit"
            element={<EditOption />}
          />

          {/*
                    <Route
                        path="/teacher/evaluation"
                        element={<Evaluation />}
                    />

                </Route>*/}
        </Route>
      </Route>

      {/* ================= STUDENT ================= */}
      {/* 
            <Route
                element={<ProtectedRoute allowedRoles={["STUDENT"]} />}
            >

                <Route element={<StudentLayout />}>

                    <Route
                        path="/student/dashboard"
                        element={<StudentDashboard />}
                    />

                    <Route
                        path="/student/quizzes"
                        element={<AvailableQuizzes />}
                    />

                    <Route
                        path="/student/quizzes/:quizId"
                        element={<QuizPage />}
                    />

                    <Route
                        path="/student/results/:attemptId"
                        element={<Result />}
                    />

                </Route>

            </Route> */}

      {/* ================= 404 ================= */}

      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;
