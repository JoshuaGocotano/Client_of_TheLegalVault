import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import user1 from "@/assets/JoshuaG..jpg";
import user2 from "../../../../uploads/joshua.png";
import user3 from "../../../../uploads/user_profile-1752223125848-455598027.jpg";
import AddUserModal from "@/components/add-users";

const initialUsers = [
    { id: 1, name: "Sarah Wilson", username: "admin", email: "admin@example.com", role: "admin", image: user1 },
    { id: 2, name: "John Cooper", username: "john.cooper", email: "john@example.com", role: "paralegal", image: user2 },
    { id: 3, name: "Emma Thompson", username: "emma.thompson", email: "emma@example.com", role: "lawyer", image: user3 },
];

const roles = ["All", "Admin", "Lawyer", "Paralegal", "Staff"];

const Users = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState(initialUsers);
    const [selectedRole, setSelectedRole] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    const openRemoveModal = (user) => {
        setUserToRemove(user);
        setIsRemoveModalOpen(true);
    };

    const closeRemoveModal = () => {
        setIsRemoveModalOpen(false);
        setUserToRemove(null);
    };

    const confirmRemoveUser = () => {
        setUsers((prev) => prev.filter((u) => u.id !== userToRemove.id));
        closeRemoveModal();
    };

    const openEditModal = (user) => {
        setUserToEdit(user);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setUserToEdit(null);
    };

    const saveEditedUser = (updatedUser) => {
        setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        closeEditModal();
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());

        const matchesRole = selectedRole === "All" || user.role.toLowerCase() === selectedRole.toLowerCase();

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
                    className="w-full rounded-md border border-gray-300 bg-transparent px-4 py-2 text-gray-900 dark:border-slate-600 dark:text-white md:flex-1"
                />
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Add User
                </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-xl border shadow dark:border-slate-700">
                <table className="w-full table-auto text-left text-sm">
                    <thead className="text-xs uppercase dark:text-slate-400">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Username</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="dark:text-slate-50">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t hover:bg-blue-50 dark:hover:bg-blue-950"
                                >
                                    <td className="flex items-center gap-3 px-4 py-5">
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                        <span className="font-medium">{user.name}</span>
                                    </td>
                                    <td className="px-4 py-3">{user.username}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3 capitalize">{user.role}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => openRemoveModal(user)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
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
            {isModalOpen && <AddUserModal onClose={() => setIsModalOpen(false)} />}

            {/* Edit Modal */}
            {isEditModalOpen && userToEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
                        <h2 className="mb-4 text-lg font-semibold dark:text-white">Edit User</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                saveEditedUser(userToEdit);
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="text-sm font-medium dark:text-white">Name</label>
                                <input
                                    type="text"
                                    value={userToEdit.name}
                                    onChange={(e) => setUserToEdit({ ...userToEdit, name: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium dark:text-white">Username</label>
                                <input
                                    type="text"
                                    value={userToEdit.username}
                                    onChange={(e) => setUserToEdit({ ...userToEdit, username: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium dark:text-white">Email</label>
                                <input
                                    type="email"
                                    value={userToEdit.email}
                                    onChange={(e) => setUserToEdit({ ...userToEdit, email: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium dark:text-white">Role</label>
                                <select
                                    value={userToEdit.role}
                                    onChange={(e) => setUserToEdit({ ...userToEdit, role: e.target.value })}
                                    className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="lawyer">Lawyer</option>
                                    <option value="paralegal">Paralegal</option>
                                    <option value="staff">Staff</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="rounded-lg bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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
                            {userToRemove.role.charAt(0).toUpperCase() + userToRemove.role.slice(1)} Removal
                        </h2>
                        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                            Are you sure you want to remove this {userToRemove.role.toLowerCase()}?
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
