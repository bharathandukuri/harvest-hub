import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import useForm from "../../hooks/useForm";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { BACKEND_URL } from "../../config/Config";
import {
    isValidEmail,
    isValidName,
    isValidPassword,
} from "../../hooks/auth/ValidateCredentials";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();
    const { form, data, setLoading, loading, setMessage, setMessageType } =
        useForm({
            title: "Create Account",
            description: "Sign up now and checkout exclusive deals.",
            inputs: [
                {
                    type: "text",
                    placeholder: "Full Name",
                    icon: <FaUser />,
                    name: "fullName",
                },
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
                {
                    type: "password",
                    placeholder: "Confirm Password",
                    icon: <FaLock />,
                    name: "confirmPassword",
                },
            ],
            forgotPassword: false,
            submitLabel: "Register",
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
                            alt="Microsoft"
                        />
                    ),
                    label: "Continue with Microsoft",
                },
            ],
            submit: (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (loading) return;

                setLoading(true);

                function validateRegistrationData(
                    data: any
                ): string | undefined {
                    const { fullName, email, password, confirmPassword } = data;

                    return (
                        isValidName(fullName) ||
                        isValidEmail(email) ||
                        isValidPassword(password) ||
                        (password !== confirmPassword
                            ? "Passwords don't match."
                            : undefined)
                    );
                }

                const errorMessage = validateRegistrationData(data);
                if (errorMessage) {
                    setMessage(errorMessage);
                    setMessageType("warning");
                    setLoading(false);
                    return;
                }

                setMessage("");

                async function register() {
                    try {
                        const response = await axios
                            .post(BACKEND_URL + "/auth/register", data)
                            .then((data) => data.data);
                        setMessage(response.message);
                        setMessageType(response.type.toLowerCase());
                        if (response.code === "REGISTRATION_SUCCESS") {
                            setTimeout(() => {
                                navigate(`/auth/verify-user/${data.email}`);
                            }, 3000);
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

                register();
            },
            bottomMessage: "Already have an account?",
            bottomButtonLabel: "Sign in",
            bottomButtonSubmit() {
                navigate("/auth/login");
            },
        });

    return form;
}

export default RegisterPage;
