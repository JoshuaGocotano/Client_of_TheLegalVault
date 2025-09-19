import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // number of notifications per page

    const totalPages = Math.ceil(notifications.length / pageSize);

    // Helper to show "x minutes/hours/days ago"
    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return interval === 1 ? "1 year ago" : `${interval} years ago`;

        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval === 1 ? "1 month ago" : `${interval} months ago`;

        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval === 1 ? "1 day ago" : `${interval} days ago`;

        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval === 1 ? "1 hour ago" : `${interval} hours ago`;

        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;

        return "Just now";
    };

    // Fetch notifications when component mounts
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/notifications", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await res.json();

                if (res.ok) {
                    setNotifications(data);
                } else {
                    console.error("Failed to fetch notifications:", data.error);
                }
            } catch (err) {
                console.error("Error fetching notifications:", err);
            }
        };

        fetchNotifications();
    }, []);

    // Mark all as read (frontend-only for now)
    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((note) => ({ ...note, is_read: true })));
    };

    // Clear all (frontend-only for now)
    const clearAll = () => {
        setNotifications([]);
    };

    // Paginated notifications
    const startIdx = (currentPage - 1) * pageSize;
    const paginatedNotifications = notifications.slice(startIdx, startIdx + pageSize);

    return (
        <div>
            <div className="bg-blue rounded-xl p-4 shadow-sm dark:bg-slate-900 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">Notifications</h1>
                        <p className="text-sm text-gray-500">Manage how you receive notifications and updates</p>
                    </div>
                    <button
                        onClick={() => navigate("/notifications/notif-settings")}
                        className="text-blue-700 hover:text-blue-900"
                    >
                        <Settings size={24} />
                    </button>
                </div>

                {/* Action buttons */}
                <div className="mb-4 flex justify-end gap-2">
                    <button
                        onClick={markAllAsRead}
                        className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                    >
                        Mark all as read
                    </button>
                    <button
                        onClick={clearAll}
                        className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-800 hover:bg-gray-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                    >
                        Clear All
                    </button>
                </div>

                {/* Notifications list */}
                {paginatedNotifications.length > 0 ? (
                    paginatedNotifications.map((note) => (
                        <div
                            key={note.notification_id}
                            className={`mb-3 flex w-full items-start gap-3 rounded-xl border p-4 ${
                                note.is_read ? "bg-gray-100 dark:bg-slate-700" : "bg-white dark:bg-slate-800"
                            } border-gray-200 dark:border-slate-700`}
                        >
                            <input
                                type="checkbox"
                                unChecked={note.is_read}
                                className="mt-1"
                            />
                            <div>
                                <p
                                    className={`text-sm ${
                                        note.is_read ? "font-normal text-gray-600 dark:text-slate-300" : "font-bold text-gray-800 dark:text-white"
                                    }`}
                                >
                                    {note.notification_message}
                                </p>
                                <span className="text-xs text-gray-400">
                                    {timeAgo(note.date_created)} ({new Date(note.date_created).toLocaleString()})
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 dark:text-slate-400">No notifications found</p>
                )}

                {/* Footer with pagination */}
                <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400 sm:flex-row">
                    <span>
                        Showing {paginatedNotifications.length} of {notifications.length} notifications
                    </span>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-2 flex items-center justify-end gap-3 p-2 sm:mt-0">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className={`rounded border px-3 py-1 ${
                                    currentPage === 1
                                        ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                        : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                }`}
                            >
                                &lt;
                            </button>

                            <span className="text-sm text-gray-700 dark:text-white">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`rounded border px-3 py-1 ${
                                    currentPage === totalPages
                                        ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                        : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                                }`}
                            >
                                &gt;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
