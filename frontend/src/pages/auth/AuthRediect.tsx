import { Navigate } from "react-router-dom";
import { isValidSession } from "../../hooks/auth/SessionValidation";
import type { JSX } from "react";

interface AuthRedirectProps {
    children: JSX.Element;
}

function AuthRedirect({ children }: AuthRedirectProps): JSX.Element {
    if (isValidSession()) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AuthRedirect;
