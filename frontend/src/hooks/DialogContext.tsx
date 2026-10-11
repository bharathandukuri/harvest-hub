import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
    useCallback,
} from "react";
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import Dialog from "../components/Dialog";

interface DialogButton {
    label: ReactNode;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger" | "info";
    className?: string;
    ref?: React.RefObject<HTMLButtonElement>;
}

export interface DialogPropsForProvider {
    title: ReactNode;
    description?: ReactNode;
    children?: React.ReactNode;
    initialFocusRef?: React.RefObject<HTMLElement>;
    className?: string;
    overlayClassName?: string;
    sticky?: boolean;
    hideCloseButton?: boolean;
    showSpinner?: boolean;
    spinnerMessage?: string;
    showSuccessIcon?: boolean;
    successMessage?: string;
    showErrorIcon?: boolean;
    errorMessage?: string;
    buttons?: DialogButton[];
}

interface DialogContextType {
    openDialog: (props: DialogPropsForProvider) => void;
    closeDialog: () => void;
    updateDialog: (props: Partial<DialogPropsForProvider>) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProviderProps {
    children: ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] =
        useState<DialogPropsForProvider | null>(null);

    const openDialog = useCallback((props: DialogPropsForProvider) => {
        setDialogProps(props);
        setIsOpen(true);
    }, []);

    const closeDialog = useCallback(() => {
        setIsOpen(false);
        setTimeout(() => setDialogProps(null), 300);
    }, []);

    const updateDialog = useCallback(
        (props: Partial<DialogPropsForProvider>) => {
            setDialogProps((prev) => (prev ? { ...prev, ...props } : null));
        },
        []
    );

    const renderDialogContent = () => {
        if (!dialogProps) return null;

        const {
            children,
            showSpinner,
            spinnerMessage = "Loading...",
            showSuccessIcon,
            successMessage = "Operation successful!",
            showErrorIcon,
            errorMessage = "An error occurred.",
            buttons,
        } = dialogProps;

        if (showSpinner) {
            return (
                <div className="flex flex-col items-center justify-center p-4">
                    <FaSpinner className="animate-spin text-green-600 text-4xl mb-4" />
                    <p className="text-xl font-semibold text-gray-800">
                        {spinnerMessage}
                    </p>
                </div>
            );
        } else if (showSuccessIcon) {
            return (
                <div className="flex flex-col items-center justify-center p-4">
                    <FaCheckCircle className="text-green-500 text-5xl mb-4" />
                    <p className="text-xl font-semibold text-gray-800 text-center">
                        {successMessage}
                    </p>
                    {buttons && buttons.length > 0 && (
                        <div className="flex justify-center space-x-4 mt-6 w-full">
                            {buttons.map((button, index) => (
                                <button
                                    key={index}
                                    onClick={button.onClick}
                                    className={`px-6 py-3 rounded-md font-medium transition-colors ${getButtonClasses(
                                        button.variant
                                    )} ${button.className || ""}`}
                                    ref={button.ref}
                                >
                                    {button.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            );
        } else if (showErrorIcon) {
            return (
                <div className="flex flex-col items-center justify-center p-4">
                    <FaExclamationCircle className="text-red-500 text-5xl mb-4" />
                    <p className="text-xl font-semibold text-gray-800 text-center">
                        {errorMessage}
                    </p>
                    {buttons && buttons.length > 0 && (
                        <div className="flex justify-center space-x-4 mt-6 w-full">
                            {buttons.map((button, index) => (
                                <button
                                    key={index}
                                    onClick={button.onClick}
                                    className={`px-6 py-3 rounded-md font-medium transition-colors ${getButtonClasses(
                                        button.variant
                                    )} ${button.className || ""}`}
                                    ref={button.ref}
                                >
                                    {button.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <>
                {children}
                {buttons && buttons.length > 0 && (
                    <div className="flex justify-end space-x-4 mt-6">
                        {buttons.map((button, index) => (
                            <button
                                key={index}
                                onClick={button.onClick}
                                className={`px-6 py-3 rounded-md font-medium transition-colors ${getButtonClasses(
                                    button.variant
                                )} ${button.className || ""}`}
                                ref={button.ref}
                            >
                                {button.label}
                            </button>
                        ))}
                    </div>
                )}
            </>
        );
    };

    const getButtonClasses = (
        variant?: "primary" | "secondary" | "danger" | "info"
    ) => {
        switch (variant) {
            case "primary":
                return "bg-green-600 text-white hover:bg-green-700";
            case "secondary":
                return "bg-gray-200 text-gray-800 hover:bg-gray-300";
            case "danger":
                return "bg-red-600 text-white hover:bg-red-700";
            case "info":
                return "bg-blue-500 text-white hover:bg-blue-600";
            default:
                return "bg-gray-200 text-gray-800 hover:bg-gray-300";
        }
    };

    return (
        <DialogContext.Provider
            value={{ openDialog, closeDialog, updateDialog }}
        >
            {children}
            {dialogProps && (
                <Dialog
                    isOpen={isOpen}
                    onClose={closeDialog}
                    title={dialogProps.title}
                    description={dialogProps.description}
                    initialFocusRef={dialogProps.initialFocusRef}
                    className={dialogProps.className}
                    overlayClassName={dialogProps.overlayClassName}
                    sticky={dialogProps.sticky}
                    hideCloseButton={dialogProps.hideCloseButton}
                >
                    {renderDialogContent()}
                </Dialog>
            )}
        </DialogContext.Provider>
    );
};

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (context === undefined) {
        throw new Error("useDialog must be used within a DialogProvider");
    }
    return context;
};
