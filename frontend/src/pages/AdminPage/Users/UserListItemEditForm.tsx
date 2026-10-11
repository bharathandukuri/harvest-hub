import React, { useState, useEffect } from "react";
import {
    type User,
    type Role,
    type Category,
    type Address,
    type Location,
} from "./UsersPage";
import {
    isValidName,
    isValidEmail,
} from "../../../hooks/auth/ValidateCredentials";
import { useDialog } from "../../../hooks/DialogContext";

interface UserListItemEditFormProps {
    user: User;
    onSave: (updatedUser: User) => void;
    onCancel: () => void;
}

const ALL_CATEGORIES: Category[] = [
    "FRUITS",
    "VEGETABLES",
    "DAIRY",
    "GRAINS",
    "MEAT",
    "SEAFOOD",
];

function UserListItemEditForm({
    user,
    onSave,
    onCancel,
}: UserListItemEditFormProps) {
    const [editableUser, setEditableUser] = useState<User>({ ...user });
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
        {}
    );
    const { openDialog, closeDialog } = useDialog();

    useEffect(() => {
        setEditableUser({
            ...user,
            dob: user.dob ? user.dob.split("T")[0] : "",
            sellingCategories:
                user.role === "SELLER" && !user.sellingCategories
                    ? []
                    : user.sellingCategories,
            address: user.address || {},
            farmLocation:
                user.role === "SELLER" && !user.farmLocation
                    ? {}
                    : user.farmLocation || {},
        });
        setErrors({});
    }, [user]);

    const handleChange = (
        field: keyof User,
        value: string | boolean | Role | number | Category[]
    ) => {
        setEditableUser((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleAddressChange = (field: keyof Address, value: string) => {
        setEditableUser((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: value,
            },
        }));
    };

    const handleFarmLocationChange = (field: keyof Location, value: string) => {
        setEditableUser((prev) => ({
            ...prev,
            farmLocation: {
                ...prev.farmLocation,
                [field]: value,
            },
        }));
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as Role;
        setEditableUser((prev) => ({
            ...prev,
            role: newRole,
            ...(newRole !== "SELLER" && {
                businessName: undefined,
                businessLogoUrl: undefined,
                sellingCategories: undefined,
                rating: undefined,
                farmLocation: undefined,
            }),
            ...(newRole === "SELLER" &&
                !prev.sellingCategories && {
                    sellingCategories: [],
                }),
            ...(newRole === "SELLER" &&
                !prev.farmLocation && {
                    farmLocation: {},
                }),
        }));
    };

    const handleCategoryChange = (category: Category, isChecked: boolean) => {
        setEditableUser((prev) => {
            const currentCategories = prev.sellingCategories || [];
            const updatedCategories = isChecked
                ? [...currentCategories, category]
                : currentCategories.filter((c) => c !== category);
            return { ...prev, sellingCategories: updatedCategories };
        });
    };
    const handleSave = () => {
        const newErrors: { [key: string]: string | undefined } = {};

        const nameError = isValidName(editableUser.fullName);
        if (nameError) {
            newErrors.fullName = nameError;
        }

        const emailError = isValidEmail(editableUser.email);
        if (emailError) {
            newErrors.email = emailError;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            openDialog({
                title: "Invalid Input",
                description: (
                    <ul className="list-disc list-inside text-left">
                        {Object.entries(newErrors).map(([field, message]) =>
                            message ? <li key={field}>{message}</li> : null
                        )}
                    </ul>
                ),
                sticky: true,
                hideCloseButton: true,
                buttons: [
                    {
                        label: "Okay",
                        onClick: () => closeDialog(),
                    },
                ],
            });

            return;
        }

        onSave(editableUser);
    };

    return (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                        User Information
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label
                                htmlFor="fullName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={editableUser.fullName}
                                onChange={(e) =>
                                    handleChange("fullName", e.target.value)
                                }
                                placeholder="Full Name"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.fullName}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={editableUser.email}
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                                placeholder="Email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="profilePicUrl"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Profile Picture URL
                            </label>
                            <input
                                id="profilePicUrl"
                                type="text"
                                value={editableUser.profilePicUrl || ""}
                                onChange={(e) =>
                                    handleChange(
                                        "profilePicUrl",
                                        e.target.value
                                    )
                                }
                                placeholder="Profile Picture URL"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Phone
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                value={editableUser.phone || ""}
                                onChange={(e) =>
                                    handleChange("phone", e.target.value)
                                }
                                placeholder="Phone"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="dob"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Date of Birth
                            </label>
                            <input
                                id="dob"
                                type="date"
                                value={editableUser.dob || ""}
                                onChange={(e) =>
                                    handleChange("dob", e.target.value)
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                id="accountVerified"
                                type="checkbox"
                                checked={editableUser.accountVerified}
                                onChange={(e) =>
                                    handleChange(
                                        "accountVerified",
                                        e.target.checked
                                    )
                                }
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label
                                htmlFor="accountVerified"
                                className="ml-2 block text-sm text-gray-900"
                            >
                                Account Verified
                            </label>
                        </div>
                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Role
                            </label>
                            <select
                                id="role"
                                value={editableUser.role}
                                onChange={handleRoleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="USER">User</option>
                                <option value="SELLER">Seller</option>
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="bio"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                value={editableUser.bio || ""}
                                onChange={(e) =>
                                    handleChange("bio", e.target.value)
                                }
                                placeholder="Tell us about yourself..."
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {editableUser.role === "SELLER" && (
                    <>
                        <div className="col-span-full mb-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                Seller Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label
                                        htmlFor="businessName"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Business Name
                                    </label>
                                    <input
                                        id="businessName"
                                        type="text"
                                        value={editableUser.businessName || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                "businessName",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Business Name"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="businessLogoUrl"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Business Logo URL
                                    </label>
                                    <input
                                        id="businessLogoUrl"
                                        type="text"
                                        value={
                                            editableUser.businessLogoUrl || ""
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "businessLogoUrl",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Business Logo URL"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="rating"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Rating
                                    </label>
                                    <input
                                        id="rating"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={editableUser.rating || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                "rating",
                                                e.target.value === ""
                                                    ? ""
                                                    : parseFloat(e.target.value)
                                            )
                                        }
                                        placeholder="Rating (0-5)"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Selling Categories
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {ALL_CATEGORIES.map((category) => (
                                            <div
                                                key={category}
                                                className="flex items-center"
                                            >
                                                <input
                                                    id={`category-${category}`}
                                                    type="checkbox"
                                                    checked={
                                                        editableUser.sellingCategories?.includes(
                                                            category
                                                        ) || false
                                                    }
                                                    onChange={(e) =>
                                                        handleCategoryChange(
                                                            category,
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label
                                                    htmlFor={`category-${category}`}
                                                    className="ml-2 text-sm text-gray-900 capitalize"
                                                >
                                                    {category.toLowerCase()}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full mt-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                Farm Location Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="farmLandmark"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Landmark
                                    </label>
                                    <input
                                        id="farmLandmark"
                                        type="text"
                                        value={
                                            editableUser.farmLocation
                                                ?.landmark || ""
                                        }
                                        onChange={(e) =>
                                            handleFarmLocationChange(
                                                "landmark",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Farm Landmark"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmStreet"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Street
                                    </label>
                                    <input
                                        id="farmStreet"
                                        type="text"
                                        value={
                                            editableUser.farmLocation?.street ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFarmLocationChange(
                                                "street",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Farm Street"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmCity"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        City
                                    </label>
                                    <input
                                        id="farmCity"
                                        type="text"
                                        value={
                                            editableUser.farmLocation?.city ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFarmLocationChange(
                                                "city",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Farm City"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmDistrict"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        District
                                    </label>
                                    <input
                                        id="farmDistrict"
                                        type="text"
                                        value={
                                            editableUser.farmLocation
                                                ?.district || ""
                                        }
                                        onChange={(e) =>
                                            handleFarmLocationChange(
                                                "district",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Farm District"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmState"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        State
                                    </label>
                                    <input
                                        id="farmState"
                                        type="text"
                                        value={
                                            editableUser.farmLocation?.state ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFarmLocationChange(
                                                "state",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Farm State"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmCountry"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Country
                                    </label>
                                    <input
                                        id="farmCountry"
                                        type="text"
                                        value={
                                            editableUser.farmLocation
                                                ?.country || ""
                                        }
                                        onChange={(e) =>
                                            handleFarmLocationChange(
                                                "country",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Farm Country"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmPincode"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Pincode
                                    </label>
                                    <input
                                        id="farmPincode"
                                        type="text"
                                        value={
                                            editableUser.farmLocation
                                                ?.pincode || ""
                                        }
                                        onChange={(e) =>
                                            handleFarmLocationChange(
                                                "pincode",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Farm Pincode"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmLatitude"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Latitude
                                    </label>
                                    <input
                                        id="farmLatitude"
                                        type="text"
                                        value={
                                            editableUser.farmLocation
                                                ?.latitude || ""
                                        }
                                        onChange={(e) =>
                                            handleFarmLocationChange(
                                                "latitude",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Latitude"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmLongitude"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Longitude
                                    </label>
                                    <input
                                        id="farmLongitude"
                                        type="text"
                                        value={
                                            editableUser.farmLocation
                                                ?.longitude || ""
                                        }
                                        onChange={(e) =>
                                            handleFarmLocationChange(
                                                "longitude",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Longitude"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="col-span-full mt-4">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="landmark"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Landmark
                        </label>
                        <input
                            id="landmark"
                            type="text"
                            value={editableUser.address?.landmark || ""}
                            onChange={(e) =>
                                handleAddressChange("landmark", e.target.value)
                            }
                            placeholder="Landmark"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="street"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Street
                        </label>
                        <input
                            id="street"
                            type="text"
                            value={editableUser.address?.street || ""}
                            onChange={(e) =>
                                handleAddressChange("street", e.target.value)
                            }
                            placeholder="Street"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700"
                        >
                            City
                        </label>
                        <input
                            id="city"
                            type="text"
                            value={editableUser.address?.city || ""}
                            onChange={(e) =>
                                handleAddressChange("city", e.target.value)
                            }
                            placeholder="City"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="district"
                            className="block text-sm font-medium text-gray-700"
                        >
                            District
                        </label>
                        <input
                            id="district"
                            type="text"
                            value={editableUser.address?.district || ""}
                            onChange={(e) =>
                                handleAddressChange("district", e.target.value)
                            }
                            placeholder="District"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="state"
                            className="block text-sm font-medium text-gray-700"
                        >
                            State
                        </label>
                        <input
                            id="state"
                            type="text"
                            value={editableUser.address?.state || ""}
                            onChange={(e) =>
                                handleAddressChange("state", e.target.value)
                            }
                            placeholder="State"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Country
                        </label>
                        <input
                            id="country"
                            type="text"
                            value={editableUser.address?.country || ""}
                            onChange={(e) =>
                                handleAddressChange("country", e.target.value)
                            }
                            placeholder="Country"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="pincode"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Pincode
                        </label>
                        <input
                            id="pincode"
                            type="text"
                            value={editableUser.address?.pincode || ""}
                            onChange={(e) =>
                                handleAddressChange("pincode", e.target.value)
                            }
                            placeholder="Pincode"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <button
                    onClick={handleSave}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                    Save Changes
                </button>
                <button
                    onClick={onCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default UserListItemEditForm;
