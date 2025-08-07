import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClickOutside } from "@/hooks/use-click-outside";
import ViewModal from "../../components/view-case";

const InitialData = [
    {
        id: 1,
        name: "Davis Incorporation",
        client: "Davis Corp",
        category: "Corporate",
        status: "Pending",
        lawyer: "Sarah Wilson",
        balance: "P 40,000.00",
        fee: "P 50,000.00",
    },
    {
        id: 2,
        name: "Smith vs. Henderson",
        client: "John Smith",
        category: "Property",
        status: "Processing",
        lawyer: "John Cooper",
        balance: "P 0.00",
        fee: "P 10,000.00",
    },
    {
        id: 3,
        name: "Davis Incorporation",
        client: "Davis Corp",
        category: "Corporate",
        status: "Completed",
        lawyer: "Emma Thompson",
        balance: "P 2,500.00",
        fee: "P 12,500.00",
    },
];

const getStatusColor = (status) => {
    switch (status) {
        case "Pending":
            return "text-red-600 font-semibold";
        case "Processing":
            return "text-yellow-500 font-semibold";
        case "Completed":
            return "text-green-600 font-semibold";
        default:
            return "text-gray-500 font-semibold";
    }
};

const Cases = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState(InitialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState(null);
    const addCaseModalRef = useRef();
    const navigate = useNavigate();

    const [newCase, setNewCase] = useState({
        id: "",
        name: "",
        category: "",
        client: "",
        branch: "",
        filedDate: "",
        description: "",
        fee: "",
        status: "Pending",
        lawyer: "Unassigned",
        balance: "P 0.00",
    });

    useClickOutside([addCaseModalRef], () => setIsModalOpen(false));

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsModalOpen(false);
                setSelectedCase(null);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleAddCase = () => {
        const formattedFee = newCase.fee.startsWith("P") ? newCase.fee : `P ${newCase.fee}`;
        const formattedId = parseInt(newCase.id);

        setData((prev) => [
            ...prev,
            {
                ...newCase,
                id: formattedId,
                fee: formattedFee,
            },
        ]);

        setNewCase({
            id: "",
            name: "",
            category: "",
            client: "",
            branch: "",
            filedDate: "",
            description: "",
            fee: "",
            status: "Pending",
            lawyer: "Unassigned",
            balance: "P 0.00",
        });

        setIsModalOpen(false);
        alert("New case has been added successfully!");
    };

    const filteredCases = data.filter((item) => {
        return (
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.client.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div className="mx-auto">
            <div className="mb-6">
                <h2 className="title">Cases</h2>
                <p className="text-sm dark:text-slate-300">Manage all case details here.</p>
            </div>

            {/* Search and Buttons */}
            <div className="card mb-5 flex flex-col gap-3 overflow-x-auto p-4 shadow-md md:flex-row md:items-center md:gap-x-3">
                <input
                    type="text"
                    placeholder="Search by case name, client, or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="focus:ring-0.5 h-10 w-full flex-grow rounded-md border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:outline-none focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:border-blue-600 dark:focus:ring-blue-600"
                />

                <div className="flex flex-shrink-0 gap-2 whitespace-nowrap">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex h-10 items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white shadow hover:bg-green-700"
                    >
                        New Case
                    </button>
                    <button
                        onClick={() => navigate("/clients")}
                        className="flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow hover:bg-blue-700"
                    >
                        View Clients
                    </button>
                </div>
            </div>

            {/* Case Table */}
            <div className="card overflow-x-auto shadow-md">
                <table className="min-w-full table-auto text-left text-sm">
                    <thead className="text-xs uppercase dark:text-slate-300">
                        <tr>
                            <th className="px-4 py-3">Case ID</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Client</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Lawyer</th>
                            <th className="px-4 py-3">Balance</th>
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
                                    <td className="px-4 py-3">C{item.id}</td>
                                    <td className="px-4 py-3">{item.name}</td>
                                    <td className="px-4 py-3">{item.client}</td>
                                    <td className="px-4 py-3">{item.category}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{item.lawyer}</td>
                                    <td className="px-4 py-3">{item.balance}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap items-center gap-1">
                                            <button
                                                className="p-1.5 text-blue-600 hover:text-blue-800"
                                                onClick={() => setSelectedCase(item)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1.5 text-yellow-500 hover:text-yellow-700"
                                                onClick={() => alert(`Editing ${item.name}`)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1.5 text-red-600 hover:text-red-800"
                                                onClick={() => alert(`Deleting ${item.name}`)}
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
                                    colSpan="9"
                                    className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
                                >
                                    No cases found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Case Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div
                        ref={addCaseModalRef}
                        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800"
                    >
                        <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Add New Case</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {[
                                ["Cabinet Number", "id"],
                                ["Case Name", "name"],
                                ["Category", "category"],
                                ["Client", "client"],
                                ["Branch", "branch"],
                                ["Filed Date", "filedDate", "date"],
                                ["Fee", "fee"],
                            ].map(([label, name, type = "text"]) => (
                                <div key={name}>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={newCase[name]}
                                        onChange={(e) => setNewCase({ ...newCase, [name]: e.target.value })}
                                        className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>
                            ))}
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    name="description"
                                    value={newCase.description}
                                    onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                                    className="w-full resize-none rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                                    rows={4}
                                ></textarea>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCase}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Add Case
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Case Modal */}
            <ViewModal
                selectedCase={selectedCase}
                setSelectedCase={setSelectedCase}
            />
        </div>
    );
};

export default Cases;
