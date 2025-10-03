import { ChartColumn, Folders, Home, ListTodo, Users, Logs, Archive, ShieldUser, FileText, Wallet } from "lucide-react";

const allNavbarLinks = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Cases", icon: Folders, path: "/cases" },
    { label: "Documents", icon: FileText, path: "/documents" },
    { label: "Clients", icon: Users, path: "/clients" },
    { label: "Tasks", icon: ListTodo, path: "/tasks" },
    { label: "Users", icon: ShieldUser, path: "/users" },
    { label: "Reports", icon: ChartColumn, path: "/reports" },
    { label: "Activity Logs", icon: Logs, path: "/user-logs" },
    { label: "Case Archive", icon: Archive, path: "/case-archive" },
    { label: "Payments", icon: Wallet, path: "/payments" },
];

// 🔧 Export a function to get filtered links based on role
export const getNavbarLinks = (role) => {
    if (role === "Admin") {
        return allNavbarLinks;
    }

    if (role === "Lawyer") {
        return allNavbarLinks.filter((link) => link.label !== "Users" && link.label !== "Reports");
    }

    if (role === "Staff") {
        return allNavbarLinks.filter((link) => ["Home", "Clients", "Tasks", "Activity Logs"].includes(link.label));
    }

    if (role === "Paralegal") {
        return allNavbarLinks.filter((link) => ["Home", "Tasks", "Activity Logs"].includes(link.label));
    }

    return [];
};

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
