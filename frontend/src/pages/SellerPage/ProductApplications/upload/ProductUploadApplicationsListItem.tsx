// src/components/ProductUploadApplicationsListItem.tsx
import React, { useState } from "react";
import { type ProductUploadApplication } from "../../../AdminPage/ProductApplications/ProductUploadApplications"; // Adjust path as needed

// Icons (you can keep these or import from a library)
const ChevronDownIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
    </svg>
);

const ChevronUpIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
    </svg>
);

interface ProductUploadApplicationListItemProps {
    application: ProductUploadApplication;
}

const ProductUploadApplicationListItem: React.FC<
    ProductUploadApplicationListItemProps
> = ({ application }) => {
    const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

    const statusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "APPROVED":
                return "bg-green-100 text-green-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    console.log(application.product.name);

    return (
        <li className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
                    Product: {application.product.name}
                </h2>
                <div className="flex items-center gap-4">
                    <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColor(
                            application.applicationStatus
                        )}`}
                    >
                        {application.applicationStatus}
                    </span>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        aria-expanded={isOpen}
                        aria-controls={`application-details-${application.id}`}
                    >
                        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </button>
                </div>
            </div>

            {/* Detailed Section - Conditionally rendered based on isOpen state */}
            {isOpen && (
                <div
                    id={`application-details-${application.id}`}
                    className="pt-6 mt-4 border-t border-gray-200 bg-gray-50 -mx-6 px-6 pb-6"
                >
                    {/* Applicant Profile Section - Simplified for seller's view, focuses on product/business context */}
                    <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                        {application.appliedBy.businessLogoUrl && (
                            <img
                                src={application.appliedBy.businessLogoUrl}
                                alt={`${application.appliedBy.fullName}'s business logo`}
                                className="w-20 h-20 rounded-full object-cover mr-4 shadow-md"
                            />
                        )}
                        <div>
                            <h3 className="font-extrabold text-2xl text-gray-900 leading-tight">
                                {application.appliedBy.fullName}
                            </h3>
                            <p className="text-blue-700 text-lg font-medium">
                                {application.appliedBy.email}
                            </p>
                            <p className="text-gray-600 text-sm">
                                Submitted on:{" "}
                                {new Date(
                                    application.createdAt
                                ).toLocaleString()}
                            </p>
                            <p className="text-gray-600 text-sm">
                                Last updated:{" "}
                                {new Date(
                                    application.updatedAt
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Application Basic Information */}
                    <h4 className="font-bold text-xl text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        Application Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 mb-6">
                        <p>
                            <strong>Application ID:</strong> {application.id}
                        </p>
                        <p>
                            <strong>Your Role:</strong>{" "}
                            <span className="capitalize font-semibold text-indigo-700">
                                {application.appliedBy.role.toLowerCase()}
                            </span>
                        </p>
                        <p>
                            <strong>Account Verified:</strong>{" "}
                            {application.appliedBy.accountVerified ? (
                                <span className="text-green-600 font-semibold">
                                    Yes
                                </span>
                            ) : (
                                <span className="text-red-600 font-semibold">
                                    No
                                </span>
                            )}
                        </p>
                        <p>
                            <strong>Your Seller Rating:</strong>{" "}
                            {application.appliedBy.rating
                                ? `${application.appliedBy.rating}/5`
                                : "N/A"}
                        </p>
                    </div>

                    {/* Product Details Section */}
                    <h4 className="font-bold text-xl text-gray-800 mb-4 pt-4 pb-2 border-b border-gray-200">
                        Product Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 mb-6">
                        <p>
                            <strong>Product ID:</strong>{" "}
                            {application.product.id}
                        </p>
                        <p>
                            <strong>Price:</strong> {application.product.price}
                        </p>
                        <p>
                            <strong>Stock:</strong> {application.product.stock}
                        </p>
                        <p>
                            <strong>Rating:</strong>{" "}
                            {application.product.rating
                                ? application.product.rating.toFixed(1) + "/5"
                                : "N/A"}
                        </p>
                        <p className="col-span-1 md:col-span-2">
                            <strong>Description:</strong>{" "}
                            {application.product.description}
                        </p>
                    </div>

                    {application.product.images &&
                        application.product.images.length > 0 && (
                            <div className="mb-6">
                                <strong className="font-semibold text-gray-800">
                                    Product Images:
                                </strong>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {application.product.images.map(
                                        (img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`${
                                                    application.product.name
                                                } image ${index + 1}`}
                                                className="w-24 h-24 object-cover rounded-md shadow-sm border border-gray-200"
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    {application.product.badges &&
                        application.product.badges.length > 0 && (
                            <div className="mb-6">
                                <strong className="font-semibold text-gray-800">
                                    Product Badges:
                                </strong>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {application.product.badges.map(
                                        (badge, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                            >
                                                {badge}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Seller Information (from product.seller) - Displaying 'Your' business details */}
                    {application.product.seller && (
                        <>
                            <h4 className="font-bold text-xl text-gray-800 mb-4 pt-4 pb-2 border-b border-gray-200">
                                Your Business Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                                <p>
                                    <strong>Business Name:</strong>{" "}
                                    {application.product.seller.businessName ||
                                        "N/A"}
                                </p>
                                {application.product.seller.businessLogoUrl && (
                                    <div className="flex items-center">
                                        <strong>Business Logo:</strong>{" "}
                                        <img
                                            src={
                                                application.product.seller
                                                    .businessLogoUrl
                                            }
                                            alt={`${application.product.seller.businessName} logo`}
                                            className="w-10 h-10 ml-2 rounded-md object-contain border border-gray-200"
                                        />
                                    </div>
                                )}
                                <p>
                                    <strong>Business Email:</strong>{" "}
                                    {application.product.seller.email}
                                </p>
                                <p>
                                    <strong>Current Business Rating:</strong>{" "}
                                    {application.product.seller.rating
                                        ? `${application.product.seller.rating}/5`
                                        : "N/A"}
                                </p>
                                <p className="col-span-1 md:col-span-2">
                                    <strong>Selling Categories:</strong>{" "}
                                    {application.product.seller
                                        .sellingCategories &&
                                    application.product.seller.sellingCategories
                                        .length > 0
                                        ? application.product.seller.sellingCategories
                                              .map((cat) => cat.toLowerCase())
                                              .join(", ")
                                        : "N/A"}
                                </p>

                                {application.product.seller.farmLocation && (
                                    <>
                                        <h5 className="col-span-full font-semibold text-lg text-gray-800 mt-4 mb-2">
                                            Your Farm Location
                                        </h5>
                                        <p>
                                            <strong>City:</strong>{" "}
                                            {application.product.seller
                                                .farmLocation.city || "N/A"}
                                        </p>
                                        <p>
                                            <strong>State:</strong>{" "}
                                            {application.product.seller
                                                .farmLocation.state || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Country:</strong>{" "}
                                            {application.product.seller
                                                .farmLocation.country || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Pincode:</strong>{" "}
                                            {application.product.seller
                                                .farmLocation.pincode || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Latitude:</strong>{" "}
                                            {application.product.seller
                                                .farmLocation.latitude !==
                                            undefined
                                                ? application.product.seller
                                                      .farmLocation.latitude
                                                : "N/A"}
                                        </p>
                                        <p>
                                            <strong>Longitude:</strong>{" "}
                                            {application.product.seller
                                                .farmLocation.longitude !==
                                            undefined
                                                ? application.product.seller
                                                      .farmLocation.longitude
                                                : "N/A"}
                                        </p>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </li>
    );
};

export default ProductUploadApplicationListItem;
