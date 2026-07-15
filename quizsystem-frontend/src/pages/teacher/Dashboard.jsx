import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";

function Dashboard() {
  const { name } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Welcome */}

      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Welcome, {name} 👋</h1>

        <p className="mt-3 text-blue-100">
          Manage quizzes, questions, options, and evaluate student performance
          from one place.
        </p>
      </div>

      {/* Quick Actions */}

      <div>
        <h2 className="mb-5 text-2xl font-semibold">Quick Actions</h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Link
            to="/teacher/quizzes"
            className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 text-4xl">📝</div>

            <h3 className="text-xl font-semibold">My Quizzes</h3>

            <p className="mt-2 text-sm text-gray-500">
              View, edit and manage quizzes.
            </p>
          </Link>

          <Link
            to="/teacher/quizzes/create"
            className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 text-4xl">➕</div>

            <h3 className="text-xl font-semibold">Create Quiz</h3>

            <p className="mt-2 text-sm text-gray-500">
              Create a new quiz for students.
            </p>
          </Link>

          <Link
            to="/teacher/evaluations"
            className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 text-4xl">📊</div>

            <h3 className="text-xl font-semibold">Evaluation</h3>

            <p className="mt-2 text-sm text-gray-500">
              Evaluate descriptive answers submitted by students.
            </p>
          </Link>
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="mb-4 text-4xl">👨‍🎓</div>

            <h3 className="text-xl font-semibold">Student Attempts</h3>

            <p className="mt-2 text-sm text-gray-500">
              Track student quiz attempts.
            </p>

            <span className="mt-4 inline-block rounded bg-gray-200 px-3 py-1 text-xs">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Statistics */}

      <div>
        <h2 className="mb-5 text-2xl font-semibold">Overview</h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-gray-500">Total Quizzes</h3>

            <p className="mt-3 text-4xl font-bold text-blue-600">--</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-gray-500">Active Quizzes</h3>

            <p className="mt-3 text-4xl font-bold text-green-600">--</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-gray-500">Total Questions</h3>

            <p className="mt-3 text-4xl font-bold text-purple-600">--</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-gray-500">Student Attempts</h3>

            <p className="mt-3 text-4xl font-bold text-orange-600">--</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
