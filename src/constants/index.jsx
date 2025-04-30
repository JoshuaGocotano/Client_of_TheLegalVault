import { ChartColumn, Home, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users } from "lucide-react";

export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Home",
                icon: Home,
                path: "/",
            },
            {
                label: "Analytics",
                icon: ChartColumn,
                path: "/analytics",
            },
            {
                label: "Reports",
                icon: NotepadText,
                path: "/reports",
            },
        ],
    },
    {
        title: "Clients",
        links: [
            {
                label: "Internal Clients",
                icon: Users,
                path: "/internal-clients",
            },
            {
                label: "External Clients",
                icon: UserPlus,
                path: "/external-clients",
            },
        ],
    },
    {
        title: "Tickets",
        links: [
            {
                label: "Tickets",
                icon: Package,
                path: "/Tickets",
            },
            {
                label: "New Tickets",
                icon: PackagePlus,
                path: "/new-ticket",
            },
        ],
    },
    {
        title: "Admins",
        links: [
            {
                label: "Admins",
                icon: Settings,
                path: "/admins",
            },
        ],
    },
    {
        title: "Settings",
        links: [
            {
                label: "Settings",
                icon: Settings,
                path: "/settings",
            },
        ],
    },
];
