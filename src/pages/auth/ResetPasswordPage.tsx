import { FaLock } from "react-icons/fa";
import useForm from "../../hooks/useForm";
import axios from "axios";
import { BACKEND_URL } from "../../config/Config";
import { isValidPassword } from "../../hooks/auth/ValidateCredentials";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
    const navigate = useNavigate();
    const email = useParams().email;
    const { form, data, setLoading, loading, setMessage, setMessageType } =
        useForm({
            title: "Reset Password",
            description: "Enter your new password below.",
            inputs: [
                {
                    type: "password",
                    placeholder: "New Password",
                    icon: <FaLock />,
                    name: "newPassword",
                },
                {
                    type: "password",
                    placeholder: "Confirm New Password",
                    icon: <FaLock />,
                    name: "confirmPassword",
                },
            ],
            forgotPassword: false,
            submitLabel: "Reset Password",
            socialLogin: false,
            bottomMessage: "Back to login?",
            bottomButtonLabel: "Login",
            bottomButtonSubmit: () => {
                navigate("/auth/login");
            },
            submit: (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                if (loading) return;

                setLoading(true);
                const { newPassword, confirmPassword } = data;
                const message = isValidPassword(newPassword);
                if (message) {
                    setMessage(message);
                    setMessageType("warning");
                }
                if (newPassword !== confirmPassword) {
                    setMessage("Passwords do not match.");
                    setMessageType("warning");
                    setLoading(false);
                    return;
                }
                setMessage("");
                async function reset() {
                    try {
                        const response = await axios
                            .post(BACKEND_URL + `/auth/reset-password`, {
                                email,
                                password: newPassword,
                            })
                            .then((data) => data.data);
                        setMessage(response.message);
                        setMessageType(response.type.toLowerCase());
                        if (response.code === "UNAUTHORIZED") {
                            setTimeout(() => {
                                navigate("/auth/forgot-password/otp");
                            }, 3000);
                        }
                        if (response.code === "PASSWORD_RESET_SUCCESS") {
                            setTimeout(() => {
                                navigate("/auth/login");
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
                reset();
            },
        });
    return form;
}
export default ResetPassword;
