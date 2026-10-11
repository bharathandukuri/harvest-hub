import { Navigate } from "react-router-dom";
import {
    getSessionDetails,
    isValidSession,
} from "../hooks/auth/SessionValidation";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRole: string;
}

export default function ProtectedRoute({
    children,
    allowedRole,
}: ProtectedRouteProps) {
    const isLoggedIn = isValidSession();
    const { role } = getSessionDetails();

    if (!isLoggedIn) return <Navigate to="/auth/login" />;

    const hasAccess = role===allowedRole;
    if (!hasAccess) return <Navigate to="/" />;

    return children;
}
