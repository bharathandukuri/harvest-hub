import React, { useState, useEffect } from "react";
import ProductUploadApplicationListItem from "./ProductUploadApplicationsListItem";
import { type ProductUploadApplication } from "../../../AdminPage/ProductApplications/ProductUploadApplications";
import ProductUploadApplicationForm from "./ProductUploadApplicationForm";
import axios from "axios";
import { BACKEND_URL } from "../../../../config/Config";
import { useDialog } from "../../../../hooks/DialogContext";
import { useNavigate } from "react-router-dom";
import { logoutSession } from "../../../../hooks/auth/SessionValidation";

const ProductUploadApplications: React.FC = () => {
    const [applications, setApplications] = useState<
        ProductUploadApplication[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const { openDialog, closeDialog } = useDialog();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
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
                }

                const response = await axios.get(
                    BACKEND_URL + "/seller/product-applications/upload/",
                    {
                        headers: {
                            Authorization:
                                "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );
                setApplications(response.data);

                const data = await axios.get(
                    BACKEND_URL + "/seller/selling-categories",
                    {
                        headers: {
                            Authorization:
                                "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );
                setCategories(data.data);
            } catch (err) {
                setError("Failed to load your applications. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const hasPendingApplications = applications.some(
        (app) => app.applicationStatus === "PENDING"
    );

    const handleAddNewProductClick = () => {
        setIsFormDialogOpen(true);
    };

    const handleCloseFormDialog = () => {
        setIsFormDialogOpen(false);
    };

    const handleProductFormSubmit = async (newProductData: any) => {
        const uploadImage = async (file: File): Promise<string> => {
            const token = localStorage.getItem("token");
            if (!token) {
                openDialog({
                    title: "Unauthorized",
                    showErrorIcon: true,
                    errorMessage:
                        "You are not logged in. Please log in to upload.",
                    buttons: [
                        {
                            label: "Login",
                            variant: "primary",
                            onClick: () => {
                                closeDialog();
                                logoutSession();
                                navigate("/auth/login");
                            },
                        },
                    ],
                });
                throw new Error("No token found.");
            }

            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                `${BACKEND_URL}/file/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data.data.url;
        };

        const images = newProductData.images;

        if (
            !Array.isArray(images) ||
            images.some((image) => !(image instanceof File))
        ) {
            openDialog({
                title: "Invalid Image Data",
                showErrorIcon: true,
                errorMessage: "Images must be a valid array of File objects.",
                buttons: [{ label: "OK", onClick: closeDialog }],
            });
            return;
        }

        try {
            openDialog({
                title: "Uploading...",
                showSpinner: true,
                spinnerMessage: "Submitting your product application...",
                sticky: true,
            });

            const imageUrls: string[] = [];

            for (const image of images) {
                const url = await uploadImage(image);
                imageUrls.push(url);
            }

            newProductData.images = imageUrls;
            newProductData.badges = newProductData.badges.split(",");

            const response = await axios.post(
                `${BACKEND_URL}/seller/product-applications/upload/`,
                newProductData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            closeDialog();

            openDialog({
                title: "Success!",
                showSuccessIcon: true,
                successMessage: "Product application submitted successfully!",
                buttons: [
                    {
                        label: "Close",
                        variant: "primary",
                        onClick: () => {
                            closeDialog();
                            handleCloseFormDialog();
                            window.location.reload();
                        },
                    },
                ],
            });
            setIsFormDialogOpen(false);
        } catch (error) {
            closeDialog();

            openDialog({
                title: "Submission Failed",
                showErrorIcon: true,
                errorMessage:
                    "There was an error with your submission. Please try again.",
                buttons: [
                    { label: "OK", variant: "danger", onClick: closeDialog },
                ],
            });
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-gray-700">
                <p>Loading your product applications...</p>
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
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900">
                    Your Product Upload Applications
                </h1>
                <button
                    onClick={handleAddNewProductClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
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
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Add New Product
                </button>
            </div>
            {applications.length === 0 ? (
                <div className="text-center bg-gray-50 rounded-lg p-6 shadow-md">
                    <p className="text-xl font-medium text-gray-700 mb-4">
                        You haven't submitted any product upload applications
                        yet. Click "Add New Product" to get started!
                    </p>
                </div>
            ) : (
                <>
                    <ul className="space-y-6">
                        {applications.map((app) => (
                            <ProductUploadApplicationListItem
                                key={app.id}
                                application={app}
                            />
                        ))}
                    </ul>

                    {hasPendingApplications && (
                        <div className="text-center mt-10 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md">
                            <p className="text-md font-medium">
                                You have pending applications being reviewed.
                                We'll notify you once they are processed!
                            </p>
                        </div>
                    )}
                </>
            )}
            {isFormDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 relative overflow-y-auto max-h-[90vh]">
                        <ProductUploadApplicationForm
                            onClose={handleCloseFormDialog}
                            onSubmit={handleProductFormSubmit}
                            categories={categories}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductUploadApplications;
