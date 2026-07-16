function StatusBadge({ status }) {
  const config = {
    ACTIVE: {
      bg: "bg-green-100",
      text: "text-green-700",
    },
    INACTIVE: {
      bg: "bg-red-100",
      text: "text-red-700",
    },
    DRAFT: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
    },
  };

  const style = config[status] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;