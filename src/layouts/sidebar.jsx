import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import { navbarLinks } from "../constants";
import light_logo2 from "@/assets/light_logo2.png";
import light_logo from "@/assets/light_logo.png";
import { cn } from "@/utils/cn";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-30 flex h-full w-[240px] flex-col overflow-x-hidden rounded-lg border-slate-300 bg-white shadow-md [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
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
                {navbarLinks.map((link) => (
                    <NavLink
                        key={link.label}
                        to={link.path}
                        className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                    >
                        <link.icon
                            size={22}
                            className="flex-shrink-0"
                        />
                        {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                    </NavLink>
                ))}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};
