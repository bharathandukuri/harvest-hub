// src/components/seller/ProductCard.tsx
import React from "react";
import { type Product } from "./ProductTypes";
import { StarIcon, CubeIcon, TagIcon } from "@heroicons/react/24/solid";

interface ProductCardProps {
    product: Product;
    onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onViewDetails,
}) => {
    // Determine the product image to display
    const imageUrl =
        product.images && product.images.length > 0
            ? product.images[0]
            : "https://via.placeholder.com/200x150?text=No+Image";

    const displayedRating =
        product.rating !== undefined
            ? product.rating
            : product.reviews.length > 0
            ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
              product.reviews.length
            : 0;

    return (
        <div
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-200 hover:scale-[1.02] cursor-pointer"
            onClick={() => onViewDetails(product)}
        >
            <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover"
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 truncate mb-2">
                    {product.name}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>
                        {displayedRating.toFixed(1)} ({product.reviews.length}{" "}
                        reviews)
                    </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-green-700">
                        ₹{parseFloat(product.price).toFixed(2)}
                    </span>
                    <span
                        className={`inline-flex items-center text-sm font-semibold px-2 py-1 rounded-full ${
                            parseInt(product.stock) > 10
                                ? "bg-green-100 text-green-800"
                                : parseInt(product.stock) > 0
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        <CubeIcon className="h-4 w-4 mr-1" /> {product.stock} in
                        stock
                    </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                    {product.badges.map((badge, index) => (
                        <span
                            key={index}
                            className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                        >
                            <TagIcon className="h-3 w-3 mr-1" />
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
