import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Address {
    landmark?: string;
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    pincode?: string;
}

export interface Location extends Address {
    latitude?: string;
    longitude?: string;
}

export type Role = "ADMIN" | "USER" | "SELLER" | "USER";

export type Category =
    | "FRUITS"
    | "VEGETABLES"
    | "DAIRY"
    | "GRAINS"
    | "MEAT"
    | "SEAFOOD";

export interface UserFormData {
    fullName: string;
    email: string;
    password: string;
    role: Role;
    accountVerified: boolean;
    profilePicUrl?: string;
    bio?: string;
    phone?: string;
    dob?: string;
    address?: Address;

    businessName?: string;
    businessLogoUrl?: string;
    sellingCategories?: Category[];
    farmLocation?: Location;
    rating?: number;
}

interface AddUserPageProps {
    onFormSubmit: (userData: UserFormData) => Promise<void>;
    isSubmitting?: boolean;
}

function AddUserPage({ onFormSubmit, isSubmitting = false }: AddUserPageProps) {
    const navigate = useNavigate();

    const initialFormData: UserFormData = {
        fullName: "",
        email: "",
        password: "",
        role: "USER",
        phone: "",
        bio: "",
        dob: "",
        accountVerified: false,
        profilePicUrl: "",
        address: {
            landmark: "",
            street: "",
            city: "",
            district: "",
            state: "",
            country: "",
            pincode: "",
        },
        businessName: "",
        businessLogoUrl: "",
        sellingCategories: [],
        farmLocation: {
            landmark: "",
            street: "",
            city: "",
            district: "",
            state: "",
            country: "",
            pincode: "",
            latitude: "",
            longitude: "",
        },
        rating: 0,
    };

    const [formData, setFormData] = useState<UserFormData>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

        if (name === "accountVerified") {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (name.startsWith("address.")) {
            const addressField = name.split(".")[1] as keyof Address;
            setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, [addressField]: value },
            }));
        } else if (name.startsWith("farmLocation.")) {
            const farmLocationField = name.split(".")[1] as keyof Location;
            setFormData((prev) => ({
                ...prev,
                farmLocation: {
                    ...prev.farmLocation,
                    [farmLocationField]: value,
                },
            }));
        } else if (name === "sellingCategories") {
            setFormData((prev) => ({
                ...prev,
                sellingCategories: value
                    .split(",")
                    .map((s) => s.trim().toUpperCase() as Category)
                    .filter(Boolean),
            }));
        } else if (type === "number") {
            setFormData((prev) => ({
                ...prev,
                [name]: parseFloat(value) || 0,
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName || formData.fullName.trim() === "") {
            newErrors.fullName = "Full name is required.";
        }
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "A valid email is required.";
        }
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }
        if (!formData.role) {
            newErrors.role = "Role is required.";
        }

        if (formData.role === "SELLER") {
            if (!formData.businessName || formData.businessName.trim() === "") {
                newErrors.businessName =
                    "Business name is required for sellers.";
            }
            if (formData.farmLocation) {
                if (
                    !formData.farmLocation.country ||
                    formData.farmLocation.country.trim() === ""
                ) {
                    newErrors.farmLocationCountry =
                        "Farm location country is required for sellers.";
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Form has validation errors.");
            return;
        }

        await onFormSubmit(formData);
        setFormData(initialFormData);
    };

    const allCategories: Category[] = [
        "FRUITS",
        "VEGETABLES",
        "DAIRY",
        "GRAINS",
        "MEAT",
        "SEAFOOD",
    ];

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                Add New User
            </h1>
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                        Account Details
                    </h2>
                    <div>
                        <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full border ${
                                errors.fullName
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2`}
                            required
                            disabled={isSubmitting}
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.fullName}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full border ${
                                errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2`}
                            required
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full border ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2`}
                            required
                            disabled={isSubmitting}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={`w-full border ${
                                errors.role
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 bg-white`}
                            required
                            disabled={isSubmitting}
                        >
                            <option value="USER">User</option>
                            <option value="SELLER">Seller</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.role}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="accountVerified"
                            name="accountVerified"
                            checked={formData.accountVerified}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            disabled={isSubmitting}
                        />
                        <label
                            htmlFor="accountVerified"
                            className="ml-2 block text-sm font-medium text-gray-700"
                        >
                            Account Verified
                        </label>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4 mt-8">
                        Additional Information
                    </h2>
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="dob"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={formData.dob || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="bio"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={3}
                            value={formData.bio || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                            disabled={isSubmitting}
                        ></textarea>
                    </div>
                    <div>
                        <label
                            htmlFor="profilePicUrl"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Profile Picture URL
                        </label>
                        <input
                            type="url"
                            id="profilePicUrl"
                            name="profilePicUrl"
                            value={formData.profilePicUrl || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                            disabled={isSubmitting}
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4 mt-8">
                        Address Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="address.landmark"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Landmark
                            </label>
                            <input
                                type="text"
                                id="address.landmark"
                                name="address.landmark"
                                value={formData.address?.landmark || ""}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="address.street"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Street
                            </label>
                            <input
                                type="text"
                                id="address.street"
                                name="address.street"
                                value={formData.address?.street || ""}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="address.city"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                City
                            </label>
                            <input
                                type="text"
                                id="address.city"
                                name="address.city"
                                value={formData.address?.city || ""}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="address.district"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                District
                            </label>
                            <input
                                type="text"
                                id="address.district"
                                name="address.district"
                                value={formData.address?.district || ""}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="address.state"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                State
                            </label>
                            <input
                                type="text"
                                id="address.state"
                                name="address.state"
                                value={formData.address?.state || ""}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="address.country"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Country
                            </label>
                            <input
                                type="text"
                                id="address.country"
                                name="address.country"
                                value={formData.address?.country || ""}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label
                                htmlFor="address.pincode"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Pincode
                            </label>
                            <input
                                type="text"
                                id="address.pincode"
                                name="address.pincode"
                                value={formData.address?.pincode || ""}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {formData.role === "SELLER" && (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4 mt-8">
                                Seller Information
                            </h2>
                            <div>
                                <label
                                    htmlFor="businessName"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Business Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="businessName"
                                    name="businessName"
                                    value={formData.businessName || ""}
                                    onChange={handleChange}
                                    className={`w-full border ${
                                        errors.businessName
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2`}
                                    required={formData.role === "SELLER"}
                                    disabled={isSubmitting}
                                />
                                {errors.businessName && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.businessName}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="businessLogoUrl"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Business Logo URL
                                </label>
                                <input
                                    type="url"
                                    id="businessLogoUrl"
                                    name="businessLogoUrl"
                                    value={formData.businessLogoUrl || ""}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="rating"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Rating (0-5)
                                </label>
                                <input
                                    type="number"
                                    id="rating"
                                    name="rating"
                                    value={formData.rating || 0}
                                    onChange={handleChange}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="sellingCategories"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Selling Categories (comma-separated, e.g.,
                                    FRUITS, VEGETABLES)
                                </label>
                                <input
                                    type="text"
                                    id="sellingCategories"
                                    name="sellingCategories"
                                    value={
                                        formData.sellingCategories?.join(
                                            ", "
                                        ) || ""
                                    }
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                    placeholder={`e.g., ${allCategories.join(
                                        ", "
                                    )}`}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 mt-8">
                                Farm Location
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="farmLocation.landmark"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Landmark
                                    </label>
                                    <input
                                        type="text"
                                        id="farmLocation.landmark"
                                        name="farmLocation.landmark"
                                        value={
                                            formData.farmLocation?.landmark ||
                                            ""
                                        }
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmLocation.street"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Street
                                    </label>
                                    <input
                                        type="text"
                                        id="farmLocation.street"
                                        name="farmLocation.street"
                                        value={
                                            formData.farmLocation?.street || ""
                                        }
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmLocation.city"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="farmLocation.city"
                                        name="farmLocation.city"
                                        value={
                                            formData.farmLocation?.city || ""
                                        }
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmLocation.district"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        District
                                    </label>
                                    <input
                                        type="text"
                                        id="farmLocation.district"
                                        name="farmLocation.district"
                                        value={
                                            formData.farmLocation?.district ||
                                            ""
                                        }
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmLocation.state"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        id="farmLocation.state"
                                        name="farmLocation.state"
                                        value={
                                            formData.farmLocation?.state || ""
                                        }
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmLocation.country"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Country{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="farmLocation.country"
                                        name="farmLocation.country"
                                        value={
                                            formData.farmLocation?.country || ""
                                        }
                                        onChange={handleChange}
                                        className={`w-full border ${
                                            errors.farmLocationCountry
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2`}
                                        required={formData.role === "SELLER"}
                                        disabled={isSubmitting}
                                    />
                                    {errors.farmLocationCountry && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.farmLocationCountry}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmLocation.pincode"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        id="farmLocation.pincode"
                                        name="farmLocation.pincode"
                                        value={
                                            formData.farmLocation?.pincode || ""
                                        }
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmLocation.latitude"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Latitude
                                    </label>
                                    <input
                                        type="text"
                                        id="farmLocation.latitude"
                                        name="farmLocation.latitude"
                                        value={
                                            formData.farmLocation?.latitude ||
                                            ""
                                        }
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="farmLocation.longitude"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Longitude
                                    </label>
                                    <input
                                        type="text"
                                        id="farmLocation.longitude"
                                        name="farmLocation.longitude"
                                        value={
                                            formData.farmLocation?.longitude ||
                                            ""
                                        }
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/users")}
                            className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Adding...
                                </>
                            ) : (
                                "Add User"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUserPage;
