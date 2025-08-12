import { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2, UserRoundX } from "lucide-react";
import AddUserModal from "@/components/add-users";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import default_avatar from "@/assets/default-avatar.png";

const roles = ["All", "Admin", "Lawyer", "Paralegal", "Staff"];
const API_BASE = "http://localhost:3000";

const Users = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    // redirect non-admins -> perform navigation as an effect (avoid side effects during render)
    useEffect(() => {
        if (!user) return; // wait until auth state is known
        if (user.user_role !== "Admin") {
            navigate("/unauthorized", { replace: true });
        }
    }, [user, navigate]);

    // fetch users (extract so we can call after adding/updating/removing)
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
        setUserToRemove(u);
        setIsRemoveModalOpen(true);
    };

    const closeRemoveModal = () => {
        setIsRemoveModalOpen(false);
        setUserToRemove(null);
    };

    const openEditModal = (u) => {
        setUserToEdit(u);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setUserToEdit(null);
    };

    // Delete user (calls API, then updates local state)
    const confirmRemoveUser = async () => {
        if (!userToRemove) return;

        try {
            const res = await fetch(`${API_BASE}/api/users/${userToRemove.user_id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                // fallback: log and don't remove locally
                console.error("Failed to delete user");
                return;
            }

            setUsers((prev) => prev.filter((u) => u.user_id !== userToRemove.user_id));
            closeRemoveModal();
        } catch (err) {
            console.error("Error deleting user:", err);
        }
    };

    // Save edited user (PUT to API, then update local state)
    const handleSaveEditedUser = async (e) => {
        e.preventDefault();
        if (!userToEdit) return;

        try {
            const payload = {
                // send the fields you expect your API to accept
                user_fname: userToEdit.user_fname,
                user_mname: userToEdit.user_mname,
                user_lname: userToEdit.user_lname,
                user_email: userToEdit.user_email,
                user_phonenum: userToEdit.user_phonenum,
                // user_role: userToEdit.user_role,
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

            const updated = await res.json();

            // update local copy (if your API returns the updated user, use it; otherwise use userToEdit)
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
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Branch</th>
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
                                    <td className="px-4 py-3 capitalize">{u.user_status}</td>
                                    <td className="px-4 py-3 capitalize">{u.branch_id}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(u)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => openRemoveModal(u)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <UserRoundX className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-6 text-center text-gray-400"
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
                        <h2 className="mb-4 text-lg font-semibold dark:text-white">Edit User</h2>
                        <form
                            onSubmit={handleSaveEditedUser}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-3 gap-2">
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

                            {/* <div>
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
            {isRemoveModalOpen && userToRemove && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
                        <h2 className="mb-4 text-lg font-semibold dark:text-white">
                            {userToRemove.user_role ? userToRemove.user_role.charAt(0).toUpperCase() + userToRemove.user_role.slice(1) : "User"}{" "}
                            Suspension
                        </h2>
                        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                            Are you sure you want to suspend{" "}
                            <span className="font-semibold underline">
                                {userToRemove.user_fname} {userToRemove.user_mname} {userToRemove.user_lname}
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
                                onClick={confirmRemoveUser}
                                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            >
                                Remove
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
