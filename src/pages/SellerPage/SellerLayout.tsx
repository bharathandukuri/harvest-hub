import { useEffect, useState, type ReactNode } from "react";
import {
    FaLeaf,
    FaUser,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaUserCircle,
    FaHome,
    FaBoxOpen,
    FaShoppingCart,
    FaChartBar,
    FaCog,
    FaClipboard,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import {
    fetchAndCacheUserProfile,
    getCachedUserProfile,
    type UserProfile,
} from "../../hooks/UseProfileService";
import { getSessionDetails } from "../../hooks/auth/SessionValidation";

interface SellerLayoutProps {
    page: string;
    pageIcon: ReactNode;
    children: ReactNode;
}

const SellerLayout = ({ page, pageIcon, children }: SellerLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { activeLink, selectLink } = useSidebar();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

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
        links.forEach((link) => {
            if (location.pathname.startsWith(link.path)) {
                selectLink(link.name);
            }
        });
    }, [location.pathname, selectLink]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/auth/login");
    };

    const links = [
        {
            name: "Dashboard",
            icon: <FaHome className="text-base" />,
            path: "/seller/",
            onClick: () => navigate("/seller/"),
        },
        {
            name: "Products Applcations",
            icon: <FaClipboard className="text-base" />,
            path: "/seller/product-applications",
            onClick: () => navigate("/seller/product-applications"),
        },
        {
            name: "Products",
            icon: <FaBoxOpen className="text-base" />,
            path: "/seller/products",
            onClick: () => navigate("/seller/products"),
        },
        {
            name: "Orders",
            icon: <FaShoppingCart className="text-base" />,
            path: "/seller/orders",
            onClick: () => navigate("/seller/orders"),
        },
        {
            name: "Analytics",
            icon: <FaChartBar className="text-base" />,
            path: "/seller/analytics",
            onClick: () => navigate("/seller/analytics"),
        },
        {
            name: "Settings",
            icon: <FaCog className="text-base" />,
            path: "/seller/settings",
            onClick: () => navigate("/seller/settings"),
        },
    ];

    return (
        <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
            <aside
                className={`${
                    sidebarOpen ? "w-64" : "w-0 overflow-hidden"
                } bg-white border-r border-gray-200 shadow-xl flex flex-col justify-between transition-all duration-300 ease-in-out z-20 md:w-64`}
            >
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
                    <div className="flex items-center gap-2 p-5 text-gray-800 text-2xl font-extrabold whitespace-nowrap border-b border-gray-100 bg-gradient-to-r from-green-50 to-green-100">
                        <FaLeaf className="text-green-600 text-3xl" />
                        <span>Harvest Hub</span>
                    </div>

                    <nav className="mt-6 px-4">
                        {links.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => {
                                    selectLink(link.name);
                                    link.onClick?.();
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-3 mb-2
                                    ${
                                        activeLink === link.name // Using activeLink from useSidebar hook
                                            ? "bg-green-600 text-white shadow-md"
                                            : "text-gray-700 hover:bg-green-50 hover:text-green-800"
                                    }`}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="border-t border-gray-200 p-4 bg-white flex items-center justify-between shadow-inner">
                    <div className="flex items-center gap-3 text-gray-800">
                        {user?.profilePicUrl ? (
                            <img
                                src={user.profilePicUrl}
                                alt="Profile"
                                className="w-11 h-11 rounded-full object-cover border-2 border-green-400 ring-2 ring-green-200"
                            />
                        ) : (
                            <FaUserCircle className="text-4xl text-green-500" />
                        )}
                        <div className="text-sm">
                            <div className="font-semibold text-gray-900">
                                {user?.fullName || "Seller"}
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
                            className="text-xl p-2 text-gray-600 hover:bg-gray-100 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 md:hidden"
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
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                        title="Exit Seller Panel"
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

export default SellerLayout;
