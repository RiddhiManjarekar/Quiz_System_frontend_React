import { useMemo, useState } from "react";

import {
  useStudents,
  useUpdateStudentStatus,
  useDeleteStudent,
} from "../../hooks/useAdmin";
import DataTable from "../../components/admin/DataTable";

import StatusBadge from "../../components/admin/StatusBadge";
import StatusToggleButton from "../../components/admin/StatusToggleButton";
import DeleteButton from "../../components/admin/DeleteButton";
import EmptyState from "../../components/admin/EmptyState";

function Students() {

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

  const {
    data: students = [],
    isLoading,
    error,
  } = useStudents();

  const updateStatus = useUpdateStudentStatus();
  const deleteStudent = useDeleteStudent();

  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return students.filter(
      (student) =>
        student.name?.toLowerCase().includes(keyword) ||
        student.email?.toLowerCase().includes(keyword)
    );
  }, [students, search]);

  const handleStatus = (student) => {
    updateStatus.mutate({
      id: student.id,
      status:
        student.status === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE",
    });
  };

  const handleDelete = (student) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${student.name}"?`
      )
    ) {
      return;
    }

    deleteStudent.mutate(student.id);
  };

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <h2 className="text-xl font-semibold">
            Loading students...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load students
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
            Students
          </h1>

          <p className="mt-1 text-gray-500">
            Manage registered students.
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
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
          {filteredStudents.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {students.length}
        </span>{" "}
        students
      </div>

      {/* Empty */}

      {filteredStudents.length === 0 ? (
        <EmptyState
          title="No students found"
          message="Try changing your search keyword."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <DataTable
    columns={columns}
    data={filteredStudents}
    emptyMessage="No students found."
    renderRow={(student) => (
        <tr
            key={student.id}
            className="border-t"
        >
            <td className="px-4 py-3">
                {student.name}
            </td>

            <td className="px-4 py-3">
                {student.email}
            </td>

            <td className="px-4 py-3">
                <StatusBadge
                    status={student.status}
                />
            </td>

            <td className="space-x-2 px-4 py-3 text-center">

                <StatusToggleButton
                    status={student.status}
                    loading={updateStatus.isPending}
                    onClick={() =>
                        handleStatus(student)
                    }
                />

                <DeleteButton
                    loading={deleteStudent.isPending}
                    onClick={() =>
                        handleDelete(student)
                    }
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

export default Students;