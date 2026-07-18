import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";

function Dashboard() {
  const { name } = useAuthStore();

  const quickActions = [
    {
      title: "My Quizzes",
      description: "View, edit and manage your quizzes.",
      icon: "📝",
      link: "/teacher/quizzes",
    },
    {
      title: "Create Quiz",
      description: "Create a new quiz for students.",
      icon: "➕",
      link: "/teacher/quizzes/create",
    },
    {
      title: "Evaluation",
      description: "Evaluate descriptive answers submitted by students.",
      icon: "📊",
      link: "/teacher/evaluations",
    },
  ];

  const overviewCards = [
    {
      title: "Total Quizzes",
      value: "--",
      icon: "📝",
      color: "text-blue-600",
    },
    {
      title: "Active Quizzes",
      value: "--",
      icon: "🚀",
      color: "text-green-600",
    },
    {
      title: "Total Questions",
      value: "--",
      icon: "❓",
      color: "text-purple-600",
    },
    {
      title: "Student Attempts",
      value: "--",
      icon: "📚",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}

      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg md:p-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Teacher Workspace
        </h1>

        <p className="mt-3 max-w-2xl text-blue-100">
          Manage quizzes, questions, options, and evaluate student submissions
          from one place.
        </p>
      </div>

      {/* Quick Actions */}

      <section>
        <h2 className="mb-5 text-2xl font-semibold text-gray-800">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="rounded-xl bg-white p-6 shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 text-4xl">{item.icon}</div>

              <h3 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {item.description}
              </p>
            </Link>
          ))}

          {/* Coming Soon */}

          <div className="cursor-not-allowed rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 opacity-80">
            <div className="mb-4 text-4xl">👨‍🎓</div>

            <h3 className="text-lg font-semibold text-gray-700">
              Student Attempts
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Track quiz attempts and monitor student performance.
            </p>

            <span className="mt-5 inline-flex rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
              Coming Soon
            </span>
          </div>
        </div>
      </section>

      {/* Overview */}

      <section>
        <h2 className="mb-5 text-2xl font-semibold text-gray-800">
          Overview
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl bg-white p-6 shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-3 text-4xl">{card.icon}</div>

              <h3 className="text-sm font-medium text-gray-500">
                {card.title}
              </h3>

              <p className={`mt-3 text-4xl font-bold ${card.color}`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;