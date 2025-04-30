import { ChartColumn, Home, NotepadText, Tickets, BookCheck, Settings, ShoppingBag, UserCheck, UserPlus, Users } from "lucide-react";

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
                label: "Internal",
                icon: Users,
                path: "/internal-clients",
            },
            {
                label: "External",
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
                icon: Tickets,
                path: "/Tickets",
            },
            {
                label: "CMFs",
                icon: BookCheck,
                path: "/corrective-maintenance",
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
