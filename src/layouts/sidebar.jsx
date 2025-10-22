import { forwardRef, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import { getNavbarLinks } from "../constants";
import light_logo2 from "@/assets/light_logo2.png";
import light_logo from "@/assets/light_logo.png";
import { cn } from "@/utils/cn";

import { useAuth } from "@/context/auth-context";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const { user } = useAuth();
    const navbarLinks = getNavbarLinks(user?.user_role);

    const [pendingCount, setPendingCount] = useState(0);

    // 🔴 Fetch pending task count
    useEffect(() => {
        if (!user) return;

        const fetchPendingCount = async () => {
            try {
                const url =
                    user.user_role === "Admin"
                        ? "http://localhost:3000/api/documents/count/pending-tasks"
                        : `http://localhost:3000/api/documents/count/pending-tasks/${user.user_id}`;

                const res = await fetch(url, { credentials: "include" });
                const data = await res.json();

                // The API should return { count: number }
                setPendingCount(data.count || 0);
            } catch (error) {
                console.error("Error fetching pending tasks count:", error);
            }
        };

        fetchPendingCount();

        // Optional: Auto-refresh every 1 minute
        const interval = setInterval(fetchPendingCount, 60000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <aside
            ref={ref}
            className={cn(
                "z-999 fixed flex h-full w-[240px] flex-col overflow-x-hidden rounded-lg border-slate-300 bg-white shadow-md [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:left-full" : "max-md:left-0",
            )}
        >
            {/* Logo Section */}
            <div className="flex items-center gap-x-3 p-3 opacity-60">
                <img
                    src={light_logo2}
                    alt="opascor_logo_light"
                    className="h-23 w-20 dark:hidden"
                />
                <img
                    src={light_logo}
                    alt="opascor_logo_dark"
                    className="h-23 hidden w-20 brightness-150 dark:block"
                />
                {!collapsed && <p className="font-serif text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">Legal Vault</p>}
            </div>

            {/* Navigation Links */}
            <div className="flex w-full flex-col gap-y-3 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
                {navbarLinks.map((link) => {
                    const isTaskLink = link.label === "Tasks";

                    return (
                        <NavLink
                            key={link.label}
                            to={link.path}
                            className={cn("sidebar-item relative", collapsed && "md:w-[45px]")}
                        >
                            {/* Icon */}
                            <div className="relative">
                                <link.icon
                                    size={22}
                                    className="flex-shrink-0"
                                />

                                {isTaskLink && pendingCount && collapsed > 0 && (
                                    <span
                                        className={cn("absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500", collapsed ? "md:left-4" : "")}
                                    ></span>
                                )}
                            </div>

                            {/* Label */}
                            {!collapsed && (
                                <p className="whitespace-nowrap items-center">
                                    {link.label}
                                    {isTaskLink && pendingCount > 0 && (
                                        <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                                            {pendingCount}
                                        </span>
                                    )}
                                </p>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};
