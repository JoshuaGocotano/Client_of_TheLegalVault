import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useTheme } from "@/hooks/use-theme";

import { overviewData } from "@/constants";

import { BookCheck, Tickets, TrendingDown, TrendingUp, Users } from "lucide-react";

const DashboardPage = () => {
    const { theme, setTheme } = useTheme();

    return (
        <>
            <div className="flex flex-col gap-y-4">
                <h1 className="title">Dashboard</h1>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Total Tickets Resolved */}
                    <div className="card">
                        <div className="card-header">
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <Tickets size={26} />
                            </div>
                            <p className="card-title">Total Tickets</p>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">532</p>
                            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                <TrendingUp size={18} />
                                20%
                            </span>
                        </div>
                    </div>

                    {/* Total Corrective Maintenance Forms */}
                    <div className="card">
                        <div className="card-header">
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <BookCheck size={26} />
                            </div>
                            <p className="card-title">Total CMFs</p>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">407</p>
                            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                <TrendingUp size={18} />
                                5%
                            </span>
                        </div>
                    </div>

                    {/* Pending Tickets */}
                    <div className="card">
                        <div className="card-header">
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <BookCheck size={26} />
                            </div>
                            <p className="card-title">Pending Tickets</p>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">5</p>
                            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                <TrendingUp size={18} />
                                5%
                            </span>
                        </div>
                    </div>

                    {/* Total Clients */}
                    <div className="card">
                        <div className="card-header">
                            <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                <Users size={26} />
                            </div>
                            <p className="card-title">Total Clients</p>
                        </div>
                        <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">91</p>
                            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                                <TrendingUp size={18} />
                                2%
                            </span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                        <div className="card-header">
                            <p className="card-title">Overview</p>
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
                                        formatter={(value) => `$${value}`}
                                        active={true}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        strokeWidth={0}
                                        stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    />
                                    <YAxis
                                        dataKey="total"
                                        strokeWidth={0}
                                        stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                        tickFormatter={(value) => `$${value}`}
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

                    <div className="card col-span-1 md:col-span-2 lg:col-span-3"></div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
