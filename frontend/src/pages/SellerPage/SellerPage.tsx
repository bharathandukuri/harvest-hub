import { useState, useEffect, useMemo } from "react";
import axios, { type AxiosError } from "axios";
import { BACKEND_URL } from "../../config/Config";
import { useNavigate } from "react-router-dom";
import { logoutSession } from "../../hooks/auth/SessionValidation";
import { useDialog } from "../../hooks/DialogContext";
import UserApplicationListItem from "./UserApplicationListItem";
import type { SellerApplication } from "../AdminPage/Seller/SelllerApplications";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

function SellerPage() {
    const [applications, setApplications] = useState<SellerApplication[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const { openDialog, closeDialog } = useDialog();

    useEffect(() => {
        if (!token) {
            openDialog({
                title: "Invalid session!",
                description: "Your session has expired. Please log in again.",
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
    }, [token, navigate, openDialog, closeDialog]);

    useEffect(() => {
        const fetchUserApplications = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(
                    BACKEND_URL + "/seller/application/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data: SellerApplication[] = response.data.data || [];

                if (data.length === 0) {
                    navigate("/seller/apply");
                    return;
                }

                setApplications(data);
            } catch (error) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 404) {
                    navigate("/seller/apply");
                    return;
                }

                openDialog({
                    title: "Error Fetching Applications",
                    description:
                        "We couldn't retrieve your applications. Please try again later.",
                    showErrorIcon: true,
                    sticky: true,
                    buttons: [{ label: "Okay", onClick: closeDialog }],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserApplications();
    }, [token, navigate, openDialog, closeDialog]);

    const hasPendingApplication = useMemo(() => {
        return applications.some((app) => app.status === "PENDING");
    }, [applications]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
                <p className="ml-4 text-xl text-gray-700">
                    Loading your applications...
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 text-center sm:text-left">
                        My Seller Applications
                    </h1>

                    {!loading && !hasPendingApplication && (
                        <button
                            onClick={() => navigate("/seller/apply")}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out shrink-0"
                            aria-label="Submit a new seller application"
                        >
                            <PlusCircleIcon className="h-6 w-6" />
                            Submit New Application
                        </button>
                    )}
                </div>

                {applications.length > 0 ? (
                    <div>
                        {!hasPendingApplication && (
                            <div
                                className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md mb-6"
                                role="alert"
                            >
                                <p className="font-bold">
                                    Ready to Apply Again?
                                </p>
                                <p>
                                    You currently have no pending applications.
                                    Click the button above to submit a new one.
                                </p>
                            </div>
                        )}
                        <ul className="space-y-6">
                            {applications.map((application) => (
                                <UserApplicationListItem
                                    key={application.id}
                                    application={application}
                                />
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-center text-gray-600 text-xl mt-10">
                        You have not submitted any seller applications.
                        Redirecting...
                    </p>
                )}
            </div>
        </div>
    );
}

export default SellerPage;
