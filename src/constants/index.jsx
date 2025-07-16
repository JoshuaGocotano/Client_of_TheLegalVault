import { ChartColumn, Folders, Home, ListTodo, Users, Logs, Archive, ShieldUser, FileText } from "lucide-react";

import ProfileImage from "@/assets/JoshuaG..jpg";

export const navbarLinks = [
    {
        label: "Home",
        icon: Home,
        path: "/",
    },
    {
        label: "Cases",
        icon: Folders,
        path: "/cases",
    },
    {
        label: "Documents",
        icon: FileText,
        path: "/documents",
    },
    {
        label: "Clients",
        icon: Users,
        path: "/clients",
    },
    {
        label: "Tasks",
        icon: ListTodo,
        path: "/tasks",
    },
    {
        label: "Users",
        icon: ShieldUser,
        path: "/users",
    },
    {
        label: "Reports",
        icon: ChartColumn,
        path: "/reports",
    },
    {
        label: "User Logs",
        icon: Logs,
        path: "/user-logs",
    },
    {
        label: "Case Archive",
        icon: Archive,
        path: "/case-archive",
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

export const recentSalesData = [
    {
        id: 1,
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        image: ProfileImage,
        total: 1500,
    },
    {
        id: 2,
        name: "James Smith",
        email: "james.smith@email.com",
        image: ProfileImage,
        total: 2000,
    },
    {
        id: 3,
        name: "Sophia Brown",
        email: "sophia.brown@email.com",
        image: ProfileImage,
        total: 4000,
    },
    {
        id: 4,
        name: "Noah Wilson",
        email: "noah.wilson@email.com",
        image: ProfileImage,
        total: 3000,
    },
];
