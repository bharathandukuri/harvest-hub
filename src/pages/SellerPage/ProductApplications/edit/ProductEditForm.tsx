import React, { useState, useEffect, useCallback } from "react";
import { type Product, type ProductEditFormData } from "../ProductTypes";
import { useDialog } from "../../../../hooks/DialogContext.tsx";
import { logoutSession } from "../../../../hooks/auth/SessionValidation.ts";
import { useNavigate } from "react-router-dom";
import {
    FaTimesCircle,
    FaImage,
    FaSpinner,
    FaSave,
    FaBan,
} from "react-icons/fa";
import axios from "axios";
import { BACKEND_URL } from "../../../../config/Config.ts";

interface ProductEditFormProps {
    productId: number;
    initialProductData: Product;
    onCancel: () => void;
    onProductUpdated: (originalProduct: Product) => void;
    availableCategories: string[];
    onSubmit: (updatedData: ProductEditFormData) => Promise<void>;
}

enum ProductStatus {
    APPROVED = "APPROVED",
    PENDING = "PENDED",
    REJECTED = "REJECTED",
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({
    productId,
    initialProductData,
    onCancel,
    onProductUpdated,
    availableCategories,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<Omit<
        ProductEditFormData,
        "unit"
    > | null>(null);
    const [loading, setLoading] = useState(true);
    const [imagePreviews, setImagePreviews] = useState<(string | File)[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { openDialog, closeDialog, updateDialog } = useDialog();
    const navigate = useNavigate();

    useEffect(() => {
        if (initialProductData) {
            setFormData({
                name: initialProductData.name,
                description: initialProductData.description,
                price: initialProductData.price,
                stock: initialProductData.stock,
                images: initialProductData.images,
                badges: initialProductData.badges || [],
                category: initialProductData.category || "",
            });
            setImagePreviews(initialProductData.images);
            setLoading(false);
        } else {
            openDialog({
                title: "Error",
                description:
                    "Product data not provided. Please ensure the product data is passed correctly.",
                showErrorIcon: true,
                errorMessage: "Missing product data.",
                buttons: [
                    {
                        label: "OK",
                        onClick: () => {
                            closeDialog();
                            onCancel();
                        },
                        variant: "primary",
                    },
                ],
            });
        }
    }, [initialProductData, openDialog, closeDialog, onCancel]);

    const [blobUrls, setBlobUrls] = useState<string[]>([]);

    useEffect(() => {
        const newBlobUrls: string[] = [];
        const currentFiles = imagePreviews.filter(
            (item) => item instanceof File
        ) as File[];

        currentFiles.forEach((file) => {
            newBlobUrls.push(URL.createObjectURL(file));
        });

        const oldBlobUrlsToRevoke = blobUrls.filter(
            (url) => !newBlobUrls.includes(url)
        );
        oldBlobUrlsToRevoke.forEach((url) => URL.revokeObjectURL(url));

        setBlobUrls(newBlobUrls);

        return () => {
            newBlobUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    const uploadImage = async (file: File): Promise<string> => {
        const token = localStorage.getItem("token");
        if (!token) {
            openDialog({
                title: "Unauthorized",
                showErrorIcon: true,
                errorMessage: "You are not logged in. Please log in to upload.",
                buttons: [
                    {
                        label: "Login",
                        variant: "primary",
                        onClick: () => {
                            closeDialog();
                            logoutSession();
                            navigate("/auth/login");
                        },
                    },
                ],
            });
            throw new Error("No token found.");
        }

        const imageData = new FormData();
        imageData.append("file", file);

        const response = await axios.post(
            `${BACKEND_URL}/file/upload`,
            imageData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.data.url;
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;
        if (!formData) return;

        if (type === "file") {
            const files = (e.target as HTMLInputElement).files;
            if (files) {
                const newFiles = Array.from(files);
                setFormData((prev) => ({
                    ...(prev as Omit<ProductEditFormData, "unit">),
                    images: [
                        ...(prev as Omit<ProductEditFormData, "unit">).images,
                        ...newFiles,
                    ],
                }));
                setImagePreviews((prev) => [...prev, ...newFiles]);
            }
        } else {
            setFormData((prev) => ({
                ...(prev as Omit<ProductEditFormData, "unit">),
                [name]: value,
            }));
        }
    };

    const handleRemoveImage = useCallback((indexToRemove: number) => {
        setFormData((prevFormData) => {
            if (!prevFormData) return null;

            const updatedImages = prevFormData.images.filter(
                (_, index) => index !== indexToRemove
            );
            return {
                ...prevFormData,
                images: updatedImages,
            };
        });

        setImagePreviews((prevImagePreviews) => {
            const itemRemoved = prevImagePreviews[indexToRemove];
            if (itemRemoved instanceof File) {
            }
            return prevImagePreviews.filter(
                (_, index) => index !== indexToRemove
            );
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting || !formData) return;

        if (
            !formData.name.trim() ||
            !formData.description.trim() ||
            formData.price.trim() === "" ||
            formData.stock.trim() === "" ||
            !formData.category.trim()
        ) {
            openDialog({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                showErrorIcon: true,
                errorMessage: "Missing information.",
                buttons: [
                    { label: "OK", onClick: closeDialog, variant: "primary" },
                ],
            });
            return;
        }

        if (imagePreviews.length === 0) {
            openDialog({
                title: "Validation Error",
                description: "At least one product image is required.",
                showErrorIcon: true,
                errorMessage: "No images provided.",
                buttons: [
                    { label: "OK", onClick: closeDialog, variant: "primary" },
                ],
            });
            return;
        }

        setIsSubmitting(true);
        openDialog({
            title: "Submitting Edit Application",
            showSpinner: true,
            spinnerMessage: "Preparing application...",
            hideCloseButton: true,
        });

        try {
            const imagesToSend: string[] = [];
            for (const item of formData.images) {
                if (typeof item === "string") {
                    imagesToSend.push(item);
                } else if (item instanceof File) {
                    updateDialog({
                        spinnerMessage: `Uploading image: ${item.name}...`,
                    });
                    const imageUrl = await uploadImage(item);
                    imagesToSend.push(imageUrl);
                }
            }

            const productDataForApplication: Omit<ProductEditFormData, "unit"> =
                {
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    stock: formData.stock,
                    images: imagesToSend,
                    badges: formData.badges
                        .map((b) => b.trim())
                        .filter((b) => b !== ""),
                    category: formData.category,
                };

            updateDialog({
                spinnerMessage: "Submitting product edit application...",
            });

            await onSubmit(productDataForApplication);

            updateDialog({
                showSpinner: false,
                showSuccessIcon: true,
                successMessage:
                    "Product edit application submitted successfully! It will be reviewed by an admin.",
                buttons: [
                    {
                        label: "OK",
                        onClick: () => {
                            closeDialog();
                            onProductUpdated(initialProductData);
                        },
                        variant: "primary",
                    },
                ],
            });
        } catch (error) {
            console.error("Error submitting product edit application:", error);
            updateDialog({
                showSpinner: false,
                showErrorIcon: true,
                errorMessage: `Failed to submit edit application: ${
                    axios.isAxiosError(error) && error.response?.data?.message
                        ? error.response.data.message
                        : "Unknown error"
                }`,
                buttons: [
                    { label: "OK", onClick: closeDialog, variant: "primary" },
                ],
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !formData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-xl flex flex-col items-center">
                    <FaSpinner className="animate-spin text-green-500 text-4xl mb-4" />
                    <p className="text-lg text-gray-700 font-medium">
                        Loading product details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-10 tracking-tight">
                    Edit Product:{" "}
                    <span className="text-green-600">{formData.name}</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="e.g., Organic Fresh Tomatoes"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="Provide a detailed description of your product..."
                            required
                            disabled={isSubmitting}
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label
                                htmlFor="price"
                                className="block text-sm font-semibold text-gray-800 mb-2"
                            >
                                Price (₹){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
                                placeholder="e.g., 150.00"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="stock"
                                className="block text-sm font-semibold text-gray-800 mb-2"
                            >
                                Stock Quantity{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
                                placeholder="e.g., 100"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="block w-full pl-4 pr-10 py-2 text-base border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 appearance-none bg-white transition duration-200 ease-in-out disabled:bg-gray-100 disabled:text-gray-500"
                                required
                                disabled={isSubmitting}
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                {availableCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
                                <svg
                                    className="fill-current h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="images"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Product Images{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center space-x-3 mb-4">
                            <input
                                type="file"
                                id="images"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={handleChange}
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition-colors duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            />
                            <FaImage className="text-green-600 text-xl" />
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
                                {imagePreviews.map((srcOrFile, index) => {
                                    const src =
                                        typeof srcOrFile === "string"
                                            ? srcOrFile
                                            : URL.createObjectURL(srcOrFile);
                                    const isNewFile = srcOrFile instanceof File;
                                    const name = isNewFile
                                        ? srcOrFile.name
                                        : `Existing Image ${index + 1}`;

                                    return (
                                        <div
                                            key={
                                                typeof srcOrFile === "string"
                                                    ? srcOrFile
                                                    : srcOrFile.name + index
                                            }
                                            className="relative w-full aspect-square overflow-hidden rounded-lg shadow-md bg-gray-100 group border border-gray-200 hover:border-green-400 transition-all duration-200"
                                        >
                                            <img
                                                src={src}
                                                alt={`Product preview ${
                                                    index + 1
                                                }`}
                                                className="absolute inset-0 object-cover w-full h-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveImage(index)
                                                }
                                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
                                                aria-label={`Remove image ${
                                                    index + 1
                                                }`}
                                                disabled={isSubmitting}
                                            >
                                                <FaTimesCircle className="w-4 h-4" />
                                            </button>
                                            {isNewFile && (
                                                <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full opacity-90">
                                                    New
                                                </span>
                                            )}
                                            <div className="absolute inset-0 flex items-end justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-black via-transparent to-transparent text-white text-xs font-medium p-2 text-left break-words leading-tight">
                                                {name}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="badges"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Badges (comma-separated, e.g., Organic, Local)
                        </label>
                        <input
                            type="text"
                            id="badges"
                            name="badges"
                            value={
                                Array.isArray(formData.badges)
                                    ? formData.badges.join(", ")
                                    : formData.badges
                            }
                            onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData((prev) => ({
                                    ...(prev as Omit<
                                        ProductEditFormData,
                                        "unit"
                                    >),
                                    [name]: value
                                        .split(",")
                                        .map((b) => b.trim()),
                                }));
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="e.g., Organic, Gluten-Free, Vegan"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="productStatus"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Current Product Status
                        </label>
                        <input
                            type="text"
                            id="productStatus"
                            name="productStatus"
                            value={initialProductData.productStatus}
                            className="block w-full px-4 py-2 text-base border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                            readOnly
                            disabled={true}
                        />
                        <p className="mt-1 text-sm text-gray-600">
                            Product status cannot be changed directly; it will
                            be set to 'PENDING' upon submission for admin
                            review.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="inline-flex items-center px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            <FaBan className="mr-2 -ml-1 h-5 w-5 text-gray-500" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                    Submitting Application...
                                </div>
                            ) : (
                                <>
                                    <FaSave className="mr-2 -ml-1 h-5 w-5" />
                                    Submit Edit Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditForm;
