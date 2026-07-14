import { Link, useNavigate } from "react-router-dom";
import { useAvailableQuizzes } from "../../hooks/useStudentQuiz";
import { useResults } from "../../hooks/useStudentResult";
import useAuthStore from "../../store/authStore";

// Constants
const QUICK_ACTIONS = [
  {
    to: "/student/quizzes",
    icon: "📝",
    title: "Available Quizzes",
    description: "View all quizzes that are available for you.",
  },
  {
    to: "/student/results",
    icon: "📊",
    title: "My Results",
    description: "View your completed quiz results.",
  },
  {
    to: "/student/quizzes",
    icon: "🏆",
    title: "Start New Quiz",
    description: "Begin a new quiz attempt right now.",
    isAction: true,
  },
];

function Dashboard() {
  const { name } = useAuthStore();
  const navigate = useNavigate();
  
  const { data: quizzes = [], isLoading: quizzesLoading } = useAvailableQuizzes();
  const { data: results = [], isLoading: resultsLoading } = useResults();

  // Calculate stats with memoization
  const stats = {
    availableQuizzes: quizzes.length,
    completedQuizzes: results.filter((r) => r.status === "SUBMITTED").length,
    passedQuizzes: results.filter((r) => r.passed).length,
    averageScore: results.length > 0
      ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)
      : 0,
  };

  const isLoading = quizzesLoading || resultsLoading;

  // Stat cards configuration
  const statCards = [
    {
      label: "Available Quizzes",
      value: stats.availableQuizzes,
      color: "text-green-600",
      icon: "📚",
    },
    {
      label: "Completed Quizzes",
      value: stats.completedQuizzes,
      color: "text-blue-600",
      icon: "✅",
    },
    {
      label: "Average Score",
      value: stats.averageScore > 0 ? `${stats.averageScore}%` : "--",
      color: "text-purple-600",
      icon: "📊",
    },
    {
      label: "Passed Quizzes",
      value: stats.passedQuizzes,
      color: "text-orange-600",
      icon: "🏅",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section - Only place where name appears on dashboard */}
      <div className="rounded-2xl bg-gradient-to-r from-green-600 to-green-700 p-6 md:p-8 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome{name ? `, ${name}` : ""} 👋
        </h1>
        <p className="mt-2 md:mt-3 text-green-100 text-sm md:text-base">
          Ready to test your knowledge? Start a quiz and track your progress.
        </p>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 md:mb-5 text-xl md:text-2xl font-semibold text-gray-800">
          Quick Actions
        </h2>

        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {QUICK_ACTIONS.map((action) => {
            const Component = action.isAction ? "div" : Link;
            const props = action.isAction
              ? {
                  onClick: () => navigate(action.to),
                  className: "cursor-pointer",
                }
              : { to: action.to };

            return (
              <Component
                key={action.title}
                {...props}
                className="rounded-xl bg-white p-5 md:p-6 shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95"
              >
                <div className="mb-3 md:mb-4 text-3xl md:text-4xl" aria-hidden="true">
                  {action.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                  {action.title}
                </h3>
                <p className="mt-1 md:mt-2 text-sm text-gray-500">
                  {action.description}
                </p>
              </Component>
            );
          })}
        </div>
      </section>

      {/* Overview */}
      <section>
        <h2 className="mb-4 md:mb-5 text-xl md:text-2xl font-semibold text-gray-800">
          Overview
        </h2>

        {isLoading ? (
          <div className="grid gap-4 md:gap-5 grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-white p-5 md:p-6 shadow animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:gap-5 grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white p-5 md:p-6 shadow transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm md:text-base text-gray-500">
                    {stat.label}
                  </h3>
                  <span className="text-xl" aria-hidden="true">
                    {stat.icon}
                  </span>
                </div>
                <p className={`mt-2 md:mt-3 text-2xl md:text-4xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;