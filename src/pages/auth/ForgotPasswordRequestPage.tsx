import { FaEnvelope } from "react-icons/fa";
import useForm from "../../hooks/useForm";
import axios from "axios";
import { BACKEND_URL } from "../../config/Config";
import { isValidEmail } from "../../hooks/auth/ValidateCredentials";
import { useNavigate } from "react-router-dom";

function ForgotPasswordRequestPage() {
    const navigate = useNavigate();
    const { form, setLoading, setMessage, loading, setMessageType, data } =
        useForm({
            title: "Forgot Password",
            description: "Enter your email to receive a password reset OTP.",
            inputs: [
                {
                    type: "email",
                    placeholder: "Email",
                    icon: <FaEnvelope />,
                    name: "email",
                },
            ],
            forgotPassword: false,
            submitLabel: "Send OTP",
            socialLogin: false,
            bottomMessage: "Remembered your password?",
            bottomButtonLabel: "Go to Login",
            bottomButtonSubmit: () => {
                navigate("/auth/login");
            },
            submit: (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                if (loading) return;

                setLoading(true);
                const { email } = data;
                const message = isValidEmail(email);
                if (message) {
                    setMessage(message);
                    setMessageType("warning");
                    setLoading(false);
                    return;
                }
                setMessage("");
                async function sendOtp() {
                    try {
                        const response = await axios
                            .get(
                                BACKEND_URL +
                                    "/auth/forgot-password/otp?email=" +
                                    email
                            )
                            .then((data) => data.data);
                        setMessage(response.message);
                        setMessageType(response.type.toLowerCase());
                        if (response.code === "VERIFICATION_SENT") {
                            setTimeout(() => {
                                navigate(
                                    `/auth/forgot-password/verify/${email}`
                                );
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
                sendOtp();
            },
        });
    return form;
}
export default ForgotPasswordRequestPage;
