import React from "react";
import type { ProductDeleteApplicationProps } from "../ProductTypes.ts";
import { format } from "date-fns"; // For date formatting

interface ProductDeleteApplicationListItemProps {
    application: ProductDeleteApplicationProps;
}

const ProductDeleteApplicationListItem: React.FC<
    ProductDeleteApplicationListItemProps
> = ({ application }) => {
    const getStatusClass = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "ACCEPTED":
                return "bg-green-100 text-green-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <li className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200 ease-in-out">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                    Deletion Request for "{application.product.name}"
                </h3>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${getStatusClass(
                        application.applicationStatus
                    )}`}
                >
                    {application.applicationStatus}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6">
                <div>
                    <p className="font-semibold text-gray-800 mb-1">
                        Product Details:
                    </p>
                    <div className="flex items-center space-x-4 mb-2">
                        {application.product.images &&
                            application.product.images.length > 0 && (
                                <img
                                    src={application.product.images[0]}
                                    alt={application.product.name}
                                    className="w-16 h-16 object-cover rounded-md shadow-sm"
                                />
                            )}
                        <div>
                            <p className="text-lg font-medium">
                                {application.product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                ID: {application.product.id}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm">
                        <span className="font-semibold">Price:</span> ₹
                        {application.product.price}
                    </p>
                    <p className="text-sm">
                        <span className="font-semibold">Stock:</span>{" "}
                        {application.product.stock} units
                    </p>
                    <p className="text-sm line-clamp-2">
                        <span className="font-semibold">Description:</span>{" "}
                        {application.product.description}
                    </p>
                </div>
                <div>
                    <p className="font-semibold text-gray-800 mb-1">
                        Application Details:
                    </p>
                    <p className="text-sm">
                        <span className="font-semibold">Requested By:</span>{" "}
                        {application.appliedBy.fullName} (
                        {application.appliedBy.email})
                    </p>
                    <p className="text-sm">
                        <span className="font-semibold">Applied On:</span>{" "}
                        {format(new Date(application.createdAt), "PPP - p")}
                    </p>
                    <p className="text-sm">
                        <span className="font-semibold">Last Updated:</span>{" "}
                        {format(new Date(application.updatedAt), "PPP - p")}
                    </p>
                    {application.applicationStatus === "REJECTED" && (
                        <p className="text-sm text-red-600 mt-2 font-medium">
                            This deletion request was rejected. Please contact
                            support for more details if needed.
                        </p>
                    )}
                </div>
            </div>
        </li>
    );
};

export default ProductDeleteApplicationListItem;
