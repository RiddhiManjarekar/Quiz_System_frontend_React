import useAuthStore from "../../store/authStore";
import useAuth from "../../hooks/useAuth";

function Navbar({ onMenuClick }) {
  const { name, role } = useAuthStore();
  const { logoutUser } = useAuth();

  const roleColors = {
    ADMIN: "bg-red-100 text-red-700",
    TEACHER: "bg-blue-100 text-blue-700",
    STUDENT: "bg-green-100 text-green-700",
  };

  const roleIcons = {
    ADMIN: "👑",
    TEACHER: "👨‍🏫",
    STUDENT: "🎓",
  };

  const initials =
    name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-16 w-full min-w-0 items-center justify-between
        border-b border-gray-200
        bg-white/95
        px-4
        shadow-sm
        backdrop-blur
        sm:px-5
        lg:px-6
      "
    >
      {/* Left */}

      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile Menu */}

        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="
            rounded-lg
            p-2
            transition
            hover:bg-gray-100
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            lg:hidden
          "
        >
          ☰
        </button>

        <div className="min-w-0">
          <h1 className="hidden text-lg font-semibold text-gray-800 md:block">
            Welcome back 👋
          </h1>

          <p className="max-w-[180px] truncate text-sm text-gray-500 sm:max-w-xs">
            {name}
          </p>
        </div>
      </div>

      {/* Right */}

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Role */}

        <span
          className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex ${
            roleColors[role] ?? "bg-gray-100 text-gray-700"
          }`}
        >
          {roleIcons[role]}&nbsp;{role}
        </span>

        {/* Avatar */}

        <div
          aria-hidden="true"
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full
            bg-blue-600
            text-sm
            font-bold
            text-white
            sm:h-10 sm:w-10
          "
        >
          {initials}
        </div>

        {/* Logout */}

        <button
          onClick={logoutUser}
          className="
            rounded-lg
            bg-red-500
            px-3 py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-red-600
            focus:outline-none
            focus:ring-2
            focus:ring-red-500
            active:scale-95
          "
        >
          <span className="hidden sm:inline">
            Logout
          </span>

          <span className="sm:hidden">
            🚪
          </span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;