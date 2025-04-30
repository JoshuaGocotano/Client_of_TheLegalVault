import { forwardRef } from "react";

import opascorlogo from "@/assets/opascorlogo.png";
import opascorlogo2 from "@/assets/opascorlogo2.png";

import { cn } from "@/utils/cn";

import PropTypes from "prop-types";

export const Sidebar = forwardRef(({}, ref) => {
    return (
        <aside
            ref={ref}
            className={cn(
                "[transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cub ic-bezier(0.4,_0,_0.2,_1)] fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900",
            )}
        >
            <div className="flex gap-x-3 p-3">
                <img
                    src={opascorlogo2}
                    alt="opascor_logo_light"
                    className="h-12 w-12 dark:hidden"
                />
                <img
                    src={opascorlogo}
                    alt="opascor_logo_dark"
                    className="hidden h-12 w-12 dark:block"
                />
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";
