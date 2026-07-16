import { Outlet, NavLink } from "react-router-dom";
import useAuthStore from "../store/authStore";

function AdminLayout() {

    const { name, role } = useAuthStore();

    return (

        <div className="min-h-screen flex bg-gray-100">

            {/* Sidebar */}

            <aside className="w-64 bg-gray-900 text-white p-6">

                <h2 className="text-2xl font-bold mb-8">
                    Admin Panel
                </h2>

                <nav className="space-y-2">

  <NavLink
    to="/admin/dashboard"
    className={({ isActive }) =>
      `block rounded-lg px-4 py-2 transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-800"
      }`
    }
  >
    📊 Dashboard
  </NavLink>

  <NavLink
    to="/admin/students"
    className={({ isActive }) =>
      `block rounded-lg px-4 py-2 transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-800"
      }`
    }
  >
    🎓 Students
  </NavLink>

  <NavLink
    to="/admin/teachers"
    className={({ isActive }) =>
      `block rounded-lg px-4 py-2 transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-800"
      }`
    }
  >
    👨‍🏫 Teachers
  </NavLink>

  <NavLink
    to="/admin/quizzes"
    className={({ isActive }) =>
      `block rounded-lg px-4 py-2 transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-800"
      }`
    }
  >
    📝 Quizzes
  </NavLink>

</nav>

            </aside>

            {/* Main Content */}

            <main className="flex-1">

                {/* Navbar */}

                <header className="bg-white shadow px-8 py-4 flex justify-between">

                    <h1 className="text-xl font-semibold">
                        Quiz Management System
                    </h1>

                    <div>

                        <p className="font-semibold">
                            {name}
                        </p>

                        <p className="text-sm text-gray-500">
                            {role}
                        </p>

                    </div>

                </header>

                <div className="p-8">

                    <Outlet />

                </div>

            </main>

        </div>

    );

}

export default AdminLayout;