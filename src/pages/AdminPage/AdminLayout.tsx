import { useEffect, useState, type ReactNode } from "react";
import {
    FaLeaf,
    FaUser,
    FaUsers,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaChevronDown,
    FaChevronUp,
    FaUserCircle,
    FaBox,
    FaClipboard,
    FaCheck,
    FaTag,
    FaUpload,
    FaPen,
    FaTrash,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import {
    fetchAndCacheUserProfile,
    getCachedUserProfile,
    type UserProfile,
} from "../../hooks/UseProfileService";
import { getSessionDetails } from "../../hooks/auth/SessionValidation";
import { FaCartShopping } from "react-icons/fa6";

interface AdminLayoutProps {
    page: string;
    pageIcon: ReactNode;
    children: ReactNode;
}

const AdminLayout = ({ page, pageIcon, children }: AdminLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { activeLink, selectLink } = useSidebar();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openCategories, setOpenCategories] = useState<Set<string>>(
        new Set()
    );

    const sessionEmail = getSessionDetails().email;

    useEffect(() => {
        const loadProfile = async () => {
            await fetchAndCacheUserProfile();
            const cached = getCachedUserProfile();
            if (cached) setUser(cached);
        };
        loadProfile();
    }, []);

    useEffect(() => {
        categories.forEach((cat) => {
            if (cat.links.some((link) => location.pathname === link.path)) {
                setOpenCategories((prev) => new Set(prev).add(cat.name));
            }
        });
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/auth/login");
    };

    const toggleCategoryDropdown = (categoryName: string) => {
        setOpenCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(categoryName)) {
                newSet.delete(categoryName);
            } else {
                newSet.add(categoryName);
            }
            return newSet;
        });
    };

    const categories = [
        {
            name: "Accounts",
            icon: <FaUsers className="text-lg" />,
            links: [
                {
                    name: "Users",
                    icon: <FaUser className="text-base" />,
                    path: "/admin/users",
                    onClick: () => navigate("/admin/users"),
                },
                {
                    name: "Seller Applications",
                    icon: <FaTag className="text-base" />,
                    path: "/admin/seller-applications",
                    onClick: () => navigate("/admin/seller-applications"),
                },
            ],
        },
        {
            name: "Product Applications",
            icon: <FaClipboard className="text-lg" />,
            links: [
                {
                    name: "Upload",
                    icon: <FaUpload className="text-lg" />,
                    path: "/admin/product-applications/upload",
                    onClick: () =>
                        navigate("/admin/product-applications/upload"),
                },
                {
                    name: "Edit",
                    icon: <FaPen className="text-lg" />,
                    path: "/admin/product-applications/edit",
                    onClick: () => navigate("/admin/product-applications/edit"),
                },
                {
                    name: "Delete",
                    icon: <FaTrash className="text-lg" />,
                    path: "/admin/product-applications/delete",
                    onClick: () =>
                        navigate("/admin/product-applications/delete"),
                },
            ],
        },
        {
            name: "Products",
            icon: <FaCartShopping className="text-lg" />,
            links: [
                {
                    name: "Stock",
                    icon: <FaBox className="text-base" />,
                    path: "/admin/products/stock",
                    onClick: () => navigate("/admin/products/stock"),
                },
                {
                    name: "Orders",
                    icon: <FaClipboard className="text-base" />,
                    path: "/admin/products/orders",
                    onClick: () => navigate("/admin/products/orders"),
                },
                {
                    name: "Deliveries",
                    icon: <FaCheck className="text-base" />,
                    path: "/admin/products/deliveries",
                    onClick: () => navigate("/admin/products/deliveries"),
                },
            ],
        },
    ];

    return (
        <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
            <aside
                className={`${
                    sidebarOpen ? "w-64" : "w-0 overflow-hidden"
                } bg-white border-r border-gray-200 shadow-xl flex flex-col justify-between transition-all duration-300 ease-in-out z-20`}
            >
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
                    <div className="flex items-center gap-2 p-5 text-gray-800 text-2xl font-extrabold whitespace-nowrap border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
                        <FaLeaf className="text-blue-600 text-3xl" />
                        <span>Harvest Hub</span>
                    </div>

                    <nav className="mt-6 px-4">
                        {categories.map((cat) => {
                            const isCategoryActive = cat.links.some((link) =>
                                location.pathname.startsWith(link.path)
                            );
                            const isCategoryOpen = openCategories.has(cat.name);

                            return (
                                <div key={cat.name} className="mb-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleCategoryDropdown(cat.name)
                                        }
                                        className={`flex items-center justify-between w-full px-4 py-2 rounded-lg font-semibold uppercase tracking-wide text-xs transition-colors duration-200 ${
                                            isCategoryActive
                                                ? "bg-blue-100 text-blue-800"
                                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {cat.icon}
                                            <span>{cat.name}</span>
                                        </div>
                                        {isCategoryOpen ? (
                                            <FaChevronUp className="text-xs" />
                                        ) : (
                                            <FaChevronDown className="text-xs" />
                                        )}
                                    </button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            isCategoryOpen
                                                ? "max-h-96 opacity-100 mt-2"
                                                : "max-h-0 opacity-0 mt-0"
                                        }`}
                                    >
                                        <div className="ml-4 space-y-1">
                                            {cat.links.map((link) => (
                                                <button
                                                    key={link.name}
                                                    onClick={() => {
                                                        selectLink(link.name);
                                                        link.onClick?.();
                                                    }}
                                                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-3 ${
                                                        location.pathname ===
                                                        link.path
                                                            ? "bg-blue-600 text-white shadow-md"
                                                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                                                    }`}
                                                >
                                                    {link.icon}
                                                    <span>{link.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </nav>
                </div>

                <div className="border-t border-gray-200 p-4 bg-white flex items-center justify-between shadow-inner">
                    <div className="flex items-center gap-3 text-gray-800">
                        {user?.profilePicUrl ? (
                            <img
                                src={user.profilePicUrl}
                                alt="Profile"
                                className="w-11 h-11 rounded-full object-cover border-2 border-blue-400 ring-2 ring-blue-200"
                            />
                        ) : (
                            <FaUserCircle className="text-4xl text-blue-500" />
                        )}
                        <div className="text-sm">
                            <div className="font-semibold text-gray-900">
                                {user?.fullName || "Admin"}
                            </div>
                            <div className="text-xs text-gray-600">
                                {user?.email || sessionEmail}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-700 transition duration-200 p-2 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                        title="Logout"
                    >
                        <FaSignOutAlt className="text-xl" />
                    </button>
                </div>
            </aside>

            <main className="flex flex-col flex-1 h-full bg-gray-100">
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm z-10">
                    <div className="flex items-center gap-4 text-gray-800 text-xl font-bold">
                        <button
                            onClick={() => setSidebarOpen((prev) => !prev)}
                            className="text-xl p-2 text-gray-600 hover:bg-gray-100 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            title={
                                sidebarOpen
                                    ? "Collapse Sidebar"
                                    : "Expand Sidebar"
                            }
                        >
                            <FaBars />
                        </button>
                        {pageIcon}
                        <span>{page}</span>
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        title="Exit Admin Panel"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </header>

                <section className="flex-1 overflow-y-auto p-8 bg-gray-100">
                    {children}
                </section>
            </main>
        </div>
    );
};

export default AdminLayout;
