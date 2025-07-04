import { type User } from "./UsersPage";

interface UserListItemDetailsProps {
    user: User;
}

function UserListItemDetails({ user }: UserListItemDetailsProps) {
    return (
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            {/* Profile Section */}
            <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                {user.profilePicUrl && (
                    <img
                        src={user.profilePicUrl}
                        alt={`${user.fullName}'s profile`}
                        className="w-20 h-20 rounded-full object-cover mr-4 shadow-md"
                    />
                )}
                <div>
                    <h3 className="font-extrabold text-2xl text-gray-900 leading-tight">
                        {user.fullName}
                    </h3>
                    <p className="text-blue-700 text-lg font-medium">
                        {user.email}
                    </p>
                    <p className="text-gray-600 text-sm">
                        Member since:{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-sm">
                        Last updated:{" "}
                        {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Basic Information */}
            <h4 className="font-bold text-xl text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 mb-6">
                <p>
                    <strong>ID:</strong> {user.id}
                </p>
                <p>
                    <strong>Verified:</strong>{" "}
                    {user.accountVerified ? (
                        <span className="text-green-600 font-semibold">
                            Yes
                        </span>
                    ) : (
                        <span className="text-red-600 font-semibold">No</span>
                    )}
                </p>
                <p>
                    <strong>Phone:</strong> {user.phone || "N/A"}
                </p>
                <p>
                    <strong>DOB:</strong>{" "}
                    {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
                </p>
                <p>
                    <strong>Role:</strong>{" "}
                    <span className="capitalize font-semibold text-indigo-700">
                        {user.role.toLowerCase()}
                    </span>
                </p>
                <p className="col-span-1 md:col-span-2">
                    <strong>Bio:</strong> {user.bio || "N/A"}
                </p>
            </div>

            {/* Address Section */}
            {user.address && (
                <>
                    <h4 className="font-bold text-xl text-gray-800 mb-4 pt-4 pb-2 border-b border-gray-200">
                        Address Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 mb-6">
                        <p>
                            <strong>Landmark:</strong>{" "}
                            {user.address.landmark || "N/A"}
                        </p>
                        <p>
                            <strong>Street:</strong>{" "}
                            {user.address.street || "N/A"}
                        </p>
                        <p>
                            <strong>City:</strong> {user.address.city || "N/A"}
                        </p>
                        <p>
                            <strong>District:</strong>{" "}
                            {user.address.district || "N/A"}
                        </p>
                        <p>
                            <strong>State:</strong>{" "}
                            {user.address.state || "N/A"}
                        </p>
                        <p>
                            <strong>Country:</strong>{" "}
                            {user.address.country || "N/A"}
                        </p>
                        <p className="col-span-1 md:col-span-2">
                            <strong>Pincode:</strong>{" "}
                            {user.address.pincode || "N/A"}
                        </p>
                    </div>
                </>
            )}

            {/* Seller Properties Section (conditionally rendered) */}
            {user.role === "SELLER" && (
                <>
                    <h4 className="font-bold text-xl text-gray-800 mb-4 pt-4 pb-2 border-b border-gray-200">
                        Seller Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                        <p>
                            <strong>Business Name:</strong>{" "}
                            {user.businessName || "N/A"}
                        </p>
                        {user.businessLogoUrl && (
                            <div className="flex items-center">
                                <strong>Business Logo:</strong>{" "}
                                <img
                                    src={user.businessLogoUrl}
                                    alt={`${user.businessName} logo`}
                                    className="w-10 h-10 ml-2 rounded-md object-contain border border-gray-200"
                                />
                            </div>
                        )}
                        <p>
                            <strong>Rating:</strong>{" "}
                            {user.rating ? `${user.rating}/5` : "N/A"}
                        </p>
                        <p className="col-span-1 md:col-span-2">
                            <strong>Selling Categories:</strong>{" "}
                            {user.sellingCategories &&
                            user.sellingCategories.length > 0
                                ? user.sellingCategories
                                      .map((cat) => cat.toLowerCase())
                                      .join(", ")
                                : "N/A"}
                        </p>

                        {/* Farm Location Section (added) */}
                        {user.farmLocation && (
                            <>
                                <h5 className="col-span-full font-semibold text-lg text-gray-800 mt-4 mb-2">
                                    Farm Location
                                </h5>
                                <p>
                                    <strong>Landmark:</strong>{" "}
                                    {user.farmLocation.landmark || "N/A"}
                                </p>
                                <p>
                                    <strong>Street:</strong>{" "}
                                    {user.farmLocation.street || "N/A"}
                                </p>
                                <p>
                                    <strong>City:</strong>{" "}
                                    {user.farmLocation.city || "N/A"}
                                </p>
                                <p>
                                    <strong>District:</strong>{" "}
                                    {user.farmLocation.district || "N/A"}
                                </p>
                                <p>
                                    <strong>State:</strong>{" "}
                                    {user.farmLocation.state || "N/A"}
                                </p>
                                <p>
                                    <strong>Country:</strong>{" "}
                                    {user.farmLocation.country || "N/A"}
                                </p>
                                <p>
                                    <strong>Pincode:</strong>{" "}
                                    {user.farmLocation.pincode || "N/A"}
                                </p>
                                {/* Display Latitude and Longitude for Farm Location */}
                                <p>
                                    <strong>Latitude:</strong>{" "}
                                    {user.farmLocation.latitude !== undefined
                                        ? user.farmLocation.latitude
                                        : "N/A"}
                                </p>
                                <p>
                                    <strong>Longitude:</strong>{" "}
                                    {user.farmLocation.longitude !== undefined
                                        ? user.farmLocation.longitude
                                        : "N/A"}
                                </p>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default UserListItemDetails;
