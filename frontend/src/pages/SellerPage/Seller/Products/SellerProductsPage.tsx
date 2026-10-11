// src/pages/Seller/SellerProductsPage.tsx
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";
import {
    type Product,
    type ProductFormData,
    type Review,
    type User,
} from "./ProductTypes";
import { PlusCircleIcon } from "@heroicons/react/24/outline"; // For Add Product button
import { useDialog } from "../../../../hooks/DialogContext"; // Assuming you have this context for alerts
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../../../../config/Config";
import {
    getSessionDetails,
    logoutSession,
} from "../../../../hooks/auth/SessionValidation";
import { ClipLoader } from "react-spinners"; // Optional: for loading spinner

const DUMMY_USER_1: User = {
    id: "user-1",
    fullName: "Customer Alpha",
    email: "alpha@example.com",
    profilePicUrl: "https://randomuser.me/api/portraits/women/44.jpg",
};

const DUMMY_USER_2: User = {
    id: "user-2",
    fullName: "Customer Beta",
    email: "beta@example.com",
    profilePicUrl: "https://randomuser.me/api/portraits/men/32.jpg",
};

const DUMMY_USER_3: User = {
    id: "user-3",
    fullName: "Customer Gamma",
    email: "gamma@example.com",
    profilePicUrl: "https://randomuser.me/api/portraits/lego/3.jpg",
};

const DUMMY_REVIEWS_1: Review[] = [
    {
        id: 101,
        rating: 5,
        title: "Fantastic product!",
        description:
            "These tomatoes are incredibly fresh and flavorful. Highly recommend them for salads and cooking.",
        images: ["https://via.placeholder.com/100x100?text=TomatoReview1"],
        by: DUMMY_USER_1,
    },
    {
        id: 102,
        rating: 4,
        title: "Good quality, quick delivery",
        description:
            "Arrived quickly and in good condition. A little smaller than expected but still very good.",
        images: [],
        by: DUMMY_USER_2,
    },
];

const DUMMY_REVIEWS_2: Review[] = [
    {
        id: 201,
        rating: 5,
        title: "Best eggs ever!",
        description:
            "Truly farm fresh, the yolks are so vibrant. My family loves them for breakfast.",
        images: ["https://via.placeholder.com/100x100?text=EggReview1"],
        by: DUMMY_USER_3,
    },
];

const DUMMY_PRODUCTS_DATA: Product[] = [
    {
        id: 1,
        name: "Organic Heirloom Tomatoes",
        description:
            "Juicy, vibrant heirloom tomatoes grown organically on our farm. Perfect for salads, sauces, or just snacking.",
        images: [
            "https://via.placeholder.com/400x300?text=Organic+Tomatoes+1",
            "https://via.placeholder.com/400x300?text=Organic+Tomatoes+2",
        ],
        price: "150.00",
        stock: "50",
        badges: ["Organic", "Farm Fresh", "Seasonal"],
        seller: {
            id: "seller-123",
            fullName: "Green Harvest Farms",
            email: "seller@example.com",
        },
        reviews: DUMMY_REVIEWS_1,
        rating: 4.5,
    },
    {
        id: 2,
        name: "Fresh Free-Range Eggs (Dozen)",
        description:
            "A dozen large, fresh eggs from our happy free-range chickens. Rich in flavor and nutrients.",
        images: ["https://via.placeholder.com/400x300?text=FreeRange+Eggs+1"],
        price: "90.00",
        stock: "10", // Low stock
        badges: ["Free-Range", "Local"],
        seller: {
            id: "seller-123",
            fullName: "Green Harvest Farms",
            email: "seller@example.com",
        },
        reviews: DUMMY_REVIEWS_2,
        rating: 5.0,
    },
    {
        id: 3,
        name: "Artisanal Sourdough Bread",
        description:
            "Hand-kneaded, slow-fermented sourdough bread with a crispy crust and chewy interior. Baked fresh daily.",
        images: ["https://via.placeholder.com/400x300?text=Sourdough+Bread"],
        price: "120.00",
        stock: "0", // Out of stock
        badges: ["Handmade", "Baked Fresh"],
        seller: {
            id: "seller-123",
            fullName: "Green Harvest Farms",
            email: "seller@example.com",
        },
        reviews: [],
        rating: 0,
    },
    {
        id: 4,
        name: "Pure Wildflower Honey (500g)",
        description:
            "Natural, unprocessed honey gathered from local wildflowers. A sweet and healthy addition to any meal.",
        images: ["https://via.placeholder.com/400x300?text=Wildflower+Honey"],
        price: "250.00",
        stock: "75",
        badges: ["Natural", "Local"],
        seller: {
            id: "seller-123",
            fullName: "Green Harvest Farms",
            email: "seller@example.com",
        },
        reviews: [
            {
                id: 401,
                rating: 5,
                title: "Delicious honey",
                description: "Very tasty and pure.",
                images: [],
                by: DUMMY_USER_1,
            },
        ],
        rating: 5.0,
    },
];

const SellerProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { openDialog, closeDialog } = useDialog();

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                // Handle missing token, redirect to login
                openDialog({
                    title: "Authentication Error",
                    description:
                        "Your session has expired. Please log in again.",
                    showErrorIcon: true,
                    buttons: [
                        {
                            label: "OK",
                            onClick: () => {
                                closeDialog();
                                logoutSession();
                            },
                        },
                    ],
                });
                return;
            }

            // In a real app, you'd fetch from your backend API
            // const response = await axios.get(`${BACKEND_URL}/seller/products`, {
            //     headers: { Authorization: `Bearer ${token}` }
            // });
            // setProducts(response.data);

            // Simulate API call with dummy data
            await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
            setProducts(DUMMY_PRODUCTS_DATA);
        } catch (err: unknown) {
            const axiosError = err as AxiosError;
            console.error("Failed to fetch products:", axiosError);
            if (
                axiosError.response?.status === 401 ||
                axiosError.response?.status === 403
            ) {
                openDialog({
                    title: "Authorization Error",
                    description:
                        "You are not authorized to view this content. Please log in again.",
                    showErrorIcon: true,
                    buttons: [
                        {
                            label: "OK",
                            onClick: () => {
                                closeDialog();
                                logoutSession();
                            },
                        },
                    ],
                });
            } else {
                setError("Failed to load products. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedProduct(null);
    };

    const handleProductUpdate = (updatedProduct: Product) => {
        // In a real app: call backend API to update product
        // axios.put(`${BACKEND_URL}/seller/products/${updatedProduct.id}`, updatedProduct, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        // .then(() => {
        //     setProducts(prevProducts => prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        //     openDialog({ title: "Success", description: "Product updated successfully!", buttons: [{ label: "OK", onClick: closeDialog }] });
        // })
        // .catch(error => {
        //     console.error("Failed to update product:", error);
        //     openDialog({ title: "Error", description: "Failed to update product. Please try again.", showErrorIcon: true, buttons: [{ label: "OK", onClick: closeDialog }] });
        // });

        // Simulate update
        setProducts((prevProducts) =>
            prevProducts.map((p) =>
                p.id === updatedProduct.id ? updatedProduct : p
            )
        );
        openDialog({
            title: "Success",
            description: "Product updated successfully!",
            buttons: [{ label: "OK", onClick: closeDialog }],
        });
        handleCloseDetailModal(); // Close modal after update
    };

    const handleProductDelete = (productId: number) => {
        // In a real app: call backend API to delete product
        // axios.delete(`${BACKEND_URL}/seller/products/${productId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        // .then(() => {
        //     setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
        //     openDialog({ title: "Success", description: "Product deleted successfully!", buttons: [{ label: "OK", onClick: closeDialog }] });
        // })
        // .catch(error => {
        //     console.error("Failed to delete product:", error);
        //     openDialog({ title: "Error", description: "Failed to delete product. Please try again.", showErrorIcon: true, buttons: [{ label: "OK", onClick: closeDialog }] });
        // });

        // Simulate delete
        setProducts((prevProducts) =>
            prevProducts.filter((p) => p.id !== productId)
        );
        openDialog({
            title: "Success",
            description: "Product deleted successfully!",
            buttons: [{ label: "OK", onClick: closeDialog }],
        });
        handleCloseDetailModal(); // Close modal after deletion
    };

    const handleAddProduct = () => {
        // This would typically navigate to a separate /seller/products/add page or open a modal
        // For now, let's just log or open a dummy modal if you want to implement that later.
        openDialog({
            title: "Add New Product",
            description:
                "Functionality to add a new product will be implemented here (e.g., navigate to /seller/products/add or open a dedicated form modal).",
            buttons: [{ label: "OK", onClick: closeDialog }],
        });
        console.log("Add new product functionality triggered!");
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[500px]">
                <ClipLoader color="#10B981" loading={isLoading} size={50} />
                <p className="ml-4 text-lg text-gray-700">
                    Loading products...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-bold">Error loading products:</p>
                <p>{error}</p>
                <p className="mt-2">
                    Please refresh the page or contact support.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Your Products
                </h2>
                <button
                    onClick={handleAddProduct}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition-colors"
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" /> Add New Product
                </button>
            </div>

            {products.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <p className="text-lg text-gray-600 mb-4">
                        You don't have any products listed yet.
                    </p>
                    <button
                        onClick={handleAddProduct}
                        className="flex items-center mx-auto px-6 py-3 bg-green-500 text-white rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                        <PlusCircleIcon className="h-6 w-6 mr-3" /> Start
                        Selling Now!
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            )}

            {selectedProduct && (
                <ProductDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseDetailModal}
                    product={selectedProduct}
                    onProductUpdate={handleProductUpdate}
                    onProductDelete={handleProductDelete}
                />
            )}
        </div>
    );
};

export default SellerProductsPage;
