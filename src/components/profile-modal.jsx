import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Mail, Phone, BadgeCheck, UserCheck, Building2, Pencil, Save, X } from "lucide-react";

import { useClickOutside } from "@/hooks/use-click-outside";
import { useAuth } from "@/context/auth-context";

export const ProfileModal = ({ onClose }) => {
    const { user, setUser } = useAuth();

    const [formData, setFormData] = useState({ ...user });
    const [isEditing, setIsEditing] = useState(false);
    const [branchName, setBranchName] = useState("Loading...");
    const [loadingBranch, setLoadingBranch] = useState(true);

    const modalRef = useRef(null);
    useClickOutside([modalRef], onClose);

    useEffect(() => {
        setFormData({ ...user });
    }, [user]);

    useEffect(() => {
        const fetchBranchName = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/branches", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                const branch = data.find((b) => b.branch_id === user.branch_id);
                setBranchName(branch?.branch_name || "Unknown");
            } catch (error) {
                console.error("Failed to fetch branches:", error);
                setBranchName("Error");
            } finally {
                setLoadingBranch(false);
            }
        };

        if (user?.branch_id) fetchBranchName();
    }, [user]);

    const outlineColor =
        formData.user_status === "Active"
            ? "outline-green-600"
            : user.user_status === "Pending"
              ? "outline-yellow-500"
              : user.user_status === "Suspended"
                ? "outline-red-500"
                : "outline-gray-300";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/users/${user.user_id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update user");

            const verifyRes = await fetch("http://localhost:3000/api/verify", {
                credentials: "include",
            });

            const { user: updatedUser } = await verifyRes.json();
            setUser(updatedUser);

            alert("Profile updated successfully.");
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("An error occurred while updating.");
        }
    };

    const infoItems = [
        {
            label: "Email",
            name: "user_email",
            icon: <Mail size={16} />,
            editable: true,
        },
        {
            label: "Phone",
            name: "user_phonenum",
            icon: <Phone size={16} />,
            editable: true,
        },
        {
            label: "Role",
            name: "user_role",
            icon: <BadgeCheck size={16} />,
            editable: true,
        },
        {
            label: "Status",
            name: "user_status",
            icon: <UserCheck size={16} />,
            editable: true,
        },
        {
            label: "Branch",
            name: "branchName",
            icon: <Building2 size={16} />,
            editable: false,
            value: branchName,
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div
                ref={modalRef}
                className="relative w-full max-w-md rounded-xl bg-white p-4 shadow-xl dark:bg-slate-900 sm:p-6 md:p-8"
            >
                <button
                    className="btn-ghost absolute right-2 top-2 text-gray-500 hover:text-red-500 dark:text-gray-300"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center justify-center">
                    <img
                        src={`http://localhost:3000${user.user_profile}`}
                        alt="Profile"
                        className={`mb-3 h-32 w-32 rounded-full object-cover p-1 outline outline-4 ${outlineColor}`}
                    />
                    <h2 className="text-center text-lg font-bold text-gray-800 dark:text-white">
                        {`${formData.user_fname} ${formData.user_mname} ${formData.user_lname}`}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formData.user_role}</p>
                </div>

                <div className="mt-6 space-y-3">
                    {infoItems.map(({ label, name, icon, editable, value }) => (
                        <div
                            key={label}
                            className="flex items-start gap-3 rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-slate-800 dark:text-gray-200"
                        >
                            <div className="mt-1 text-blue-600 dark:text-blue-400">{icon}</div>
                            <div className="flex w-full flex-col">
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
                                {isEditing && editable ? (
                                    <input
                                        type="text"
                                        name={name}
                                        value={formData[name] || ""}
                                        onChange={handleInputChange}
                                        className="rounded bg-white px-2 py-1 text-sm text-gray-800 outline-none dark:bg-slate-700 dark:text-white"
                                    />
                                ) : (
                                    <span>{value ?? formData[name]}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-center gap-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                                <Save size={16} />
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({ ...user });
                                }}
                                className="flex items-center gap-2 rounded bg-gray-400 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500"
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Pencil size={16} />
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

ProfileModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};
