import React from "react";
import { CgSpinner } from "react-icons/cg";

interface LoadingDialogProps {
    visible: boolean;
    message?: string;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({ visible, message }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/20 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
                <CgSpinner className="animate-spin text-4xl text-green-600" />
                <p className="text-gray-800 text-lg font-medium">
                    {message || "Loading..."}
                </p>
            </div>
        </div>
    );
};

export default LoadingDialog;
