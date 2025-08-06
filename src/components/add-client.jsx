import { useState, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";

const AddClient = ({ AddClients, setAddClients }) => {
    const modalRef = useRef(null);
    useClickOutside([modalRef], () => setAddClients(null));

    const [clientData, setClientData] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
    });

    const [contact, setContact] = useState({
        fullname: "",
        email: "",
        phone: "",
        role: "",
    });

    const [contacts, setContacts] = useState([]);

    const handleAddContact = () => {
        if (!contact.fullname || !contact.email || !contact.phone || !contact.role) return;
        setContacts([...contacts, contact]);
        setContact({ fullname: "", email: "", phone: "", role: "" });
    };

    const handleRemoveContact = (index) => {
        setContacts(contacts.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3000/api/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    client: clientData,
                    contacts: contacts,
                }),
            });

            if (!res.ok) throw new Error("Failed to add client");

            setAddClients(null);
        } catch (err) {
            console.error(err);
            alert("Error adding client");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                ref={modalRef}
                className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800"
            >
                <button
                    onClick={() => setAddClients(null)}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Add New Client</h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div>
                        <h3 className="mb-2 font-semibold text-blue-700 dark:text-blue-300">Client Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={clientData.fullname}
                                onChange={(e) => setClientData({ ...clientData, fullname: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={clientData.email}
                                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={clientData.phone}
                                onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={clientData.password}
                                onChange={(e) => setClientData({ ...clientData, password: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2 font-semibold text-blue-700 dark:text-blue-300">Contact Person</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={contact.fullname}
                                onChange={(e) => setContact({ ...contact, fullname: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={contact.email}
                                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                            />
                            <input
                                type="tel"
                                placeholder="Phone"
                                value={contact.phone}
                                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                            />
                            <input
                                type="text"
                                placeholder="Relation / Role"
                                value={contact.role}
                                onChange={(e) => setContact({ ...contact, role: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={handleAddContact}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                +
                            </button>
                        </div>

                        {/* Temporary contact table */}
                        {contacts.length > 0 && (
                            <div className="mt-4">
                                <table className="w-full table-auto text-sm">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="px-2 py-1">Name</th>
                                            <th className="px-2 py-1">Email</th>
                                            <th className="px-2 py-1">Phone</th>
                                            <th className="px-2 py-1">Role</th>
                                            <th className="px-2 py-1">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contacts.map((c, idx) => (
                                            <tr
                                                key={idx}
                                                className="border-t"
                                            >
                                                <td className="px-2 py-1">{c.fullname}</td>
                                                <td className="px-2 py-1">{c.email}</td>
                                                <td className="px-2 py-1">{c.phone}</td>
                                                <td className="px-2 py-1">{c.role}</td>
                                                <td className="px-2 py-1">
                                                    <button
                                                        onClick={() => handleRemoveContact(idx)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Save Client
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClient;
