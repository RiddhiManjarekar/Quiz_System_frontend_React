function OverviewCard({
  title,
  icon,
  items,
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
      <div className="mb-5 flex items-center gap-3">
        <div className="text-3xl">{icon}</div>

        <h2 className="text-xl font-semibold text-gray-800">
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0"
          >
            <span className="text-gray-500">
              {item.label}
            </span>

            <span
              className={`text-lg font-bold ${item.color}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OverviewCard;