import React, { useEffect, useState } from "react";

const Userlogs = () => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);

    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState("All Users");
    const [selectedDate, setSelectedDate] = useState("");

    // 🔁 Fetch logs from backend
    useEffect(() => {
        const fetchUserLogs = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/user-logs", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch user logs");

                const data = await res.json();

                // Format logs for UI consistency
                const formattedLogs = data.map((log) => ({
                    icon: getLogIcon(log.user_log_action),
                    user: log.user_fullname,
                    action: log.user_log_action,
                    tag: getLogTag(log.user_log_action),
                    tagColor: getTagColor(log.user_log_action),
                    time: new Date(log.user_log_time).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    avatar: log.user_profile ? `http://localhost:3000${log.user_profile}` : "/default-avatar.png",
                }));

                setLogs(formattedLogs);
                setFilteredLogs(formattedLogs);
            } catch (error) {
                console.error("Failed to fetch user logs:", error);
            }
        };

        fetchUserLogs();
    }, []);

    // 🎯 Filter function
    const handleApplyFilters = () => {
        const filtered = logs.filter((log) => {
            const matchUser = selectedUser === "All Users" || log.user === selectedUser;
            const matchSearch = log.action.toLowerCase().includes(search.toLowerCase());
            const matchDate = !selectedDate || log.time.startsWith(formatDate(selectedDate));
            return matchUser && matchSearch && matchDate;
        });

        setFilteredLogs(filtered);
    };

    const formatDate = (input) => {
        const date = new Date(input);
        const options = { year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
    };

    // 🛠 Helpers
    const getLogIcon = (action) => {
        if (/login/i.test(action)) return "https://img.icons8.com/fluency/48/lock.png";
        if (/logout/i.test(action)) return "https://img.icons8.com/fluency/48/export.png";
        if (/fail|error/i.test(action)) return "https://img.icons8.com/fluency/48/error.png";
        return "https://img.icons8.com/fluency/48/activity-history.png";
    };

    const getLogTag = (action) => {
        if (/login|logout/i.test(action)) return "Login";
        if (/fail|error/i.test(action)) return "Error";
        return "Action";
    };

    const getTagColor = (action) => {
        if (/login|logout/i.test(action)) return "bg-blue-100 text-blue-700";
        if (/fail|error/i.test(action)) return "bg-red-100 text-red-700";
        return "bg-green-100 text-green-700";
    };

    // 🔁 Extract unique users for dropdown
    const userOptions = ["All Users", ...new Set(logs.map((log) => log.user))];

    return (
        <div className="min-h-screen">
            <div className="mb-6 flex flex-col gap-y-1">
                <h2 className="title">User Logs</h2>
                <p className="text-sm dark:text-slate-300">Track and monitor user activities across the platform.</p>
            </div>

            {/* Filter Section */}
            <div className="mb-8 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-slate-900">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="card w-full rounded border px-3 py-2 text-slate-950 dark:text-slate-50 sm:w-64"
                />
                <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="card rounded border border-gray-300 bg-white px-3 py-2 text-black dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                    {userOptions.map((user, idx) => (
                        <option key={idx}>{user}</option>
                    ))}
                </select>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="card rounded border border-gray-300 bg-white px-3 py-2 text-black dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
                <button
                    className="ml-auto rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={handleApplyFilters}
                >
                    Apply Filters
                </button>
            </div>

            {/* Logs Section */}
            {filteredLogs.length > 0 ? (
                <div className="space-y-4">
                    {filteredLogs.map((log, index) => (
                        <div
                            key={index}
                            className="flex items-start rounded-lg bg-white p-4 text-black shadow-md dark:bg-slate-800 dark:text-white"
                        >
                            {/* Avatar */}
                            <img
                                src={log.avatar}
                                alt={log.user}
                                className="mr-4 h-12 w-12 rounded-full border"
                            />

                            {/* Details */}
                            <div className="flex-1 dark:text-white">
                                <div className="mb-1 flex items-center gap-3">
                                    <span className="font-semibold">{log.user}</span>
                                </div>
                                <div className="text-dark-700 mb-1 flex items-center gap-2 text-sm">
                                    <img
                                        src={log.icon}
                                        alt="icon"
                                        className="h-5 w-5"
                                    />
                                    {log.action}
                                </div>
                                <span className={`rounded px-2 py-1 text-xs font-medium ${log.tagColor}`}>{log.tag}</span>
                            </div>

                            {/* Timestamp */}
                            <div className="ml-auto whitespace-nowrap text-sm dark:text-white">{log.time}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-300">No logs available.</p>
            )}

            <div className="mt-6 text-center">
                <button className="text-gray-800 underline hover:text-blue-300 dark:text-white">Load More</button>
            </div>
        </div>
    );
};

export default Userlogs;
