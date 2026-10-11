import React, { useState } from "react";
import { type ProductEditApplicationProps } from "../ProductTypes";

export type ProductStatus = "PENDING" | "APPROVED" | "REJECTED";

interface ProductEditApplicationListItemProps {
    application: ProductEditApplicationProps;
}

const ProductEditApplicationListItem: React.FC<
    ProductEditApplicationListItemProps
> = ({ application }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false); // State to control dropdown visibility

    const getStatusBadgeColor = (
        status: ProductStatus | "PENDING" | "ACCEPTED" | "REJECTED"
    ) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "APPROVED": // Assuming 'ACCEPTED' in your type maps to 'APPROVED' for display
                return "bg-green-100 text-green-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Removed the formatCurrency function as requested
    // const formatCurrency = (price: string) => {
    //     const numericPrice = parseFloat(price);
    //     if (isNaN(numericPrice)) {
    //         return price;
    //     }
    //     return new Intl.NumberFormat("en-IN", {
    //         style: "currency",
    //         currency: "INR",
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2,
    //     }).format(numericPrice);
    // };

    const determineChangeClass = (original: any, updated: any) => {
        // Handle array comparison (e.g., for badges or images)
        if (Array.isArray(original) && Array.isArray(updated)) {
            return JSON.stringify(original) !== JSON.stringify(updated)
                ? "text-orange-600 font-semibold"
                : "";
        }
        return original !== updated ? "text-orange-600 font-semibold" : "";
    };

    // Helper to check if there are any actual changes
    const hasChanges = () => {
        const relevantProps = [
            "name",
            "price",
            "stock",
            "badges",
            "description",
            "images",
        ];
        return relevantProps.some((prop) => {
            const originalValue = (application.originalProduct as any)[prop];
            const updatedValue = (application.updatedProduct as any)[prop];

            if (Array.isArray(originalValue) && Array.isArray(updatedValue)) {
                return (
                    JSON.stringify(originalValue) !==
                    JSON.stringify(updatedValue)
                );
            }
            return originalValue !== updatedValue;
        });
    };

    return (
        <li className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200 ease-in-out">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h3 className="text-xl font-semibold text-gray-900 break-words max-w-[80%]">
                    Edit Application for:{" "}
                    <span className="text-indigo-600">
                        {application.originalProduct.name}
                    </span>
                </h3>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusBadgeColor(
                        application.applicationStatus
                    )}`}
                >
                    {application.applicationStatus}
                </span>
            </div>

            {/* Dropdown Toggle Button */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                    {isDetailsOpen ? "Hide Details" : "View Full Details"}
                    <svg
                        className={`ml-2 h-5 w-5 transform ${
                            isDetailsOpen ? "rotate-180" : ""
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

            {/* Dropdown Content - Conditionally rendered */}
            {isDetailsOpen && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-gray-700 text-sm">
                        <div>
                            <p className="font-bold text-gray-800 mb-3 text-base border-b pb-2">
                                Original Product Details:
                            </p>
                            <p className="mb-1">
                                <strong>Name:</strong>{" "}
                                {application.originalProduct.name}
                            </p>
                            <p className="mb-1">
                                <strong>Price:</strong>{" "}
                                {application.originalProduct.price}
                            </p>
                            <p className="mb-1">
                                <strong>Stock:</strong>{" "}
                                {application.originalProduct.stock} units
                            </p>
                            <p className="mb-1">
                                <strong>Badges:</strong>{" "}
                                {application.originalProduct.badges.join(
                                    ", "
                                ) || "N/A"}
                            </p>
                            <p className="mb-1">
                                <strong>Description:</strong>{" "}
                                {application.originalProduct.description}
                            </p>
                            {application.originalProduct.images &&
                                application.originalProduct.images.length >
                                    0 && (
                                    <div className="mt-4">
                                        <strong>Images:</strong>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {application.originalProduct.images.map(
                                                (image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt={`Original Product Image ${
                                                            index + 1
                                                        }`}
                                                        className="w-20 h-20 object-cover rounded-md border border-gray-300 shadow-sm"
                                                        loading="lazy"
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>

                        <div>
                            <p className="font-bold text-gray-800 mb-3 text-base border-b pb-2">
                                Proposed Changes:
                            </p>
                            <p className="mb-1">
                                <strong>Name:</strong>{" "}
                                <span
                                    className={determineChangeClass(
                                        application.originalProduct.name,
                                        application.updatedProduct.name
                                    )}
                                >
                                    {application.updatedProduct.name}
                                </span>
                            </p>
                            <p className="mb-1">
                                <strong>Price:</strong>{" "}
                                <span
                                    className={determineChangeClass(
                                        application.originalProduct.price,
                                        application.updatedProduct.price
                                    )}
                                >
                                    {application.updatedProduct.price}
                                </span>
                            </p>
                            <p className="mb-1">
                                <strong>Stock:</strong>{" "}
                                <span
                                    className={determineChangeClass(
                                        application.originalProduct.stock,
                                        application.updatedProduct.stock
                                    )}
                                >
                                    {application.updatedProduct.stock} units
                                </span>
                            </p>
                            <p className="mb-1">
                                <strong>Badges:</strong>{" "}
                                <span
                                    className={determineChangeClass(
                                        application.originalProduct.badges,
                                        application.updatedProduct.badges
                                    )}
                                >
                                    {application.updatedProduct.badges.join(
                                        ", "
                                    ) || "N/A"}
                                </span>
                            </p>
                            <p className="mb-1">
                                <strong>Description:</strong>{" "}
                                <span
                                    className={determineChangeClass(
                                        application.originalProduct.description,
                                        application.updatedProduct.description
                                    )}
                                >
                                    {application.updatedProduct.description}
                                </span>
                            </p>
                            {application.updatedProduct.images &&
                                application.updatedProduct.images.length >
                                    0 && (
                                    <div className="mt-4">
                                        <strong>Updated Images:</strong>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {application.updatedProduct.images.map(
                                                (image, index) =>
                                                    typeof image ===
                                                    "string" ? (
                                                        <img
                                                            key={index}
                                                            src={image}
                                                            alt={`Updated Product Image ${
                                                                index + 1
                                                            }`}
                                                            className="w-20 h-20 object-cover rounded-md border border-gray-300 shadow-sm"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <span
                                                            key={index}
                                                            className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-md text-gray-500 text-xs text-center border border-gray-300 shadow-sm"
                                                        >
                                                            New Image Uploaded
                                                        </span>
                                                    )
                                            )}
                                        </div>
                                    </div>
                                )}
                            {!hasChanges() && (
                                <p className="text-gray-500 italic mt-4">
                                    No explicit property changes were detected
                                    in this application.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <span>
                            <strong>Applied by:</strong>{" "}
                            {application.appliedBy.fullName} (
                            {application.appliedBy.email})
                        </span>
                        <span>
                            <strong>Applied On:</strong>{" "}
                            {formatDate(application.createdAt)}
                        </span>
                        <span>
                            <strong>Last Updated:</strong>{" "}
                            {formatDate(application.updatedAt)}
                        </span>
                    </div>
                </div>
            )}
        </li>
    );
};

export default ProductEditApplicationListItem;
