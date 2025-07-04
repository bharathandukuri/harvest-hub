import { useState, type ReactNode, useEffect } from "react";
import {
    FaCheckCircle,
    FaEnvelope,
    FaExclamationTriangle,
    FaEye,
    FaEyeSlash,
    FaInfoCircle,
    FaLock,
    FaTimesCircle,
} from "react-icons/fa";

interface Input {
    type: "email" | "password" | "text" | "otp";
    placeholder: string;
    icon: ReactNode;
    name: string;
}

interface SocialButton {
    icon: ReactNode;
    label: string;
}

interface FormProps {
    title: string;
    description: string;
    inputs: Input[];
    forgotPassword: boolean;
    forgotPasswordClick?: () => void;
    submitLabel: string;
    socialLogin?: boolean;
    socialButtons?: SocialButton[];
    submit: (e: React.FormEvent<HTMLFormElement>) => void;
    bottomMessage: string;
    bottomButtonLabel: string;
    bottomButtonSubmit?: () => void;
    resendOtp?: boolean;
    onResendOtp?: () => void;
}

export type MessageType = "success" | "error" | "info" | "warning";

export const MessageType = {
    SUCCESS: "success" as MessageType,
    ERROR: "error" as MessageType,
    INFO: "info" as MessageType,
    WARNING: "warning" as MessageType,
};

interface useFormReturntype {
    form: ReactNode;
    data: Record<string, string>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setMessageType: React.Dispatch<React.SetStateAction<MessageType>>;
}

function useForm(props: FormProps): useFormReturntype {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<MessageType>(
        MessageType.INFO
    );
    const [inputValues, setInputValues] = useState<Record<string, string>>(() =>
        props.inputs.reduce((acc, input) => {
            acc[input.name] = "";
            return acc;
        }, {} as Record<string, string>)
    );

    const [activeIndex, setActiveIndex] = useState(0);
    const [countdown, setCountdown] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    useEffect(() => {
        if (!props.resendOtp) return;

        if (countdown > 0 && isResendDisabled) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setIsResendDisabled(false);
        }
    }, [countdown, props.resendOtp, isResendDisabled]);

    const handleResendClick = () => {
        if (props.onResendOtp) {
            props.onResendOtp();
        }
        setCountdown(60);
        setIsResendDisabled(true);
    };

    const getMessageStyle = (type: MessageType) => {
        switch (type) {
            case MessageType.SUCCESS:
                return {
                    icon: <FaCheckCircle className="text-green-600 text-lg" />,
                    classes: "bg-green-100 text-green-700 border-green-400",
                };
            case MessageType.ERROR:
                return {
                    icon: <FaTimesCircle className="text-red-600 text-lg" />,
                    classes: "bg-red-100 text-red-700 border-red-400",
                };
            case MessageType.WARNING:
                return {
                    icon: (
                        <FaExclamationTriangle className="text-yellow-600 text-lg" />
                    ),
                    classes: "bg-yellow-100 text-yellow-800 border-yellow-400",
                };
            case MessageType.INFO:
            default:
                return {
                    icon: <FaInfoCircle className="text-blue-600 text-lg" />,
                    classes: "bg-blue-100 text-blue-700 border-blue-400",
                };
        }
    };

    const input = (
        type: string,
        placeholder: string,
        id: string,
        name: string
    ): ReactNode => {
        switch (type) {
            case "text":
            case "email":
                return (
                    <div className="flex items-center mb-4 border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 w-full">
                        <label className="pl-3 pr-2 text-gray-400" htmlFor={id}>
                            <FaEnvelope />
                        </label>
                        <input
                            type={type}
                            id={id}
                            onChange={(e) => {
                                setInputValues((prev) => ({
                                    ...prev,
                                    [name]: e.target.value,
                                }));
                            }}
                            name={name}
                            placeholder={placeholder}
                            className="flex-1 p-2 outline-none bg-transparent"
                        />
                    </div>
                );
            case "password":
                return (
                    <div className="flex items-center mb-4 border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 w-full transition-all">
                        <label className="pl-3 pr-2 text-gray-400" htmlFor={id}>
                            <FaLock />
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id={id}
                            placeholder={placeholder}
                            onChange={(e) => {
                                setInputValues((prev) => ({
                                    ...prev,
                                    [name]: e.target.value,
                                }));
                            }}
                            name={name}
                            className="flex-1 p-2 outline-none bg-transparent text-gray-800"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            className="px-3 text-gray-400 hover:text-blue-500 focus:outline-none"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                );
            case "otp":
                const otpValue = inputValues[name] || "";

                const handleOnChange = (
                    e: React.ChangeEvent<HTMLInputElement>
                ) => {
                    const newDigit = e.target.value.replace(/\D/g, "");
                    if (newDigit) {
                        setInputValues((prev) => {
                            const chars = (prev[name] || "").split("");
                            chars[activeIndex] = newDigit;
                            return {
                                ...prev,
                                [name]: chars.join("").slice(0, 6),
                            };
                        });
                        if (activeIndex < 5) {
                            setActiveIndex(activeIndex + 1);
                            document
                                .getElementById(
                                    `${name}-otp-${activeIndex + 1}`
                                )
                                ?.focus();
                        }
                    }
                };

                const handleOnKeyDown = (
                    e: React.KeyboardEvent<HTMLInputElement>
                ) => {
                    switch (e.key) {
                        case "Backspace":
                            e.preventDefault();
                            setInputValues((prev) => {
                                const chars = (prev[name] || "").split("");
                                if (chars[activeIndex]) chars[activeIndex] = "";
                                else if (activeIndex > 0)
                                    chars[activeIndex - 1] = "";
                                return { ...prev, [name]: chars.join("") };
                            });
                            if (activeIndex > 0) {
                                setActiveIndex(activeIndex - 1);
                                document
                                    .getElementById(
                                        `${name}-otp-${activeIndex - 1}`
                                    )
                                    ?.focus();
                            }
                            break;
                        case "ArrowLeft":
                            if (activeIndex > 0) {
                                setActiveIndex(activeIndex - 1);
                                document
                                    .getElementById(
                                        `${name}-otp-${activeIndex - 1}`
                                    )
                                    ?.focus();
                            }
                            break;
                        case "ArrowRight":
                            if (activeIndex < 5) {
                                setActiveIndex(activeIndex + 1);
                                document
                                    .getElementById(
                                        `${name}-otp-${activeIndex + 1}`
                                    )
                                    ?.focus();
                            }
                            break;
                    }
                };

                const handleOnPaste = (
                    e: React.ClipboardEvent<HTMLDivElement>
                ) => {
                    e.preventDefault();
                    const pastedData = e.clipboardData
                        .getData("text")
                        .replace(/\D/g, "")
                        .slice(0, 6);
                    if (pastedData) {
                        setInputValues((prev) => ({
                            ...prev,
                            [name]: pastedData,
                        }));
                        const lastDigitIndex = Math.max(
                            0,
                            pastedData.length - 1
                        );
                        setActiveIndex(lastDigitIndex);
                        setTimeout(
                            () =>
                                document
                                    .getElementById(
                                        `${name}-otp-${lastDigitIndex}`
                                    )
                                    ?.focus(),
                            0
                        );
                    }
                };

                return (
                    <>
                        <div
                            className="flex gap-3 justify-center"
                            onPaste={handleOnPaste}
                        >
                            {Array.from({ length: 6 }).map((_, i) => (
                                <input
                                    key={i}
                                    id={`${name}-otp-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={otpValue[i] || ""}
                                    onChange={handleOnChange}
                                    onKeyDown={handleOnKeyDown}
                                    onFocus={() => setActiveIndex(i)}
                                    className={`w-12 h-14 text-center text-2xl font-semibold text-gray-800 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        otpValue[i]
                                            ? "border-blue-400"
                                            : "border-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        {props.resendOtp && (
                            <div className="w-full text-center mt-4 mb-2">
                                <button
                                    type="button"
                                    disabled={isResendDisabled}
                                    onClick={handleResendClick}
                                    className="text-sm font-semibold text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed hover:underline"
                                >
                                    {isResendDisabled
                                        ? `Resend OTP in ${countdown}s`
                                        : "Resend OTP"}
                                </button>
                            </div>
                        )}
                    </>
                );
            default:
                return <></>;
        }
    };

    const form = (
        <div className="flex items-center justify-center py-15">
            <form onSubmit={props.submit}>
                <div className="flex flex-col border-2 max-w-[450px] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] border-gray-300 rounded-lg shadow-lg p-10 items-center">
                    <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        {props.title}
                    </h1>
                    <span className="text-gray-600 mb-6">
                        {props.description}
                    </span>

                    {message && (
                        <div
                            className={`w-full text-sm font-medium px-4 py-2 rounded border mb-4 flex items-center gap-2 ${
                                getMessageStyle(messageType).classes
                            }`}
                        >
                            {getMessageStyle(messageType).icon}
                            <span>{message}</span>
                        </div>
                    )}

                    {props.inputs.map((value, index) => (
                        <div key={value.name} className="w-full">
                            {input(
                                value.type,
                                value.placeholder,
                                index.toString(),
                                value.name
                            )}
                        </div>
                    ))}

                    {props.forgotPassword && (
                        <div className="w-full text-right mb-6">
                            <span
                                className="text-sm text-blue-500 hover:underline font-semibold cursor-pointer"
                                onClick={props.forgotPasswordClick}
                            >
                                Forgot password?
                            </span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`p-2 w-full rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                            loading
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span className="sr-only">Loading...</span>
                            </>
                        ) : (
                            props.submitLabel
                        )}
                    </button>

                    {props.socialLogin &&
                        props.socialButtons &&
                        props.socialButtons.length > 0 && (
                            <>
                                <div className="flex items-center my-4 text-gray-500 w-full">
                                    <div className="border-t border-gray-300 flex-grow" />
                                    <span className="px-3 text-gray-500 text-sm">
                                        OR
                                    </span>
                                    <div className="border-t border-gray-300 flex-grow" />
                                </div>

                                {props.socialButtons.map((button, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        className="p-2 flex items-center justify-center gap-2 border rounded-lg border-gray-300 w-full font-semibold text-gray-800 hover:bg-gray-100 transition-colors duration-200 shadow-sm mb-4"
                                    >
                                        <span className="text-xl">
                                            {button.icon}
                                        </span>
                                        {button.label}
                                    </button>
                                ))}
                            </>
                        )}

                    <div className="mt-4 text-gray-600">
                        {props.bottomMessage}{" "}
                        <a
                            href="#"
                            className="text-blue-500 hover:underline"
                            onClick={
                                props.bottomButtonSubmit
                                    ? props.bottomButtonSubmit
                                    : () => {}
                            }
                        >
                            {props.bottomButtonLabel}
                        </a>
                    </div>
                </div>
            </form>
        </div>
    );

    return {
        form,
        data: inputValues,
        setLoading,
        loading,
        setMessage,
        setMessageType,
    };
}

export default useForm;
