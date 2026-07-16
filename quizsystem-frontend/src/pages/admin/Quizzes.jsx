import { useMemo, useState } from "react";

import {
  useQuizzes,
  useUpdateQuizStatus,
  useDeleteQuiz,
} from "../../hooks/useAdmin";

import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import StatusToggleButton from "../../components/admin/StatusToggleButton";
import DeleteButton from "../../components/admin/DeleteButton";
import EmptyState from "../../components/admin/EmptyState";

function Quizzes() {
  const {
    data: quizzes = [],
    isLoading,
    error,
  } = useQuizzes();

  const updateStatus = useUpdateQuizStatus();
  const deleteQuiz = useDeleteQuiz();

  const [search, setSearch] = useState("");

  const filteredQuizzes = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return quizzes.filter(
      (quiz) =>
        quiz.title?.toLowerCase().includes(keyword) ||
        quiz.teacherName?.toLowerCase().includes(keyword)
    );
  }, [quizzes, search]);

  const handleStatus = (quiz) => {
    const nextStatus =
      quiz.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    updateStatus.mutate({
      id: quiz.id,
      status: nextStatus,
    });
  };

  const handleDelete = (quiz) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${quiz.title}"?`
      )
    ) {
      return;
    }

    deleteQuiz.mutate(quiz.id);
  };

  const columns = [
    {
      key: "title",
      title: "Title",
    },
    {
      key: "teacher",
      title: "Teacher",
    },
    {
      key: "duration",
      title: "Duration",
    },
    {
      key: "totalMarks",
      title: "Total Marks",
    },
    {
      key: "passingMarks",
      title: "Passing Marks",
    },
    {
      key: "startTime",
      title: "Start",
    },
    {
      key: "endTime",
      title: "End",
    },
    {
      key: "status",
      title: "Status",
    },
    {
      key: "actions",
      title: "Actions",
      align: "center",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <h2 className="text-xl font-semibold">
            Loading quizzes...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load quizzes
        </h2>

        <p className="mt-2 text-gray-600">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Quizzes
          </h1>

          <p className="mt-1 text-gray-500">
            Manage all quizzes in the system.
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search by title or teacher..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-72 rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />

          <span className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Count */}

      <div className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold">
          {filteredQuizzes.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {quizzes.length}
        </span>{" "}
        quizzes
      </div>

      {/* Empty */}

      {filteredQuizzes.length === 0 ? (
        <EmptyState
          title="No quizzes found"
          message="Try changing your search keyword."
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredQuizzes}
          renderRow={(quiz) => (
            <tr
              key={quiz.id}
              className="border-t"
            >
              <td className="px-4 py-3 font-medium">
                {quiz.title}
              </td>

              <td className="px-4 py-3">
                {quiz.teacherName}
              </td>

              <td className="px-4 py-3">
                {quiz.durationMinutes} mins
              </td>

              <td className="px-4 py-3">
                {quiz.totalMarks}
              </td>

              <td className="px-4 py-3">
                {quiz.passingMarks}
              </td>

              <td className="px-4 py-3">
                {quiz.startTime
                  ? new Date(
                      quiz.startTime
                    ).toLocaleString()
                  : "-"}
              </td>

              <td className="px-4 py-3">
                {quiz.endTime
                  ? new Date(
                      quiz.endTime
                    ).toLocaleString()
                  : "-"}
              </td>

              <td className="px-4 py-3">
                <StatusBadge
                  status={quiz.status}
                />
              </td>

              <td className="space-x-2 px-4 py-3 text-center">
                <StatusToggleButton
                  status={quiz.status}
                  loading={updateStatus.isPending}
                  onClick={() =>
                    handleStatus(quiz)
                  }
                />

                <DeleteButton
                  loading={deleteQuiz.isPending}
                  onClick={() =>
                    handleDelete(quiz)
                  }
                />
              </td>
            </tr>
          )}
        />
      )}
    </div>
  );
}

export default Quizzes;