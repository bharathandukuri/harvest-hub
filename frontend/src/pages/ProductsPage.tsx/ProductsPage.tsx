import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import ProductDetailModal from "./ProductDetailModel";
import { type Product, type Review } from "./ProductTypes";
import { BACKEND_URL } from "../../config/Config";
import { useDialog } from "../../hooks/DialogContext";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { logoutSession } from "../../hooks/auth/SessionValidation";

interface CartItem extends Product {
    quantity: number;
}

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [filters, setFilters] = useState({
        searchTerm: "",
        minPrice: 0,
        maxPrice: Infinity,
        selectedBadges: [] as string[],
    });
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

    const { id } = useParams<{ id?: string }>(); // Get the 'id' parameter from the URL
    const { openDialog, closeDialog } = useDialog();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get<Product[]>(
                    BACKEND_URL + "/products",
                    {
                        headers: {
                            Authorization:
                                "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );
                setProducts(response.data);

                // If an ID is present in the URL, try to set the selected product
                if (id) {
                    const productFromUrl = response.data.find(
                        (p) => p.id.toString() === id
                    );
                    setSelectedProduct(productFromUrl || null);
                    if (!productFromUrl) {
                        setError("Product not found."); // Or navigate to a 404 page
                    }
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
                if (axios.isAxiosError(err) && err.response) {
                    setError(
                        `Failed to load products: ${err.response.status} - ${err.response.statusText}`
                    );
                } else {
                    setError(
                        "Failed to load products. Please try again later."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [id]); // Re-run effect if ID changes

    const allUniqueBadges = useMemo(() => {
        const badges = new Set<string>();
        products.forEach((p) => p.badges.forEach((b) => badges.add(b)));
        return Array.from(badges);
    }, [products]);

    useEffect(() => {
        let tempProducts = [...products];

        if (filters.searchTerm) {
            tempProducts = tempProducts.filter(
                (p) =>
                    p.name
                        .toLowerCase()
                        .includes(filters.searchTerm.toLowerCase()) ||
                    p.description
                        .toLowerCase()
                        .includes(filters.searchTerm.toLowerCase())
            );
        }

        tempProducts = tempProducts.filter((p) => {
            const priceValue = parseFloat(p.price.split("/")[0]);
            return (
                priceValue >= filters.minPrice && priceValue <= filters.maxPrice
            );
        });

        if (filters.selectedBadges.length > 0) {
            tempProducts = tempProducts.filter((p) =>
                filters.selectedBadges.every((badge) =>
                    p.badges.includes(badge)
                )
            );
        }

        setFilteredProducts(tempProducts);
    }, [filters, products]);

    const handleFilterChange = (filterName: string, value: any) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterName]: value,
        }));
    };

    const handleProductClick = (productId: number) => {
        const product = products.find((p) => p.id === productId);
        setSelectedProduct(product || null);
        // Optionally update URL to reflect the selected product
        navigate(`/products/${productId}`);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        // Optionally remove product ID from URL when modal is closed
        navigate("/products");
    };

    const handleAddToCart = (productToAdd: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.id === productToAdd.id
            );
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === productToAdd.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...productToAdd, quantity: 1 }];
            }
        });
        setIsCartOpen(true);
    };

    const handleRemoveFromCart = (productId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveFromCart(productId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const calculateTotalPrice = useMemo(() => {
        return cart.reduce((total, item) => {
            const pricePerUnit = parseFloat(item.price.split("/")[0]);
            return total + pricePerUnit * item.quantity;
        }, 0);
    }, [cart]);

    const handleBuyNow = () => {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add items before buying.");
            return;
        }
        console.log("Proceeding to checkout with cart:", cart);
        alert(
            `Buying ${cart.reduce(
                (total, item) => total + item.quantity,
                0
            )} items for ₹ ${calculateTotalPrice.toFixed(
                2
            )}! (Checkout logic would go here)`
        );
        setCart([]);
        setIsCartOpen(false);
    };

    const onReviewSubmit = async (
        productId: string,
        review: Omit<Review, "id" | "by">,
        userId: string,
        fullName: string
    ) => {
        const token = localStorage.getItem("token");
        if (!token) {
            openDialog({
                title: "Unauthorized",
                showErrorIcon: true,
                errorMessage: "You must be logged in to submit a review.",
                buttons: [
                    {
                        label: "Login",
                        variant: "primary",
                        onClick: () => {
                            closeDialog();
                            logoutSession();
                            navigate("/auth/login");
                        },
                    },
                ],
            });
            return;
        }

        try {
            const response = await axios.post(
                `${BACKEND_URL}/products/${productId}/reviews`,
                {
                    ...review,
                    userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            openDialog({
                title: "Review Submitted",
                successMessage: `Thanks, ${fullName}! Your review was submitted successfully.`,
                showSuccessIcon: true,
                buttons: [
                    {
                        label: "OK",
                        variant: "primary",
                        onClick: closeDialog,
                    },
                ],
            });
        } catch (error: any) {
            console.error("Review submission failed", error);

            openDialog({
                title: "Submission Failed",
                showErrorIcon: true,
                errorMessage:
                    error.response?.data?.message ||
                    "Something went wrong while submitting your review. Please try again.",
                buttons: [
                    {
                        label: "Close",
                        variant: "secondary",
                        onClick: closeDialog,
                    },
                ],
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 relative">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
                Our Approved Products
            </h1>

            <div className="fixed top-20 right-8 z-50">
                <button
                    className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center relative"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    aria-label="Toggle Cart"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.769.707 1.769H19m-4 0a1 1 0 11-2 0 1 1 0 012 0zm-7 0a1 1 0 11-2 0 1 1 0 012 0z"
                        ></path>
                    </svg>
                    {cart.length > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                            {cart.reduce(
                                (total, item) => total + item.quantity,
                                0
                            )}
                        </span>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <ProductFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        allBadges={allUniqueBadges}
                    />
                </div>

                <div className="md:col-span-3">
                    {loading ? (
                        <div className="text-center text-gray-600 text-lg mt-8">
                            Loading products...
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 text-lg mt-8">
                            {error}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center text-gray-600 text-lg mt-8">
                            No products found matching your filters.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={handleProductClick}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black/20 bg-opacity-50 z-30 transition-opacity duration-300"
                    onClick={() => setIsCartOpen(false)}
                ></div>
            )}

            <div
                className={`fixed top-0 right-0 h-screen w-full md:w-96 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
                ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full p-6">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Your Cart
                        </h2>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setIsCartOpen(false)}
                            aria-label="Close cart"
                        >
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                    </div>

                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500 mt-4">
                            Your cart is empty.
                        </p>
                    ) : (
                        <>
                            <ul className="flex-grow space-y-4 overflow-y-auto pr-2">
                                {" "}
                                {cart.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center border-b border-gray-100 pb-4 last:border-b-0"
                                    >
                                        <img
                                            src={
                                                item.images[0] ||
                                                "https://via.placeholder.com/50?text=No+Img"
                                            }
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-md mr-4 flex-shrink-0"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-600">
                                                ₹ {item.price}
                                            </p>
                                            <div className="flex items-center mt-2">
                                                <button
                                                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300"
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    aria-label="Decrease quantity"
                                                >
                                                    -
                                                </button>
                                                <span className="mx-2 text-gray-800 font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300"
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    className="ml-auto text-red-500 hover:text-red-700 text-sm"
                                                    onClick={() =>
                                                        handleRemoveFromCart(
                                                            item.id
                                                        )
                                                    }
                                                    aria-label="Remove item from cart"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xl font-bold text-gray-800">
                                        Total:
                                    </span>
                                    <span className="text-xl font-bold text-emerald-700">
                                        ₹ {calculateTotalPrice.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    onClick={handleBuyNow}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <ProductDetailModal
                onReviewSubmit={onReviewSubmit}
                product={selectedProduct}
                onClose={handleCloseModal}
                onAddToCart={handleAddToCart}
            />
        </div>
    );
};

export default ProductsPage;
