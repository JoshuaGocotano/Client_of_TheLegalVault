import { useState, useEffect, use } from "react";
import { Eye, Trash2, Search } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";

export const Payments = () => {
    const { user } = useAuth();
    const [error, setError] = useState("");
    const [paymentsData, setPaymentsData] = useState([]);

    // Helpers
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount);

    const formatDateTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    // fetching here the payments
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/payments", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch payments");
                }

                const data = await response.json();
                setPaymentsData(data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch payments. Please try again later.");
            }
        };

        fetchPayments();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [paymentTypeFilter, setPaymentTypeFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewPayment, setViewPayment] = useState(null);
    const [addPayment, setAddPayment] = useState(null);

    const rowsPerPage = 10;

    const filteredPayments = paymentsData.filter((p) => {
        const matchesSearch =
            p.payment_id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.client_fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.ct_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.payment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formatDateTime(p.payment_date).toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPaymentType = paymentTypeFilter === "All" || p.payment_type === paymentTypeFilter;

        return matchesSearch && matchesPaymentType;
    });

    // Pagination
    const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);
    const paginatedPayments = filteredPayments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleDeletePayment = (payment) => {
        const toastId = toast.loading("Deleting payment...", { duration: 4000 });

        if (window.confirm(`Are you sure you want to delete payment ID ${payment.payment_id}? This action cannot be undone.`)) {
            try {
                fetch(`http://localhost:3000/api/payments/${payment.payment_id}`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then((res) => {
                    if (!res.ok) {
                        throw new Error("Failed to delete payment");
                    }
                });

                setPaymentsData((prev) => prev.filter((p) => p.payment_id !== payment.payment_id));
                toast.success("Payment deleted successfully!", { id: toastId, duration: 4000 });
            } catch (err) {
                console.error(err);
                setError("Failed to delete payment. Please try again later.");
                toast.error("Failed to delete payment.", { id: toastId, duration: 4000 });
                return;
            }
        }
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
            <div className="card mb-6 flex flex-col items-center gap-3 rounded-lg bg-white p-4 shadow-md dark:bg-slate-800 md:flex-row">
                <div className="focus:ring-0.5 flex flex-grow items-center gap-2 rounded-md border border-gray-300 bg-transparent px-3 py-2 focus-within:border-blue-600 focus-within:ring-blue-400 dark:border-slate-600 dark:focus-within:border-blue-600">
                    <Search
                        size={18}
                        className="text-gray-600 dark:text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search payments by client, case or date..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent text-gray-900 placeholder-gray-500 outline-none dark:text-white dark:placeholder-gray-400"
                    />
                </div>

                <select
                    value={paymentTypeFilter}
                    onChange={(e) => setPaymentTypeFilter(e.target.value)}
                    className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 outline-none focus:border-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-600"
                >
                    <option value="All">All Types</option>
                    <option value="Check">Cheque</option>
                    <option value="Cash">Cash</option>
                </select>
                <button
                    onClick={() => setAddPayment(true)}
                    className="flex h-10 items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white shadow hover:bg-green-700"
                >
                    Add Payment
                </button>
            </div>

            {/* Payments Table */}
            <div className="card w-full overflow-x-auto">
                <div className="overflow-y-auto">
                    <table className="min-w-full table-auto text-left text-sm">
                        <thead className="card-title z-100 sticky top-0 bg-white text-xs uppercase dark:bg-slate-900">
                            <tr>
                                <th className="px-4 py-3">Payment ID</th>
                                <th className="px-4 py-3">Client</th>
                                <th className="px-4 py-3">Case</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Payment Type</th>
                                <th className="px-4 py-3">Added By</th>
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
                                        <td className="px-4 py-3 font-medium">{p.payment_id}</td>
                                        <td className="px-4 py-3 font-medium">{p.client_fullname}</td>
                                        <td
                                            className="max-w-xs truncate px-4 py-3"
                                            title={p.ct_name}
                                        >
                                            {p.ct_name}
                                        </td>
                                        <td className="px-4 py-3 font-bold text-green-600 dark:text-green-400">{formatCurrency(p.payment_amount)}</td>
                                        <td className="px-4 py-3">{formatDateTime(p.payment_date)}</td>
                                        <td className="px-4 py-3">{p.payment_type}</td>
                                        <td className="px-4 py-3">{p.user_fname}</td>
                                        <td className="it px-4 py-3">
                                            <button
                                                className="p-1.5 text-blue-600 hover:text-blue-800"
                                                onClick={() => setViewPayment(p)}
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                className="p-1.5 text-red-600 hover:text-red-800"
                                                onClick={() => handleDeletePayment(p)}
                                                title="Delete Payment"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
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
                        <div className="grid grid-cols-1 gap-4 text-sm text-blue-900 sm:grid-cols-2">
                            <div>
                                <p className="font-semibold dark:text-blue-700">Payment ID</p>
                                <p className="text-gray-600 dark:text-slate-200">{viewPayment.payment_id}</p>
                            </div>
                            <div>
                                <p className="font-semibold dark:text-blue-700">Client</p>
                                <p className="text-gray-600 dark:text-slate-200">{viewPayment.client_fullname}</p>
                            </div>
                            <div>
                                <p className="font-semibold dark:text-blue-700">Case</p>
                                <p className="text-gray-600 dark:text-slate-200">{viewPayment.ct_name}</p>
                            </div>
                            <div>
                                <p className="font-semibold dark:text-blue-700">Amount</p>
                                <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(viewPayment.payment_amount)}</p>
                            </div>
                            <div>
                                <p className="font-semibold dark:text-blue-700">Date</p>
                                <p className="text-gray-600 dark:text-slate-200">{formatDateTime(viewPayment.payment_date)}</p>
                            </div>
                            <div>
                                <p className="font-semibold dark:text-blue-700">Payment Type</p>
                                <p className="text-gray-600 dark:text-slate-200">{viewPayment.payment_type}</p>
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

            {/* Add Payment Modal */}
            {addPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
                        <h3 className="mb-6 text-xl font-bold text-blue-900 dark:text-slate-200">Add Payment</h3>
                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                            <div>
                                <label className="font-semibold">Client</label>
                                <input
                                    type="text"
                                    value={addPayment.client}
                                    onChange={(e) => setAddPayment({ ...addPayment, client: e.target.value })}
                                    className="w-full rounded-md border px-3 py-2 dark:bg-slate-700 dark:text-slate-50"
                                />
                            </div>
                            <div>
                                <label className="font-semibold">Case</label>
                                <input
                                    type="text"
                                    value={addPayment.case}
                                    onChange={(e) => setAddPayment({ ...addPayment, case: e.target.value })}
                                    className="w-full rounded-md border px-3 py-2 dark:bg-slate-700 dark:text-slate-50"
                                />
                            </div>
                            <div>
                                <label className="font-semibold">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={addPayment.paid_amount}
                                    onChange={(e) =>
                                        setAddPayment({
                                            ...addPayment,
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
                                    value={addPayment.date}
                                    onChange={(e) => setAddPayment({ ...addPayment, date: e.target.value })}
                                    className="w-full rounded-md border px-3 py-2 dark:bg-slate-700 dark:text-slate-50"
                                />
                            </div>
                            <div>
                                <label className="font-semibold">Payment Type</label>
                                <select
                                    value={addPayment.payment_type}
                                    onChange={(e) => setAddPayment({ ...addPayment, payment_type: e.target.value })}
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
                                    value={addPayment.status}
                                    onChange={(e) => setAddPayment({ ...addPayment, status: e.target.value })}
                                    className="w-full rounded-md border px-3 py-2 dark:bg-slate-700 dark:text-slate-50"
                                >
                                    <option value="Completed">Completed</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setAddPayment(null)}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setPaymentsData((prev) => prev.map((p) => (p.payment_id === addPayment.payment_id ? addPayment : p)));
                                    setAddPayment(null);
                                    toast.success("Payment added successfully!");
                                }}
                                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                            >
                                Add Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
