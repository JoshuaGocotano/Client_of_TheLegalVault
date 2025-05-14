import { ChartColumn, Home, NotepadText, Tickets, BookCheck, Settings, UserPlus, Users, ShieldUser } from "lucide-react";

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
                icon: ShieldUser,
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

export const overviewData = [
    {
        name: "Jan",
        total: 1500,
    },
    {
        name: "Feb",
        total: 2000,
    },
    {
        name: "Mar",
        total: 1000,
    },
    {
        name: "Apr",
        total: 5000,
    },
    {
        name: "May",
        total: 2000,
    },
    {
        name: "Jun",
        total: 5900,
    },
    {
        name: "Jul",
        total: 2000,
    },
    {
        name: "Aug",
        total: 5500,
    },
    {
        name: "Sep",
        total: 2000,
    },
    {
        name: "Oct",
        total: 4000,
    },
    {
        name: "Nov",
        total: 1500,
    },
    {
        name: "Dec",
        total: 2500,
    },
];
