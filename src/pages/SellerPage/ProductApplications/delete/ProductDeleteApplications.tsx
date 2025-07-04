import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../../config/Config.ts";
import { useDialog } from "../../../../hooks/DialogContext.tsx";
import { logoutSession } from "../../../../hooks/auth/SessionValidation.ts";
import type {
    Product,
    ProductDeleteApplicationProps,
} from "../ProductTypes.ts";

import ProductDeleteApplicationListItem from "./ProductDeleteApplicationListItem.tsx";
import ProductSelectionForDelete from "./ProductSelectionForDelete.tsx"; // We'll create this

function ProductDeleteApplications() {
    const [applications, setApplications] = useState<
        ProductDeleteApplicationProps[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showProductSelection, setShowProductSelection] = useState(false);
    const [selectedProductToDelete, setSelectedProductToDelete] =
        useState<Product | null>(null); // To store the product selected for deletion

    const { openDialog, closeDialog } = useDialog();
    const navigate = useNavigate();

    const fetchDeleteApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                openDialog({
                    title: "Invalid session!",
                    showErrorIcon: true,
                    sticky: true,
                    hideCloseButton: true,
                    buttons: [
                        {
                            label: "Okay",
                            onClick() {
                                closeDialog();
                                logoutSession();
                                navigate("/auth/login");
                            },
                        },
                    ],
                });
                return;
            }

            const response = await axios.get(
                BACKEND_URL + "/seller/product-applications/delete/",
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            setApplications(response.data);
        } catch (err: any) {
            console.error("Error fetching product delete applications:", err);
            setError(
                "Failed to load your delete applications. Please try again."
            );
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                openDialog({
                    title: "Session Expired!",
                    description:
                        "Your session has expired. Please log in again.",
                    showErrorIcon: true,
                    sticky: true,
                    hideCloseButton: true,
                    buttons: [
                        {
                            label: "Login",
                            onClick() {
                                closeDialog();
                                logoutSession();
                                navigate("/auth/login");
                            },
                        },
                    ],
                });
            } else {
                openDialog({
                    title: "Error",
                    description:
                        err.response?.data?.message || "Something went wrong.",
                    showErrorIcon: true,
                    buttons: [{ label: "OK", onClick: closeDialog }],
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeleteApplications();
    }, []);

    const handleRequestDeleteClick = () => {
        setShowProductSelection(true); // Open product selection modal for deletion
    };

    const handleProductSelectForDelete = (product: Product) => {
        setSelectedProductToDelete(product);
        setShowProductSelection(false); // Close product selection modal
        // Immediately submit the delete request
        submitDeleteApplication(product.id);
    };

    const submitDeleteApplication = async (productId: number) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                openDialog({
                    title: "Invalid session!",
                    showErrorIcon: true,
                    sticky: true,
                    hideCloseButton: true,
                    buttons: [
                        {
                            label: "Okay",
                            onClick() {
                                closeDialog();
                                logoutSession();
                                navigate("/auth/login");
                            },
                        },
                    ],
                });
                return;
            }

            openDialog({
                title: "Submitting Delete Request...",
                showSpinner: true,
                spinnerMessage:
                    "Submitting your product deletion application...",
                sticky: true,
            });

            await axios.post(
                BACKEND_URL +
                    "/seller/product-applications/delete/" +
                    productId,
                {}, // No body needed for delete request usually
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            closeDialog(); // Close the "Submitting..." dialog
            openDialog({
                title: "Success!",
                showSuccessIcon: true,
                successMessage:
                    "Product deletion application submitted successfully!",
                buttons: [
                    {
                        label: "Close",
                        variant: "primary",
                        onClick: () => {
                            closeDialog();
                            setSelectedProductToDelete(null); // Clear selected product after successful submission
                            fetchDeleteApplications(); // Refresh the list of applications
                        },
                    },
                ],
            });
        } catch (err: any) {
            closeDialog(); // Ensure any prior dialog is closed
            console.error("Error submitting product delete application:", err);

            if (axios.isAxiosError(err) && err.response?.status === 401) {
                openDialog({
                    title: "Session Expired!",
                    description:
                        "Your session has expired. Please log in again.",
                    showErrorIcon: true,
                    sticky: true,
                    hideCloseButton: true,
                    buttons: [
                        {
                            label: "Login",
                            onClick() {
                                closeDialog();
                                logoutSession();
                                navigate("/auth/login");
                            },
                        },
                    ],
                });
            } else {
                openDialog({
                    title: "Error submitting application!",
                    description:
                        err.response?.data?.message ||
                        err.message ||
                        "An unknown error occurred. Please try again.",
                    showErrorIcon: true,
                    sticky: true,
                    hideCloseButton: true,
                    buttons: [
                        {
                            label: "Okay",
                            onClick: closeDialog,
                        },
                    ],
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-gray-700">
                <p>Loading your product delete applications...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mt-4"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-600">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Product Delete Applications
                </h1>
                <button
                    onClick={handleRequestDeleteClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                    <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Request Product Deletion
                    <svg
                        className={`ml-2 -mr-1 h-5 w-5 transform ${
                            showProductSelection ? "rotate-180" : ""
                        } transition-transform duration-200`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {applications.length === 0 && !showProductSelection ? (
                <div className="text-center bg-gray-50 rounded-lg p-6 shadow-md">
                    <p className="text-xl font-medium text-gray-700 mb-4">
                        You haven't submitted any product deletion applications
                        yet.
                    </p>
                    <p className="text-gray-600 mb-4">
                        Click "Request Product Deletion" to start.
                    </p>
                    <button
                        onClick={handleRequestDeleteClick}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        <svg
                            className="-ml-1 mr-3 h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                        Request a Product Deletion
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-xl font-medium text-gray-700 mb-4">
                        Your existing product deletion applications:
                    </p>
                    <ul className="space-y-6">
                        {applications.map((app) => (
                            <ProductDeleteApplicationListItem
                                key={app.id}
                                application={app}
                                // onUpdateStatus={handleUpdateApplicationStatus} // If you need a handler for status updates
                            />
                        ))}
                    </ul>
                    {applications.some(
                        (app) => app.applicationStatus === "PENDING"
                    ) && (
                        <div className="text-center mt-10 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md">
                            <p className="text-md font-medium">
                                You have pending deletion applications being
                                reviewed. We'll notify you once they are
                                processed!
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Product Selection Modal for Deletion (controlled by showProductSelection) */}
            {showProductSelection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 relative overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-bold text-gray-800 p-6 border-b border-gray-200">
                            Select a Product to Delete
                            <button
                                onClick={() => setShowProductSelection(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </h2>
                        <div className="p-6">
                            <ProductSelectionForDelete
                                onSelectProduct={handleProductSelectForDelete}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDeleteApplications;
