import { ChartColumn, Folders, Home, ListTodo, Users, Logs, Archive, ShieldUser, FileText, Wallet } from "lucide-react";

const allNavbarLinks = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Cases", icon: Folders, path: "/cases" },
    { label: "Documents", icon: FileText, path: "/documents" },
    { label: "Clients", icon: Users, path: "/clients" },
    { label: "Tasks", icon: ListTodo, path: "/tasks" },
    { label: "Tasks V2", icon: ListTodo, path: "/tasking" },
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

export const COLUMNS = [
    { id: "TODO", title: "To Do" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "DONE", title: "Done" },
];

export const INITIAL_TASKS = [
    {
        id: "1",
        title: "Research Project",
        description: "Gather requirements and create initial documentation",
        status: "TODO",
        priolevel: "high",
    },
    {
        id: "2",
        title: "Design System",
        description: "Create component library and design tokens",
        status: "TODO",
        priolevel: "medium",
    },
    {
        id: "3",
        title: "API Integration",
        description: "Implement REST API endpoints",
        status: "TODO",
        priolevel: "low",
    },
    {
        id: "4",
        title: "Testing",
        description: "Write unit tests for core functionality",
        status: "TODO",
        priolevel: "medium",
    },
];
