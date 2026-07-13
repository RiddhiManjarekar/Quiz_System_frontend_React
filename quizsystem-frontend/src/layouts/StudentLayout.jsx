import { Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

function StudentLayout() {

    const { name, role } = useAuthStore();

    return (

        <div className="min-h-screen flex bg-gray-100">

            <aside className="w-64 bg-green-700 text-white p-6">

                <h2 className="text-2xl font-bold mb-8">
                    Student Panel
                </h2>

                <nav className="space-y-4">

                    <p>Dashboard</p>

                    <p>Available Quizzes</p>

                    <p>Results</p>

                </nav>

            </aside>

            <main className="flex-1">

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

export default StudentLayout;