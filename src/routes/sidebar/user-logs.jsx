import React, { useEffect, useState } from "react";
import defaultAvatar from "../../assets/default-avatar.png";
import { FileText, Archive, User, Scale, LogIn, LogOut, AlertTriangle, Activity } from "lucide-react";

const Userlogs = () => {
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const [visibleCount, setVisibleCount] = useState(5);

    useEffect(() => {
        const fetchUserLogs = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/user-logs", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch user logs");

                const data = await res.json();
                setTableData(data);
            } catch (error) {
                console.error("Failed to fetch logs", error);
                setError(error);
            }
        };

        fetchUserLogs();
    }, []);

    const getLogIcon = (log) => {
        const type = log.user_log_type?.toLowerCase();
        const action = log.user_log_action?.toLowerCase();

        if (type === "user log") return <User className="h-5 w-5" />;
        if (type === "document log") return <FileText className="h-5 w-5" />;
        if (type === "case log") return <Scale className="h-5 w-5" />;
        if (type === "archive log") return <Archive className="h-5 w-5" />;

        if (/login/.test(action)) return <LogIn className="h-5 w-5" />;
        if (/logout/.test(action)) return <LogOut className="h-5 w-5" />;
        if (/fail|error/.test(action)) return <AlertTriangle className="h-5 w-5 text-red-500" />;

        return <Activity className="h-5 w-5" />;
    };

    const getTagColor = (action) => {
        if (/login/i.test(action)) return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
        if (/logout/i.test(action)) return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
        if (/fail|error/i.test(action)) return "bg-red-100 text-red-700";
        return "bg-green-100 text-green-700";
    };

    const getLogTag = (action) => {
        if (/login/i.test(action)) return "Login";
        if (/logout/i.test(action)) return "Logout";
        if (/fail|error/i.test(action)) return "Error";
        return "Action";
    };

    // Filtered directly in render
    const filteredLogs = tableData.filter((log) => {
        const matchSearch =
            log.user_fullname?.toLowerCase().includes(search.toLowerCase()) ||
            log.user_log_type?.toLowerCase().includes(search.toLowerCase()) ||
            log.user_log_action?.toLowerCase().includes(search.toLowerCase());

        const matchDate = !selectedDate || log.user_log_time?.startsWith(selectedDate);

        return matchSearch && matchDate;
    });

    return (
        <div className="min-h-screen">
            {error && (
                <div className="alert alert-error mx-10 mb-5 mt-5 shadow-lg">
                    <div>
                        <span>{error.message}</span>
                    </div>
                </div>
            )}

            <div className="mb-6 flex flex-col gap-y-1">
                <h2 className="title">Logs</h2>
                <p className="text-sm dark:text-slate-300">Track and monitor user activities across the platform.</p>
            </div>

            {/* Filter Section */}
            <div className="mb-8 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-slate-900">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input flex-grow bg-transparent text-slate-900 outline-0 placeholder:text-slate-500 focus:border-blue-600 dark:text-slate-50"
                />

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input w-[150px] bg-transparent px-2 py-1 text-sm text-slate-900 outline-0 placeholder:text-slate-500 focus:border-blue-600 dark:text-slate-50"
                />
            </div>

            {/* Logs Section */}
            {filteredLogs.length > 0 ? (
                <div className="space-y-4">
                    {filteredLogs.slice(0, visibleCount).map((log, index) => {
                        const fullName = `${log.user_fullname ? log.user_fullname : "Unknown User"}`;
                        const avatar = log.user_profile ? `http://localhost:3000${log.user_profile}` : defaultAvatar;
                        const icon = getLogIcon(log);
                        const tag = getLogTag(log.user_log_action);
                        const tagColor = getTagColor(log.user_log_action);
                        const formattedTime = new Date(log.user_log_time).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        });

                        return (
                            <div
                                key={index}
                                className="flex items-start rounded-lg bg-white p-4 text-black shadow-sm hover:shadow-md dark:bg-slate-800 dark:text-white"
                            >
                                {/* Avatar */}
                                <img
                                    src={avatar}
                                    alt={fullName}
                                    className="mr-4 h-12 w-12 rounded-full border"
                                />

                                {/* Details */}
                                <div className="flex-1">
                                    <div className="mb-1 flex items-center gap-3">
                                        <span className="font-semibold">{fullName}</span>
                                        <span className={`rounded px-2 py-1 text-xs font-medium ${tagColor}`}>{tag}</span>
                                    </div>
                                    <div className="text-dark-700 mb-1 flex items-center gap-2 text-sm">
                                        {icon}
                                        {log.user_log_type || "Unknown Type"}
                                    </div>
                                </div>

                                {/* Timestamp */}
                                <div className="ml-auto whitespace-nowrap text-sm">{formattedTime}</div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-gray-300">No logs available.</p>
            )}

            {visibleCount < filteredLogs.length && (
                <div className="mt-6 text-center">
                    <button
                        className="text-gray-800 underline hover:text-blue-300 dark:text-white dark:hover:text-blue-400"
                        onClick={() => setVisibleCount((prev) => prev + 5)}
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default Userlogs;
