import axios from "axios";
import { BACKEND_URL } from "../../config/Config";
import { useDialog } from "../DialogContext";

interface SessionDetails {
    token: string | null;
    tokenExpiry: string | null;
    fullName: string | null;
    email: string | null;
    role: string | null;
}

export function isValidSession(): boolean {
    const token = localStorage.getItem("token");
    const expiryStr = localStorage.getItem("tokenExpiry");

    if (!token || !expiryStr) return false;

    const expiry = new Date(expiryStr);
    if (isNaN(expiry.getTime())) return false;

    return expiry > new Date();
}

export function getSessionDetails(): SessionDetails {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const fullName = localStorage.getItem("fullName");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    return {
        token,
        tokenExpiry,
        fullName,
        email,
        role,
    };
}

export function logoutSession() {
    localStorage.clear();
}

export async function fetchAndUpdateSessionDetails(): Promise<void> {
    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
        logoutSession();
        return;
    }

    try {
        const response = await axios.get(`${BACKEND_URL}/auth/user`, {
            params: { token },
        });

        const user = response.data?.data;
        if (user) {
            localStorage.setItem("email", user.email);
            localStorage.setItem("fullName", user.fullName);
            localStorage.setItem("role", user.role);
        } else {
            logoutSession();
        }
    } catch (error) {
        logoutSession();
    }
}
