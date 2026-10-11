import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerificationPage from "./pages/auth/VerificationPage";
import ResendVerificationPage from "./pages/auth/ResendVerificationPage";
import ForgotPasswordRequestPage from "./pages/auth/ForgotPasswordRequestPage";
import ForgotPasswordVerification from "./pages/auth/ForgotPasswordVerificationPage";
import ResetPassword from "./pages/auth/ResetPasswordPage";
import AuthRedirect from "./pages/auth/AuthRediect";
import ContactUsPage from "./pages/ContactUsPage";
import ProfilePage from "./pages/ProfilePage";
import { useEffect } from "react";
import {
    fetchAndUpdateSessionDetails,
    isValidSession,
} from "./hooks/auth/SessionValidation";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import AdminRoutes from "./pages/AdminPage/AdminRoutes";
import TermsAndConditions from "./pages/TermsAndCondition";
import { useDialog } from "./hooks/DialogContext";
import SellerApplicationForm from "./pages/SellerPage/SellerApplicationForm";
import SellerRoutes from "./pages/SellerPage/SellerRoutes";
import SellerPage from "./pages/SellerPage/SellerPage";
import ProductsPage from "./pages/ProductsPage.tsx/ProductsPage";

function App() {
    const location = useLocation();
    const hideNavAndFooter =
        location.pathname.startsWith("/admin") ||
        (location.pathname.startsWith("/seller/") &&
            location.pathname !== "/seller/apply");
    console.log(location.pathname);

    useEffect(() => {
        if (isValidSession()) {
            fetchAndUpdateSessionDetails();
        }
    }, []);

    const { openDialog, closeDialog } = useDialog();

    return (
        <div>
            {!hideNavAndFooter && <Navbar />}

            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route
                    path="/auth/login"
                    element={
                        <AuthRedirect>
                            <LoginPage />
                        </AuthRedirect>
                    }
                />
                <Route
                    path="/auth/register"
                    element={
                        <AuthRedirect>
                            <RegisterPage />
                        </AuthRedirect>
                    }
                />
                <Route
                    path="/auth/verify-user/:email"
                    element={
                        <AuthRedirect>
                            <VerificationPage />
                        </AuthRedirect>
                    }
                />
                <Route
                    path="/auth/resend-verification"
                    element={
                        <AuthRedirect>
                            <ResendVerificationPage />
                        </AuthRedirect>
                    }
                />
                <Route
                    path="/auth/forgot-password/otp"
                    element={
                        <AuthRedirect>
                            <ForgotPasswordRequestPage />
                        </AuthRedirect>
                    }
                />
                <Route
                    path="/auth/forgot-password/verify/:email"
                    element={
                        <AuthRedirect>
                            <ForgotPasswordVerification />
                        </AuthRedirect>
                    }
                />
                <Route
                    path="/auth/reset-password/:email"
                    element={
                        <AuthRedirect>
                            <ResetPassword />
                        </AuthRedirect>
                    }
                />

                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductsPage />} />
                <Route path="/contact-us" element={<ContactUsPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminRoutes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/seller-applications/"
                    element={
                        <ProtectedRoute allowedRole="USER">
                            <SellerPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/seller/*"
                    element={
                        <ProtectedRoute allowedRole="SELLER">
                            <SellerRoutes />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/seller/apply"
                    element={
                        <ProtectedRoute allowedRole="USER">
                            <SellerApplicationForm
                                openDialog={openDialog}
                                closeDialog={closeDialog}
                            />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/terms-and-conditions"
                    element={<TermsAndConditions />}
                />
            </Routes>

            {!hideNavAndFooter && <Footer />}
        </div>
    );
}
export default App;
