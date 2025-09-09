import { useState } from "react";
import { Download, Trash2, FileText, Search, Filter, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const initialDocuments = [
    {
        id: 1,
        name: "Cases.jpg",
        case: "Davis Incorporation",
        type: "JPG",
        size: "1.4 MB",
        uploadedBy: "Admin",
        date: "2025-04-26",
    },
];

const Documents = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // redirect non-admins
    useEffect(() => {
        if (!user) return; // wait until auth state is known
        if (user.user_role !== "Admin" && user.user_role !== "Lawyer") {
            navigate("/unauthorized", { replace: true });
        }
    }, [user, navigate]);

    const [error, setError] = useState("");
    const [documents, setDocuments] = useState(initialDocuments);
    const [search, setSearch] = useState("");
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [docToDelete, setDocToDelete] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const toggleFilterModal = () => setShowFilterModal(!showFilterModal);

    const confirmDelete = (doc) => {
        setDocToDelete(doc);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (docToDelete) {
            setDocuments(documents.filter((doc) => doc.id !== docToDelete.id));
            setDocToDelete(null);
            setShowDeleteModal(false);
        }
    };

    // Filtered list
    const filteredDocs = documents.filter((doc) => doc.name.toLowerCase().includes(search.toLowerCase()));

    // Pagination logic
    const totalPages = Math.ceil(filteredDocs.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDocs = filteredDocs.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-6">
            {error && <div className="mb-4 w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-red-50 shadow">{error}</div>}
            {/* Header */}
            <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                <div>
                    <h1 className="title">Documents</h1>
                    <p className="text-sm dark:text-slate-300">Manage and organize case-related documents</p>
                </div>
                <div className="mt-4 flex gap-2 md:mt-0">
                    <button
                        className="flex items-center gap-2 rounded-md border border-blue-600 bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                        onClick={toggleFilterModal}
                    >
                        <Filter size={16} /> Filters
                    </button>
                </div>
            </div>

            {/* Search Input */}
            <div className="card shadow-md">
                <div className="focus:ring-0.5 flex flex-grow items-center gap-2 rounded-md border border-gray-300 bg-transparent px-3 py-2 focus-within:border-blue-600 focus-within:ring-blue-400 dark:border-slate-600 dark:focus-within:border-blue-600">
                    <Search
                        size={18}
                        className="text-gray-600 dark:text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search documents by name, type, or case..."
                        className="focus:ring-0.5 w-full bg-transparent text-gray-900 placeholder-gray-500 outline-none dark:text-white dark:placeholder-gray-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Document Table */}
            <div className="card overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-800 dark:text-white">
                    <thead className="border-b text-gray-800 dark:text-white">
                        <tr>
                            <th className="px-4 py-3 font-medium">Document</th>
                            <th className="px-4 py-3 font-medium">Case</th>
                            <th className="px-4 py-3 font-medium">Type</th>
                            <th className="px-4 py-3 font-medium">Size</th>
                            <th className="px-4 py-3 font-medium">Uploaded By</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                            <th className="px-4 py-3 text-center font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDocs.map((doc) => (
                            <tr
                                key={doc.id}
                                className="border-t hover:bg-blue-100 dark:hover:bg-blue-950"
                            >
                                <td className="flex items-center gap-2 px-4 py-4 font-medium text-blue-800">
                                    <FileText size={18} /> {doc.name}
                                </td>
                                <td className="px-4 py-3">{doc.case}</td>
                                <td className="px-4 py-3">{doc.type}</td>
                                <td className="px-4 py-3">{doc.size}</td>
                                <td className="px-4 py-3">{doc.uploadedBy}</td>
                                <td className="px-4 py-3">{doc.date}</td>
                                <td className="flex justify-center gap-4 px-4 py-3">
                                    <a
                                        href={`/files/${doc.name}`}
                                        download
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Download size={16} />
                                    </a>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => confirmDelete(doc)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="mt-2 flex items-center justify-end px-4 py-3 text-sm text-gray-700 dark:text-white">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                        >
                            &lt;
                        </button>

                        <div>
                            Page {currentPage} of {totalPages}
                        </div>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}

            {/* Filter Modal */}
            {showFilterModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={() => setShowFilterModal(false)}
                >
                    <div
                        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={toggleFilterModal}
                            className="absolute right-3 top-3 text-gray-500 hover:text-black"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">Filter Options</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Document Type</label>
                                <input
                                    type="text"
                                    placeholder="e.g. PDF, JPG"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Uploaded By</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Admin, Staff"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    onClick={toggleFilterModal}
                                    className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={toggleFilterModal}
                                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-black"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">Are you sure you want to remove this document?</h2>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Documents;
