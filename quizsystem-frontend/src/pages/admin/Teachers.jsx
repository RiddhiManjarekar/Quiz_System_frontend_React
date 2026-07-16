import { useMemo, useState } from "react";

import {
  useTeachers,
  useUpdateTeacherStatus,
  useDeleteTeacher,
} from "../../hooks/useAdmin";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import StatusToggleButton from "../../components/admin/StatusToggleButton";
import DeleteButton from "../../components/admin/DeleteButton";
import EmptyState from "../../components/admin/EmptyState";

function Teachers() {
  const columns = [
    {
      key: "name",
      title: "Name",
    },
    {
      key: "email",
      title: "Email",
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

  const { data: teachers = [], isLoading, error } = useTeachers();

  const updateStatus = useUpdateTeacherStatus();
  const deleteTeacher = useDeleteTeacher();

  const [search, setSearch] = useState("");

  const filteredTeachers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return teachers.filter(
      (teacher) =>
        teacher.name?.toLowerCase().includes(keyword) ||
        teacher.email?.toLowerCase().includes(keyword),
    );
  }, [teachers, search]);

  const handleStatus = (teacher) => {
    updateStatus.mutate({
      id: teacher.id,
      status: teacher.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });
  };

  const handleDelete = (teacher) => {
    if (!window.confirm(`Are you sure you want to delete "${teacher.name}"?`)) {
      return;
    }

    deleteTeacher.mutate(teacher.id);
  };

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <h2 className="text-xl font-semibold">Loading teachers...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load teachers
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
          <h1 className="text-3xl font-bold">Teachers</h1>

          <p className="mt-1 text-gray-500">Manage registered teachers.</p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />

          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Count */}

      <div className="text-sm text-gray-500">
        Showing <span className="font-semibold">{filteredTeachers.length}</span>{" "}
        of <span className="font-semibold">{teachers.length}</span> teachers
      </div>

      {filteredTeachers.length === 0 ? (
        <EmptyState
          title="No teachers found"
          message="Try changing your search keyword."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <DataTable
            columns={columns}
            data={filteredTeachers}
            emptyMessage="No teachers found."
            renderRow={(teacher) => (
              <tr key={teacher.id} className="border-t">
                <td className="px-4 py-3">{teacher.name}</td>

                <td className="px-4 py-3">{teacher.email}</td>

                <td className="px-4 py-3">
                  <StatusBadge status={teacher.status} />
                </td>

                <td className="space-x-2 px-4 py-3 text-center">
                  <StatusToggleButton
                    status={teacher.status}
                    loading={updateStatus.isPending}
                    onClick={() => handleStatus(teacher)}
                  />

                  <DeleteButton
                    loading={deleteTeacher.isPending}
                    onClick={() => handleDelete(teacher)}
                  />
                </td>
              </tr>
            )}
          />
        </div>
      )}
    </div>
  );
}

export default Teachers;
