import React, { useState } from "react";
import type { SellerApplication, User } from "./SelllerApplications"; // Adjust path as needed
import {
    MapPinIcon,
    BuildingStorefrontIcon,
    TagIcon,
    CalendarDaysIcon,
    CircleStackIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    IdentificationIcon,
    BuildingOfficeIcon,
    SparklesIcon,
    StarIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@heroicons/react/24/outline";

interface SellerApplicationListItemProps {
    application: SellerApplication;
    onUpdateStatus: (id: number, status: "APPROVED" | "REJECTED") => void;
}

const SellerApplicationListItem: React.FC<SellerApplicationListItemProps> = ({
    application,
    onUpdateStatus,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusClasses = (status: SellerApplication["status"]) => {
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

    // Helper component to render user details
    const ApplicantDetails: React.FC<{ user: User }> = ({ user }) => (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h4 className="font-bold text-lg text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-indigo-500" /> Applicant
                Details
            </h4>
            <div className="flex items-center space-x-4 mb-4">
                {user.profilePicUrl ? (
                    <img
                        src={user.profilePicUrl}
                        alt={`${user.fullName}'s profile`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-indigo-300"
                    />
                ) : (
                    <UserIcon className="h-16 w-16 text-gray-400 border-2 border-gray-300 rounded-full p-2" />
                )}
                <div>
                    <p className="text-lg font-semibold text-gray-900">
                        {user.fullName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" /> {user.email}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm">
                <p className="flex items-center">
                    <IdentificationIcon className="h-4 w-4 mr-1 text-gray-400" />
                    <strong>ID:</strong> {user.id}
                </p>
                <p className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                    <strong>Phone:</strong> {user.phone || "N/A"}
                </p>
                <p>
                    <strong>Role:</strong>{" "}
                    <span className="capitalize text-indigo-600 font-medium">
                        {user.role.toLowerCase()}
                    </span>
                </p>
                <p>
                    <strong>Verified:</strong>{" "}
                    {user.accountVerified ? (
                        <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                        <span className="text-red-600 font-medium">No</span>
                    )}
                </p>
                {user.dob && (
                    <p className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                        <strong>DOB:</strong>{" "}
                        {new Date(user.dob).toLocaleDateString()}
                    </p>
                )}
                <p className="col-span-full">
                    <strong>Member Since:</strong>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                </p>
            </div>
            {user.bio && (
                <p className="mt-3 pt-2 border-t border-gray-100 text-gray-600 text-sm italic">
                    <span className="font-semibold not-italic">Bio:</span>{" "}
                    {user.bio}
                </p>
            )}
            {user.address && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                    <p className="font-semibold text-gray-800 text-sm mb-1 flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1 text-blue-500" />{" "}
                        Address:
                    </p>
                    <p className="text-gray-700 text-sm">
                        <strong>Street:</strong> {user.address.street || "N/A"}
                        <br />
                        {user.address.landmark && (
                            <>
                                <strong>Landmark:</strong>{" "}
                                {user.address.landmark}
                                <br />
                            </>
                        )}
                        <strong>City:</strong> {user.address.city || "N/A"},{" "}
                        <strong>District:</strong>{" "}
                        {user.address.district || "N/A"}
                        <br />
                        <strong>State:</strong> {user.address.state || "N/A"},{" "}
                        <strong>Country:</strong>{" "}
                        {user.address.country || "N/A"}
                        <br />
                        <strong>Pincode:</strong>{" "}
                        {user.address.pincode || "N/A"}
                    </p>
                </div>
            )}
        </div>
    );

    return (
        <li className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div
                className="p-6 cursor-pointer flex justify-between items-center"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-4">
                    {application.businessLogoUrl && (
                        <img
                            src={application.businessLogoUrl}
                            alt={`${application.businessName} logo`}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <BuildingStorefrontIcon className="h-6 w-6 mr-2 text-gray-600" />
                            {application.businessName}
                        </h2>
                        <p className="text-gray-600 text-md flex items-center mt-1">
                            <UserIcon className="h-5 w-5 mr-1 text-gray-500" />
                            Applied by: {application.appliedBy.fullName}
                        </p>
                        <p className="text-gray-500 text-sm flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {application.appliedBy.email}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusClasses(
                            application.status
                        )}`}
                    >
                        {application.status}
                    </span>
                    {isExpanded ? (
                        <ChevronUpIcon className="h-6 w-6 text-gray-500" />
                    ) : (
                        <ChevronDownIcon className="h-6 w-6 text-gray-500" />
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="px-6 pb-6 pt-4 border-t border-gray-200 bg-gray-50">
                    <h3 className="font-extrabold text-2xl text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
                        <BuildingStorefrontIcon className="h-7 w-7 mr-2 text-gray-700" />
                        Application Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-md">
                        {/* Business Information Section */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <h4 className="font-bold text-lg text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
                                <SparklesIcon className="h-5 w-5 mr-2 text-purple-500" />{" "}
                                Business Information
                            </h4>
                            <p className="mb-2 text-sm">
                                <strong>Description:</strong>{" "}
                                {application.description}
                            </p>
                            <p className="flex items-center mb-2 text-sm">
                                <TagIcon className="h-5 w-5 mr-2 text-teal-500" />
                                <strong>Categories:</strong>{" "}
                                {application.categories.join(", ")}
                            </p>
                            <p className="flex items-center mb-2 text-sm">
                                <CalendarDaysIcon className="h-5 w-5 mr-2 text-orange-500" />
                                <strong>Applied On:</strong>{" "}
                                {new Date(
                                    application.createdAt
                                ).toLocaleDateString()}
                            </p>
                            {application.status !== "PENDING" && (
                                <p className="flex items-center text-sm">
                                    <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-500" />
                                    <strong>Last Updated:</strong>{" "}
                                    {new Date(
                                        application.updatedAt
                                    ).toLocaleDateString()}
                                </p>
                            )}
                        </div>

                        {/* Farm Location Section */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <h4 className="font-bold text-lg text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
                                <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />{" "}
                                Farm Location
                            </h4>
                            <p className="text-gray-700 text-sm">
                                <strong>Street:</strong>{" "}
                                {application.farmLocation.street || "N/A"}
                                <br />
                                {application.farmLocation.landmark && (
                                    <>
                                        <strong>Landmark:</strong>{" "}
                                        {application.farmLocation.landmark}
                                        <br />
                                    </>
                                )}
                                <strong>City:</strong>{" "}
                                {application.farmLocation.city || "N/A"},{" "}
                                <strong>District:</strong>{" "}
                                {application.farmLocation.district || "N/A"}
                                <br />
                                <strong>State:</strong>{" "}
                                {application.farmLocation.state || "N/A"},{" "}
                                <strong>Country:</strong>{" "}
                                {application.farmLocation.country || "N/A"}
                                <br />
                                <strong>Pincode:</strong>{" "}
                                {application.farmLocation.pincode || "N/A"}
                            </p>
                            <p className="flex items-center text-sm text-gray-600 mt-2 border-t pt-2 border-gray-100">
                                <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
                                Lat:{" "}
                                {application.farmLocation.latitude || "N/A"},
                                Long:{" "}
                                {application.farmLocation.longitude || "N/A"}
                            </p>
                        </div>

                        {/* Produce Details Section */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 col-span-1 md:col-span-2">
                            <h4 className="font-bold text-lg text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
                                <CircleStackIcon className="h-5 w-5 mr-2 text-green-600" />{" "}
                                Produce Details
                            </h4>
                            {application.produceDetails.length > 0 ? (
                                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700 text-sm">
                                    {application.produceDetails.map(
                                        (produce, index) => (
                                            <li key={index}>
                                                <strong>
                                                    {produce.produceName}:
                                                </strong>{" "}
                                                {produce.quantityAvailable}{" "}
                                                (Seasonality:{" "}
                                                {produce.seasonality})
                                            </li>
                                        )
                                    )}
                                </ul>
                            ) : (
                                <p className="text-gray-500 ml-4 text-sm">
                                    No produce details provided.
                                </p>
                            )}
                        </div>

                        {/* Applicant Details Section (using the helper component) */}
                        <div className="col-span-1 md:col-span-2">
                            <ApplicantDetails user={application.appliedBy} />
                        </div>
                    </div>

                    {application.status === "PENDING" && (
                        <div className="mt-8 flex justify-end space-x-3 border-t pt-6 border-gray-200">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateStatus(application.id, "APPROVED");
                                }}
                                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 ease-in-out font-medium shadow-md"
                            >
                                Approve
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateStatus(application.id, "REJECTED");
                                }}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 ease-in-out font-medium shadow-md"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            )}
        </li>
    );
};

export default SellerApplicationListItem;
