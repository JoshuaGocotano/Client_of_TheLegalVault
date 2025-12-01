import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { Eye, Folder, Search, ArrowLeft } from "lucide-react";
import ViewModal from "./view-case";

const CaseFolder = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeFolder, setActiveFolder] = useState("All");
    const [cases, setCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [search, setSearch] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const fetchCases = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/cases", {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to fetch cases.");
            setCases(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCases();
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFolder, search]);

    const formatDateTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getLawyerFullName = (c) => {
        return c.user_fname ? `${c.user_fname} ${c.user_mname ? c.user_mname[0] + "." : ""} ${c.user_lname}`.trim() : "Unassigned";
    };

    const caseFolders = [
        "All",
        "Civil Cases",
        "Criminal Cases",
        "Special Proceedings",
        "Constitutional Cases",
        "Jurisdictional Cases",
        "Special Courts Cases",
    ];

    // Filter by folder
    const filteredCases = cases.filter((c) => {
        if (activeFolder === "All") return true;
        const folder = activeFolder.toLowerCase().replace(/s$/, "");
        const category = c.cc_name?.toLowerCase().replace(/s$/, "");
        return category === folder;
    });

    // Filter by search
    const searchedCases = filteredCases.filter((c) => {
        const text = `${c.ct_name} ${c.cc_name} ${c.client_fullname}`.toLowerCase();
        return text.includes(search.toLowerCase());
    });

    // Pagination
    const totalPages = Math.ceil(searchedCases.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCases = searchedCases.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="mx-auto">
            <div className="mb-6">
                <h2 className="title">Case Folder</h2>
                <p className="text-sm text-gray-500">Manage all case category here.</p>
            </div>

            {/* Folder Categories */}
            <div className="mt-2 flex flex-wrap gap-4">
                {caseFolders.map((folder) => (
                    <div
                        key={folder}
                        onClick={() => setActiveFolder(folder)}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-2 transition ${
                            activeFolder === folder ? "border-blue-600 bg-blue-900 text-white" : "bg-gray-200 text-black hover:bg-gray-300"
                        } `}
                    >
                        <Folder size={18} />
                        <span>{folder}</span>
                    </div>
                ))}
            </div>

            {/* Search Input */}
            <div className="mt-4">
                <div className="card mb-5 flex flex-col gap-3 overflow-x-auto p-4 shadow-md md:flex-row md:items-center md:gap-x-3">
                    <div className="flex flex-grow items-center gap-2 rounded-md border border-gray-300 px-3 py-2 dark:border-slate-600">
                        <Search
                            size={18}
                            className="text-gray-600 dark:text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search documents by name, type, or case..."
                            className="w-full bg-transparent outline-none dark:text-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Cases Table */}
            <div className="card mb-5 flex flex-col gap-3 overflow-x-auto p-4 shadow-md">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white-100 text-xs uppercase text-gray-600 dark:bg-slate-800 dark:text-gray-300">
                        <tr>
                            <th className="px-4 py-3">Case ID</th>
                            <th className="px-4 py-3">Case Name</th>
                            <th className="px-4 py-3">Case Category</th>
                            <th className="px-4 py-3">Client</th>
                            <th className="px-4 py-3">Date Filed</th>
                            <th className="px-4 py-3">Lawyer</th>
                            <th className="px-4 py-3">View</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-950 dark:text-white">
                        {paginatedCases.length > 0 ? (
                            paginatedCases.map((c) => (
                                <tr
                                    key={c.case_id}
                                    className="border-t border-gray-200 transition hover:bg-blue-600 dark:border-gray-700 dark:hover:bg-blue-950"
                                >
                                    <td className="px-4 py-3">{c.case_id}</td>
                                    <td className="px-4 py-3">{c.ct_name}</td>
                                    <td className="px-4 py-3">{c.cc_name}</td>
                                    <td className="px-4 py-3">{c.client_fullname}</td>
                                    <td className="px-4 py-3">{formatDateTime(c.case_date_created)}</td>
                                    <td className="px-4 py-3">{c.user_id ? `Atty. ${getLawyerFullName(c)}` : "Unassigned"}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => setSelectedCase(c)}
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                                >
                                    No cases found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination and  Back Button */}
            <div className="mt-2 flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-white">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                >
                    <ArrowLeft size={16} />
                    Back to Cases
                </button>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
                        >
                            &lt;
                        </button>

                        <div>
                            Page {currentPage} of {totalPages}
                        </div>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>

            {/* View Case Modal */}
            <ViewModal
                selectedCase={selectedCase}
                tableData={cases}
                setSelectedCase={setSelectedCase}
                onCaseUpdated={fetchCases}
            />
        </div>
    );
};

export default CaseFolder;
