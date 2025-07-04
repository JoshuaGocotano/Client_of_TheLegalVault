import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/context/auth-context";
import { useClickOutside } from "@/hooks/use-click-outside";

import { ChevronsLeft, Search, Sun, Moon, Bell } from "lucide-react";
import profileImage from "@/assets/JoshuaG..jpg";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useClickOutside([dropdownRef], () => {
        setOpen(false);
    });

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            logout();
            navigate("/login");
        }
    };

    const handleProfile = () => {
        window.confirm("Profile info in modal should appear...");
    };

    return (
        <header className="relative z-10 ml-4 flex h-[60px] items-center justify-between rounded-lg bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>
                <div className="input">
                    <Search
                        size={20}
                        className="text-slate-500"
                    />
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search..."
                        className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-500 dark:text-slate-50"
                    />
                </div>
            </div>

            <div className="relative flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => {
                        setTheme(theme === "dark" ? "light" : "dark");
                    }}
                >
                    <Sun
                        size={20}
                        className="dark:hidden"
                    />
                    <Moon
                        size={20}
                        className="hidden dark:block"
                    />
                </button>
                <button className="btn-ghost size-10">
                    <Bell size={20} />
                </button>

                {/* Profile Image Dropdown */}
                <div
                    className="relative"
                    ref={dropdownRef}
                >
                    <button
                        className="size-10 overflow-hidden rounded-full"
                        onClick={() => setOpen(!open)}
                    >
                        <img
                            src={profileImage}
                            alt="profile image"
                            className="size-full object-cover"
                        />
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white p-2 shadow-lg dark:bg-slate-800">
                            <div className="max-w-full truncate px-2 py-1 text-sm text-gray-500 dark:text-gray-300">{user?.email}</div>
                            <button
                                onClick={handleProfile}
                                className="w-full rounded px-2 py-1 text-left text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full rounded px-2 py-1 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
