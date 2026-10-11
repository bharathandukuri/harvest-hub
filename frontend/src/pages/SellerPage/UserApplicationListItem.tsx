import { useState } from "react"; // Import useState for managing component state
import type { SellerApplication } from "../AdminPage/Seller/SelllerApplications";
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    MapPinIcon,
    InformationCircleIcon,
    QueueListIcon,
    CalendarDaysIcon,
    ChevronDownIcon, // Import the ChevronDownIcon for the dropdown arrow
    ChevronUpIcon, // Import ChevronUpIcon for when the dropdown is open
} from "@heroicons/react/24/solid";

interface UserApplicationListItemProps {
    application: SellerApplication;
}

// A helper to get status color and icon
const getStatusAttributes = (status: "PENDING" | "APPROVED" | "REJECTED") => {
    switch (status) {
        case "APPROVED":
            return {
                icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
                textColor: "text-green-700",
                bgColor: "bg-green-100",
                text: "Approved",
            };
        case "REJECTED":
            return {
                icon: <XCircleIcon className="h-6 w-6 text-red-500" />,
                textColor: "text-red-700",
                bgColor: "bg-red-100",
                text: "Rejected",
            };
        case "PENDING":
        default:
            return {
                icon: <ClockIcon className="h-6 w-6 text-yellow-500" />,
                textColor: "text-yellow-700",
                bgColor: "bg-yellow-100",
                text: "Pending Review",
            };
    }
};

// Component to render a detail item, handling optional values
const DetailItem = ({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) => (
    <div>
        <p className="font-semibold text-gray-600">{label}</p>
        <p className="text-gray-800">{value || "N/A"}</p>
    </div>
);

function UserApplicationListItem({
    application,
}: UserApplicationListItemProps) {
    const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility
    const statusInfo = getStatusAttributes(application.status);
    const { farmLocation, produceDetails } = application;

    const toggleOpen = () => setIsOpen(!isOpen); // Function to toggle visibility

    return (
        <li className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl">
            <div className="p-6">
                {/* --- Header Section --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-5 mb-5">
                    <div className="flex items-center mb-4 sm:mb-0">
                        <img
                            className="h-20 w-20 rounded-full object-cover mr-5 border-4 border-gray-100"
                            src={
                                application.businessLogoUrl ||
                                "https://via.placeholder.com/150"
                            }
                            alt={`${application.businessName} logo`}
                        />
                        <div>
                            <p className="text-3xl font-bold text-gray-900">
                                {application.businessName}
                            </p>
                            <p className="text-sm text-gray-500">
                                Application ID: #{application.id}
                            </p>
                        </div>
                    </div>
                    <div
                        className={`inline-flex items-center px-4 py-2 rounded-full font-semibold ${statusInfo.textColor} ${statusInfo.bgColor}`}
                    >
                        {statusInfo.icon}
                        <span className="ml-2">{statusInfo.text}</span>
                    </div>
                </div>

                {/* --- Expand/Collapse Button --- */}
                <div className="flex justify-center mb-5">
                    <button
                        onClick={toggleOpen}
                        className="flex items-center px-6 py-3 bg-indigo-500 text-white rounded-full font-semibold hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
                    >
                        {isOpen ? "Hide Details" : "View Details"}
                        {isOpen ? (
                            <ChevronUpIcon className="ml-2 h-5 w-5" />
                        ) : (
                            <ChevronDownIcon className="ml-2 h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* --- Main Details Section (Conditional Rendering) --- */}
                {isOpen && (
                    <div className="space-y-8 pt-5 border-t border-gray-200 mt-5">
                        {/* --- Business Information --- */}
                        <div>
                            <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                <InformationCircleIcon className="h-6 w-6 mr-2 text-indigo-500" />{" "}
                                Business Information
                            </h3>
                            <div className="space-y-3">
                                <DetailItem
                                    label="Selling Categories"
                                    value={application.categories.join(", ")}
                                />
                                <DetailItem
                                    label="Business Description"
                                    value={`"${application.description}"`}
                                />
                            </div>
                        </div>

                        {/* --- Farm Location Details --- */}
                        <div>
                            <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                <MapPinIcon className="h-6 w-6 mr-2 text-indigo-500" />
                                Farm Location
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                                <DetailItem
                                    label="Street"
                                    value={farmLocation.street}
                                />
                                <DetailItem
                                    label="Landmark"
                                    value={farmLocation.landmark}
                                />
                                <DetailItem
                                    label="City"
                                    value={farmLocation.city}
                                />
                                <DetailItem
                                    label="District"
                                    value={farmLocation.district}
                                />
                                <DetailItem
                                    label="State"
                                    value={farmLocation.state}
                                />
                                <DetailItem
                                    label="Country"
                                    value={farmLocation.country}
                                />
                                <DetailItem
                                    label="Pincode"
                                    value={farmLocation.pincode}
                                />
                                <DetailItem
                                    label="Latitude"
                                    value={farmLocation.latitude}
                                />
                                <DetailItem
                                    label="Longitude"
                                    value={farmLocation.longitude}
                                />
                            </div>
                        </div>

                        {/* --- Produce Details Table --- */}
                        {produceDetails && produceDetails.length > 0 && (
                            <div>
                                <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                    <QueueListIcon className="h-6 w-6 mr-2 text-indigo-500" />
                                    Produce Details
                                </h3>
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="whitespace-nowrap px-4 py-3 font-semibold text-left text-gray-900">
                                                    Produce Name
                                                </th>
                                                <th className="whitespace-nowrap px-4 py-3 font-semibold text-left text-gray-900">
                                                    Quantity Available
                                                </th>
                                                <th className="whitespace-nowrap px-4 py-3 font-semibold text-left text-gray-900">
                                                    Seasonality
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {produceDetails.map(
                                                (produce, index) => (
                                                    <tr
                                                        key={index}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                                                            {
                                                                produce.produceName
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                                            {
                                                                produce.quantityAvailable
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                                                            {
                                                                produce.seasonality
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {/* --- Timestamps --- */}
                        <div>
                            <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                <CalendarDaysIcon className="h-6 w-6 mr-2 text-indigo-500" />
                                Timestamps
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <DetailItem
                                    label="Submitted On"
                                    value={new Date(
                                        application.createdAt
                                    ).toLocaleString()}
                                />
                                <DetailItem
                                    label="Last Updated"
                                    value={new Date(
                                        application.updatedAt
                                    ).toLocaleString()}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
}

export default UserApplicationListItem;
