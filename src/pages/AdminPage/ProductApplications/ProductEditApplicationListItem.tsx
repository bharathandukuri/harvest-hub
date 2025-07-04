import React, { useState } from "react";
import { type ProductEditApplicationProps as ProductEditApplication } from "../../SellerPage/ProductApplications/ProductTypes";
import {
    FaUser,
    FaCalendarAlt,
    FaEdit,
    FaCheckCircle,
    FaTimesCircle,
    FaChevronDown, // Import the chevron icon
    FaChevronUp, // Import the chevron up icon
} from "react-icons/fa";

interface ProductEditApplicationListItemProps {
    application: ProductEditApplication;
    onUpdateStatus: (
        applicationId: number,
        newStatus: "APPROVED" | "REJECTED"
    ) => void;
}

const ProductEditApplicationListItem: React.FC<
    ProductEditApplicationListItemProps
> = ({ application, onUpdateStatus }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false); // State for dropdown
    const {
        id,
        appliedBy,
        originalProduct,
        updatedProduct,
        applicationStatus,
        createdAt,
    } = application;

    const statusClasses = {
        PENDING: "bg-yellow-100 text-yellow-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
    };

    const handleApprove = () => {
        onUpdateStatus(id, "APPROVED");
    };

    const handleReject = () => {
        onUpdateStatus(id, "REJECTED");
    };

    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const renderDifference = (
        original: string | number | undefined, // Allow undefined for optional properties
        updated: string | number | undefined, // Allow undefined for optional properties
        label: string
    ) => {
        // Handle cases where properties might be missing from either original or updated
        const actualOriginal =
            original !== undefined && original !== null ? original : "N/A";
        const actualUpdated =
            updated !== undefined && updated !== null ? updated : "N/A";

        if (actualOriginal !== actualUpdated) {
            return (
                <p className="flex flex-col text-sm text-red-700 bg-red-50 p-2 rounded-md">
                    <span className="font-medium">{label}:</span>
                    <span className="line-through text-gray-500">
                        {actualOriginal}
                    </span>
                    <span className="text-green-700">{actualUpdated}</span>
                </p>
            );
        }
        return (
            <p className="text-sm text-gray-700">
                <span className="font-medium">{label}:</span> {actualOriginal}
            </p>
        );
    };

    const renderImageDifference = (
        originalImages: string[] = [],
        updatedImages: (string | File)[] = []
    ) => {
        const originalUrls = originalImages;
        const updatedUrls = updatedImages.filter(
            (img) => typeof img === "string"
        ) as string[];
        const newFilesCount = updatedImages.filter(
            (img) => img instanceof File
        ).length;

        // Check if lengths are different OR if any original URL is not in updated URLs OR if there are new files
        const hasChanges =
            originalUrls.length !== updatedUrls.length ||
            originalUrls.some((url) => !updatedUrls.includes(url)) ||
            newFilesCount > 0;

        if (hasChanges) {
            return (
                <div className="flex flex-col text-sm text-red-700 bg-red-50 p-2 rounded-md">
                    <span className="font-medium">Images:</span>
                    <p className="line-through text-gray-500">
                        Original: {originalUrls.length} images
                    </p>
                    <p className="text-green-700">
                        Updated: {updatedUrls.length + newFilesCount} images (
                        {newFilesCount} new)
                    </p>
                </div>
            );
        }
        return (
            <p className="text-sm text-gray-700">
                <span className="font-medium">Images:</span>{" "}
                {originalUrls.length} images
            </p>
        );
    };

    return (
        <li className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <FaEdit className="text-purple-600 mr-2" />
                    Edit Request for: {originalProduct?.name || "N/A"}
                </h3>
                <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide ${statusClasses[applicationStatus]}`}
                >
                    {applicationStatus}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-gray-700 mb-6">
                <p className="flex items-center col-span-full">
                    <FaUser className="text-gray-500 mr-2" />
                    <span className="font-semibold">Applicant:</span>{" "}
                    {appliedBy?.fullName || "N/A"} ({appliedBy?.email || "N/A"})
                </p>
                <p className="flex items-center col-span-full">
                    <FaCalendarAlt className="text-gray-500 mr-2" />
                    <span className="font-semibold">Applied On:</span>{" "}
                    {formattedDate}
                </p>
            </div>

            {/* Dropdown Toggle Button */}
            <div className="flex justify-center mt-4 mb-4">
                <button
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    aria-expanded={isDetailsOpen}
                    aria-controls={`application-details-${id}`} // Accessibility
                >
                    {isDetailsOpen ? "Hide Details" : "View Full Changes"}
                    {isDetailsOpen ? (
                        <FaChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                        <FaChevronDown className="ml-2 h-4 w-4" />
                    )}
                </button>
            </div>

            {/* Collapsible Content */}
            {isDetailsOpen && (
                <div
                    id={`application-details-${id}`} // Accessibility
                    className="border-t border-gray-200 pt-4 mt-4 animate-fade-in" // Added fade-in animation
                >
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Product Details:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderDifference(
                            originalProduct?.name,
                            updatedProduct?.name,
                            "Name"
                        )}
                        {renderDifference(
                            originalProduct?.description,
                            updatedProduct?.description,
                            "Description"
                        )}
                        {renderDifference(
                            originalProduct?.price,
                            updatedProduct?.price,
                            "Price"
                        )}
                        {renderDifference(
                            originalProduct?.stock,
                            updatedProduct?.stock,
                            "Stock"
                        )}
                        {renderDifference(
                            (originalProduct?.badges || []).join(", "),
                            (updatedProduct?.badges || []).join(", "),
                            "Badges"
                        )}
                        {renderImageDifference(
                            originalProduct?.images || [],
                            updatedProduct?.images || []
                        )}
                    </div>
                </div>
            )}

            {applicationStatus === "PENDING" && (
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 border-t pt-4 border-gray-100">
                    <button
                        onClick={handleApprove}
                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 flex items-center justify-center"
                        aria-label={`Approve edit application for ${
                            originalProduct?.name || "this product"
                        }`}
                    >
                        <FaCheckCircle className="mr-2" /> Approve
                    </button>
                    <button
                        onClick={handleReject}
                        className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200 flex items-center justify-center"
                        aria-label={`Reject edit application for ${
                            originalProduct?.name || "this product"
                        }`}
                    >
                        <FaTimesCircle className="mr-2" /> Reject
                    </button>
                </div>
            )}
            {(applicationStatus === "APPROVED" ||
                applicationStatus === "REJECTED") && (
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100 text-gray-500 text-sm italic">
                    Status already {applicationStatus.toLowerCase()}.
                </div>
            )}
        </li>
    );
};

export default ProductEditApplicationListItem;
