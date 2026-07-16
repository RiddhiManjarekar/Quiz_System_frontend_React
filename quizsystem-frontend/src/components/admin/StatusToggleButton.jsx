function StatusToggleButton({
  status,
  loading = false,
  onClick,
}) {
  const buttonConfig = {
    ACTIVE: {
      text: "Deactivate",
      className: "bg-orange-500 hover:bg-orange-600",
    },

    INACTIVE: {
      text: "Activate",
      className: "bg-green-600 hover:bg-green-700",
    },

    DRAFT: {
      text: "Activate",
      className: "bg-green-600 hover:bg-green-700",
    },
  };

  const config =
    buttonConfig[status] || {
      text: "Update",
      className: "bg-gray-600 hover:bg-gray-700",
    };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${config.className}
      disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {loading ? "Updating..." : config.text}
    </button>
  );
}

export default StatusToggleButton;