import React from "react";
import { type ProductDeleteApplicationProps as ProductDeleteApplication } from "../../SellerPage/ProductApplications/ProductTypes";
import {
    FaUser,
    FaCalendarAlt,
    FaTrashAlt, // Changed icon for deletion
    FaCheckCircle,
    FaTimesCircle,
} from "react-icons/fa";

interface ProductDeleteApplicationListItemProps {
    application: ProductDeleteApplication;
    onUpdateStatus: (
        applicationId: number,
        newStatus: "ACCEPTED" | "REJECTED"
    ) => void;
}

const ProductDeleteApplicationListItem: React.FC<
    ProductDeleteApplicationListItemProps
> = ({ application, onUpdateStatus }) => {
    const { id, appliedBy, product, applicationStatus, createdAt } =
        application;

    const statusClasses = {
        PENDING: "bg-yellow-100 text-yellow-800",
        ACCEPTED: "bg-green-100 text-green-800", // Changed APPROVED to ACCEPTED
        REJECTED: "bg-red-100 text-red-800",
    };

    const handleAccept = () => {
        onUpdateStatus(id, "ACCEPTED");
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

    return (
        <li className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <FaTrashAlt className="text-red-600 mr-2" />{" "}
                    {/* Changed icon */}
                    Deletion Request for: {product?.name || "N/A"}
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

            {/* Product Details for Deletion Request */}
            <div
                id={`application-details-${id}`}
                className="border-t border-gray-200 pt-4 mt-4"
            >
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Product to be Deleted:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Name:</span>{" "}
                        {product?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Description:</span>{" "}
                        {product?.description || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Price:</span>{" "}
                        {product?.price || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Stock:</span>{" "}
                        {product?.stock || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Badges:</span>{" "}
                        {(product?.badges || []).join(", ") || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Images:</span>{" "}
                        {product?.images?.length || 0} images
                    </p>
                </div>
            </div>

            {applicationStatus === "PENDING" && (
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 border-t pt-4 border-gray-100">
                    <button
                        onClick={handleAccept}
                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 flex items-center justify-center"
                        aria-label={`Accept delete application for ${
                            product?.name || "this product"
                        }`}
                    >
                        <FaCheckCircle className="mr-2" /> Accept
                    </button>
                    <button
                        onClick={handleReject}
                        className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200 flex items-center justify-center"
                        aria-label={`Reject delete application for ${
                            product?.name || "this product"
                        }`}
                    >
                        <FaTimesCircle className="mr-2" /> Reject
                    </button>
                </div>
            )}
            {(applicationStatus === "ACCEPTED" ||
                applicationStatus === "REJECTED") && (
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100 text-gray-500 text-sm italic">
                    Status already {applicationStatus.toLowerCase()}.
                </div>
            )}
        </li>
    );
};

export default ProductDeleteApplicationListItem;
