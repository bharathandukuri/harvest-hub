// src/components/seller/ProductDetailModal.tsx
import React, { useState } from "react";
import {
    type Product,
    type Review,
    type ProductFormData,
} from "./ProductTypes";
import { Dialog, Transition } from "@headlessui/react";
import {
    XMarkIcon,
    PencilSquareIcon,
    TrashIcon,
    StarIcon,
    ChatBubbleLeftIcon,
    PhotoIcon,
    CubeIcon,
    CurrencyRupeeIcon,
} from "@heroicons/react/24/solid";
import ProductEditForm from "./ProductEditForm"; // We'll create this next
import DeleteProductDialog from "./DeleteProductDialog"; // We'll create this next

interface ProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    onProductUpdate: (updatedProduct: Product) => void;
    onProductDelete: (productId: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
    isOpen,
    onClose,
    product,
    onProductUpdate,
    onProductDelete,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleEditSave = (formData: ProductFormData) => {
        // Here you would typically send `formData` to your backend API
        // For now, simulate update on the frontend
        const updatedProduct: Product = {
            ...product,
            name: formData.name,
            description: formData.description,
            images: formData.images,
            price: formData.price,
            stock: formData.stock,
            badges: formData.badges,
        };
        onProductUpdate(updatedProduct); // Pass updated product back to parent
        setIsEditing(false); // Close edit form
    };

    const handleDeleteConfirm = () => {
        onProductDelete(product.id);
        setIsDeleteDialogOpen(false); // Close delete dialog
        onClose(); // Close the product detail modal after deletion
    };

    const displayedRating =
        product.rating !== undefined
            ? product.rating
            : product.reviews.length > 0
            ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
              product.reviews.length
            : 0;

    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-bold leading-6 text-gray-900"
                                    >
                                        Product Details
                                    </Dialog.Title>
                                    <div className="flex space-x-2">
                                        {!isEditing && (
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                                onClick={() =>
                                                    setIsEditing(true)
                                                }
                                            >
                                                <PencilSquareIcon className="h-5 w-5 mr-2" />{" "}
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={() =>
                                                setIsDeleteDialogOpen(true)
                                            }
                                        >
                                            <TrashIcon className="h-5 w-5 mr-2" />{" "}
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                            onClick={onClose}
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {isEditing ? (
                                    <ProductEditForm
                                        product={product}
                                        onSave={handleEditSave}
                                        onCancel={() => setIsEditing(false)}
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        {/* Product Images */}
                                        <div className="col-span-1">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                                <PhotoIcon className="h-5 w-5 mr-2" />{" "}
                                                Images
                                            </h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {product.images &&
                                                product.images.length > 0 ? (
                                                    product.images.map(
                                                        (img, index) => (
                                                            <img
                                                                key={index}
                                                                src={img}
                                                                alt={`${
                                                                    product.name
                                                                } image ${
                                                                    index + 1
                                                                }`}
                                                                className="w-full h-24 object-cover rounded-lg shadow-sm border border-gray-200"
                                                            />
                                                        )
                                                    )
                                                ) : (
                                                    <div className="col-span-full text-center text-gray-500 py-4 bg-gray-50 rounded-lg">
                                                        No images available
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="col-span-1">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                                <CubeIcon className="h-5 w-5 mr-2" />{" "}
                                                Details
                                            </h4>
                                            <p className="text-lg font-medium text-gray-900">
                                                {product.name}
                                            </p>
                                            <p className="text-gray-700 mt-2">
                                                {product.description}
                                            </p>
                                            <p className="mt-3 text-2xl font-bold text-green-700 flex items-center">
                                                <CurrencyRupeeIcon className="h-6 w-6 mr-1" />
                                                {parseFloat(
                                                    product.price
                                                ).toFixed(2)}
                                            </p>
                                            <p className="text-gray-600 mt-1">
                                                Stock:{" "}
                                                <span className="font-semibold">
                                                    {product.stock} units
                                                </span>
                                            </p>

                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {product.badges.map(
                                                    (badge, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                                        >
                                                            {badge}
                                                        </span>
                                                    )
                                                )}
                                            </div>

                                            <div className="flex items-center mt-4">
                                                <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                                                <span className="text-lg font-semibold text-gray-800">
                                                    {displayedRating.toFixed(1)}
                                                </span>
                                                <span className="text-sm text-gray-600 ml-1">
                                                    ({product.reviews.length}{" "}
                                                    reviews)
                                                </span>
                                            </div>
                                        </div>

                                        {/* Product Reviews */}
                                        <div className="col-span-full mt-6">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />{" "}
                                                Customer Reviews (
                                                {product.reviews.length})
                                            </h4>
                                            {product.reviews.length === 0 ? (
                                                <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                                                    No reviews yet for this
                                                    product.
                                                </p>
                                            ) : (
                                                <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                                    {product.reviews.map(
                                                        (review) => (
                                                            <div
                                                                key={review.id}
                                                                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                                            >
                                                                <div className="flex items-center mb-2">
                                                                    {review.by
                                                                        ?.profilePicUrl ? (
                                                                        <img
                                                                            src={
                                                                                review
                                                                                    .by
                                                                                    .profilePicUrl
                                                                            }
                                                                            alt={
                                                                                review
                                                                                    .by
                                                                                    .fullName
                                                                            }
                                                                            className="w-8 h-8 rounded-full object-cover mr-3"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600 mr-3">
                                                                            {review
                                                                                .by
                                                                                ?.fullName
                                                                                ? review.by.fullName
                                                                                      .charAt(
                                                                                          0
                                                                                      )
                                                                                      .toUpperCase()
                                                                                : "U"}
                                                                        </div>
                                                                    )}
                                                                    <span className="font-semibold text-gray-800">
                                                                        {review
                                                                            .by
                                                                            ?.fullName ||
                                                                            "Anonymous User"}
                                                                    </span>
                                                                    <div className="flex items-center ml-auto">
                                                                        {Array.from(
                                                                            {
                                                                                length: 5,
                                                                            }
                                                                        ).map(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) => (
                                                                                <StarIcon
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className={`h-4 w-4 ${
                                                                                        i <
                                                                                        review.rating
                                                                                            ? "text-yellow-400"
                                                                                            : "text-gray-300"
                                                                                    }`}
                                                                                />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <h5 className="font-medium text-gray-900 mb-1">
                                                                    {
                                                                        review.title
                                                                    }
                                                                </h5>
                                                                <p className="text-gray-700 text-sm">
                                                                    {
                                                                        review.description
                                                                    }
                                                                </p>
                                                                {review.images &&
                                                                    review
                                                                        .images
                                                                        .length >
                                                                        0 && (
                                                                        <div className="flex flex-wrap gap-2 mt-3">
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
                                                                                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                                                                    />
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>

                <DeleteProductDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    productName={product.name}
                />
            </Dialog>
        </Transition>
    );
};

export default ProductDetailModal;
