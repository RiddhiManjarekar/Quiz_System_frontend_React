import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import useAuthStore from "../store/authStore";

// Navigation configuration
const NAV_ITEMS = [
  { to: "/student/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/student/quizzes", label: "Available Quizzes", icon: "📝" },
  { to: "/student/results", label: "My Results", icon: "📈" },
];

function StudentLayout() {
  const { name, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = useCallback(() => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login", { replace: true });
    }
  }, [logout, navigate]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Get user initials for avatar
  const userInitial = name?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-gradient-to-b from-green-700 to-green-800 
          text-white flex flex-col shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="p-6 border-b border-green-600/30">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">🎓</span>
            Student Panel
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) => `
                flex items-center gap-3 rounded-lg px-4 py-3 
                transition-all duration-200
                ${isActive
                  ? "bg-green-800 shadow-lg ring-1 ring-green-500/50"
                  : "hover:bg-green-600/50 hover:translate-x-1"
                }
              `}
            >
              <span className="text-xl" aria-hidden="true">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout - ONLY PLACE where user name appears */}
        <div className="p-4 border-t border-green-600/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-green-500/30 flex items-center justify-center text-lg font-bold ring-2 ring-green-400/50">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{name || "Student"}</p>
              <p className="text-sm text-green-200/80 truncate">
                {role || "Student"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600/90 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 hover:shadow-lg active:scale-95"
          >
            <span aria-hidden="true">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header - NO USERNAME HERE */}
        <header className="bg-white shadow-sm px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h1 className="text-lg md:text-xl font-semibold text-gray-800">
              Quiz Management System
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Online Status */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default StudentLayout;