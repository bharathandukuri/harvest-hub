import { useNavigate, useParams } from "react-router-dom";
import useForm from "../../hooks/useForm";
import axios from "axios";
import { BACKEND_URL } from "../../config/Config";

function VerificationPage() {
    const email = useParams().email;
    const navigate = useNavigate();

    const { form, data, setLoading, loading, setMessage, setMessageType } =
        useForm({
            title: "Verify Your Account",
            description: "We've sent a 6-digit code to " + email,

            inputs: [
                {
                    type: "otp",
                    name: "otp",
                    placeholder: "",
                    icon: <></>,
                },
            ],

            submitLabel: "Verify Account",
            submit: (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                if (loading) return;

                setLoading(true);

                const { otp } = data;

                async function verify() {
                    try {
                        const response = await axios
                            .post(
                                BACKEND_URL +
                                    "/auth/verify-account?email=" +
                                    email +
                                    "&otp=" +
                                    otp
                            )
                            .then((data) => data.data);
                        setMessage(response.message);
                        setMessageType(response.type.toLowerCase());
                        if (response.code === "INVALID_OTP") {
                            setTimeout(() => {
                                navigate("/auth/resend-verification");
                            }, 3000);
                        }
                        if (response.code === "USER_VERIFIED") {
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

                verify();
            },

            resendOtp: true,
            async onResendOtp() {
                if (loading) return;
                setLoading(true);
                const response = await axios
                    .get(
                        BACKEND_URL + "/auth/resend-verification?email=" + email
                    )
                    .then((data) => data.data);
                setMessage(response.message);
                setMessageType(response.type.toLowerCase());
                setLoading(false);
            },

            bottomMessage: "Need to start over?",
            bottomButtonLabel: "Return to Login",
            bottomButtonSubmit: () => {
                navigate("/auth/login");
            },

            forgotPassword: false,
            socialLogin: false,
        });
    return form;
}
export default VerificationPage;
