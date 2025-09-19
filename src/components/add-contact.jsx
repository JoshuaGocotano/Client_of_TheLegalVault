import React, { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";

const AddContact = ({ onAdd, onClose, clients = [] }) => {
    const [formData, setFormData] = useState({
        contact_fullname: "",
        contact_email: "",
        contact_phone: "",
        contact_role: "",
        client_id: "",
    });

    const modalRef = useRef(null);
    useClickOutside([modalRef], () => onClose(null));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const confirmAddingContact = window.confirm("Are you sure you want to add this contact?");
        if (confirmAddingContact) {
            const { contact_fullname, contact_email, contact_phone, client_id } = formData;

            if (!contact_fullname || !contact_email || !contact_phone || !client_id) {
                alert("Please fill in all required fields.");
                return;
            }

            const newContact = {
                ...formData,
            };

            onAdd(newContact);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                ref={modalRef}
                className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800"
            >
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Add Client Contact Person</h2>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-3"
                >
                    <select
                        name="client_id"
                        value={formData.client_id}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-slate-50"
                    >
                        <option
                            value=""
                            disabled
                        >
                            Select Client
                        </option>
                        {clients.map((client) => (
                            <option
                                key={client.client_id}
                                value={client.client_id}
                            >
                                {client.client_fullname || `Client ${client.client_id}`}
                            </option>
                        ))}
                    </select>
                    <input
                        name="contact_fullname"
                        placeholder="Full Name"
                        value={formData.contact_fullname}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                    />
                    <input
                        name="contact_email"
                        placeholder="Email"
                        type="email"
                        value={formData.contact_email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                    />
                    <input
                        name="contact_phone"
                        placeholder="Phone Number"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                    />
                    <input
                        name="contact_role"
                        placeholder="Role (e.g. Manager, Secretary)"
                        value={formData.contact_role}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        required
                    />  

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddContact;
