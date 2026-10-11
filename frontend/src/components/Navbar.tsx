import { useState, useEffect, useRef, useMemo } from "react";
import {
    FaLeaf,
    FaHome,
    FaBoxOpen,
    FaEnvelope,
    FaSignInAlt,
    FaUserPlus,
    FaBars,
    FaTimes,
    FaUserCircle,
    FaChevronDown,
    FaUser,
    FaSignOutAlt,
    FaBell,
    FaRegBell,
    FaTag,
} from "react-icons/fa"; // Removed specific icons not needed for notifications
import { useNavigate } from "react-router-dom";
import {
    getSessionDetails,
    isValidSession,
} from "../hooks/auth/SessionValidation";
import {
    fetchAndCacheUserProfile,
    getCachedUserProfile,
} from "../hooks/UseProfileService";
import { IoIosSettings } from "react-icons/io";

export interface NotificationItem {
    id: string;
    title: string;
    description: string;
    createdAt: string; // ISO string format
    // icon?: React.ReactNode; Removed icon field
}

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false); // New loading state

    const navigate = useNavigate();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    const loggedIn = isValidSession();
    const userRole = getSessionDetails().role;

    const navLinks = useMemo(() => {
        const links = [
            { name: "Home", icon: <FaHome />, href: "/" },
            { name: "Products", icon: <FaBoxOpen />, href: "/products" },
        ];

        if (loggedIn && !(userRole === "SELLER" || userRole === "ADMIN")) {
            links.push({
                name: "Become a Seller",
                icon: <FaTag />,
                href: "/seller-applications",
            });
        }

        if (userRole === "SELLER") {
            links.push({
                name: "Dashboard",
                icon: <FaTag />,
                href: "/seller/",
            });
        }

        if (userRole === "ADMIN") {
            links.push({
                name: "Admin Panel",
                icon: <IoIosSettings />,
                href: "/admin",
            });
        }

        return links;
    }, [userRole]);

    useEffect(() => {
        if (loggedIn) {
            fetchAndCacheUserProfile();
        }
    }, [loggedIn]);

    const profile = getCachedUserProfile();
    const displayName = profile?.fullName || "Profile";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/auth/login");
        setDropdownOpen(false);
        setMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node) &&
                menuOpen &&
                !(event.target as Element).closest(".md\\:hidden.text-2xl")
            ) {
                setMenuOpen(false);
            }
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (notificationOpen) {
            setLoadingNotifications(true); // Start loading
            // Simulate API call
            timer = setTimeout(() => {
                const fetchedNotifications: NotificationItem[] = [
                    {
                        id: "1",
                        title: "Order Shipped",
                        description: "Your order #12345 has been shipped!",
                        createdAt: new Date(
                            Date.now() - 5 * 60 * 1000
                        ).toISOString(), // 5 minutes ago
                    },
                    {
                        id: "2",
                        title: "New Discount Available",
                        description:
                            "You’ve unlocked a 10% discount on fresh produce!",
                        createdAt: new Date(
                            Date.now() - 60 * 60 * 1000
                        ).toISOString(), // 1 hour ago
                    },
                    {
                        id: "3",
                        title: "Welcome Bonus!",
                        description:
                            "Thanks for signing up! Here's a $5 coupon for your first purchase.",
                        createdAt: new Date(
                            Date.now() - 24 * 60 * 60 * 1000
                        ).toISOString(), // 1 day ago
                    },
                    {
                        id: "4",
                        title: "Price Drop Alert",
                        description:
                            "Great news! The price of Organic Apples has dropped. Grab them now!",
                        createdAt: new Date(
                            Date.now() - 2 * 24 * 60 * 60 * 1000
                        ).toISOString(), // 2 days ago
                    },
                    {
                        id: "5",
                        title: "New Product Arrival",
                        description:
                            "Check out our exciting new range of Exotic Fruits!",
                        createdAt: new Date(
                            Date.now() - 3 * 24 * 60 * 60 * 1000
                        ).toISOString(), // 3 days ago
                    },
                ];

                // Sort notifications by createdAt date in descending order (newest first)
                const sortedNotifications = fetchedNotifications.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );

                setNotifications(sortedNotifications);
                setLoadingNotifications(false); // End loading
            }, 700); // Simulate 700ms loading time
        } else {
            setNotifications([]);
            setLoadingNotifications(false); // Ensure loading is false if closed early
        }

        return () => clearTimeout(timer); // Clean up timer on unmount or if notificationOpen changes
    }, [notificationOpen]);

    const formatTimeAgo = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const handleClearAllNotifications = () => {
        setNotifications([]); // Clear notifications from the UI immediately

        // In a real application, you would make an API call here to mark
        // all notifications as read or delete them from the backend database.
        /*
        fetch('/api/notifications/clear-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // assuming you use a token
            },
        })
        .then(response => {
            if (!response.ok) {
                console.error('Failed to clear notifications on backend');
                // Optionally, re-fetch notifications or show an error
            }
        })
        .catch(error => {
            console.error('Error clearing notifications:', error);
            // Optionally, re-fetch notifications or show an error
        });
        */
        console.log(
            "All notifications cleared (frontend). Backend API call simulated."
        );
    };

    const handleClearOneNotification = (id: string) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));

        // In a real application, you would make an API call here to mark
        // this specific notification as read or delete it from the backend.
        /*
        fetch(`/api/notifications/${id}/clear`, { // Or /api/notifications/${id} with DELETE method
            method: 'POST', // Or 'PUT' if marking as read, 'DELETE' if removing
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            // body: JSON.stringify({ isRead: true }) // If marking as read
        })
        .then(response => {
            if (!response.ok) {
                console.error(`Failed to clear notification ${id} on backend`);
                // Optionally, re-fetch notifications or show an error
            }
        })
        .catch(error => {
            console.error(`Error clearing notification ${id}:`, error);
            // Optionally, re-fetch notifications or show an error
        });
        */
        console.log(
            `Notification ${id} cleared (frontend). Backend API call simulated.`
        );
    };

    return (
        <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="flex items-center justify-between max-w-6xl mx-auto p-4 text-green-700">
                <span
                    className="text-2xl transition-transform duration-200 hover:scale-110 cursor-pointer flex items-center gap-2"
                    onClick={() => navigate("/")}
                >
                    <FaLeaf className="text-green-600" />
                    <span className="font-bold tracking-wide">Harvest Hub</span>
                </span>

                <div className="hidden md:flex gap-6 text-lg items-center">
                    {navLinks.map((link) => {
                        let baseStyle =
                            "flex items-center gap-1 px-2 py-1 rounded-md transition text-[17px] font-semibold";
                        let colorStyle =
                            "hover:bg-green-50 hover:text-green-900 text-green-700";

                        if (link.name === "Dashboard") {
                            colorStyle =
                                "text-blue-600 hover:bg-blue-50 hover:text-blue-900";
                        } else if (link.name === "Admin Panel") {
                            colorStyle =
                                "text-red-600 hover:bg-red-50 hover:text-red-900";
                        }

                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`${baseStyle} ${colorStyle}`}
                            >
                                {link.icon} {link.name}
                            </a>
                        );
                    })}
                </div>

                <div className="hidden md:flex gap-2 items-center relative">
                    {loggedIn && (
                        <div className="relative mr-1" ref={notificationRef}>
                            <button
                                onClick={() =>
                                    setNotificationOpen(!notificationOpen)
                                }
                                className="relative p-2 rounded-full hover:bg-green-50 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                                aria-label="Notifications"
                            >
                                <FaBell className="text-xl text-green-700" />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                            {notificationOpen && (
                                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-fade-in-up text-sm">
                                    <div className="p-4 border-b border-gray-100 font-semibold text-gray-800 bg-gray-50 flex justify-between items-center">
                                        <span>Notifications</span>
                                        {notifications.length > 0 && (
                                            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                                                {notifications.length} New
                                            </span>
                                        )}
                                    </div>

                                    {/* Loading State */}
                                    {loadingNotifications ? (
                                        <div className="p-6 text-center">
                                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto border-green-500 animate-spin"></div>
                                            <p className="text-gray-600">
                                                Loading notifications...
                                            </p>
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500 text-sm italic flex flex-col items-center gap-2">
                                            <FaRegBell className="text-4xl text-gray-300" />
                                            <p className="text-lg font-medium text-gray-600">
                                                No new notifications
                                            </p>
                                            <p>You're all caught up!</p>
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-100">
                                            {notifications.map((notif) => (
                                                <li
                                                    key={notif.id}
                                                    className="px-4 py-3 hover:bg-green-50 cursor-pointer transition flex flex-col"
                                                >
                                                    <p className="font-medium text-gray-800 flex items-center gap-2">
                                                        {/* Removed notif.icon here */}
                                                        <span>
                                                            {notif.title}
                                                        </span>
                                                        <span className="text-xs text-gray-400 ml-auto flex items-center gap-2">
                                                            {formatTimeAgo(
                                                                notif.createdAt
                                                            )}
                                                            <button
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation(); // Prevent dropdown from closing
                                                                    handleClearOneNotification(
                                                                        notif.id
                                                                    );
                                                                }}
                                                                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                                                aria-label={`Clear ${notif.title} notification`}
                                                            >
                                                                &times;{" "}
                                                                {/* HTML entity for 'x' */}
                                                            </button>
                                                        </span>
                                                    </p>
                                                    <div className="text-gray-600 text-sm mt-1">
                                                        {notif.description}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {notifications.length > 0 && (
                                        <div className="p-2 border-t border-gray-100 bg-gray-50">
                                            <button
                                                onClick={
                                                    handleClearAllNotifications
                                                }
                                                className="w-full text-center text-sm text-green-600 hover:text-green-800 font-semibold py-1 rounded transition-colors duration-200"
                                            >
                                                Clear All Notifications
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {!loggedIn ? (
                        <>
                            <button
                                className="flex items-center gap-1 px-4 py-2 rounded-full bg-white text-green-700 border border-green-600 font-semibold hover:bg-green-100 transition cursor-pointer"
                                onClick={() => navigate("/auth/login")}
                            >
                                <FaSignInAlt /> Login
                            </button>
                            <button
                                className="flex items-center gap-1 px-4 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition cursor-pointer"
                                onClick={() => navigate("/auth/register")}
                            >
                                <FaUserPlus /> Register
                            </button>
                        </>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="focus:outline-none flex items-center gap-2 rounded-full px-3 py-2 hover:bg-green-50 transition"
                            >
                                {profile?.profilePicUrl ? (
                                    <img
                                        src={profile.profilePicUrl}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full border border-green-500 object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="text-3xl text-green-700" />
                                )}
                                <span className="font-semibold text-green-800 hidden lg:inline">
                                    {displayName}
                                </span>
                                <FaChevronDown
                                    className={`text-sm transition-transform ${
                                        dropdownOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                                    <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                                        {profile?.profilePicUrl ? (
                                            <img
                                                src={profile.profilePicUrl}
                                                alt="Profile"
                                                className="w-12 h-12 rounded-full border border-green-500 object-cover"
                                            />
                                        ) : (
                                            <FaUserCircle className="text-4xl text-green-700" />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-800">
                                                {profile?.fullName ||
                                                    "Your name"}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {profile?.email ||
                                                    localStorage.getItem(
                                                        "email"
                                                    )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col text-sm text-gray-700">
                                        <button
                                            className="flex items-center gap-2 px-4 py-3 hover:bg-green-50 transition"
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                navigate("/profile");
                                            }}
                                        >
                                            <FaUser /> My Profile
                                        </button>
                                        <button className="flex items-center gap-2 px-3 py-3 hover:bg-green-50 transition">
                                            <IoIosSettings className="text-xl" />{" "}
                                            Settings
                                        </button>
                                        <button
                                            className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 transition"
                                            onClick={handleLogout}
                                        >
                                            <FaSignOutAlt /> Log Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="md:hidden flex items-center gap-3">
                    {loggedIn && (
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() =>
                                    setNotificationOpen(!notificationOpen)
                                }
                                className="relative p-2 rounded-full hover:bg-green-50 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                                aria-label="Notifications"
                            >
                                <FaBell className="text-xl text-green-700" />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                            {notificationOpen && (
                                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-fade-in-up text-sm">
                                    <div className="p-4 border-b border-gray-100 font-semibold text-gray-800 bg-gray-50 flex justify-between items-center">
                                        <span>Notifications</span>
                                        {notifications.length > 0 && (
                                            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                                                {notifications.length} New
                                            </span>
                                        )}
                                    </div>

                                    {/* Loading State */}
                                    {loadingNotifications ? (
                                        <div className="p-6 text-center">
                                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto border-green-500 animate-spin"></div>
                                            <p className="text-gray-600">
                                                Loading notifications...
                                            </p>
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500 text-sm italic flex flex-col items-center gap-2">
                                            <FaRegBell className="text-4xl text-gray-300" />
                                            <p className="text-lg font-medium text-gray-600">
                                                No new notifications
                                            </p>
                                            <p>You're all caught up!</p>
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-100">
                                            {notifications.map((notif) => (
                                                <li
                                                    key={notif.id}
                                                    className="px-4 py-3 hover:bg-green-50 cursor-pointer transition flex flex-col"
                                                >
                                                    <p className="font-medium text-gray-800 flex items-center gap-2">
                                                        {/* Removed notif.icon here */}
                                                        <span>
                                                            {notif.title}
                                                        </span>
                                                        <span className="text-xs text-gray-400 ml-auto flex items-center gap-2">
                                                            {formatTimeAgo(
                                                                notif.createdAt
                                                            )}
                                                            <button
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation(); // Prevent dropdown from closing
                                                                    handleClearOneNotification(
                                                                        notif.id
                                                                    );
                                                                }}
                                                                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                                                aria-label={`Clear ${notif.title} notification`}
                                                            >
                                                                &times;{" "}
                                                                {/* HTML entity for 'x' */}
                                                            </button>
                                                        </span>
                                                    </p>
                                                    <div className="text-gray-600 text-sm mt-1">
                                                        {notif.description}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {notifications.length > 0 && (
                                        <div className="p-2 border-t border-gray-100 bg-gray-50">
                                            <button
                                                onClick={
                                                    handleClearAllNotifications
                                                }
                                                className="w-full text-center text-sm text-green-600 hover:text-green-800 font-semibold py-1 rounded transition-colors duration-200"
                                            >
                                                Clear All Notifications
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    <button
                        className="text-2xl p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
