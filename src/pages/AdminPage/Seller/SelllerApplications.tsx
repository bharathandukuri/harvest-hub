import { useState, useEffect, useMemo } from "react";
import axios, { type AxiosError } from "axios";
import { BACKEND_URL } from "../../../config/Config";
import { useNavigate } from "react-router-dom";
import { logoutSession } from "../../../hooks/auth/SessionValidation";
import { useDialog } from "../../../hooks/DialogContext";
import SellerApplicationListItem from "./SellerApplicationListItem";

export interface Address {
    landmark?: string;
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    pincode?: string;
}

export interface Location extends Address {
    latitude?: string;
    longitude?: string;
}

export type Role = "ADMIN" | "USER" | "SELLER";

export interface Product {
    id: number;
    name: string;
    rating: number;
}

export type Category =
    | "FRUITS"
    | "VEGETABLES"
    | "DAIRY"
    | "GRAINS"
    | "MEAT"
    | "SEAFOOD";

export interface User {
    id: number;
    email: string;
    fullName: string;
    role: Role;
    accountVerified: boolean;
    profilePicUrl?: string;
    bio?: string;
    phone?: string;
    dob?: string;
    address?: Address;
    createdAt: string;
    updatedAt: string;

    businessName?: string;
    businessLogoUrl?: string;
    sellingCategories?: Category[];
    farmLocation?: Location;
    rating?: number;
}

export interface ProduceDetail {
    produceName: string;
    quantityAvailable: string;
    seasonality: string;
}

export interface SellerApplication {
    id: number;
    businessName: string;
    businessLogoUrl: string;
    farmLocation: Location;
    description: string;
    categories: Category[];
    produceDetails: ProduceDetail[];
    appliedBy: User;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    updatedAt: string;
}

function SellerApplications() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<
        "ALL" | "PENDING" | "APPROVED" | "REJECTED"
    >("ALL");
    const [applications, setApplications] = useState<SellerApplication[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [applicationsPerPage] = useState<number>(10);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const { openDialog, closeDialog } = useDialog();

    useEffect(() => {
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
    }, [token, navigate, openDialog, closeDialog]);

    const fetchApplications = async () => {
        console.log(token);

        setLoading(true);
        try {
            const data = await axios
                .get(BACKEND_URL + "/admin/seller-applications/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((data) => data.data);
            console.log(data);

            setApplications(data);
        } catch (error) {
            openDialog({
                title: "Error fetching seller applications!",
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchApplications();
        }
    }, [token]);

    const filteredApplications = useMemo(() => {
        setCurrentPage(1);
        return applications.filter((application) => {
            const matchesSearchTerm =
                application.businessName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                application.appliedBy.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                application.appliedBy.fullName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                filterStatus === "ALL" || application.status === filterStatus;

            return matchesSearchTerm && matchesStatus;
        });
    }, [applications, searchTerm, filterStatus]);

    const indexOfLastApplication = currentPage * applicationsPerPage;
    const indexOfFirstApplication =
        indexOfLastApplication - applicationsPerPage;
    const currentApplications = filteredApplications.slice(
        indexOfFirstApplication,
        indexOfLastApplication
    );

    const totalPages = Math.ceil(
        filteredApplications.length / applicationsPerPage
    );

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const getPaginationRange = () => {
        const delta = 2;
        const range = [];
        const left = currentPage - delta;
        const right = currentPage + delta;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= left && i <= right) ||
                (i === left - 1 && currentPage - delta > 1) ||
                (i === right + 1 && currentPage + delta < totalPages)
            ) {
                range.push(i);
            } else if (i < left && range[range.length - 1] !== "...") {
                range.push("...");
            } else if (i > right && range[range.length - 1] !== "...") {
                range.push("...");
            }
        }
        return range.filter(
            (item, index, arr) => item !== "..." || arr[index - 1] !== "..."
        );
    };

    const paginationRange = getPaginationRange();

    const handleUpdateApplicationStatus = async (
        applicationId: number,
        newStatus: "APPROVED" | "REJECTED"
    ) => {
        setLoading(true);
        try {
            await axios.put(
                `${BACKEND_URL}/admin/seller-applications/${applicationId}/status`,
                { status: newStatus },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setApplications((prevApplications) =>
                prevApplications.map((app) =>
                    app.id === applicationId
                        ? { ...app, status: newStatus }
                        : app
                )
            );
            openDialog({
                title: "Application Updated!",
                description: `Application ID ${applicationId} status has been updated to ${newStatus}.`,
                showSuccessIcon: true,
                buttons: [{ label: "Okay", onClick: closeDialog }],
            });
        } catch (err: unknown) {
            const axiosError = err as AxiosError;
            openDialog({
                title: "Error updating application!",
                description:
                    (axiosError.response?.data as { message: string })
                        ?.message ||
                    "An error occurred while updating the application status.",
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                Seller Applications
            </h1>

            <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-grow w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search by business name or applicant email/name..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg text-gray-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search applications"
                        disabled={loading}
                    />
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                <div className="relative w-full sm:w-auto">
                    <select
                        className="block appearance-none w-full bg-white border border-gray-300 text-gray-800 py-3 pl-4 pr-10 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
                        value={filterStatus}
                        onChange={(e) =>
                            setFilterStatus(
                                e.target.value as
                                    | "ALL"
                                    | "PENDING"
                                    | "APPROVED"
                                    | "REJECTED"
                            )
                        }
                        aria-label="Filter by status"
                        disabled={loading}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    <p className="ml-4 text-xl text-gray-600">
                        Loading seller applications...
                    </p>
                </div>
            ) : filteredApplications.length > 0 ? (
                <>
                    <ul className="space-y-6">
                        {currentApplications.map((application) => (
                            <SellerApplicationListItem
                                key={application.id}
                                application={application}
                                onUpdateStatus={handleUpdateApplicationStatus}
                            />
                        ))}
                    </ul>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 transition duration-200 ease-in-out"
                                aria-label="Previous page"
                            >
                                Previous
                            </button>
                            {paginationRange.map((page, index) =>
                                page === "..." ? (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="px-4 py-2 text-gray-700"
                                    >
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => paginate(page as number)}
                                        className={`px-4 py-2 rounded-lg transition duration-200 ease-in-out ${
                                            currentPage === page
                                                ? "bg-blue-700 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                        aria-label={`Go to page ${page}`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 transition duration-200 ease-in-out"
                                aria-label="Next page"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center text-gray-600 text-xl mt-10">
                    No seller applications found matching your criteria.
                </p>
            )}
        </div>
    );
}

export default SellerApplications;
