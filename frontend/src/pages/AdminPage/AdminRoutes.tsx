import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { FaBox, FaPen, FaTag, FaTrash, FaUpload, FaUser } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import UsersPage from "./Users/UsersPage";
import ProductsPage from "./Products/ProductsPage";
import SellersPage from "./Seller/SellersPage";
import AdminPage from "./AdminPage";
import AddUserPage, { type UserFormData } from "./Users/AddUserPage";
import axios, { AxiosError } from "axios";
import { BACKEND_URL } from "../../config/Config";
import { useDialog } from "../../hooks/DialogContext";
import { logoutSession } from "../../hooks/auth/SessionValidation";
import SelllerApplications from "./Seller/SelllerApplications";
import ProductUploadApplications from "./ProductApplications/ProductUploadApplications";
import ProductEditApplications from "./ProductApplications/ProductEditApplications";
import ProductDeleteApplications from "./ProductApplications/ProductDeleteApplications";

const AdminRoutes = () => {
    const navigate = useNavigate();
    const [isAddingUser, setIsAddingUser] = useState(false);
    const { openDialog, closeDialog } = useDialog();

    const handleAddUserSubmit = async (userData: UserFormData) => {
        setIsAddingUser(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                openDialog({
                    title: "Invalid session!",
                    showErrorIcon: true,
                    sticky: true,
                    hideCloseButton: true,
                    buttons: [
                        {
                            label: "Okay",
                            onClick() {
                                closeDialog();
                                navigate("/auth/login");
                                logoutSession();
                            },
                        },
                    ],
                });
            }

            await axios.post(BACKEND_URL + "/admin/user/", userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            navigate("/admin/users");
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 409) {
                openDialog({
                    title: "Error creating user!",
                    description:
                        (axiosError.response?.data as { message: string })
                            ?.message ||
                        "Conflict: User with this email already exists.",
                    sticky: true,
                    hideCloseButton: true,
                    buttons: [
                        {
                            label: "Okay",
                            onClick() {
                                closeDialog();
                            },
                        },
                    ],
                });
            } else {
                openDialog({
                    title: "Error creating user!",
                    showErrorIcon: true,
                    sticky: true,
                    hideCloseButton: true,
                    buttons: [
                        {
                            label: "Okay",
                            onClick() {
                                closeDialog();
                            },
                        },
                    ],
                });
            }
        } finally {
            setIsAddingUser(false);
        }
    };

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <AdminLayout page="Admin" pageIcon={<IoIosSettings />}>
                        <AdminPage />
                    </AdminLayout>
                }
            />
            <Route
                path="users"
                element={
                    <AdminLayout page="Users" pageIcon={<FaUser />}>
                        <UsersPage />
                    </AdminLayout>
                }
            />
            <Route
                path="users/add"
                element={
                    <AdminLayout page="Users" pageIcon={<FaUser />}>
                        <AddUserPage
                            onFormSubmit={handleAddUserSubmit}
                            isSubmitting={isAddingUser}
                        />
                    </AdminLayout>
                }
            />
            <Route
                path="seller-applications"
                element={
                    <AdminLayout
                        page="Sellers Applications"
                        pageIcon={<FaTag />}
                    >
                        <SelllerApplications />
                    </AdminLayout>
                }
            />
            <Route
                path="product-applications/upload"
                element={
                    <AdminLayout
                        page="Prodcut Upload Applications"
                        pageIcon={<FaUpload />}
                    >
                        <ProductUploadApplications />
                    </AdminLayout>
                }
            />
            <Route
                path="product-applications/edit"
                element={
                    <AdminLayout
                        page="Prodcut Edit Applications"
                        pageIcon={<FaPen />}
                    >
                        <ProductEditApplications />
                    </AdminLayout>
                }
            />
            <Route
                path="product-applications/delete"
                element={
                    <AdminLayout
                        page="Prodcut Delete Applications"
                        pageIcon={<FaTrash />}
                    >
                        <ProductDeleteApplications />
                    </AdminLayout>
                }
            />
            <Route
                path="products/stock"
                element={
                    <AdminLayout page="Products" pageIcon={<FaBox />}>
                        <ProductsPage />
                    </AdminLayout>
                }
            />
        </Routes>
    );
};

export default AdminRoutes;
