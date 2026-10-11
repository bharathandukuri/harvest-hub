import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactNode;
    description?: React.ReactNode;
    children: React.ReactNode;
    initialFocusRef?: React.RefObject<HTMLElement>;
    className?: string;
    overlayClassName?: string;
    sticky?: boolean;
    hideCloseButton?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    initialFocusRef,
    className,
    overlayClassName,
    sticky = false,
    hideCloseButton = false,
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const titleId = React.useId();
    const descriptionId = React.useId();

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !sticky && !hideCloseButton) {
                onClose();
            }
            if (event.key === "Tab" && dialogRef.current) {
                const focusableElements = dialogRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[
                    focusableElements.length - 1
                ] as HTMLElement;

                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement?.focus();
                        event.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement?.focus();
                        event.preventDefault();
                    }
                }
            }
        };

        const previouslyFocusedElement =
            document.activeElement as HTMLElement | null;

        if (initialFocusRef?.current) {
            initialFocusRef.current.focus();
        } else if (dialogRef.current) {
            dialogRef.current.focus();
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            if (
                previouslyFocusedElement &&
                document.body.contains(previouslyFocusedElement)
            ) {
                previouslyFocusedElement.focus();
            }
        };
    }, [isOpen, onClose, initialFocusRef, sticky, hideCloseButton]);

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${
                overlayClassName || ""
            }`}
            onClick={sticky ? undefined : onClose}
            aria-modal="true"
            role="dialog"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
        >
            <div
                ref={dialogRef}
                className={`relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-lg w-full
                            transform transition-all duration-300 scale-95 opacity-0
                            ${isOpen ? "scale-100 opacity-100" : ""} ${
                    className || ""
                }`}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                    <h2
                        id={titleId}
                        className="text-2xl font-bold text-gray-800"
                    >
                        {title}
                    </h2>
                    {!hideCloseButton && (
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full p-2"
                            aria-label="Close dialog"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    )}
                </div>

                {description && (
                    <p id={descriptionId} className="text-gray-600 mb-4">
                        {description}{" "}
                    </p>
                )}

                <div className="text-gray-700">{children}</div>
            </div>
        </div>,
        document.body
    );
};

export default Dialog;
