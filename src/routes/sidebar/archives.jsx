import { useState, useRef } from "react";
import { Filter, X } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import ViewModal from "../../components/view-case";

const initialCases = [
    {
        id: "C54321",
        name: "Davis Incorporation",
        client: "Davis Corp",
        dateFiled: "11/5/2022",
        archivedDate: "11/5/2022",
        category: "Corporate",
        lawyer: "Mark Reyes",
        fee: "₱20,000.00",
        balance: "₱10,000.00",
        status: "Closed",
        description: "Corporate filing case from 2022.",
    },
    {
        id: "A12345",
        name: "Smith vs. Henderson",
        client: "John Smith",
        dateFiled: "1/15/2023",
        archivedDate: "N/A",
        category: "Civil",
        lawyer: "Anna Cruz",
        fee: "₱50,000.00",
        balance: "₱30,000.00",
        status: "For Review",
        description: "Civil case involving property dispute.",
    },
    {
        id: "B67890",
        name: "Wilson Property Dispute",
        client: "Emily Wilson",
        dateFiled: "2/28/2023",
        archivedDate: "N/A",
        category: "Real Estate",
        lawyer: "James Tan",
        fee: "₱35,000.00",
        balance: "₱5,000.00",
        status: "Pending",
        description: "Dispute over residential land ownership.",
    },
];

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case "closed":
            return "text-green-600";
        case "pending":
            return "text-yellow-600";
        case "for review":
            return "text-blue-600";
        default:
            return "text-gray-600";
    }
};

const Archives = () => {
    const [search, setSearch] = useState("");
    const [cases, setCases] = useState(initialCases);
    const [selectedCase, setSelectedCase] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [clientFilter, setClientFilter] = useState("");
    const [archivedDateFilter, setArchivedDateFilter] = useState("");

    const filterModalRef = useRef();

    useClickOutside([filterModalRef], () => setIsFilterOpen(false));

    const handleUnarchive = (id) => {
        setCases((prev) => prev.filter((item) => item.id !== id));
    };

    const filteredCases = cases.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesClient = clientFilter ? item.client.toLowerCase().includes(clientFilter.toLowerCase()) : true;
        const matchesArchivedDate = archivedDateFilter ? item.archivedDate.toLowerCase().includes(archivedDateFilter.toLowerCase()) : true;
        return matchesSearch && matchesClient && matchesArchivedDate;
    });

    return (
        <div className="mx-auto">
            <div className="mb-6">
                <h2 className="title">Archives</h2>
                <p className="text-sm dark:text-slate-300">Browse and search completed and archived cases</p>
            </div>

            {/* Search and Filter */}
            <div className="card mb-5 flex flex-col gap-3 overflow-x-auto p-4 shadow-md md:flex-row md:items-center md:gap-x-3">
                <input
                    type="text"
                    placeholder="Search archives..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="focus:ring-0.5 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:border-blue-600 dark:focus:ring-blue-600"
                />
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <Filter size={18} />
                    Filter
                </button>
            </div>

            {/* Table */}
            <div className="card overflow-x-auto shadow-md">
                <table className="min-w-full table-auto text-left text-sm">
                    <thead className="text-xs uppercase dark:text-slate-300">
                        <tr>
                            <th className="px-4 py-3">Case Number</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Client</th>
                            <th className="px-4 py-3">Date Filed</th>
                            <th className="px-4 py-3">Archived Date</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-950 dark:text-white">
                        {filteredCases.length > 0 ? (
                            filteredCases.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-t border-gray-200 transition hover:bg-blue-100 dark:border-gray-700 dark:hover:bg-blue-950"
                                >
                                    <td className="px-4 py-3">{item.id}</td>
                                    <td className="px-4 py-3">{item.name}</td>
                                    <td className="px-4 py-3">{item.client}</td>
                                    <td className="px-4 py-3">{item.dateFiled}</td>
                                    <td className="px-4 py-3">{item.archivedDate}</td>
                                    <td className="space-x-2 px-4 py-3 text-blue-600">
                                        <button
                                            onClick={() => setSelectedCase(item)}
                                            className="hover:underline"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleUnarchive(item.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Unarchive
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
                                >
                                    No archived cases found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Filter Modal */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div
                        ref={filterModalRef}
                        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Archives</h2>
                            <X
                                className="cursor-pointer text-slate-500 hover:text-slate-800 dark:text-slate-300"
                                onClick={() => setIsFilterOpen(false)}
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
                                <input
                                    type="text"
                                    value={clientFilter}
                                    onChange={(e) => setClientFilter(e.target.value)}
                                    className="w-full rounded border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    placeholder="Enter client name"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Archived Date</label>
                                <input
                                    type="text"
                                    value={archivedDateFilter}
                                    onChange={(e) => setArchivedDateFilter(e.target.value)}
                                    className="w-full rounded border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    placeholder="e.g. 11/5/2022 or N/A"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    onClick={() => {
                                        setClientFilter("");
                                        setArchivedDateFilter("");
                                        setIsFilterOpen(false);
                                    }}
                                    className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ViewModal
                selectedCase={selectedCase}
                setSelectedCase={setSelectedCase}
            />
        </div>
    );
};

export default Archives;
