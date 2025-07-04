import { FaEnvelope } from "react-icons/fa";
import useForm from "../../hooks/useForm";
import axios from "axios";
import { BACKEND_URL } from "../../config/Config";
import { isValidEmail } from "../../hooks/auth/ValidateCredentials";
import { useNavigate } from "react-router-dom";

function ResendVerificationPage() {
    const navigate = useNavigate();

    const { form, setLoading, loading, setMessage, setMessageType, data } =
        useForm({
            title: "Resend Verification",
            description: "Enter your email address to send the OTP.",
            inputs: [
                {
                    type: "email",
                    placeholder: "Email",
                    icon: <FaEnvelope />,
                    name: "email",
                },
            ],
            forgotPassword: false,
            submitLabel: "Resend OTP",
            socialLogin: false,
            bottomMessage: "Already verified?",
            bottomButtonLabel: "Go to Login",
            bottomButtonSubmit: () => {
                console.log("Navigating to login page...");
            },
            resendOtp: false,
            submit: (e) => {
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

                async function resendVerification() {
                    try {
                        const response = await axios
                            .get(
                                BACKEND_URL +
                                    "/auth/resend-verification?email=" +
                                    email
                            )
                            .then((data) => data.data);
                        setMessage(response.message);
                        setMessageType(response.type.toLowerCase());

                        if (response.code === "VERIFICATION_SENT") {
                            setTimeout(() => {
                                navigate("/auth/verify-user?email=" + email);
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

                resendVerification();
            },
        });

    return form;
}
export default ResendVerificationPage;
