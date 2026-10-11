import React, { useState } from "react";
import { type Product, type Review } from "./ProductTypes";
import { FaChevronLeft, FaChevronRight, FaStar, FaTimes } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import WriteReviewForm from "./WriteReviewForm";

interface ProductDetailModalProps {
    product: Product | null;
    onClose: () => void;
    onReviewSubmit: (
        productId: string,
        review: Omit<Review, "id" | "by">,
        userId: string,
        fullName: string
    ) => void;
    // New prop for adding to cart
    onAddToCart: (productId: string, quantity: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
    product,
    onClose,
    onReviewSubmit,
    onAddToCart, // Destructure the new prop
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<"reviews" | "writeReview">(
        "reviews"
    );
    const [quantity, setQuantity] = useState(1); // State for quantity

    React.useEffect(() => {
        setCurrentImageIndex(0);
        setActiveTab("reviews");
        setQuantity(1); // Reset quantity when product changes
    }, [product]);

    if (!product) return null;

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
        );
    };

    const sellerDisplayName =
        product.seller.businessName || product.seller.fullName;

    const sellerRating =
        product.seller.rating !== undefined &&
        product.seller.rating !== null &&
        product.seller.rating > 0
            ? product.seller.rating.toFixed(1)
            : "N/A";

    const overallProductRatingDisplay =
        product.rating !== undefined && product.rating !== null
            ? product.rating.toFixed(1)
            : "N/A";

    const dummyUserId = "user123";
    const dummyUserFullName = "John Doe";

    const handleReviewSubmit = (reviewData: Omit<Review, "id" | "by">) => {
        console.log(reviewData);

        onReviewSubmit(product.id, reviewData, dummyUserId, dummyUserFullName);
        setActiveTab("reviews");
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0 && value <= product.stock) {
            setQuantity(value);
        } else if (value > product.stock) {
            setQuantity(product.stock); // Cap at max stock
        } else {
            setQuantity(1); // Default to 1 if invalid input
        }
    };

    const handleAddToCartClick = () => {
        onAddToCart(product.id, quantity);
        onClose(); // Optionally close the modal after adding to cart
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.2, ease: "easeIn" },
        },
    };

    const tabContentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeOut" },
        },
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-gray-900/20 bg-opacity-75 flex justify-center items-center p-4 z-50 overflow-y-auto"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-auto my-8 relative transform
               max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors z-10 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100"
                        aria-label="Close product details"
                    >
                        <FaTimes className="w-6 h-6" />{" "}
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        <div className="flex flex-col items-center">
                            <div className="relative w-full aspect-w-16 aspect-h-9 sm:aspect-h-10 md:aspect-h-9 lg:aspect-h-3 overflow-hidden rounded-lg shadow-md mb-4 group">
                                <img
                                    src={
                                        product.images[currentImageIndex] ||
                                        "https://via.placeholder.com/600x400?text=No+Image"
                                    }
                                    alt={`${product.name} image ${
                                        currentImageIndex + 1
                                    }`}
                                    className="w-full h-full object-contain bg-gray-100"
                                />
                                {product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={handlePreviousImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
                                            aria-label="Previous image"
                                        >
                                            <FaChevronLeft className="w-5 h-5" />{" "}
                                        </button>
                                        <button
                                            onClick={handleNextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
                                            aria-label="Next image"
                                        >
                                            <FaChevronRight className="w-5 h-5" />{" "}
                                        </button>
                                    </>
                                )}
                            </div>
                            {product.images.length > 1 && (
                                <div className="flex gap-3 justify-center overflow-x-auto pb-2 scrollbar-hide">
                                    {product.images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`${product.name} thumbnail ${
                                                index + 1
                                            }`}
                                            className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all duration-200 transform hover:scale-105 ${
                                                index === currentImageIndex
                                                    ? "border-blue-600 shadow-lg ring-2 ring-blue-300"
                                                    : "border-gray-200 hover:border-blue-400"
                                            }`}
                                            onClick={() =>
                                                setCurrentImageIndex(index)
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                                {product.name}
                            </h2>
                            <p className="text-emerald-700 text-3xl font-bold mb-4">
                                ₹ {product.price}
                            </p>
                            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                                {product.description}
                            </p>

                            <div className="space-y-4 mb-6 text-lg">
                                <div className="flex items-center">
                                    <span className="font-semibold text-gray-800 mr-2">
                                        Stock:
                                    </span>{" "}
                                    <span className="text-gray-700 font-medium">
                                        {product.stock} units
                                    </span>
                                </div>

                                <div className="flex items-center">
                                    <span className="font-semibold text-gray-800 mr-2">
                                        Status:
                                    </span>{" "}
                                    <span
                                        className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full ${
                                            product.productStatus === "APPROVED"
                                                ? "bg-green-100 text-green-800 border border-green-200"
                                                : product.productStatus ===
                                                  "PENDING"
                                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                : "bg-red-100 text-red-800 border border-red-200"
                                        }`}
                                    >
                                        {product.productStatus}
                                    </span>
                                </div>

                                <div>
                                    <span className="font-semibold text-gray-800 mr-2">
                                        Badges:
                                    </span>{" "}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {product.badges.length > 0 ? (
                                            product.badges.map(
                                                (badge, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full shadow-sm"
                                                    >
                                                        {badge}
                                                    </span>
                                                )
                                            )
                                        ) : (
                                            <span className="text-gray-500 text-base italic">
                                                No badges associated.
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <span className="font-semibold text-gray-800 mr-2">
                                        Seller:
                                    </span>{" "}
                                    <div className="flex items-center">
                                        {product.seller.businessLogoUrl ? (
                                            <img
                                                src={
                                                    product.seller
                                                        .businessLogoUrl
                                                }
                                                alt={`${sellerDisplayName} logo`}
                                                className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full mr-2 bg-gray-200 flex items-center justify-center text-gray-500 text-base font-bold uppercase">
                                                {sellerDisplayName
                                                    ? sellerDisplayName[0]
                                                    : "S"}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-blue-600 hover:underline cursor-pointer font-medium leading-snug">
                                                {sellerDisplayName}
                                            </span>
                                            {product.seller.businessName &&
                                                product.seller.fullName && (
                                                    <span className="text-gray-500 text-sm leading-snug">
                                                        (
                                                        {
                                                            product.seller
                                                                .fullName
                                                        }
                                                        )
                                                    </span>
                                                )}
                                        </div>
                                        <span className="ml-auto text-gray-700 flex-shrink-0 text-base font-medium">
                                            ⭐ {sellerRating}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <span className="font-semibold text-gray-800 mr-2">
                                        Overall Rating:
                                    </span>{" "}
                                    <div className="flex items-center text-yellow-500">
                                        {product.rating !== undefined &&
                                        product.rating !== null &&
                                        product.rating > 0 ? (
                                            <>
                                                {Array(
                                                    Math.floor(product.rating)
                                                )
                                                    .fill(0)
                                                    .map((_, i) => (
                                                        <FaStar
                                                            key={`full-star-${i}`}
                                                            className="w-5 h-5"
                                                        />
                                                    ))}
                                                {Array(
                                                    5 -
                                                        Math.floor(
                                                            product.rating
                                                        )
                                                )
                                                    .fill(0)
                                                    .map((_, i) => (
                                                        <FaStar
                                                            key={`empty-star-${i}`}
                                                            className="text-gray-300 w-5 h-5"
                                                        />
                                                    ))}
                                                <span className="ml-2 text-gray-700 font-medium text-base">
                                                    (
                                                    {
                                                        overallProductRatingDisplay
                                                    }
                                                    )
                                                </span>
                                            </>
                                        ) : (
                                            <span className="ml-2 text-gray-500 font-medium text-base">
                                                {overallProductRatingDisplay}
                                            </span>
                                        )}

                                        {product.reviews &&
                                            product.reviews.length > 0 && (
                                                <span className="ml-2 text-gray-500 text-base">
                                                    ({product.reviews.length}{" "}
                                                    reviews)
                                                </span>
                                            )}
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart Section */}
                            <div className="flex items-center space-x-4 mb-6">
                                <label
                                    htmlFor="quantity"
                                    className="font-semibold text-gray-800"
                                >
                                    Quantity:
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="w-24 p-2 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={handleAddToCartClick}
                                    disabled={product.stock === 0}
                                    className={`flex-1 px-6 py-3 rounded-lg text-white font-bold text-lg transition-all duration-300 ${
                                        product.stock === 0
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    }`}
                                >
                                    {product.stock === 0
                                        ? "Out of Stock"
                                        : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-gray-200">
                        <div className="flex border-b border-gray-200 mb-6">
                            <button
                                className={`py-3 px-6 text-lg font-semibold ${
                                    activeTab === "reviews"
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600 hover:text-blue-600"
                                } transition-colors duration-200`}
                                onClick={() => setActiveTab("reviews")}
                            >
                                Customer Reviews ({product.reviews.length})
                            </button>
                            <button
                                className={`py-3 px-6 text-lg font-semibold ${
                                    activeTab === "writeReview"
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600 hover:text-blue-600"
                                } transition-colors duration-200`}
                                onClick={() => setActiveTab("writeReview")}
                            >
                                Write a Review
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === "reviews" && (
                                <motion.div
                                    key="reviews-tab"
                                    variants={tabContentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                >
                                    {product.reviews.length > 0 ? (
                                        <div className="space-y-6">
                                            {product.reviews.map(
                                                (review: Review) => (
                                                    <div
                                                        key={review.id}
                                                        className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm"
                                                    >
                                                        <div className="flex items-center mb-3">
                                                            <div className="flex text-yellow-500 text-xl">
                                                                {Array(
                                                                    review.rating
                                                                )
                                                                    .fill(0)
                                                                    .map(
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) => (
                                                                            <FaStar
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="w-5 h-5"
                                                                            />
                                                                        )
                                                                    )}
                                                                {Array(
                                                                    5 -
                                                                        review.rating
                                                                )
                                                                    .fill(0)
                                                                    .map(
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) => (
                                                                            <FaStar
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="text-gray-300 w-5 h-5"
                                                                            />
                                                                        )
                                                                    )}
                                                            </div>
                                                            <span className="ml-4 text-lg font-semibold text-gray-800">
                                                                {review.title}
                                                            </span>
                                                            <span className="ml-auto text-base font-medium text-gray-600 flex items-center">
                                                                <IoPersonCircle className="w-5 h-5 mr-1 text-gray-400" />
                                                                by{" "}
                                                                {
                                                                    review.by
                                                                        .fullName
                                                                }
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 text-base leading-relaxed mb-3">
                                                            {review.description}
                                                        </p>
                                                        {review.images &&
                                                            review.images
                                                                .length > 0 && (
                                                                <div className="flex gap-2 overflow-x-auto mt-3 pb-2 scrollbar-hide">
                                                                    {review.images.map(
                                                                        (
                                                                            img,
                                                                            idx
                                                                        ) => (
                                                                            <img
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                src={
                                                                                    img
                                                                                }
                                                                                alt={`Review image ${
                                                                                    idx +
                                                                                    1
                                                                                }`}
                                                                                className="w-28 h-28 object-cover rounded-md border border-gray-200 shadow-sm flex-shrink-0"
                                                                            />
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 text-center italic py-4">
                                            No reviews yet for this product. Be
                                            the first to review!
                                        </p>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === "writeReview" && (
                                <motion.div
                                    key="write-review-tab"
                                    variants={tabContentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                >
                                    <WriteReviewForm
                                        onSubmit={handleReviewSubmit}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProductDetailModal;
