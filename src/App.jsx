import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/context/theme-context";
import { AuthProvider } from "@/context/auth-context";

import Layout from "./routes/layout";
import ProtectedRoute from "./components/protected-route";

import DashboardPage from "./routes/dashboard/page";
import Login from "./auth/login";
import Verify from "./auth/verification"; // 2FA
import ForgotPassword from "./auth/forgotpass";

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
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/",
                    element: <Layout />,
                    children: [
                        { index: true, element: <DashboardPage /> },
                        { path: "cases", element: <h1>Cases</h1> },
                        { path: "documents", element: <h1>Documents</h1> },
                        { path: "clients", element: <h1>Clients</h1> },
                        { path: "tasks", element: <h1>Tasks</h1> },
                        { path: "users", element: <h1>Users</h1> },
                        { path: "user-logs", element: <h1>User Logs</h1> },
                        { path: "case-archive", element: <h1>Archived Cases</h1> },
                        { path: "admins", element: <h1>Administrators</h1> },
                        { path: "reports", element: <h1>Reports</h1> },
                        { path: "settings", element: <h1>Settings</h1> },
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
