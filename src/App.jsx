import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/context/theme-context";
import { AuthProvider } from "@/context/auth-context";

import Layout from "./routes/layout";
import ProtectedRoute from "./components/protected-route";

import DashboardPage from "./routes/dashboard/page";
import Login from "./auth/login";
import Verify from "./auth/verification"; // 2FA
import ForgotPassword from "./auth/forgotpass";
import Registration from "./components/registration";
import Users from "./routes/users";

export default function App() {
    const router = createBrowserRouter([
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/verify",
            element: <Verify />,
        },
        {
            path: "/forgot-password",
            element: <ForgotPassword />,
        },
        {
            path: "/register",
            element: <Registration />,
        },
        {
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/",
                    element: <Layout />,
                    children: [
                        { index: true, element: <DashboardPage /> },
                        { path: "cases", element: <h1 className="title">Cases</h1> },
                        { path: "documents", element: <h1 className="title">Documents</h1> },
                        { path: "clients", element: <h1 className="title">Clients</h1> },
                        { path: "tasks", element: <h1 className="title">Tasks</h1> },
                        { path: "users", element: <Users /> },
                        { path: "reports", element: <h1 className="title">Reports</h1> },
                        { path: "user-logs", element: <h1 className="title">User Logs</h1> },
                        { path: "case-archive", element: <h1 className="title">Archived Cases</h1> },
                    ],
                },
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ThemeProvider>
    );
}
