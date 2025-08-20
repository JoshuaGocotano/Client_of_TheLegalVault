import { useEffect, useState, useCallback } from "react";
import { Pencil, UserRoundX, UserRoundPlus } from "lucide-react";
import AddUserModal from "@/components/add-users";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import default_avatar from "@/assets/default-avatar.png";
import toast from "react-hot-toast";

const roles = ["All", "Admin", "Lawyer", "Paralegal", "Staff"];
const API_BASE = "http://localhost:3000";

const Users = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [userToSuspend, setUserToSuspend] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    // redirect non-admins
    useEffect(() => {
        if (!user) return; // wait until auth state is known
        if (user.user_role !== "Admin") {
            navigate("/unauthorized", { replace: true });
        }
    }, [user, navigate]);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/api/users`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to fetch users");

            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // open/close modals
    const openRemoveModal = (u) => {
        setUserToSuspend(u);
        setIsRemoveModalOpen(true);
    };

    const closeRemoveModal = () => {
        setIsRemoveModalOpen(false);
        setUserToSuspend(null);
    };

    const openEditModal = (u) => {
        setUserToEdit(u);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setUserToEdit(null);
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Delete user (calls API, then updates local state)
    const confirmSuspendUser = async () => {
        if (!userToSuspend) return;

        const fullName = [userToSuspend.user_fname, userToSuspend.user_mname, userToSuspend.user_lname].filter(Boolean).join(" ");

        const toastId = toast.loading(`Updating user: ${fullName}`, {
            duration: Infinity,
        });

        try {
            const res = await fetch(`${API_BASE}/api/users/${userToSuspend.user_id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...userToSuspend, user_status: "Suspended" }),
            });

            if (!res.ok) {
                throw new Error("Failed to suspend user");
            }

            toast.success("User suspension successful!", { id: toastId, duration: 4000 });
            const updated = await res.json();

            setUsers((prev) => prev.map((u) => (u.user_id === updated.user_id ? updated : u)));

            closeRemoveModal();
        } catch (err) {
            console.error("Error suspending user:", err);
            setError(err);
        }
    };

    const handleUserActivation = async (u) => {
        const fullName = [u.user_fname, u.user_mname, u.user_lname].filter(Boolean).join(" ");

        const confirmActivate = window.confirm(`Are you sure you want to activate ${fullName}?`);

        if (confirmActivate) {
            const toastId = toast.loading(`Activating: ${fullName}`, {
                duration: Infinity,
            });

            try {
                const res = await fetch(`${API_BASE}/api/users/${u.user_id}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...u, user_status: "Active" }),
                });

                if (!res.ok) {
                    throw new Error("Failed to activate user");
                }

                toast.success("User activation successful!", { id: toastId, duration: 4000 });
                const updated = await res.json();

                setUsers((prev) => prev.map((u) => (u.user_id === updated.user_id ? updated : u)));
            } catch (err) {
                console.error("Error updating user:", err);
                setError(err);
            }
        }
    };

    // Save edited user (PUT to API, then update local state)
    const handleSaveEditedUser = async (e) => {
        e.preventDefault();
        if (!userToEdit) return;

        const fullName = [userToEdit.user_fname, userToEdit.user_mname, userToEdit.user_lname].filter(Boolean).join(" ");

        const toastId = toast.loading(`Updating: ${fullName}`, {
            duration: Infinity,
        });

        try {
            const payload = {
                // send the fields you expect your API to accept
                user_fname: userToEdit.user_fname,
                user_mname: userToEdit.user_mname,
                user_lname: userToEdit.user_lname,
                user_email: userToEdit.user_email,
                user_phonenum: userToEdit.user_phonenum,
                user_role: userToEdit.user_role,
                user_status: userToEdit.user_status,
                branch_id: userToEdit.branch_id,
            };

            const res = await fetch(`${API_BASE}/api/users/${userToEdit.user_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                console.error("Failed to update user");
                return;
            }

            toast.success("User updated successfully!", { id: toastId, duration: 4000 });
            const updated = await res.json();

            setUsers((prev) => prev.map((u) => (u.user_id === updated.user_id ? updated : u)));
            closeEditModal();
        } catch (err) {
            console.error("Error updating user:", err);
        }
    };

    // Filter logic — search + role must both match (AND). Use safe optional chaining.
    const filteredUsers = users.filter((u) => {
        const q = search.trim().toLowerCase();

        const fields = [u.user_email, u.user_fname, u.user_mname, u.user_lname, u.user_phonenum, u.user_role, u.user_status];

        const matchesSearch = q === "" || fields.some((f) => f && f.toLowerCase().includes(q));
        const matchesRole = selectedRole === "All" || (u.user_role && u.user_role.toLowerCase() === selectedRole.toLowerCase());

        return matchesSearch && matchesRole;
    });

    return (
        <div className="dark:bg-slate-950">
            {error && (
                <div className="alert alert-error mx-10 mb-5 mt-5 shadow-lg">
                    <div>
                        <span>{error.message}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-6">
                <h2 className="title">Users</h2>
                <p className="text-sm dark:text-slate-300">Manage system users and their roles</p>
            </div>

            {/* Role Filters */}
            <div className="mb-4 flex flex-wrap gap-2">
                {roles.map((role) => (
                    <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`rounded-full border px-4 py-1.5 text-sm ${
                            selectedRole === role ? "bg-blue-600 text-white" : "border-gray-300 text-gray-800 dark:text-white"
                        }`}
                    >
                        {role}
                    </button>
                ))}
            </div>

            {/* Search & Add Button */}
            <div className="mb-6 flex flex-col items-center gap-4 md:flex-row">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="focus:ring-0.5 h-10 w-full flex-grow rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:outline-none focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:border-blue-600 dark:focus:ring-blue-600 md:flex-1"
                />

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow hover:bg-blue-700"
                >
                    Add User
                </button>
            </div>

            {/* Users Table */}
            <div className="card overflow-x-auto rounded-xl border shadow-md dark:border-slate-700">
                <table className="w-full table-auto text-left text-sm">
                    <thead className="text-xs uppercase dark:text-slate-400">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Date Created</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="dark:text-slate-50">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((u) => (
                                <tr
                                    key={u.user_id}
                                    className="border-t border-gray-200 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-blue-950"
                                >
                                    <td className="flex items-center gap-3 px-4 py-3">
                                        <img
                                            src={u.user_profile ? `${API_BASE}${u.user_profile}` : default_avatar}
                                            alt={`${u.user_fname || ""} ${u.user_lname || ""}`.trim()}
                                            className={`h-10 w-10 rounded-full border-2 object-cover p-0.5 ${
                                                u.user_status === "Active"
                                                    ? "border-green-500"
                                                    : u.user_status === "Pending"
                                                      ? "border-yellow-500"
                                                      : u.user_status === "Suspended"
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                            }`}
                                        />
                                        <span className="font-medium">
                                            {`${u.user_fname || ""} ${u.user_mname || ""} ${u.user_lname || ""}`.replace(/\s+/g, " ").trim()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{u.user_email}</td>
                                    <td className="px-4 py-3">{u.user_phonenum}</td>
                                    <td className="px-4 py-3 capitalize">{u.user_role}</td>
                                    <td className="px-4 py-3 capitalize">{formatDateTime(u.user_date_created)}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
                                                u.user_status === "Active"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300"
                                                    : u.user_status === "Pending"
                                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300"
                                                      : u.user_status === "Suspended"
                                                        ? "bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-300"
                                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300"
                                            }`}
                                        >
                                            {u.user_status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {u.user_status !== "Suspended" ? (
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(u)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit User Info"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => openRemoveModal(u)}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Suspend User"
                                                >
                                                    <UserRoundX className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(u)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit User Info"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleUserActivation(u)}
                                                    className="text-green-600 hover:text-blue-800"
                                                    title="Activate User"
                                                >
                                                    <UserRoundPlus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-6 text-center text-slate-500 dark:text-slate-400"
                                >
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <AddUserModal
                    onClose={() => {
                        setIsModalOpen(false);
                        // refresh list after modal closes (in case a user was added)
                        fetchUsers();
                    }}
                />
            )}

            {/* Edit Modal */}
            {isEditModalOpen && userToEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
                        <h2 className="mb-4 text-lg font-semibold dark:text-white">
                            Edit User <span className="text-sm text-slate-400">(User ID: {userToEdit.user_id})</span>{" "}
                        </h2>
                        <form
                            onSubmit={handleSaveEditedUser}
                            className="space-y-4"
                        >
                            <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-3">
                                <div>
                                    <label className="text-sm font-medium dark:text-white">First name</label>
                                    <input
                                        type="text"
                                        value={userToEdit.user_fname || ""}
                                        onChange={(e) => setUserToEdit((prev) => ({ ...prev, user_fname: e.target.value }))}
                                        className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium dark:text-white">Middle name</label>
                                    <input
                                        type="text"
                                        value={userToEdit.user_mname || ""}
                                        onChange={(e) => setUserToEdit((prev) => ({ ...prev, user_mname: e.target.value }))}
                                        className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium dark:text-white">Last name</label>
                                    <input
                                        type="text"
                                        value={userToEdit.user_lname || ""}
                                        onChange={(e) => setUserToEdit((prev) => ({ ...prev, user_lname: e.target.value }))}
                                        className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium dark:text-white">Email</label>
                                <input
                                    type="email"
                                    value={userToEdit.user_email || ""}
                                    onChange={(e) => setUserToEdit((prev) => ({ ...prev, user_email: e.target.value }))}
                                    className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium dark:text-white">Phone</label>
                                <input
                                    type="text"
                                    value={userToEdit.user_phonenum || ""}
                                    onChange={(e) => setUserToEdit((prev) => ({ ...prev, user_phonenum: e.target.value }))}
                                    className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>

                            {/* Role and Status */}
                            {/* <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium dark:text-white">Role</label>
                                    <select
                                        value={userToEdit.user_role || ""}
                                        onChange={(e) => setUserToEdit((prev) => ({ ...prev, user_role: e.target.value }))}
                                        className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    >
                                        {roles
                                            .filter((r) => r !== "All")
                                            .map((r) => (
                                                <option
                                                    key={r}
                                                    value={r}
                                                >
                                                    {r}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium dark:text-white">Status</label>
                                    <input
                                        type="text"
                                        value={userToEdit.user_status || ""}
                                        onChange={(e) => setUserToEdit((prev) => ({ ...prev, user_status: e.target.value }))}
                                        className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>
                            </div> */}

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>

                        <button
                            onClick={closeEditModal}
                            className="absolute right-2 top-2 text-xl text-gray-400 hover:text-gray-600"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            {/* Remove User Modal */}
            {isRemoveModalOpen && userToSuspend && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
                        <h2 className="mb-4 text-lg font-semibold dark:text-white">
                            {userToSuspend.user_role ? userToSuspend.user_role.charAt(0).toUpperCase() + userToSuspend.user_role.slice(1) : "User"}{" "}
                            Suspension
                        </h2>
                        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                            Are you sure you want to suspend{" "}
                            <span className="font-semibold underline">
                                {userToSuspend.user_fname} {userToSuspend.user_mname} {userToSuspend.user_lname}
                            </span>
                            ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeRemoveModal}
                                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSuspendUser}
                                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            >
                                Suspend
                            </button>
                        </div>

                        <button
                            onClick={closeRemoveModal}
                            className="absolute right-2 top-2 text-xl text-gray-400 hover:text-gray-600"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
