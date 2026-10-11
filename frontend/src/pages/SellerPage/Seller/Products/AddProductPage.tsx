// src/pages/Seller/AddProductPage.tsx
import React, { useState, useRef } from "react";
import { type ProductFormData } from "./ProductTypes";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../../../hooks/DialogContext";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../../../../config/Config";
import {
    getSessionDetails,
    logoutSession,
} from "../../../../hooks/auth/SessionValidation";
import {
    PhotoIcon,
    PlusIcon,
    XMarkIcon,
    TagIcon,
    CloudArrowUpIcon,
    CubeIcon, // New icon for category
} from "@heroicons/react/24/outline";
import { ClipLoader } from "react-spinners";
import { categories } from "../../../../data/Categories"; // Import categories

const AddProductPage: React.FC = () => {
    const navigate = useNavigate();
    const { openDialog, closeDialog } = useDialog();

    const [formData, setFormData] = useState<
        Omit<ProductFormData, "images" | "category"> & { category: string }
    >({
        name: "",
        description: "",
        price: "",
        stock: "",
        badges: [],
        category: "", // Add category to formData state
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [newBadge, setNewBadge] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...filesArray]);

            const newPreviews = filesArray.map((file) =>
                URL.createObjectURL(file)
            );
            setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const handleRemoveImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);

        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddBadge = () => {
        if (
            newBadge.trim() !== "" &&
            !formData.badges.includes(newBadge.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                badges: [...prev.badges, newBadge.trim()],
            }));
            setNewBadge("");
        } else if (formData.badges.includes(newBadge.trim())) {
            openDialog({
                title: "Duplicate Badge",
                description: "This badge already exists.",
                buttons: [{ label: "OK", onClick: closeDialog }],
            });
        }
    };

    const handleRemoveBadge = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            badges: prev.badges.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (
            !formData.name ||
            !formData.description ||
            !formData.price ||
            !formData.stock ||
            !formData.category // Validate category
        ) {
            openDialog({
                title: "Validation Error",
                description:
                    "Please fill in all required fields: Name, Description, Price, Stock, and Category.",
                showErrorIcon: true,
                buttons: [{ label: "OK", onClick: closeDialog }],
            });
            setIsSubmitting(false);
            return;
        }

        const parsedPrice = parseFloat(formData.price);
        const parsedStock = parseInt(formData.stock);

        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            openDialog({
                title: "Validation Error",
                description: "Price must be a positive number.",
                showErrorIcon: true,
                buttons: [{ label: "OK", onClick: closeDialog }],
            });
            setIsSubmitting(false);
            return;
        }
        if (isNaN(parsedStock) || parsedStock < 0) {
            openDialog({
                title: "Validation Error",
                description: "Stock must be a non-negative integer.",
                showErrorIcon: true,
                buttons: [{ label: "OK", onClick: closeDialog }],
            });
            setIsSubmitting(false);
            return;
        }

        if (selectedFiles.length === 0) {
            openDialog({
                title: "Validation Error",
                description:
                    "Please upload at least one image for the product.",
                showErrorIcon: true,
                buttons: [{ label: "OK", onClick: closeDialog }],
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                openDialog({
                    title: "Invalid session!",
                    showErrorIcon: true,
                    sticky: true,
                    hideCloseButton: true,
                    buttons: [
                        {
                            label: "Okay",
                            onClick() {
                                closeDialog();
                                navigate("/auth/login");
                                logoutSession();
                            },
                        },
                    ],
                });
                return;
            }

            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("stock", formData.stock);
            data.append("category", formData.category); // Append category

            selectedFiles.forEach((file) => {
                data.append(`images`, file);
            });

            data.append("badges", JSON.stringify(formData.badges));

            await axios.post(BACKEND_URL + "/seller/products", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            openDialog({
                title: "Product Added!",
                description: "Your new product has been successfully listed.",
                buttons: [
                    {
                        label: "OK",
                        onClick: () => {
                            closeDialog();
                            navigate("/seller/products");
                        },
                    },
                ],
            });
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            console.error("Failed to add product:", axiosError);
            let errorMessage = "Failed to add product. Please try again.";
            if (
                axiosError.response &&
                axiosError.response.data &&
                (axiosError.response.data as { message?: string }).message
            ) {
                errorMessage = (axiosError.response.data as { message: string })
                    .message;
            } else if (axiosError.message) {
                errorMessage = axiosError.message;
            }

            openDialog({
                title: "Error Adding Product!",
                description: errorMessage,
                showErrorIcon: true,
                sticky: true,
                buttons: [{ label: "OK", onClick: closeDialog }],
            });
        } finally {
            setIsSubmitting(false);
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        }
    };

    React.useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6 md:p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    Add New Product
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            rows={5}
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                            required
                        ></textarea>
                    </div>

                    {/* Price and Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="price"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Price (₹){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                                step="0.01"
                                min="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="stock"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Stock <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="stock"
                                id="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
                        >
                            <CubeIcon className="h-5 w-5 mr-2" /> Product
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.name} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Images Section - Updated for file input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <PhotoIcon className="h-5 w-5 mr-2" /> Product
                            Images
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {imagePreviews.map((previewUrl, index) => (
                                <div
                                    key={index}
                                    className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300"
                                >
                                    <img
                                        src={previewUrl}
                                        alt={`Product image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                                    >
                                        <XMarkIcon className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                multiple
                                accept="image/*" // Restrict to image files
                                className="hidden"
                            />
                            {/* Button to trigger file input */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-green-500 hover:text-green-600 transition-colors"
                            >
                                <CloudArrowUpIcon className="h-8 w-8 mb-1" />
                                <span className="text-xs">Upload</span>
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Upload multiple image files for your product. (e.g.,
                            .jpg, .png)
                        </p>
                    </div>

                    {/* Badges Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <TagIcon className="h-5 w-5 mr-2" /> Product Badges
                            (e.g., Organic, Fresh)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {formData.badges.map((badge, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                >
                                    {badge}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveBadge(index)}
                                        className="ml-2 text-blue-500 hover:text-blue-700"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Add a badge"
                                value={newBadge}
                                onChange={(e) => setNewBadge(e.target.value)}
                                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                            />
                            <button
                                type="button"
                                onClick={handleAddBadge}
                                className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                                <PlusIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Add descriptive tags for your product.
                        </p>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/seller/products")}
                            className="px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ClipLoader size={20} color="#fff" />
                            ) : (
                                "Add Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductPage;
