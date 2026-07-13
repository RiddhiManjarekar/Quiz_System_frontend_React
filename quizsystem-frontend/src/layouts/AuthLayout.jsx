import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                {/* Logo / Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">
                        Quiz System
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Online Quiz Management System
                    </p>
                </div>

                {/* Login / Register Page */}
                <Outlet />

            </div>

        </div>
    );
}

export default AuthLayout;