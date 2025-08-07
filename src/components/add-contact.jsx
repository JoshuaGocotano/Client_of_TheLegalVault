import React, { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";

const AddContact = ({ onAdd, onClose }) => {
    const [formData, setFormData] = useState({
        clientContact_fullname: "",
        clientContact_email: "",
        clientContact_phonenum: "",
        clientContact_relation: "",
        clientContact_client: "",
    });

    const modalRef = useRef(null);
    useClickOutside([modalRef], () => onClose(null));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.clientContact_fullname || !formData.clientContact_email || !formData.clientContact_phonenum) {
            alert("Please fill in all required fields.");
            return;
        }

        const newContact = {
            id: Date.now(),
            ...formData,
        };

        alert("Contact added successfully!");
        onAdd(newContact);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                ref={modalRef}
                className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800"
            >
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Add New Contact</h2>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-3"
                >
                    <input
                        name="clientContact_fullname"
                        placeholder="Company Name / Name"
                        value={formData.clientContact_fullname}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                    />
                    <input
                        name="clientContact_email"
                        placeholder="Email"
                        value={formData.clientContact_email}
                        onChange={handleChange}
                        required
                        type="email"
                        className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                    />
                    <input
                        name="clientContact_phonenum"
                        placeholder="Phone"
                        value={formData.clientContact_phonenum}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                    />
                    <input
                        name="clientContact_relation"
                        placeholder="Relation"
                        value={formData.clientContact_relation}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                    />
                    <input
                        name="clientContact_client"
                        placeholder="Client Name"
                        value={formData.clientContact_client}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                    />

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded bg-gray-300 px-4 py-2 dark:bg-slate-600 dark:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddContact;
