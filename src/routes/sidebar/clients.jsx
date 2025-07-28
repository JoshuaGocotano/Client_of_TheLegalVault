import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import AddClient from "../../components/add-client";

const Client = () => {
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [clientContacts, setClientContacts] = useState([]);

    // Fetching all clients and users to get the name of the user who created the client
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [clientsRes, usersRes, contactsRes] = await Promise.all([
                    fetch("http://localhost:3000/api/clients", { credentials: "include" }),
                    fetch("http://localhost:3000/api/users", { credentials: "include" }),
                    fetch("http://localhost:3000/api/client-contacts", { credentials: "include" }),
                ]);

                if (!clientsRes.ok || !usersRes.ok || !contactsRes.ok) throw new Error("Failed to fetch one or more resources");

                const [clients, users, contacts] = await Promise.all([clientsRes.json(), usersRes.json(), contactsRes.json()]);

                setTableData(clients);
                setUsers(users);
                setClientContacts(contacts); // 🔹 save contacts in state
            } catch (err) {
                console.error("Fetching error:", err);
                setError(err);
            }
        };

        fetchAll();
    }, []);

    const getUserFullName = (createdBy) => {
        const user = users.find((u) => u.user_id === createdBy);
        return user
            ? `${user.user_fname || ""} ${user.user_mname ? user.user_mname[0] + "." : ""} ${user.user_lname || ""}`.replace(/\s+/g, " ").trim()
            : "Unknown";
    };

    const [AddClients, setAddClients] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewClient, setViewClient] = useState(null);
    const [editClient, setEditClient] = useState(null);
    const [userToRemove, setUserToRemove] = useState(null);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

    const modalRef = useRef(null);
    useClickOutside([modalRef], () => {
        if (isModalOpen) setIsModalOpen(false);
    });

    const handleEditSave = () => {
        setTableData((prev) => prev.map((item) => (item.id === editClient.id ? { ...item, ...editClient } : item)));
        setEditClient(null);
    };

    const filteredClients = tableData.filter(
        (client) =>
            client.client_fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.client_phonenum.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.client_date_created.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.created_by.toString().includes(searchTerm),
    );

    const openRemoveModal = (client) => {
        setUserToRemove(client);
        setIsRemoveModalOpen(true);
    };

    const closeRemoveModal = () => {
        setUserToRemove(null);
        setIsRemoveModalOpen(false);
    };

    const confirmRemoveUser = () => {
        // Logic to remove the user
        closeRemoveModal();
    };

    return (
        <div className="bg-blue rounded-xl">
            {error && (
                <div className="alert alert-error mx-10 mb-5 mt-5 shadow-lg">
                    <div>
                        <span>{error.message}</span>
                    </div>
                </div>
            )}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="title">Clients</h1>
                    <p className="text-sm text-gray-500">Manage all client information here...</p>
                </div>
            </div>

            <div className="card mb-6 flex flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-slate-800 md:flex-row">
                <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 placeholder-gray-500 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 md:flex-1"
                />
                <button
                    onClick={() => setAddClients(true)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                >
                    Add Client
                </button>
            </div>

            <div className="card shadow-lg">
                <table className="min-w-full table-auto text-left text-sm">
                    <thead className="card-title text-xs uppercase">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-3">Client</th>
                            <th className="whitespace-nowrap px-4 py-3">Email</th>
                            <th className="whitespace-nowrap px-4 py-3">Phone</th>
                            <th className="whitespace-nowrap px-4 py-3">Created by</th>
                            <th className="whitespace-nowrap px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-white">
                        {filteredClients.map((client) => (
                            <tr
                                key={client.id}
                                className="border-t border-gray-200 transition hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-slate-800"
                            >
                                <td className="whitespace-nowrap px-4 py-3">{client.client_fullname}</td>
                                <td className="whitespace-nowrap px-4 py-3">{client.client_email}</td>
                                <td className="whitespace-nowrap px-4 py-3">{client.client_phonenum}</td>
                                <td className="whitespace-nowrap px-4 py-3">{getUserFullName(client.created_by)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            className="p-1.5 text-blue-600 hover:text-blue-800"
                                            onClick={() => setViewClient(client)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="p-1.5 text-yellow-500 hover:text-yellow-700"
                                            onClick={() => setEditClient({ ...client })}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="p-1.5 text-red-600 hover:text-red-800"
                                            onClick={() => openRemoveModal(client)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Client Modal */}
            {viewClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-screen-md rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
                        <h3 className="mb-4 text-xl font-bold text-blue-900">Client Information</h3>
                        <div className="grid grid-cols-1 gap-4 text-sm text-blue-900 sm:grid-cols-2">
                            <div>
                                <p className="font-semibold">Name / Company</p>
                                <p className="text-gray-600 dark:text-white">{viewClient.client_fullname}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Email</p>
                                <p className="text-gray-600 dark:text-white">{viewClient.client_email || "-"}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Phone</p>
                                <p className="text-gray-600 dark:text-white">{viewClient.client_phonenum || "-"}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Date Added</p>
                                <p className="text-gray-600 dark:text-white">{new Date(viewClient.client_date_created).toLocaleDateString()}</p>
                            </div>

                            <div className="col-span-2 mt-4 w-full">
                                <p className="mb-2 font-semibold">Contact(s)</p>
                                <table className="min-w-full table-auto text-left text-sm">
                                    <thead className="text-xs uppercase text-slate-500">
                                        <tr>
                                            <th className="whitespace-nowrap px-4 py-3">Name</th>
                                            <th className="whitespace-nowrap px-4 py-3">Email</th>
                                            <th className="whitespace-nowrap px-4 py-3">Phone</th>
                                            <th className="whitespace-nowrap px-4 py-3">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700 dark:text-white">
                                        {clientContacts
                                            .filter((contact) => contact.client_id === viewClient.client_id)
                                            .map((contact) => (
                                                <tr key={contact.client_id}>
                                                    <td className="whitespace-nowrap px-4 py-2">{contact.contact_fullname}</td>
                                                    <td className="whitespace-nowrap px-4 py-2">{contact.contact_email}</td>
                                                    <td className="whitespace-nowrap px-4 py-2">{contact.contact_phone}</td>
                                                    <td className="whitespace-nowrap px-4 py-2">{contact.contact_role}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setViewClient(null)}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Client Modal */}
            {editClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
                        <h3 className="mb-6 text-xl font-bold text-blue-900">Edit Client</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {["client", "email", "phone", "emergency", "ContactPersonName", "ContactPersonNumber", "RelationRole"].map((field) => (
                                <div key={field}>
                                    <label className="mb-1 block text-sm font-medium capitalize text-gray-700 dark:text-gray-300">{field}</label>
                                    <input
                                        type="text"
                                        value={editClient[field]}
                                        onChange={(e) => setEditClient({ ...editClient, [field]: e.target.value })}
                                        className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setEditClient(null)}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                className="rounded-lg bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove Modal */}
            {isRemoveModalOpen && userToRemove && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
                        <h2 className="mb-4 text-lg font-semibold dark:text-white">Are you sure?</h2>
                        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">Are you sure you want to remove this client?</p>
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

            {AddClients && (
                <AddClient
                    AddClients={AddClients}
                    setAddClients={setAddClients}
                />
            )}
        </div>
    );
};

export default Client;
