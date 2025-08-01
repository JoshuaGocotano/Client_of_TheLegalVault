import React, { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "@/hooks/use-theme";
import { overviewData } from "@/constants";
import { FileCheck, Users, ShieldUser, Archive, FolderOpen, FileMinus, UserRoundMinus, ListTodo } from "lucide-react";
import default_avatar from "@/assets/default-avatar.png";

import { useAuth } from "@/context/auth-context";

const DashboardPage = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [userLogs, setUserLogs] = useState([]);

    // fetching all user logs
    useEffect(() => {
        const fetchUserLogs = async () => {
            try {
                const endpoint =
                    user?.user_role === "Admin" ? "http://localhost:3000/api/user-logs" : `http://localhost:3000/api/user-logs/${user.user_id}`;

                const res = await fetch(endpoint, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch user logs");

                const data = await res.json();
                setUserLogs(data);
            } catch (error) {
                console.error("Failed to fetch user logs:", error);
            }
        };

        fetchUserLogs();
    }, []);

    return (
        <>
            <div className="flex flex-col gap-y-3">
                <h1 className="title">Dashboard</h1>
                <p className="dark:text-slate-300">Welcome back {user.user_fname}! Here's your overview.</p>

                {/* first row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Total Cases */}
                    <div className="card">
                        <div className="card-header">
                            <p className="card-title">Users</p>
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <ShieldUser size={26} />
                            </div>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">32</p>
                        </div>
                    </div>

                    {/* Total Archived Cases */}
                    <div className="card">
                        <div className="card-header">
                            <p className="card-title">Archived Cases</p>
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <Archive size={26} />
                            </div>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">407</p>
                        </div>
                    </div>

                    {/* Total Processing Cases */}
                    <div className="card">
                        <div className="card-header">
                            <p className="card-title">Processing Cases</p>
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <FolderOpen size={26} />
                            </div>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">5</p>
                        </div>
                    </div>

                    {/* Total Processing Documents */}
                    <div className="card">
                        <div className="card-header">
                            <p className="card-title">Processing Documents</p>
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <FileMinus size={26} />
                            </div>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">91</p>
                        </div>
                    </div>
                </div>

                {/* second row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Total Clients */}
                    <div className="card">
                        <div className="card-header">
                            <p className="card-title">Clients</p>
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <Users size={26} />
                            </div>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">21</p>
                        </div>
                    </div>

                    {/* Total Archived Documents */}
                    <div className="card">
                        <div className="card-header">
                            <p className="card-title">Archived Documents</p>
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <FileCheck size={26} />
                            </div>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">723</p>
                        </div>
                    </div>

                    {/* Total Pending Approvals */}
                    <div className="card">
                        <div className="card-header">
                            <p className="card-title">Pending Approvals</p>
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <UserRoundMinus size={26} />
                            </div>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">5</p>
                        </div>
                    </div>

                    {/* Total Pending Tasks */}
                    <div className="card">
                        <div className="card-header">
                            <p className="card-title">Pending Tasks</p>
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <ListTodo size={26} />
                            </div>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">91</p>
                        </div>
                    </div>
                </div>

                {/* charts and graphs */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                        <div className="card-header">
                            <p className="card-title">Overview of Cases</p>
                        </div>
                        <div className="card-body p-0">
                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >
                                <AreaChart
                                    data={overviewData}
                                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
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
                                    <Tooltip
                                        cursor={false}
                                        formatter={(value) => `${value}`}
                                        active={true}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        strokeWidth={0}
                                        stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                        tick={{ fontSize: 12 }}
                                        angle={-30}
                                        textAnchor="end"
                                        interval={0}
                                        height={60}
                                    />
                                    <YAxis
                                        dataKey="total"
                                        strokeWidth={0}
                                        stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                        tickFormatter={(value) => `${value}`}
                                        tickMargin={6}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#2563eb"
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

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
                                                src={log.user_profile ? `http://localhost:3000${log.user_profile}` : default_avatar}
                                                alt={`${log.user_fname || "User"}`}
                                                className="ml-2 size-10 flex-shrink-0 rounded-full object-cover"
                                            />
                                            <div className="flex flex-col gap-y-1">
                                                <p className="font-medium text-slate-900 dark:text-slate-50">
                                                    {`${log.user_fullname}` || "Unknown User"}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{log.user_log_action}</p>
                                                {/* <span>{log.user_log_type}</span> */}
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
        </>
    );
};

export default DashboardPage;
