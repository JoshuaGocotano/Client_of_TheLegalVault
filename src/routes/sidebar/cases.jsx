import { useState, useRef, useEffect } from "react";
import { Pencil, SquareX, CircleX, Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClickOutside } from "@/hooks/use-click-outside";
import ViewModal from "../../components/view-case";
import { useAuth } from "@/context/auth-context";

const Cases = () => {
    const { user } = useAuth();

    const [search, setSearch] = useState("");
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState(null);
    const addCaseModalRef = useRef();
    const navigate = useNavigate();

    // Fetch cases data from API
    useEffect(() => {
        const fetchCases = async () => {
            try {
                const cases_endpoint = user?.user_role === "Admin" ? "/cases" : `/cases/user/${user?.user_id}`;

                const response = await fetch(`http://localhost:3000/api${cases_endpoint}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch cases");
                }
                const data = await response.json();
                setTableData(data);
            } catch (error) {
                console.error("Error fetching cases:", error);
                setError(error.message + ". You might want to check your server connection.");
            }
        };
        fetchCases();
    }, []);

    // Set default statusFilter to 'Pending' if there are pending cases, else '' (All)
    useEffect(() => {
        if (tableData.some((c) => c.case_status === "Pending")) {
            setStatusFilter("Pending");
        } else {
            setStatusFilter("");
        }
    }, [tableData]);

    const formatDateTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

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

    // get the full name of the (assigned) lawyer
    const getLawyerFullName = (lawyerId) => {
        const lawyer = tableData.find((u) => u.user_id === lawyerId);
        return lawyer
            ? `${lawyer.user_fname || ""} ${lawyer.user_mname ? lawyer.user_mname[0] + "." : ""} ${lawyer.user_lname || ""}`
                  .replace(/\s+/g, " ")
                  .trim()
            : "Unassigned";
    };

    const filteredCases = tableData.filter((cases) => {
        const matchesStatus = statusFilter ? cases.case_status === statusFilter : true;
        const searchLower = search.toLowerCase();
        const matchesSearch =
            cases.case_id.toString().includes(search) ||
            (cases.ct_name && cases.ct_name.toLowerCase().includes(searchLower)) ||
            (cases.client_fullname && cases.client_fullname.toLowerCase().includes(searchLower)) ||
            (cases.case_status && cases.case_status.toLowerCase().includes(searchLower)) ||
            (getLawyerFullName(cases.user_id) && getLawyerFullName(cases.user_id).toLowerCase().includes(searchLower)) ||
            (formatDateTime(cases.case_date_created) && formatDateTime(cases.case_date_created).toLowerCase().includes(searchLower));
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="mx-auto">
            {error && <div className="mb-4 w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-red-50 shadow">{error}</div>}

            <div className="mb-6">
                <h2 className="title">Cases</h2>
                <p className="text-sm dark:text-slate-300">Manage all case details here.</p>
            </div>

            {/* Tabs */}
            <div className="mb-4 flex gap-2">
                {["All", "Pending", "Processing", "Completed", "Dismissed"].map((tab) => {
                    // assign base colors
                    const baseColors = {
                        All: "bg-blue-500 text-white font-semibold",
                        Pending: "bg-yellow-500 text-white font-semibold",
                        Processing: "bg-blue-500 text-white font-semibold",
                        Completed: "bg-green-500 text-white font-semibold",
                        Dismissed: "bg-red-500 text-white font-semibold",
                    };

                    const active = statusFilter === tab || (tab === "All" && statusFilter === "");
                    return (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab === "All" ? "" : tab)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? baseColors[tab] : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-200"}`}
                        >
                            {tab}
                        </button>
                    );
                    white;
                })}
            </div>

            {/* Search and Buttons */}
            <div className="card mb-5 flex flex-col gap-3 overflow-x-auto p-4 shadow-md md:flex-row md:items-center md:gap-x-3">
                <div className="focus:ring-0.5 flex flex-grow items-center gap-2 rounded-md border border-gray-300 bg-transparent px-3 py-2 focus-within:border-blue-600 focus-within:ring-blue-400 dark:border-slate-600 dark:focus-within:border-blue-600">
                    <Search
                        size={18}
                        className="text-gray-600 dark:text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search cases by name, client, date filed, status or lawyer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent text-gray-900 placeholder-gray-500 outline-none dark:text-white dark:placeholder-gray-400"
                    />
                </div>

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
                            <th className="px-4 py-3">Date Filed</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Lawyer</th>
                            <th className="px-4 py-3">Balance</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-950 dark:text-white">
                        {filteredCases.length > 0 ? (
                            filteredCases.map((cases) => (
                                <tr
                                    key={cases.case_id}
                                    className="border-t border-gray-200 transition hover:bg-blue-100 dark:border-gray-700 dark:hover:bg-blue-950"
                                >
                                    <td className="px-4 py-3">{cases.case_id}</td>
                                    <td className="px-4 py-3">{cases.ct_name}</td>
                                    <td className="px-4 py-3">{cases.client_fullname}</td>
                                    <td className="px-4 py-3">{formatDateTime(cases.case_date_created)}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
                                                cases.case_status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300"
                                                    : cases.case_status === "Processing"
                                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300"
                                                      : cases.case_status === "Completed"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300"
                                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300"
                                            }`}
                                        >
                                            {cases.case_status}
                                        </span>
                                    </td>

                                    {cases.user_id ? (
                                        <td className="px-4 py-3">{getLawyerFullName(cases.user_id)}</td>
                                    ) : (
                                        <td className="px-4 py-3 italic text-gray-500">Unassigned</td>
                                    )}

                                    <td className="px-4 py-3">
                                        {cases?.case_balance !== null && cases?.case_balance !== undefined
                                            ? new Intl.NumberFormat("en-PH", {
                                                  style: "currency",
                                                  currency: "PHP",
                                              }).format(Number(cases.case_balance))
                                            : "₱0.00"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap items-center gap-1">
                                            <button
                                                className="p-1.5 text-blue-600 hover:text-blue-800"
                                                onClick={() => setSelectedCase(cases)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1.5 text-yellow-500 hover:text-yellow-700"
                                                onClick={() => alert(`Editing ${cases.ct_name} of ${cases.client_fullname}`)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1.5 text-red-600 hover:text-red-800"
                                                onClick={() => alert(`Dismissing the case of ${cases.client_fullname}`)}
                                            >
                                                <SquareX className="h-4 w-4" />
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
                tableData={tableData}
                setSelectedCase={setSelectedCase}
            />
        </div>
    );
};

export default Cases;
