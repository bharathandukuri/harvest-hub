import { FaEnvelope, FaLock } from "react-icons/fa";
import useForm from "../../hooks/useForm";
import { FcGoogle } from "react-icons/fc";
import {
    isValidEmail,
    isValidPassword,
} from "../../hooks/auth/ValidateCredentials";
import axios from "axios";
import { BACKEND_URL } from "../../config/Config";
import { useNavigate } from "react-router-dom";

interface Session {
    token: string;
    tokenExpiry: string;
    user: { fullName: string; email: string; role: string };
}

function LoginPage() {
    const navigate = useNavigate();
    const { form, data, setLoading, loading, setMessage, setMessageType } =
        useForm({
            title: "Welcome Back!",
            description: "Sign in to your account to continue",
            inputs: [
                {
                    type: "email",
                    placeholder: "Email",
                    icon: <FaEnvelope />,
                    name: "email",
                },
                {
                    type: "password",
                    placeholder: "Password",
                    icon: <FaLock />,
                    name: "password",
                },
            ],
            forgotPassword: true,
            forgotPasswordClick() {
                navigate("/auth/forgot-password/otp");
            },
            submitLabel: "Login",
            socialLogin: true,
            socialButtons: [
                {
                    icon: <FcGoogle />,
                    label: "Continue with Google",
                },
                {
                    icon: (
                        <img
                            src="https://img.icons8.com/?size=100&id=22989&format=png&color=000000"
                            className="w-[20px] h-[20px]"
                        />
                    ),
                    label: "Continue with Microsoft",
                },
            ],
            submit: (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (loading) return;
                setLoading(true);

                function validateLoginData(data: any): string | undefined {
                    return (
                        isValidEmail(data.email) ||
                        isValidPassword(data.password)
                    );
                }

                const errorMessage = validateLoginData(data);
                if (errorMessage) {
                    setMessage(errorMessage);
                    setMessageType("warning");
                    setLoading(false);
                    return;
                }

                async function login() {
                    try {
                        const response = await axios
                            .post(BACKEND_URL + "/auth/login", data)
                            .then((data) => data.data);

                        setMessage(response.message);
                        setMessageType(response.type.toLowerCase());

                        if (response.code === "USER_NOT_VERIFIED") {
                            await axios.get(
                                BACKEND_URL +
                                    "/auth/resend-verification?email=" +
                                    data.email
                            );
                            navigate("/auth/verify-user/" + data.email);
                        } else if (response.code === "LOGIN_SUCCESS") {
                            const session: Session = response.data;

                            localStorage.setItem("token", session.token);
                            localStorage.setItem(
                                "tokenExpiry",
                                session.tokenExpiry
                            );
                            localStorage.setItem(
                                "fullName",
                                session.user.fullName
                            );
                            localStorage.setItem("email", session.user.email);
                            localStorage.setItem("roles", session.user.role);
                            navigate("/");
                        }
                    } catch (err) {
                        setMessage(
                            "Something went wrong. Please try again later."
                        );
                        setMessageType("error");
                    } finally {
                        setLoading(false);
                    }
                }

                login();
            },
            bottomMessage: "Don't have an account?",
            bottomButtonLabel: "Sign up",
            bottomButtonSubmit: () => {
                navigate("/auth/register");
            },
        });
    return form;
}
export default LoginPage;
