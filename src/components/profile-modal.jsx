import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Mail, Phone, BadgeCheck, UserCheck, Building2, XCircle } from "lucide-react";

export const ProfileModal = ({ user, onClose }) => {
    const [branchName, setBranchName] = useState("Loading...");
    const [loadingBranch, setLoadingBranch] = useState(true);

    useEffect(() => {
        const fetchBranchName = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/branches", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();

                if (Array.isArray(data)) {
                    const branch = data.find((b) => b.branch_id === user.branch_id);
                    setBranchName(branch?.branch_name || "Unknown");
                } else {
                    setBranchName("Unavailable");
                }
            } catch (error) {
                console.error("Failed to fetch branches:", error);
                setBranchName("Error");
            } finally {
                setLoadingBranch(false);
            }
        };

        if (user?.branch_id) {
            fetchBranchName();
        }
    }, [user]);

    if (!user) return null;

    const outlineColor =
        user.user_status === "Active"
            ? "outline-green-600"
            : user.user_status === "Pending"
              ? "outline-yellow-500"
              : user.user_status === "Suspended"
                ? "outline-red-500"
                : "outline-gray-300";

    const infoItems = [
        { label: "Email", value: user.user_email, icon: <Mail size={16} /> },
        { label: "Phone", value: user.user_phonenum, icon: <Phone size={16} /> },
        { label: "Role", value: user.user_role, icon: <BadgeCheck size={16} /> },
        { label: "Status", value: user.user_status, icon: <UserCheck size={16} /> },
        { label: "Branch", value: branchName, icon: <Building2 size={16} /> },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900">
                <button
                    className="absolute right-4 top-4 text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-500"
                    onClick={onClose}
                >
                    <XCircle size={20} />
                </button>

                <div className="flex flex-col items-center justify-center">
                    <img
                        src={`http://localhost:3000${user.user_profile}`}
                        alt="Profile"
                        className={`mb-3 h-32 w-32 rounded-full object-cover p-1 outline outline-4 ${outlineColor}`}
                    />
                    <h2 className="text-center text-lg font-bold text-gray-800 dark:text-white">
                        {`${user.user_fname} ${user.user_mname} ${user.user_lname}`}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.user_role}</p>
                </div>

                <div className="mt-6 space-y-3">
                    {infoItems.map(({ label, value, icon }) => (
                        <div
                            key={label}
                            className="flex items-start gap-3 rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-slate-800 dark:text-gray-200"
                        >
                            <div className="mt-1 text-blue-600 dark:text-blue-400">{icon}</div>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
                                <span>{loadingBranch && label === "Branch" ? "Loading..." : value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={onClose}
                        className="rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

ProfileModal.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};
