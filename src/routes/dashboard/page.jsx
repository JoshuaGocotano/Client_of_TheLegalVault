import React, { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { FileMinus, Users, ShieldUser, Archive, FolderOpen, UserRoundMinus, ListTodo } from "lucide-react";
import defaultAvatar from "@/assets/default-avatar.png";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/context/auth-context";

const DashboardPage = () => {
    const { theme } = useTheme();
    const { user } = useAuth();

    // --- State Management ---
    const [userLogs, setUserLogs] = useState([]);
    const [counts, setCounts] = useState({
        users: 0,
        clients: 0,
        processingCases: 0,
        archivedCases: 0,
        docsForApproval: 0,
        processingDocs: 0,
        pendingTasks: 0,
    });

    // --- Fetch Utilities ---
    const fetchData = async (url, setter, fallback = 0) => {
        try {
            const res = await fetch(url, {
                method: "GET",
                credentials: "include",
            });
            if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
            const data = await res.json();
            setter(data.count ?? fallback);
        } catch (err) {
            console.error(`Error fetching ${url}:`, err);
            setter(fallback);
        }
    };

    // --- Fetch User Count (Admins only) ---
    useEffect(() => {
        if (user?.user_role === "Admin") {
            fetchData("http://localhost:3000/api/users/count", (v) => setCounts((p) => ({ ...p, users: v })));
        }
    }, [user]);

    // --- Fetch Client Count ---
    useEffect(() => {
        if (user) {
            fetchData("http://localhost:3000/api/clients/count", (v) => setCounts((p) => ({ ...p, clients: v })));
        }
    }, [user]);

    // --- Fetch Processing Cases Count (role-based) ---
    useEffect(() => {
        if (!user) return;
        const endpoint =
            user.user_role === "Admin" || user.user_role === "Staff"
                ? "http://localhost:3000/api/cases/count/processing"
                : `http://localhost:3000/api/cases/count/processing/user/${user.user_id}`;

        fetchData(endpoint, (v) => setCounts((p) => ({ ...p, processingCases: v })));
    }, [user]);

    // --- Fetch Archived Cases Count ---
    useEffect(() => {
        if (!user) return;
        const endpoint =
            user.user_role === "Admin" || user.user_role === "Staff"
                ? "http://localhost:3000/api/cases/count/archived"
                : `http://localhost:3000/api/cases/count/archived/user/${user.user_id}`;

        fetchData(endpoint, (v) => setCounts((p) => ({ ...p, archivedCases: v })));
    }, [user]);

    // --- Fetch All Document-Related Counts ---
    useEffect(() => {
        if (!user) return;

        const pendingTaskUrl =
            user.user_role === "Admin"
                ? "http://localhost:3000/api/documents/count/pending-tasks"
                : `http://localhost:3000/api/documents/count/pending-tasks/${user.user_id}`;

        const processingDocumentsUrl =
            user.user_role === "Lawyer"
                ? "http://localhost:3000/api/documents/count/processing/lawyer"
                : "http://localhost:3000/api/documents/count/processing";

        const endpoints = [
            {
                url: "http://localhost:3000/api/documents/count/for-approval",
                key: "docsForApproval",
            },
            {
                url: processingDocumentsUrl,
                key: "processingDocs",
            },
            {
                url: pendingTaskUrl,
                key: "pendingTasks",
            },
        ];

        Promise.all(endpoints.map(({ url, key }) => fetchData(url, (v) => setCounts((p) => ({ ...p, [key]: v })))));
    }, [user]);

    // --- Fetch User Logs ---
    useEffect(() => {
        const fetchUserLogs = async () => {
            try {
                const endpoint =
                    user?.user_role === "Admin" ? "http://localhost:3000/api/user-logs" : `http://localhost:3000/api/user-logs/${user.user_id}`;

                const res = await fetch(endpoint, { credentials: "include" });
                if (!res.ok) throw new Error("Failed to fetch user logs");

                const data = await res.json();
                setUserLogs(data);
            } catch (err) {
                console.error("Failed to fetch user logs:", err);
            }
        };

        if (user) fetchUserLogs();
    }, [user]);

    // --- UI Section ---
    const Card = ({ title, value, icon }) => (
        <div className="card">
            <div className="card-header">
                <p className="card-title">{title}</p>
                <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 dark:bg-blue-600/20 dark:text-blue-600">{icon}</div>
            </div>
            <div className="card-body bg-slate-100 dark:bg-slate-950">
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
            </div>
        </div>
    );

    const [overViewData, setOverviewData] = useState([]);

    // --- Fetch Case Counts by Category ---
    useEffect(() => {
        const fetchCaseCountsByCategory = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/reports/case-counts-by-category", {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch case counts by category");
                const data = await res.json();

                // transform the data into chart-friendly format
                const formatted = [
                    { name: "Civil", total: data.civil || 0 },
                    { name: "Criminal", total: data.criminal || 0 },
                    { name: "Special Proceedings", total: data.special_proceedings || 0 },
                    { name: "Constitutional", total: data.constitutional || 0 },
                    { name: "Jurisdictional", total: data.jurisdictional || 0 },
                    { name: "Special Courts", total: data.special_courts || 0 },
                ];

                setOverviewData(formatted);
            } catch (err) {
                console.error("Error fetching case counts by category:", err);
            }
        };
        fetchCaseCountsByCategory();
    }, []);

    return (
        <div className="flex flex-col gap-y-3">
            <h1 className="title">Dashboard</h1>
            <p className="dark:text-slate-300">Welcome back {user?.user_fname}! Here's your overview.</p>

            {/* === First Row === */}
            <div
                className={`grid grid-cols-1 gap-4 ${user.user_role === "Admin" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-3"}`}
            >
                {user.user_role === "Admin" && (
                    <Card
                        title="Users"
                        value={counts.users}
                        icon={<ShieldUser size={26} />}
                    />
                )}
                <Card
                    title="Archived Cases"
                    value={counts.archivedCases}
                    icon={<Archive size={26} />}
                />
                <Card
                    title="Processing Cases"
                    value={counts.processingCases}
                    icon={<FolderOpen size={26} />}
                />
                <Card
                    title="Processing Documents"
                    value={counts.processingDocs}
                    icon={<FileMinus size={26} />}
                />
            </div>

            {/* === Second Row === */}
            <div className={`grid grid-cols-1 gap-4 ${user.user_role === "Admin" ? "md:grid-cols-2 lg:grid-cols-3" : "lg:grid-cols-3"}`}>
                <Card
                    title="Clients"
                    value={counts.clients}
                    icon={<Users size={26} />}
                />
                <Card
                    title="Pending Approvals"
                    value={counts.docsForApproval}
                    icon={<UserRoundMinus size={26} />}
                />
                <Card
                    title="Pending Tasks"
                    value={counts.pendingTasks}
                    icon={<ListTodo size={26} />}
                />
            </div>

            {/* === Charts and Activity === */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Chart */}
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    <div className="card-header">
                        <p className="card-title">Overview of Cases in BOS' Law Firm</p>
                    </div>
                    <div className="card-body p-0">
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <AreaChart
                                data={overViewData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorTotal"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#2563eb"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#2563eb"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <XAxis
                                    dataKey="name"
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tick={{ fontSize: 12 }}
                                    angle={-30}
                                    textAnchor="end"
                                    interval={0}
                                    height={60}
                                />
                                <YAxis
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickMargin={6}
                                />
                                <Tooltip
                                    cursor={{ stroke: "#2563eb", strokeWidth: 0 }}
                                    formatter={(value) => `${value}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#2563eb"
                                    strokeWidth={1}
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card col-span-1 md:col-span-2 lg:col-span-3">
                    <div className="card-header">
                        <p className="card-title">Recent Activity</p>
                    </div>
                    <div className="card-body h-[300px] overflow-auto p-0">
                        {userLogs.length > 0 ? (
                            userLogs.slice(0, 4).map((log) => (
                                <div
                                    key={log.user_log_id}
                                    className="flex items-center justify-between gap-x-4 rounded-lg py-2 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <div className="flex items-center gap-x-4">
                                        <img
                                            src={log.user_profile ? `http://localhost:3000${log.user_profile}` : defaultAvatar}
                                            alt={log.user_fullname || "User"}
                                            className="ml-2 size-10 rounded-full object-cover"
                                        />
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                                                {log.user_fullname || "Unknown User"}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{log.user_log_action}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                                            {new Date(log.user_log_time).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {new Date(log.user_log_time).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-slate-500 dark:text-slate-400">No recent activity found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
