import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { isAuth, user } = useAuth();
    if (!isAuth) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />; 
}
