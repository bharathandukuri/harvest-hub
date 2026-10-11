import React from "react";
import { type Product } from "./ProductTypes"; // Ensure this path is correct

interface ProductCardProps {
    product: Product;
    onClick: (productId: number) => void;
    onAddToCart: (product: Product) => void; // Changed to pass the whole product
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onClick,
    onAddToCart,
}) => {
    const sellerDisplayName =
        product.seller.businessName || product.seller.fullName;

    const sellerRating =
        product.seller.rating !== undefined &&
        product.seller.rating !== null &&
        product.seller.rating > 0
            ? product.seller.rating.toFixed(1)
            : "N/A";

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-200">
            {/* Image */}
            <div
                className="relative h-48 w-full cursor-pointer"
                onClick={() => onClick(product.id)}
            >
                <img
                    src={
                        product.images[0] ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-4 flex flex-col flex-grow">
                {/* Product Name */}
                <h3
                    className="text-xl font-bold text-gray-900 mb-2 leading-tight truncate cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => onClick(product.id)}
                >
                    {product.name}
                </h3>

                {/* Price Display: Now formatted as price/unit */}
                <p className="text-emerald-700 text-2xl font-extrabold mb-3">
                    ₹ {product.price}
                </p>

                {/* Product Rating & Reviews */}
                <div className="flex items-center text-sm text-gray-600 mb-3">
                    {product.rating ? (
                        <>
                            <span className="flex items-center">
                                <svg
                                    className="w-4 h-4 text-yellow-400 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.565-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                                </svg>
                                {product.rating.toFixed(1)}
                            </span>
                            {product.reviews && product.reviews.length > 0 && (
                                <span className="ml-2 text-gray-500">
                                    ({product.reviews.length} reviews)
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-gray-500">No reviews yet</span>
                    )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {product.badges.map((badge, index) => (
                        <span
                            key={index}
                            className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200"
                        >
                            {badge}
                        </span>
                    ))}
                </div>

                {/* Seller Information */}
                <div className="flex items-center text-sm text-gray-600 mt-auto pt-2 border-t border-gray-100">
                    {product.seller.businessLogoUrl ? (
                        <img
                            src={product.seller.businessLogoUrl}
                            alt={`${sellerDisplayName} logo`}
                            className="w-7 h-7 rounded-full mr-2 object-cover border border-gray-200"
                        />
                    ) : (
                        <div className="w-7 h-7 rounded-full mr-2 bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold uppercase">
                            {sellerDisplayName ? sellerDisplayName[0] : "S"}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0 flex-grow">
                        <span className="font-semibold text-gray-800 truncate leading-snug">
                            {sellerDisplayName}
                        </span>
                        {product.seller.businessName &&
                            product.seller.fullName && (
                                <span className="text-gray-500 text-xs leading-snug">
                                    ({product.seller.fullName})
                                </span>
                            )}
                    </div>
                    <span className="ml-auto text-gray-700 flex-shrink-0">
                        ⭐ {sellerRating}
                    </span>
                </div>

                {/* Add to Cart Button */}
                <button
                    className="mt-4 w-full bg-emerald-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event from firing
                        onAddToCart(product); // Pass the whole product object
                    }}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
