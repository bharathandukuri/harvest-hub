// src/components/seller/ProductEditForm.tsx
import React, { useState, useEffect } from "react";
import { type Product, type ProductFormData } from "./ProductTypes";
import {
    PhotoIcon,
    PlusIcon,
    TagIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useDialog } from "../../../../hooks/DialogContext"; // Assuming you have this context for alerts

interface ProductEditFormProps {
    product: Product;
    onSave: (formData: ProductFormData) => void;
    onCancel: () => void;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({
    product,
    onSave,
    onCancel,
}) => {
    const { openDialog } = useDialog();

    const [formData, setFormData] = useState<ProductFormData>({
        name: product.name,
        description: product.description,
        images: product.images || [],
        price: product.price,
        stock: product.stock,
        badges: product.badges || [],
    });

    const [newImageUrl, setNewImageUrl] = useState("");
    const [newBadge, setNewBadge] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddImage = () => {
        if (newImageUrl.trim() !== "") {
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, newImageUrl.trim()],
            }));
            setNewImageUrl("");
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleAddBadge = () => {
        if (newBadge.trim() !== "") {
            setFormData((prev) => ({
                ...prev,
                badges: [...prev.badges, newBadge.trim()],
            }));
            setNewBadge("");
        }
    };

    const handleRemoveBadge = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            badges: prev.badges.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (
            !formData.name ||
            !formData.description ||
            !formData.price ||
            !formData.stock
        ) {
            openDialog({
                title: "Validation Error",
                description:
                    "Please fill in all required fields: Name, Description, Price, and Stock.",
                showErrorIcon: true,
                buttons: [{ label: "OK", onClick: () => {} }],
            });
            return;
        }
        if (parseFloat(formData.price) <= 0) {
            openDialog({
                title: "Validation Error",
                description: "Price must be a positive number.",
                showErrorIcon: true,
                buttons: [{ label: "OK", onClick: () => {} }],
            });
            return;
        }
        if (parseInt(formData.stock) < 0) {
            openDialog({
                title: "Validation Error",
                description: "Stock cannot be negative.",
                showErrorIcon: true,
                buttons: [{ label: "OK", onClick: () => {} }],
            });
            return;
        }
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Product Name
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
            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                >
                    Description
                </label>
                <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                    required
                ></textarea>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Price (₹)
                    </label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                        step="0.01"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="stock"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Stock
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

            {/* Images Section */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <PhotoIcon className="h-5 w-5 mr-2" /> Product Images
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {formData.images.map((img, index) => (
                        <div
                            key={index}
                            className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300"
                        >
                            <img
                                src={img}
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
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="url"
                        placeholder="Add image URL"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                    />
                    <button
                        type="button"
                        onClick={handleAddImage}
                        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        <PlusIcon className="h-5 w-5" />
                    </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    Add URLs of product images. For actual file uploads, you'd
                    integrate a file upload service here.
                </p>
            </div>

            {/* Badges Section */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <TagIcon className="h-5 w-5 mr-2" /> Badges
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
                        placeholder="Add a badge (e.g., Organic, Fresh)"
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
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default ProductEditForm;
