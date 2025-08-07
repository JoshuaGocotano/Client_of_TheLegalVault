import React, { useState, useRef } from "react";
import AddContact from "../components/add-contact";
import { useClickOutside } from "@/hooks/use-click-outside";

const ClientContact = () => {
    const [tableData, setTableData] = useState([
        {
            id: 1,
            clientContact_fullname: "Maria Gomez",
            clientContact_email: "maria@example.com",
            clientContact_phonenum: "09123456789",
            clientContact_relation: "Sister",
            clientContact_client: "Juan Dela Cruz",
        },
        {
            id: 2,
            clientContact_fullname: "James Smith",
            clientContact_email: "james@example.com",
            clientContact_phonenum: "09987654321",
            clientContact_relation: "Brother",
            clientContact_client: "John Smith",
        },
        {
            id: 3,
            clientContact_fullname: "Anna Reyes",
            clientContact_email: "anna@example.com",
            clientContact_phonenum: "09111111111",
            clientContact_relation: "Mother",
            clientContact_client: "Leo Reyes",
        },
        {
            id: 4,
            clientContact_fullname: "Carla Santos",
            clientContact_email: "carla@example.com",
            clientContact_phonenum: "09222222222",
            clientContact_relation: "Friend",
            clientContact_client: "Diana Santos",
        },
        {
            id: 5,
            clientContact_fullname: "Mark Tan",
            clientContact_email: "mark@example.com",
            clientContact_phonenum: "09333333333",
            clientContact_relation: "Father",
            clientContact_client: "Luke Tan",
        },
        {
            id: 6,
            clientContact_fullname: "Nina Cruz",
            clientContact_email: "nina@example.com",
            clientContact_phonenum: "09444444444",
            clientContact_relation: "Wife",
            clientContact_client: "Samuel Cruz",
        },
    ]);

    const [showAddContacts, setShowAddContacts] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filtering
    const filteredData = tableData.filter((item) =>
        Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
    );

    // useClickOutside for modal
    const modalRef = useRef(null);
    useClickOutside([modalRef], () => {
        if (isModalOpen) setIsModalOpen(false);
    });

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                    <h1 className="title">Clients {" > "} Contacts</h1>
                    <p className="text-sm text-gray-500">Manage all client contacts information here.</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="card mb-6 flex flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-slate-800 md:flex-row">
                <input
                    type="text"
                    placeholder="Search client contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 placeholder-gray-500 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 md:flex-1"
                />
                <button
                    onClick={() => {
                        setSearchTerm("");
                        setShowAddContacts(true);
                    }}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                >
                    Add Contacts
                </button>
            </div>

            {/* Table */}
            <div className="card">
                <table className="min-w-full table-auto text-left text-sm">
                    <thead className="card-title text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3">Fullname</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Role/Relation</th>
                            <th className="px-4 py-3">Client</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-white">
                        {currentItems.map((contact) => (
                            <tr
                                key={contact.id}
                                className="border-t hover:bg-blue-50 dark:hover:bg-slate-800"
                            >
                                <td className="px-4 py-3">{contact.clientContact_fullname}</td>
                                <td className="px-4 py-3">{contact.clientContact_email}</td>
                                <td className="px-4 py-3">{contact.clientContact_phonenum}</td>
                                <td className="px-4 py-3">{contact.clientContact_relation}</td>
                                <td className="px-4 py-3">{contact.clientContact_client}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-end gap-3">
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

            {/* AddContact Modal */}
            {showAddContacts && (
                <AddContact
                    onClose={() => setShowAddContacts(false)}
                    onAdd={(newContact) => {
                        setTableData((prev) => [...prev, { id: Date.now(), ...newContact }]);
                        setCurrentPage(1); // Reset to first page
                        setShowAddContacts(false);
                    }}
                />
            )}

            {/* Go to Clients */}
            <div className="mt-6">
                <a
                    href="/clients"
                    className="text-blue-600 hover:underline"
                >
                    {" < Back "}
                </a>
            </div>
        </div>
    );
};

export default ClientContact;
