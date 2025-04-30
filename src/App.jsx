import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/context/theme-context";
import Layout from "./routes/layout";
import DashboardPage from "./routes/dashboard/page";

export default function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <DashboardPage />,
                },
                {
                    path: "analytics",
                    element: <h1 className="title">Analytics</h1>,
                },
                {
                    path: "reports",
                    element: <h1 className="title">Reports</h1>,
                },
                {
                    path: "internal-clients",
                    element: <h1 className="title">Internal Clients</h1>,
                },
                {
                    path: "external-clients",
                    element: <h1 className="title">External Clients</h1>,
                },
                {
                    path: "tickets",
                    element: <h1 className="title">Tickets</h1>,
                },
                {
                    path: "corrective-maintenance",
                    element: <h1 className="title">Corrective Maintenance Forms</h1>,
                },
                {
                    path: "admins",
                    element: <h1 className="title">Administrators</h1>,
                },
                {
                    path: "settings",
                    element: <h1 className="title">Settings</h1>,
                },
            ],
        },
    ]);
    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}
