import React, { useState, useEffect } from "react";

interface ProductFormData {
    name: string;

    description: string;

    price: string;

    stock: number | "";

    images: File[];

    category: string;

    badges: string;
}

interface ProductUploadApplicationFormProps {
    onClose: () => void;

    onSubmit: (data: ProductFormData) => void;

    categories: string[];
}

const ProductUploadApplicationForm: React.FC<
    ProductUploadApplicationFormProps
> = ({ onClose, onSubmit, categories }) => {
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",

        description: "",

        price: "",

        stock: "",

        images: [],

        category: "",

        badges: "",
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const urls: string[] = [];

        formData.images.forEach((file) => {
            const url = URL.createObjectURL(file);

            urls.push(url);
        });

        setImagePreviews(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [formData.images]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;

        if (type === "file") {
            const files = (e.target as HTMLInputElement).files;

            setFormData((prev) => ({
                ...prev,

                images: files ? Array.from(files) : [],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,

                [name]:
                    name === "stock"
                        ? value === ""
                            ? ""
                            : Number(value)
                        : value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (
            !formData.name ||
            !formData.description ||
            formData.price.trim() === "" ||
            formData.stock === ""
        ) {
            alert("Please fill in all required fields.");

            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Simulating image upload and product submission...");

            await new Promise((resolve) => setTimeout(resolve, 1500));

            onSubmit(formData);
        } catch (error) {
            console.error("Error submitting product:", error);

            alert("Failed to submit product application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 p-4 md:p-6 bg-white rounded-lg shadow-md"
        >
            <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
                Product Details
            </h2>

            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                >
                    Product Name <span className="text-red-500">*</span>
                </label>

                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm

focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500

sm:text-base transition duration-150 ease-in-out

disabled:bg-gray-50 disabled:cursor-not-allowed"
                    required
                    disabled={isSubmitting}
                />
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                >
                    Description <span className="text-red-500">*</span>
                </label>

                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm

focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500

sm:text-base transition duration-150 ease-in-out

disabled:bg-gray-50 disabled:cursor-not-allowed"
                    required
                    disabled={isSubmitting}
                ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Price (₹) <span className="text-red-500">*</span>
                    </label>

                    <input
                        type="text"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm

focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500

sm:text-base transition duration-150 ease-in-out

disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="e.g., 150.00 / kg"
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label
                        htmlFor="stock"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Stock Quantity <span className="text-red-500">*</span>
                    </label>

                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm

focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500

sm:text-base transition duration-150 ease-in-out

disabled:bg-gray-50 disabled:cursor-not-allowed"
                        min="0"
                        required
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="images"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                >
                    Product Images
                </label>

                <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="mt-1 block w-full text-sm text-gray-600

file:mr-4 file:py-2 file:px-4

file:rounded-lg file:border-0

file:text-sm file:font-semibold

file:bg-green-50 file:text-green-700

hover:file:bg-green-100 transition-colors duration-150 ease-in-out

disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                />

                {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        {imagePreviews.map((src, index) => (
                            <div
                                key={index}
                                className="relative w-full pb-[100%] overflow-hidden rounded-lg shadow-md bg-gray-100 group cursor-pointer border border-gray-200 hover:border-green-400 transition-all duration-200"
                            >
                                <img
                                    src={src}
                                    alt={`Product preview ${index + 1}`}
                                    className="absolute inset-0 object-cover w-full h-full"
                                />

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-60 text-white text-xs font-medium p-1 text-center break-words leading-tight">
                                    {formData.images[index]?.name ||
                                        `Image ${index + 1}`}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                >
                    Category
                </label>

                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-4 pr-10 py-2 text-base border border-gray-300 rounded-lg shadow-sm

focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500

sm:text-base appearance-none bg-white transition duration-150 ease-in-out

disabled:bg-gray-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    <option value="">Select a category</option>

                    {categories.map((value, index) => {
                        return (
                            <option value={value} key={index}>
                                {value}
                            </option>
                        );
                    })}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
                    </svg>
                </div>
            </div>

            <div>
                <label
                    htmlFor="badges"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                >
                    Badges (comma-separated, e.g., Organic, Local)
                </label>

                <input
                    type="text"
                    id="badges"
                    name="badges"
                    value={formData.badges}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm

focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500

sm:text-base transition duration-150 ease-in-out

disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="e.g., Organic, Gluten-Free, Vegan"
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center py-2 px-5 border border-gray-300 rounded-lg shadow-sm

text-base font-semibold text-gray-700 bg-white

hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500

transition duration-150 ease-in-out

disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="inline-flex items-center justify-center py-2 px-5 border border-transparent rounded-lg shadow-sm

text-base font-semibold text-white bg-green-600

hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500

transition duration-150 ease-in-out

disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center">
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
                            Submitting...
                        </div>
                    ) : (
                        "Submit Application"
                    )}
                </button>
            </div>
        </form>
    );
};

export default ProductUploadApplicationForm;
