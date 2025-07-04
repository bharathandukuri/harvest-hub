import React, { useEffect, useState } from "react";
import type { Product } from "../ProductTypes";
import { useDialog } from "../../../../hooks/DialogContext.tsx";
import axios from "axios";
import { BACKEND_URL } from "../../../../config/Config.ts";
import { FaStar } from "react-icons/fa";

interface ProductSelectionForDeleteProps {
    onSelectProduct: (product: Product) => void;
}

const ProductSelectionForDelete: React.FC<ProductSelectionForDeleteProps> = ({
    onSelectProduct,
}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { openDialog, closeDialog } = useDialog();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            openDialog({
                title: "Loading Products",
                showSpinner: true,
                spinnerMessage: "Fetching your product list for deletion...",
                hideCloseButton: true,
            });
            try {
                const productsResponse = await axios.get(
                    BACKEND_URL + "/products", // Assuming this endpoint lists products owned by the seller
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                // Filter out products that are already pending deletion or have been rejected/accepted for deletion.
                // You might need an additional API endpoint or data in the `Product` type
                // to know if a product currently has a pending *deletion* application.
                // For now, we'll assume `productStatus` can indicate if a product is "DELETION_PENDING"
                // or if it should not be listed for deletion if it's already "REJECTED".
                // If your backend doesn't provide this, you'll need to fetch delete applications
                // here as well to filter products that are already in a delete application lifecycle.
                const allProducts: Product[] = productsResponse.data;

                // Simple filter: exclude products that are explicitly 'REJECTED' or 'PENDING'
                // in the context of their main product status, or if they have a pending delete application.
                // For a robust solution, you might need to check the actual `ProductDeleteApplicationProps` list.
                // As a placeholder, we'll filter out products that are already explicitly REJECTED
                // or that have a 'DELETION_PENDING' status (if your Product type supported it).
                // For a more accurate filter, you would also fetch delete applications and then
                // filter products that have a 'PENDING' delete application.
                const deletableProducts = allProducts.filter(
                    (p) => p.productStatus === "APPROVED" // Only allow deleting approved products
                    // You might also want to filter out products that already have a PENDING delete application
                    // This would require fetching delete applications here or from a parent component.
                );

                setProducts(deletableProducts);
                closeDialog();
            } catch (err) {
                console.error("Error fetching products for deletion:", err);
                setError(
                    "Failed to load products for deletion. Please try again."
                );
                openDialog({
                    title: "Error",
                    description:
                        "Failed to load products for deletion. Please try again.",
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
                        No approved products available for deletion.
                    </p>
                    <p className="text-gray-500 mt-2">
                        Only approved products can be selected for deletion
                        requests.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-103 hover:shadow-2xl cursor-pointer flex flex-col"
                            onClick={() => onSelectProduct(product)}
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
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <h3
                                    className="text-2xl font-bold text-gray-900 mb-2 truncate"
                                    title={product.name}
                                >
                                    {product.name}
                                </h3>
                                <p className="text-xl font-extrabold text-indigo-700 mb-3">
                                    ₹{product.price}
                                </p>
                                <p
                                    className="text-sm text-gray-600 mb-3 flex-grow line-clamp-3"
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
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductSelectionForDelete;
