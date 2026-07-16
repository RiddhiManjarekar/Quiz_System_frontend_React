function EmptyState({
  title = "No data found",
  description = "There is nothing to display.",
}) {
  return (
    <div className="rounded-xl bg-white p-10 text-center shadow">
      <div className="text-5xl">📭</div>

      <h2 className="mt-4 text-xl font-semibold text-gray-800">
        {title}
      </h2>

      <p className="mt-2 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;