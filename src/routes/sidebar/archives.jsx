import { useState, useRef } from "react";
import { Filter, X } from "lucide-react";
import Cases from "./cases";
import { useClickOutside } from "@/hooks/use-click-outside";

const initialCases = [
    {
        id: "C54321",
        name: "Davis Incorporation",
        client: "Davis Corp",
        dateFiled: "11/5/2022",
        archivedDate: "11/5/2022",
    },
    {
        id: "A12345",
        name: "Smith vs. Henderson",
        client: "John Smith",
        dateFiled: "1/15/2023",
        archivedDate: "N/A",
    },
    {
        id: "B67890",
        name: "Wilson Property Dispute",
        client: "Emily Wilson",
        dateFiled: "2/28/2023",
        archivedDate: "N/A",
    },
];

const Archives = () => {
    const [search, setSearch] = useState("");
    const [cases, setCases] = useState(initialCases);
    const [viewCaseData, setViewCaseData] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [clientFilter, setClientFilter] = useState("");
    const [archivedDateFilter, setArchivedDateFilter] = useState("");

    const viewModalRef = useRef();
    const filterModalRef = useRef();

    // Handle clicks outside both modals
    useClickOutside([viewModalRef, filterModalRef], () => {
        if (viewCaseData) setViewCaseData(null);
        if (isFilterOpen) setIsFilterOpen(false);
    });

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
        <div className="min-h-screen p-6 text-gray-800">
            <h1 className="mb-1 text-2xl font-bold dark:text-white">Archives</h1>
            <p className="mb-6 text-sm text-gray-600">Browse and search completed and archived cases</p>

            <div className="card mb-6 flex flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-lg dark:bg-slate-800 md:flex-row">
                <input
                    type="text"
                    placeholder="Search archives..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 placeholder-gray-500 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 md:flex-1"
                />

                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <Filter size={18} />
                    Filter
                </button>
            </div>

            <div className="card overflow-x-auto rounded-lg bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Archived Cases</h2>
                <table className="w-full text-left text-sm text-gray-700">
                    <thead className="border-b text-xs uppercase dark:text-white">
                        <tr>
                            <th className="px-4 py-3">Case Number</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Client</th>
                            <th className="px-4 py-3">Date Filed</th>
                            <th className="px-4 py-3">Archived Date</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCases.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b hover:bg-blue-500 dark:text-white"
                            >
                                <td className="px-4 py-2">{item.id}</td>
                                <td className="px-4 py-2">{item.name}</td>
                                <td className="px-4 py-2">{item.client}</td>
                                <td className="px-4 py-2">{item.dateFiled}</td>
                                <td className="px-4 py-2">{item.archivedDate}</td>
                                <td className="space-x-2 px-4 py-2 font-medium text-blue-600">
                                    <button
                                        onClick={() => setViewCaseData(item)}
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
                        ))}
                    </tbody>
                </table>
            </div>

            {viewCaseData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-40">
                    <div ref={viewModalRef}>
                        <Cases />
                    </div>
                </div>
            )}

            {isFilterOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div
                        ref={filterModalRef}
                        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Filter Archives</h2>
                            <X
                                className="cursor-pointer"
                                onClick={() => setIsFilterOpen(false)}
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Client</label>
                                <input
                                    type="text"
                                    value={clientFilter}
                                    onChange={(e) => setClientFilter(e.target.value)}
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    placeholder="Enter client name"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Archived Date</label>
                                <input
                                    type="text"
                                    value={archivedDateFilter}
                                    onChange={(e) => setArchivedDateFilter(e.target.value)}
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    placeholder="e.g. 11/5/2022 or N/A"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                                    onClick={() => {
                                        setClientFilter("");
                                        setArchivedDateFilter("");
                                        setIsFilterOpen(false);
                                    }}
                                >
                                    Clear
                                </button>
                                <button
                                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                    onClick={() => setIsFilterOpen(false)}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Archives;
