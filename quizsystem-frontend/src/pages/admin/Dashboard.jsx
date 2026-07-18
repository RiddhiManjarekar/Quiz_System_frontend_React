import { useAdminDashboard } from "../../hooks/useAdmin";
import OverviewCard from "../../components/admin/OverviewCard";

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

  const cards = [
  {
    title: "Students",
    icon: "🎓",
    items: [
      {
        label: "Total",
        value: data.totalStudents,
        color: "text-blue-600",
      },
      {
        label: "Active",
        value: data.activeStudents,
        color: "text-green-600",
      },
      {
        label: "Inactive",
        value: data.inactiveStudents,
        color: "text-red-600",
      },
    ],
  },

  {
    title: "Teachers",
    icon: "👨‍🏫",
    items: [
      {
        label: "Total",
        value: data.totalTeachers,
        color: "text-purple-600",
      },
      {
        label: "Active",
        value: data.activeTeachers,
        color: "text-green-600",
      },
      {
        label: "Inactive",
        value: data.inactiveTeachers,
        color: "text-red-600",
      },
    ],
  },

  {
    title: "Quizzes",
    icon: "📝",
    items: [
      {
        label: "Total",
        value: data.totalQuizzes,
        color: "text-indigo-600",
      },
      {
        label: "Active",
        value: data.activeQuizzes,
        color: "text-green-600",
      },
      {
        label: "Draft",
        value: data.draftQuizzes,
        color: "text-yellow-600",
      },
      {
        label: "Inactive",
        value: data.inactiveQuizzes,
        color: "text-red-600",
      },
    ],
  },

  {
    title: "Attempts",
    icon: "📊",
    items: [
      {
        label: "Total Attempts",
        value: data.totalAttempts,
        color: "text-orange-600",
      },
    ],
  },
];

  return (
    <div className="space-y-8">
  <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white shadow-lg">
    <h1 className="text-3xl font-bold">
      System Overview
    </h1>

    <p className="mt-2 text-blue-100">
      Monitor students, teachers, quizzes and overall platform activity.
    </p>
  </div>

  <div className="grid gap-6 md:grid-cols-2">
    {cards.map((card) => (
      <OverviewCard
        key={card.title}
        title={card.title}
        icon={card.icon}
        items={card.items}
      />
    ))}
  </div>
</div>
  );
}

export default Dashboard;