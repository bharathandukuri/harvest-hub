import type { Product } from "../ProductsPage.tsx/ProductTypes";

interface ProductCardProps {
    product: Product;
    onClick: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    const sellerDisplayName =
        product.seller.businessName || product.seller.fullName;
    const sellerRating =
        product.seller.rating && product.seller.rating > 0
            ? product.seller.rating.toFixed(1)
            : "N/A";

    return (
        <div
            className="bg-white rounded-xl shadow hover:shadow-lg border border-gray-200 flex flex-col overflow-hidden transition-all duration-200 cursor-pointer"
            onClick={() => onClick(product.id)}
        >
            {/* Image */}
            <div className="relative h-48 w-full">
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
                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                    {product.name}
                </h3>

                <p className="text-emerald-700 text-xl font-bold mb-2">
                    ₹ {product.price}
                </p>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                    {product.rating ? (
                        <>
                            <span className="flex items-center">
                                ⭐ {product.rating.toFixed(1)}
                            </span>
                            {product.reviews?.length > 0 && (
                                <span className="ml-2 text-gray-500">
                                    ({product.reviews.length} reviews)
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-gray-500">No reviews yet</span>
                    )}
                </div>

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

                {/* Seller */}
                <div className="flex items-center text-sm text-gray-600 mt-auto pt-2 border-t border-gray-100">
                    {product.seller.businessLogoUrl ? (
                        <img
                            src={product.seller.businessLogoUrl}
                            alt={sellerDisplayName}
                            className="w-7 h-7 rounded-full mr-2 object-cover border"
                        />
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold mr-2 text-gray-600">
                            {sellerDisplayName?.[0] ?? "S"}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-gray-800 truncate">
                            {sellerDisplayName}
                        </span>
                        {product.seller.businessName &&
                            product.seller.fullName && (
                                <span className="text-gray-500 text-xs">
                                    ({product.seller.fullName})
                                </span>
                            )}
                    </div>
                    <span className="ml-auto text-gray-700">
                        ⭐ {sellerRating}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
