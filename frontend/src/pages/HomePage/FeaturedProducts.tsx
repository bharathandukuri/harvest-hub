import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { type Product } from "../ProductsPage.tsx/ProductTypes";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config/Config";

function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/products/top`);
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch top products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopProducts();
    }, []);

    if (loading) {
        return (
            <p className="text-center text-gray-500 py-10">
                Loading featured products...
            </p>
        );
    }

    return (
        <div className="px-4 md:px-10 py-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={(id) => navigate(`/products/${id}`)}
                    />
                ))}
            </div>
        </div>
    );
}

export default FeaturedProducts;
