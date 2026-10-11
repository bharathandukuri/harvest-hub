import { Routes, Route } from "react-router-dom";
import SellerLayout from "./SellerLayout";
import {
    FaHome,
    FaBoxOpen,
    FaShoppingCart,
    FaChartBar,
    FaCog,
} from "react-icons/fa";

import SellerDashboardPage from "./Seller/SellerDashboardPage";
import SellerProductsPage from "./Seller/Products/SellerProductsPage";
import SellerOrdersPage from "./Seller/SellerOrdersPage";
import SellerAnalyticsPage from "./Seller/SellerAnalyticsPage";
import SellerSettingsPage from "./Seller/SellerSettingsPage";
import AddProductPage from "./Seller/Products/AddProductPage";
import ProductApplications from "./ProductApplications/ProductApplications";

const SellerRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <SellerLayout
                        page="Seller Dashboard"
                        pageIcon={
                            <FaHome className="text-2xl text-green-600" />
                        }
                    >
                        <SellerDashboardPage />
                    </SellerLayout>
                }
            />

            <Route
                path="product-applications"
                element={
                    <SellerLayout
                        page="Seller Applications"
                        pageIcon={
                            <FaBoxOpen className="text-2xl text-green-600" />
                        }
                    >
                        <ProductApplications />
                    </SellerLayout>
                }
            />
            <Route
                path="products"
                element={
                    <SellerLayout
                        page="My Products"
                        pageIcon={
                            <FaBoxOpen className="text-2xl text-green-600" />
                        }
                    >
                        <SellerProductsPage />
                    </SellerLayout>
                }
            />
            <Route
                path="products/add"
                element={
                    <SellerLayout
                        page="Add Products"
                        pageIcon={
                            <FaBoxOpen className="text-2xl text-green-600" />
                        }
                    >
                        <AddProductPage />
                    </SellerLayout>
                }
            />

            <Route
                path="orders"
                element={
                    <SellerLayout
                        page="Orders"
                        pageIcon={
                            <FaShoppingCart className="text-2xl text-green-600" />
                        }
                    >
                        <SellerOrdersPage />
                    </SellerLayout>
                }
            />

            <Route
                path="analytics"
                element={
                    <SellerLayout
                        page="Analytics"
                        pageIcon={
                            <FaChartBar className="text-2xl text-green-600" />
                        }
                    >
                        <SellerAnalyticsPage />
                    </SellerLayout>
                }
            />

            <Route
                path="settings"
                element={
                    <SellerLayout
                        page="Settings"
                        pageIcon={<FaCog className="text-2xl text-green-600" />}
                    >
                        <SellerSettingsPage />
                    </SellerLayout>
                }
            />
        </Routes>
    );
};

export default SellerRoutes;
