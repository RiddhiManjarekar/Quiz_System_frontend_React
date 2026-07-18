import { Link } from "react-router-dom";
import { useAvailableQuizzes } from "../../hooks/useStudentQuiz";
import { useResults } from "../../hooks/useStudentResult";
import useAuthStore from "../../store/authStore";

function Dashboard() {
  const { name } = useAuthStore();

  const {
    data: quizzes = [],
    isLoading: quizzesLoading,
  } = useAvailableQuizzes();

  const {
    data: results = [],
    isLoading: resultsLoading,
  } = useResults();

  const loading = quizzesLoading || resultsLoading;

  const stats = {
    availableQuizzes: quizzes.length,
    completedQuizzes: results.filter(
      (r) => r.status === "SUBMITTED"
    ).length,
    passedQuizzes: results.filter(
      (r) => r.passed
    ).length,
    averageScore:
      results.length > 0
        ? Math.round(
            results.reduce(
              (total, result) =>
                total + result.percentage,
              0
            ) / results.length
          )
        : null,
  };

  const quickActions = [
    {
      title: "Available Quizzes",
      description:
        "View all quizzes assigned to you.",
      icon: "📝",
      to: "/student/quizzes",
    },
    {
      title: "My Results",
      description:
        "Review your completed quiz results.",
      icon: "📊",
      to: "/student/results",
    },
    {
      title: "Start Quiz",
      description:
        "Begin your next available quiz.",
      icon: "🏆",
      to: "/student/quizzes",
    },
  ];

  const overviewCards = [
    {
      title: "Available Quizzes",
      value: stats.availableQuizzes,
      icon: "📚",
      color: "text-green-600",
    },
    {
      title: "Completed Quizzes",
      value: stats.completedQuizzes,
      icon: "✅",
      color: "text-blue-600",
    },
    {
      title: "Average Score",
      value:
        stats.averageScore !== null
          ? `${stats.averageScore}%`
          : "--",
      icon: "📈",
      color: "text-purple-600",
    },
    {
      title: "Passed Quizzes",
      value: stats.passedQuizzes,
      icon: "🏅",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}

      <div className="rounded-2xl bg-gradient-to-r from-green-600 to-green-700 p-6 text-white shadow-lg md:p-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Learning Dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-green-100">
          Ready to test your knowledge? Attempt quizzes,
          track your progress, and improve your performance.
        </p>
      </div>

      {/* Quick Actions */}

      <section>
        <h2 className="mb-5 text-2xl font-semibold text-gray-800">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="rounded-xl bg-white p-6 shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 text-4xl">
                {item.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Overview */}

      <section>
        <h2 className="mb-5 text-2xl font-semibold text-gray-800">
          Overview
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-white p-6 shadow"
              >
                <div className="animate-pulse">
                  <div className="mb-4 h-8 w-8 rounded bg-gray-200" />

                  <div className="mb-3 h-4 w-24 rounded bg-gray-200" />

                  <div className="h-8 w-16 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl bg-white p-6 shadow transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-3 text-4xl">
                  {card.icon}
                </div>

                <h3 className="text-sm font-medium text-gray-500">
                  {card.title}
                </h3>

                <p
                  className={`mt-3 text-4xl font-bold ${card.color}`}
                >
                  {card.value}
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