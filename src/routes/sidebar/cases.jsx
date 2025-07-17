import { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InitialData = [
    {
        id: 1,
        name: "Davis Incorporation",
        client: "Davis Corp",
        category: "Corporate",
        status: "Pending",
        lawyer: "Sarah Wilson",
        balance: "P 35,000.00",
        fee: "P 50,000.00",
    },
    {
        id: 2,
        name: "Smith vs. Henderson",
        client: "John Smith",
        category: "Property",
        status: "Processing",
        lawyer: "John Cooper",
        balance: "P 7,000.00",
        fee: "P 10,000.00",
    },
    {
        id: 3,
        name: "Davis Incorporation",
        client: "Davis Corp",
        category: "Corporate",
        status: "Completed",
        lawyer: "Emma Thompson",
        balance: "P 12,500.00",
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
    const [data, setData] = useState(InitialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    const navigate = useNavigate();

    const handleAddCase = () => {
        const formattedFee = newCase.fee.startsWith("P") ? newCase.fee : `P ${newCase.fee}`;
        setData([...data, { ...newCase, id: parseInt(newCase.id), fee: formattedFee }]);
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

    return (
        <div className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-900 md:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">Cases</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Manage all case details here...</p>
                </div>
            </div>

            <div className="mb-6 flex justify-end gap-3">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700"
                >
                    + Add New Case
                </button>
                <button
                    onClick={() => navigate("/clients")}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                >
                    View Clients
                </button>
            </div>

            <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full table-auto text-left text-sm">
                    <thead className="text-xs uppercase dark:text-white">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-3">Case ID</th>
                            <th className="whitespace-nowrap px-4 py-3">Name</th>
                            <th className="whitespace-nowrap px-4 py-3">Client</th>
                            <th className="whitespace-nowrap px-4 py-3">Category</th>
                            <th className="whitespace-nowrap px-4 py-3">Status</th>
                            <th className="whitespace-nowrap px-4 py-3">Lawyer</th>
                            <th className="whitespace-nowrap px-4 py-3">Fee</th>
                            <th className="whitespace-nowrap px-4 py-3">Balance</th>
                            <th className="whitespace-nowrap px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-white">
                        {data.map((item) => (
                            <tr
                                key={item.id}
                                className="border-t border-gray-200 transition hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-slate-800"
                            >
                                <td className="whitespace-nowrap px-4 py-3">{item.id}</td>
                                <td className="whitespace-nowrap px-4 py-3">{item.name}</td>
                                <td className="whitespace-nowrap px-4 py-3">{item.client}</td>
                                <td className="whitespace-nowrap px-4 py-3">{item.category}</td>
                                <td className="px-4 py-3">
                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">{item.lawyer}</td>
                                <td className="whitespace-nowrap px-4 py-3">{item.fee}</td>
                                <td className="whitespace-nowrap px-4 py-3">{item.balance}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            className="p-1.5 text-blue-600 hover:text-blue-800"
                                            onClick={() => alert(`Viewing ${item.name}`)}
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
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
                        <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Add New Case</h3>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {[
                                ["Cabinet Number", "CabinetNum"],
                                ["Drawer Number", "DrawerNum"],
                                ["Folder Number", "FolderNum"],
                                ["Case Name", "name"],
                                ["Case Category", "category"],
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
        </div>
    );
};

export default Cases;
