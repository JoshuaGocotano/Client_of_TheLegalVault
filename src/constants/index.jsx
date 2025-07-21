import { ChartColumn, Folders, Home, ListTodo, Users, Logs, Archive, ShieldUser, FileText } from "lucide-react";

import profile1 from "@/assets/JoshuaG..jpg";
import profile2 from "../../../uploads/joshua.png";
import profile3 from "../../../uploads/angelie.png";
import profile4 from "../../../uploads/user_profile-1752223125848-455598027.jpg";

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

export const userRecentActivity = [
    {
        id: 1,
        user: {
            name: "Joshua Garcia",
            image: profile1,
        },
        user_log_description: "Logged in from a new device",
        user_log_datetime: "2025-07-21T08:45:00Z",
        user_log_type: "login",
    },
    {
        id: 2,
        user: {
            name: "Joshua Gocotano",
            image: profile2,
        },
        user_log_description: "Updated profile information",
        user_log_datetime: "2025-07-20T14:22:00Z",
        user_log_type: "profile update",
    },
    {
        id: 3,
        user: {
            name: "Angelie Panganiban",
            image: profile3,
        },
        user_log_description: "Reset password",
        user_log_datetime: "2025-07-19T19:10:00Z",
        user_log_type: "password reset",
    },
    {
        id: 4,
        user: {
            name: "Ivo Ajeas Gecole",
            image: profile4,
        },
        user_log_description: "Logged out successfully",
        user_log_datetime: "2025-07-18T23:55:00Z",
        user_log_type: "logout",
    },
];
