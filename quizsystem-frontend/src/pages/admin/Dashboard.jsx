import { useAdminDashboard } from "../../hooks/useAdmin";

function Dashboard() {
  const {
    data,
    isLoading,
    error,
  } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <h2 className="text-xl font-semibold text-gray-700">
            Loading dashboard...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load dashboard
        </h2>

        <p className="mt-2 text-gray-600">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong."}
        </p>
      </div>
    );
  }

  const studentStats = [
    {
      title: "Total Students",
      value: data?.totalStudents ?? 0,
      icon: "🎓",
      color: "text-blue-600",
    },
    {
      title: "Active Students",
      value: data?.activeStudents ?? 0,
      icon: "✅",
      color: "text-green-600",
    },
    {
      title: "Inactive Students",
      value: data?.inactiveStudents ?? 0,
      icon: "❌",
      color: "text-red-600",
    },
  ];

  const teacherStats = [
    {
      title: "Total Teachers",
      value: data?.totalTeachers ?? 0,
      icon: "👨‍🏫",
      color: "text-purple-600",
    },
    {
      title: "Active Teachers",
      value: data?.activeTeachers ?? 0,
      icon: "🟢",
      color: "text-green-600",
    },
    {
      title: "Inactive Teachers",
      value: data?.inactiveTeachers ?? 0,
      icon: "🔴",
      color: "text-red-600",
    },
  ];

  const quizStats = [
    {
      title: "Total Quizzes",
      value: data?.totalQuizzes ?? 0,
      icon: "📝",
      color: "text-indigo-600",
    },
    {
      title: "Draft Quizzes",
      value: data?.draftQuizzes ?? 0,
      icon: "📄",
      color: "text-yellow-600",
    },
    {
      title: "Active Quizzes",
      value: data?.activeQuizzes ?? 0,
      icon: "🚀",
      color: "text-green-600",
    },
    {
      title: "Inactive Quizzes",
      value: data?.inactiveQuizzes ?? 0,
      icon: "⛔",
      color: "text-red-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}

      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-blue-100">
          Monitor students, teachers, quizzes, and platform activity from one
          place.
        </p>
      </div>

      {/* Student Statistics */}

      <section>
        <h2 className="mb-5 text-2xl font-semibold">
          Students
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {studentStats.map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-3 text-4xl">
                {item.icon}
              </div>

              <h3 className="text-gray-500">
                {item.title}
              </h3>

              <p className={`mt-3 text-4xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Teacher Statistics */}

      <section>
        <h2 className="mb-5 text-2xl font-semibold">
          Teachers
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {teacherStats.map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-3 text-4xl">
                {item.icon}
              </div>

              <h3 className="text-gray-500">
                {item.title}
              </h3>

              <p className={`mt-3 text-4xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz Statistics */}

      <section>
        <h2 className="mb-5 text-2xl font-semibold">
          Quizzes
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {quizStats.map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-3 text-4xl">
                {item.icon}
              </div>

              <h3 className="text-gray-500">
                {item.title}
              </h3>

              <p className={`mt-3 text-4xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Attempts */}

      <section>
        <h2 className="mb-5 text-2xl font-semibold">
          Attempts
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-3 text-4xl">
              📊
            </div>

            <h3 className="text-gray-500">
              Total Attempts
            </h3>

            <p className="mt-3 text-4xl font-bold text-orange-600">
              {data?.totalAttempts ?? 0}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;