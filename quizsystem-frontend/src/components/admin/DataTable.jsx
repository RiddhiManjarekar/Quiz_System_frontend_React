function DataTable({
  columns,
  data,
  renderRow,
  emptyMessage = "No records found.",
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full whitespace-nowrap">

          <thead className="bg-gray-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-sm font-semibold text-gray-700 ${
                    column.align === "center"
                      ? "text-center"
                      : "text-left"
                  }`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>

            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map(renderRow)
            )}

          </tbody>

        </table>
      </div>
    </div>
  );
}

export default DataTable;