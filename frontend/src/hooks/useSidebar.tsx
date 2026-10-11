import { useState, type ReactNode } from "react";
import { FaSignOutAlt } from "react-icons/fa";

interface Link {
    name: string;
    icon: ReactNode;
    onClick?: () => void;
}
interface Category {
    name: string;
    icon: ReactNode;
    links: Link[];
}

interface User {
    email: string;
    name: string;
    icon: ReactNode;
}

interface SideBarProps {
    //side bar props
    icon: ReactNode;
    title: string;
    categories: Category[];
    user: User;
    logout: boolean;
    onLogout?: () => void;

    //navbar props
    page: string;
    pageIcon: ReactNode;

    //content
    children: ReactNode;
}

export function useSidebar() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeLink, setActiveLink] = useState<string | null>(null);
    const [collapsed, setCollapsed] = useState(false);

    const toggleCategory = (categoryName: string) => {
        setActiveCategory((prev) =>
            prev === categoryName ? null : categoryName
        );
    };

    const selectLink = (linkName: string) => {
        setActiveLink(linkName);
    };

    const toggleCollapse = () => setCollapsed((prev) => !prev);

    return {
        activeCategory,
        activeLink,
        collapsed,
        toggleCategory,
        selectLink,
        toggleCollapse,
    };
}

export const Sidebar = ({
    icon,
    title,
    categories,
    user,
    logout,
    onLogout,
}: SideBarProps) => {
    const { activeCategory, activeLink, toggleCategory, selectLink } =
        useSidebar();

    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 p-4 text-green-700 text-xl font-bold">
                    {icon}
                    <span>{title}</span>
                </div>
                {categories.map((cat) => (
                    <div key={cat.name} className="mb-2">
                        <button
                            className="flex items-center justify-between w-full px-4 py-2 font-semibold text-left text-green-700 hover:bg-green-50 transition"
                            onClick={() => toggleCategory(cat.name)}
                        >
                            <div className="flex items-center gap-2">
                                {cat.icon}
                                {cat.name}
                            </div>
                        </button>
                        {activeCategory === cat.name && (
                            <div className="ml-4">
                                {cat.links.map((link) => (
                                    <button
                                        key={link.name}
                                        onClick={() => {
                                            selectLink(link.name);
                                            link.onClick?.();
                                        }}
                                        className={`w-full text-left px-3 py-1 rounded-md font-medium ${
                                            activeLink === link.name
                                                ? "bg-green-100 text-green-900"
                                                : "text-green-700 hover:bg-green-50"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {link.icon}
                                            {link.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {logout && (
                <div className="border-t p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-700">
                        {user.icon}
                        <div>
                            <div className="text-sm font-semibold">
                                {user.name}
                            </div>
                            <div className="text-xs">{user.email}</div>
                        </div>
                    </div>
                    <button
                        className="text-red-600 hover:text-red-800 transition"
                        onClick={onLogout}
                    >
                        <FaSignOutAlt />
                    </button>
                </div>
            )}
        </aside>
    );
};
