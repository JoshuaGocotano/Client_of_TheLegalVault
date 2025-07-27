import { ChartColumn, Folders, Home, ListTodo, Users, Logs, Archive, ShieldUser, FileText } from "lucide-react";

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
        name: "Criminal",
        total: 150,
    },
    {
        name: "Civil",
        total: 700,
    },
    {
        name: "Special Proceedings",
        total: 100,
    },
    {
        name: "Constitutional",
        total: 200,
    },
    {
        name: "Jurisdictional",
        total: 20,
    },
    {
        name: "Special Courts",
        total: 20,
    },
];
