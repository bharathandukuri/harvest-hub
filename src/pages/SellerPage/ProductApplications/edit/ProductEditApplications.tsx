import { useEffect, useState } from "react";
import ProductEditForm from "./ProductEditForm.tsx";
import ProductSelection from "./ProductSelection.tsx";
import type { Product, ProductEditApplicationProps } from "../ProductTypes.ts";
import axios from "axios";
import { BACKEND_URL } from "../../../../config/Config.ts";
import { useDialog } from "../../../../hooks/DialogContext.tsx";
import { logoutSession } from "../../../../hooks/auth/SessionValidation.ts";
import { useNavigate } from "react-router-dom";

import ProductEditApplicationListItem from "./ProductEditApplicationListItem.tsx";

function ProductEditApplications() {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(
        null
    );
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const { openDialog, closeDialog } = useDialog();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [applications, setApplications] = useState<
        ProductEditApplicationProps[]
    >([]);
    const [showProductSelection, setShowProductSelection] = useState(false);

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
                return;
            }

            const response = await axios.get(
                BACKEND_URL + "/seller/product-applications/edit/",
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                }
            );
            console.log(response.data);
            setApplications(response.data);
        } catch (err: any) {
            console.error("Error fetching product edit applications:", err);
            setError("Failed to load your applications. Please try again.");
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
        fetchApplications();
    }, []);

    const handleProductSelect = (
        productId: number,
        product: Product,
        categories: string[]
    ) => {
        setSelectedProductId(productId);
        setProduct(product);
        setCategories(categories);
        setShowProductSelection(false);
    };

    const handleBackToSelection = () => {
        setSelectedProductId(null);
        setProduct(null);
        setCategories([]);
        setShowProductSelection(true);
    };

    const handleEditNewProductClick = () => {
        setShowProductSelection(true);
    };

    const submit = async (updatedProductData: any) => {
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
                title: "Submitting...",
                showSpinner: true,
                spinnerMessage: "Submitting your product edit application...",
                sticky: true,
            });

            const response = await axios.post(
                BACKEND_URL +
                    "/seller/product-applications/edit/" +
                    selectedProductId,
                updatedProductData,
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            closeDialog();
            openDialog({
                title: "Success!",
                showSuccessIcon: true,
                successMessage:
                    "Product edit application submitted successfully!",
                buttons: [
                    {
                        label: "Close",
                        variant: "primary",
                        onClick: () => {
                            closeDialog();
                        },
                    },
                ],
            });
        } catch (err: any) {
            console.error("Error submitting product edit application:", err);

            openDialog({
                title: "Error submitting application!",
                description:
                    err.response?.data ||
                    err.message ||
                    "An unknown error occurred.",
                showSuccessIcon: false,
                showErrorIcon: true,
                sticky: true,
                hideCloseButton: true,
                buttons: [
                    {
                        label: "Okay",
                        onClick() {
                            closeDialog();
                        },
                    },
                ],
            });
        } finally {
            setSelectedProductId(null);
            setProduct(null);
            setCategories([]);
            fetchApplications();
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-gray-700">
                <p>Loading your product edit applications...</p>
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
                    Product Edit Applications
                </h1>
                {!selectedProductId && (
                    <button
                        onClick={handleEditNewProductClick}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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
                        Edit a Product
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
                )}
            </div>

            {selectedProductId ? (
                <ProductEditForm
                    onSubmit={submit}
                    onProductUpdated={async () => {
                        await fetchApplications();
                    }}
                    availableCategories={categories}
                    initialProductData={product}
                    productId={selectedProductId}
                    onCancel={handleBackToSelection}
                />
            ) : applications.length > 0 ? (
                <>
                    <p className="text-xl font-medium text-gray-700 mb-4">
                        You have existing product edit applications.
                    </p>
                    <ul className="space-y-6">
                        {applications.map((app) => (
                            <ProductEditApplicationListItem
                                key={app.id}
                                application={app}
                            />
                        ))}
                    </ul>
                    {applications.some(
                        (app) => app.applicationStatus === "PENDING"
                    ) && (
                        <div className="text-center mt-10 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md">
                            <p className="text-md font-medium">
                                You have pending edit applications being
                                reviewed. We'll notify you once they are
                                processed!
                            </p>
                        </div>
                    )}
                    {/* Product Selection Modal (controlled by showProductSelection) */}
                    {showProductSelection && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 relative overflow-y-auto max-h-[90vh]">
                                {" "}
                                {/* Changed max-w-2xl to max-w-4xl */}
                                <h2 className="text-2xl font-bold text-gray-800 p-6 border-b border-gray-200">
                                    Select a Product to Edit
                                    <button
                                        onClick={() =>
                                            setShowProductSelection(false)
                                        }
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
                                    <ProductSelection
                                        onSelectProduct={handleProductSelect}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center bg-gray-50 rounded-lg p-6 shadow-md">
                    <p className="text-xl font-medium text-gray-700 mb-4">
                        You haven't submitted any product edit applications yet.
                        Click "Start a New Product Edit Application" to get
                        started!
                    </p>
                    <button
                        onClick={handleEditNewProductClick}
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
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.232z"
                            />
                        </svg>
                        Start a New Product Edit Application
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
                    {showProductSelection && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 relative overflow-y-auto max-h-[90vh]">
                                {" "}
                                <h2 className="text-2xl font-bold text-gray-800 p-6 border-b border-gray-200">
                                    Select a Product to Edit
                                    <button
                                        onClick={() =>
                                            setShowProductSelection(false)
                                        }
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
                                    <ProductSelection
                                        onSelectProduct={handleProductSelect}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ProductEditApplications;
