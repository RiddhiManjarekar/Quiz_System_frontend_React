import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

function ProtectedRoute({ allowedRoles }) {

    const token = useAuthStore((state) => state.token);
    const role = useAuthStore((state) => state.role);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(role)
    ) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;