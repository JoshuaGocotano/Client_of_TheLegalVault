import { useState } from "react";
import { Eye } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";

export const Payments = () => {
    const { user } = useAuth();
    const [error, setError] = useState("");

    // Sample payment data
    const [paymentsData, setPaymentsData] = useState([
        {
            payment_id: 1,
            client: "John Doe Corporation",
            case: "Contract Dispute #2024-001",
            paid_amount: 15000.0,
            date: "2024-08-15",
            payment_type: "Cash",
            status: "Completed",
            payment_method: "Wire Transfer",
            reference_number: "PAY-2024-001",
        },
        {
            payment_id: 2,
            client: "Sarah Johnson",
            case: "Personal Injury Case #2024-002",
            paid_amount: 8500.5,
            date: "2024-08-12",
            payment_type: "Credit Card",
            status: "Completed",
            payment_method: "Visa",
            reference_number: "PAY-2024-002",
        },
        {
            payment_id: 3,
            client: "TechStart Industries",
            case: "Intellectual Property #2024-003",
            paid_amount: 25000.0,
            date: "2024-08-10",
            payment_type: "Check",
            status: "Pending",
            payment_method: "Business Check",
            reference_number: "PAY-2024-003",
        },
        {
            payment_id: 4,
            client: "Maria Garcia",
            case: "Family Law Case #2024-004",
            paid_amount: 3200.0,
            date: "2024-08-08",
            payment_type: "Cash",
            status: "Completed",
            payment_method: "Cash Payment",
            reference_number: "PAY-2024-004",
        },
        {
            payment_id: 5,
            client: "Global Manufacturing Co.",
            case: "Corporate Litigation #2024-005",
            paid_amount: 45000.0,
            date: "2024-08-05",
            payment_type: "Cash Payment",
            status: "Completed",
            payment_method: "ACH Transfer",
            reference_number: "PAY-2024-005",
        },
        {
            payment_id: 6,
            client: "Robert Chen",
            case: "Real Estate Transaction #2024-006",
            paid_amount: 7800.75,
            date: "2024-08-03",
            payment_type: "Check",
            status: "Pending",
            payment_method: "MasterCard",
            reference_number: "PAY-2024-006",
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [paymentTypeFilter, setPaymentTypeFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewPayment, setViewPayment] = useState(null);
    const [editPayment, setEditPayment] = useState(null);

    const rowsPerPage = 10;

    // Filter + Search
    const filteredPayments = paymentsData.filter((p) => {
        const matchesSearch =
            p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.case.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.payment_type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPaymentType = paymentTypeFilter === "All" || p.payment_type === paymentTypeFilter;

        return matchesSearch && matchesPaymentType;
    });

    // Pagination
    const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);
    const paginatedPayments = filteredPayments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Helpers
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount);

    const getStatusBadge = (status) => {
        const styles = {
            Completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        };
        return styles[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    };

    return (
        <div className="bg-blue rounded-xl">
            {error && <div className="mb-4 w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-red-50 shadow">{error}</div>}
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="title">Payments</h1>
                    <p className="text-sm text-gray-500">Track and manage all payment records.</p>
                </div>
            </div>

            {/* Search + Filters */}
            <div className="card mb-6 flex flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-slate-800 md:flex-row">
                <input
                    type="text"
                    placeholder="Search by client, case, or reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 placeholder-gray-500 outline-none focus:border-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-600 md:flex-1"
                />

                <select
                    value={paymentTypeFilter}
                    onChange={(e) => setPaymentTypeFilter(e.target.value)}
                    className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 outline-none focus:border-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-600"
                >
                    <option value="All">All Types</option>
                    <option value="Check">Check</option>
                    <option value="Cash">Cash</option>
                </select>
            </div>

            {/* Payments Table */}
            <div className="card w-full overflow-x-auto">
                <div className="h-[600px] overflow-y-auto">
                    <table className="min-w-full table-auto text-left text-sm">
                        <thead className="card-title z-100 sticky top-0 bg-white text-xs uppercase dark:bg-slate-900">
                            <tr>
                                <th className="px-4 py-3">Client</th>
                                <th className="px-4 py-3">Case</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Payment Type</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 dark:text-white">
                            {paginatedPayments.length > 0 ? (
                                paginatedPayments.map((p) => (
                                    <tr
                                        key={p.payment_id}
                                        className="border-t border-gray-200 transition hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-slate-800"
                                    >
                                        <td className="px-4 py-3 font-medium">{p.client}</td>
                                        <td
                                            className="max-w-xs truncate px-4 py-3"
                                            title={p.case}
                                        >
                                            {p.case}
                                        </td>
                                        <td className="px-4 py-3 font-bold text-green-600 dark:text-green-400">{formatCurrency(p.paid_amount)}</td>
                                        <td className="px-4 py-3">{new Date(p.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">{p.payment_type}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                className="p-1.5 text-blue-600 hover:text-blue-800"
                                                onClick={() => setViewPayment(p)}
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
                                    >
                                        No payments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-2 flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-white">
                    <div>
                        Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredPayments.length)} of{" "}
                        {filteredPayments.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                        >
                            &lt;
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {viewPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
                        <h3 className="mb-6 text-xl font-bold text-blue-900 dark:text-slate-200">Payment Details</h3>
                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                            <div>
                                <p className="font-semibold text-gray-600 dark:text-blue-700">Reference Number</p>
                                <p className="dark:text-slate-200">{viewPayment.reference_number}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 dark:text-blue-700">Status</p>
                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(viewPayment.status)}`}>
                                    {viewPayment.status}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 dark:text-blue-700">Client</p>
                                <p className="dark:text-slate-200">{viewPayment.client}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 dark:text-blue-700">Case</p>
                                <p className="dark:text-slate-200">{viewPayment.case}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 dark:text-blue-700">Amount</p>
                                <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(viewPayment.paid_amount)}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 dark:text-blue-700">Date</p>
                                <p className="dark:text-slate-200">{new Date(viewPayment.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 dark:text-blue-700">Payment Type</p>
                                <p className="dark:text-slate-200">{viewPayment.payment_type}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 dark:text-blue-700">Payment Method</p>
                                <p className="dark:text-slate-200">{viewPayment.payment_method}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setViewPayment(null)}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
                        <h3 className="mb-6 text-xl font-bold text-blue-900 dark:text-slate-200">Edit Payment</h3>
                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                            <div>
                                <label className="font-semibold">Client</label>
                                <input
                                    type="text"
                                    value={editPayment.client}
                                    onChange={(e) => setEditPayment({ ...editPayment, client: e.target.value })}
                                    className="w-full rounded-md border px-3 py-2 dark:bg-slate-700 dark:text-slate-50"
                                />
                            </div>
                            <div>
                                <label className="font-semibold">Case</label>
                                <input
                                    type="text"
                                    value={editPayment.case}
                                    onChange={(e) => setEditPayment({ ...editPayment, case: e.target.value })}
                                    className="w-full rounded-md border px-3 py-2 dark:bg-slate-700 dark:text-slate-50"
                                />
                            </div>
                            <div>
                                <label className="font-semibold">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editPayment.paid_amount}
                                    onChange={(e) =>
                                        setEditPayment({
                                            ...editPayment,
                                            paid_amount: parseFloat(e.target.value),
                                        })
                                    }
                                    className="w-full rounded-md border px-3 py-2 dark:bg-slate-700 dark:text-slate-50"
                                />
                            </div>
                            <div>
                                <label className="font-semibold">Date</label>
                                <input
                                    type="date"
                                    value={editPayment.date}
                                    onChange={(e) => setEditPayment({ ...editPayment, date: e.target.value })}
                                    className="w-full rounded-md border px-3 py-2 dark:bg-slate-700 dark:text-slate-50"
                                />
                            </div>
                            <div>
                                <label className="font-semibold">Payment Type</label>
                                <select
                                    value={editPayment.payment_type}
                                    onChange={(e) => setEditPayment({ ...editPayment, payment_type: e.target.value })}
                                    className="w-full rounded-md border px-3 py-2 dark:bg-slate-700 dark:text-slate-50"
                                >
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Check">Check</option>
                                    <option value="Cash">Cash</option>
                                </select>
                            </div>
                            <div>
                                <label className="font-semibold">Status</label>
                                <select
                                    value={editPayment.status}
                                    onChange={(e) => setEditPayment({ ...editPayment, status: e.target.value })}
                                    className="w-full rounded-md border px-3 py-2 dark:bg-slate-700 dark:text-slate-50"
                                >
                                    <option value="Completed">Completed</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setEditPayment(null)}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setPaymentsData((prev) => prev.map((p) => (p.payment_id === editPayment.payment_id ? editPayment : p)));
                                    setEditPayment(null);
                                    toast.success("Payment updated successfully!");
                                }}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
