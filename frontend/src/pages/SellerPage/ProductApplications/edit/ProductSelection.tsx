import React, { useEffect, useState } from "react";
import type { Product } from "../ProductTypes";
import { useDialog } from "../../../../hooks/DialogContext.tsx";
import axios from "axios";
import { BACKEND_URL } from "../../../../config/Config.ts";
import { FaStar } from "react-icons/fa";

interface ProductSelectionProps {
    onSelectProduct: (
        productId: number,
        product: Product,
        categories: string[]
    ) => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({
    onSelectProduct,
}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { openDialog, closeDialog } = useDialog();
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            openDialog({
                title: "Loading Products",
                showSpinner: true,
                spinnerMessage: "Fetching product list...",
                hideCloseButton: true,
            });
            try {
                const productsResponse = await axios.get(
                    BACKEND_URL + "/products",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                const categoriesResponse = await axios.get(
                    BACKEND_URL + "/seller/selling-categories",
                    {
                        headers: {
                            Authorization:
                                "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );

                setCategories(categoriesResponse.data);
                setProducts(productsResponse.data);
                closeDialog();
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again.");
                openDialog({
                    title: "Error",
                    description: "Failed to load products. Please try again.",
                    showErrorIcon: true,
                    errorMessage: "Failed to load products.",
                    buttons: [
                        {
                            label: "OK",
                            onClick: closeDialog,
                            variant: "primary",
                        },
                    ],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [openDialog, closeDialog]);

    // Removed the formatCurrency function as it's no longer needed for direct price display
    // const formatCurrency = (price: string) => {
    //     const numericPrice = parseFloat(price);
    //     if (isNaN(numericPrice)) {
    //         return price; // Return as is if not a valid number
    //     }
    //     // Format as Indian Rupee
    //     return new Intl.NumberFormat("en-IN", {
    //         style: "currency",
    //         currency: "INR",
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2,
    //     }).format(numericPrice);
    // };

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-lg text-gray-600">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-red-600 font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl mx-auto max-w-7xl">
            {products.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center shadow-inner">
                    <p className="text-gray-700 text-xl font-medium">
                        No products available for editing.
                    </p>
                    <p className="text-gray-500 mt-2">
                        Start by adding a new product to your inventory!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-103 hover:shadow-2xl cursor-pointer flex flex-col"
                            onClick={() =>
                                onSelectProduct(product.id, product, categories)
                            }
                        >
                            <div className="relative w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                                {product.images &&
                                product.images.length > 0 &&
                                product.images[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="object-cover w-full h-full"
                                        loading="lazy"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-lg">
                                        No Image Available
                                    </span>
                                )}
                                {/* Conditionally render the status tag if not "APPROVED" */}
                                {product.productStatus !== "APPROVED" && (
                                    <span
                                        className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                                            product.productStatus === "PENDING"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {product.productStatus}
                                    </span>
                                )}
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <h3
                                    className="text-2xl font-bold text-gray-900 mb-2 truncate"
                                    title={product.name}
                                >
                                    {product.name}
                                </h3>
                                <p className="text-xl font-extrabold text-indigo-700 mb-3">
                                    {/* Display price as is */}
                                    {product.price}
                                </p>
                                <p
                                    className="text-sm text-gray-600 mb-3 flex-grow line-clamp-3" // Use line-clamp for description
                                    title={product.description}
                                >
                                    {product.description ||
                                        "No description available for this product."}
                                </p>

                                <div className="flex justify-between items-center mb-3 pt-2 border-t border-gray-100">
                                    <p className="text-base text-gray-700">
                                        Stock:{" "}
                                        <span className="font-semibold text-gray-800">
                                            {product.stock}
                                        </span>{" "}
                                        units
                                    </p>
                                    <div className="flex items-center text-base text-gray-700">
                                        <FaStar className="text-yellow-500 mr-1.5 text-lg" />
                                        <span className="font-semibold">
                                            {product.rating
                                                ? product.rating.toFixed(1)
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>

                                {product.badges &&
                                    product.badges.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {product.badges.map(
                                                (badge, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full whitespace-nowrap"
                                                    >
                                                        {badge}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductSelection;
