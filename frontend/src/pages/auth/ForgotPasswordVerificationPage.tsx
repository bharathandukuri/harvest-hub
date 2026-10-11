import { useNavigate, useParams } from "react-router-dom";
import useForm from "../../hooks/useForm";
import axios from "axios";
import { BACKEND_URL } from "../../config/Config";

function ForgotPasswordVerification() {
    const navigate = useNavigate();
    const email = useParams().email;
    const { form, data, setLoading, loading, setMessage, setMessageType } =
        useForm({
            title: "Verify OTP",
            description: `Enter the OTP sent to ${email}`,
            inputs: [
                {
                    type: "otp",
                    name: "otp",
                    placeholder: "",
                    icon: <></>,
                },
            ],
            submitLabel: "Verify OTP",
            submit: (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                if (loading) return;

                setLoading(true);
                const { otp } = data;
                async function verifyOtp() {
                    try {
                        const response = await axios
                            .post(
                                BACKEND_URL +
                                    `/auth/forgot-password/verify?email=${email}&otp=${otp}`
                            )
                            .then((data) => data.data);
                        setMessage(response.message);
                        setMessageType(response.type.toLowerCase());
                        if (response.code === "USER_VERIFIED") {
                            setTimeout(() => {
                                navigate(`/auth/reset-password/${email}`);
                            }, 3000);
                        }
                        if (response.code === "INVALID_OTP") {
                            setTimeout(() => {
                                navigate("/auth/forgot-password/otp");
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
                verifyOtp();
            },
            resendOtp: true,
            async onResendOtp() {
                if (loading) return;
                setLoading(true);
                const response = await axios
                    .get(
                        BACKEND_URL + `/auth/forgot-password/otp?email=${email}`
                    )
                    .then((data) => data.data);
                setMessage(response.message);
                setMessageType(response.type.toLowerCase());
                setLoading(false);
            },
            bottomMessage: "Didn't receive the OTP?",
            bottomButtonLabel: "Resend OTP",
            bottomButtonSubmit: () => {
                navigate("/auth/forgot-password/otp");
            },
            forgotPassword: false,
            socialLogin: false,
        });
    return form;
}
export default ForgotPasswordVerification;
