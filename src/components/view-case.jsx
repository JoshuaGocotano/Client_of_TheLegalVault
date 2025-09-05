import { useRef, useState, useEffect } from "react";
import { X, MapPin, ArrowLeft, Trash2, XCircle, CheckCircle } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useAuth } from "@/context/auth-context";

const ViewModal = ({ selectedCase, setSelectedCase, tableData }) => {
    const { user } = useAuth();

    const modalRef = useRef(null);
    const fileInputRef = useRef(null);

    const [showPayments, setShowPayments] = useState(false);
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);

    // Fetching payments
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/payments/case/${selectedCase.case_id}`);
                const data = await res.json();
                if (res.ok) {
                    setPayments(data);
                } else {
                    console.error("Failed to fetch payments:", data.error);
                }
            } catch (error) {
                console.error("Error fetching payments:", error);
            }
        };

        if (showPayments && selectedCase) {
            fetchPayments();
        }
    }, [showPayments, selectedCase]);

    // Fetching users for knowing who assigned the lawyer
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/users", { method: "GET", credentials: "include" });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch users.");
                } else {
                    setUsers(data);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    // Function to get the name of the user who assigned the lawyer
    const getAssignerName = (assignedById) => {
        const assigner = users.find((u) => u.user_id === assignedById);
        return assigner
            ? `Atty. ${assigner.user_fname} ${assigner.user_mname ? assigner.user_mname[0] + "." : ""} ${assigner.user_lname}`
            : "Unknown";
    };

    useClickOutside([modalRef], () => {
        setSelectedCase(null);
        setShowPayments(false);
    });

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            alert(`You selected file: ${file.name}`);
        }
    };

    if (!selectedCase) return null;

    const getLawyerFullName = (lawyerId) => {
        const lawyer = tableData.find((u) => u.user_id === lawyerId);
        return lawyer
            ? `${lawyer.user_fname || ""} ${lawyer.user_mname ? lawyer.user_mname[0] + "." : ""} ${lawyer.user_lname || ""}`
                  .replace(/\s+/g, " ")
                  .trim()
            : "Unassigned";
    };

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

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                ref={modalRef}
                className="relative max-h-[90vh] w-[90%] max-w-6xl overflow-y-auto rounded-xl bg-white p-6 text-black shadow-xl dark:bg-slate-900 dark:text-white"
            >
                <button
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    onClick={() => setSelectedCase(null)}
                >
                    <X className="btn-ghost h-8 w-8" />
                </button>

                {!showPayments ? (
                    <>
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    Case {selectedCase.case_id}
                                    {/* {" "}
                                    {selectedCase.case_verdict && selectedCase.case_status === "Completed" && (
                                        <span className="rounded-full bg-green-600 px-2 text-sm font-medium text-white">
                                            {selectedCase.case_verdict}
                                        </span>
                                    )} */}
                                </h2>
                                <div className="mt-1 flex gap-4 text-sm text-gray-600 dark:text-gray-300">
                                    <span>Cabinet #: {selectedCase.case_cabinet}</span>
                                    {selectedCase.case_drawer && <span>Drawer #: {selectedCase.case_drawer}</span>}
                                </div>
                            </div>
                            <div className="mr-7 flex items-center gap-1 text-sm text-slate-500">
                                <MapPin
                                    size={20}
                                    strokeWidth={2}
                                    className="text-red-400 dark:text-red-700"
                                />
                                <span>{selectedCase.branch_name}</span>
                            </div>
                        </div>

                        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                                <div>
                                    <label className="text-sm font-semibold">Case Name</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={selectedCase.ct_name}
                                        className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">Category</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={selectedCase.cc_name}
                                        className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">Client</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={selectedCase.client_fullname}
                                        className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">Lawyer</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={selectedCase.user_id ? `Atty. ${getLawyerFullName(selectedCase.user_id)}` : "Unassigned"}
                                        className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-slate-800"
                                    />
                                    {selectedCase.assigned_by && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            {selectedCase.user_id
                                                ? `Assigned by: ${getAssignerName(selectedCase.assigned_by)}`
                                                : `Created by: ${getAssignerName(selectedCase.assigned_by)}`}
                                        </p>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-semibold">Description / Remarks</label>
                                    <textarea
                                        value={selectedCase.case_remarks || ""}
                                        readOnly
                                        className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-slate-800"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-lg border bg-gray-50 p-4 dark:bg-slate-800">
                                    <h4 className="mb-2 text-sm font-semibold">Payment</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span>Total Fee</span>
                                            <span className="font-semibold">
                                                {selectedCase?.case_fee !== null && selectedCase?.case_fee !== undefined
                                                    ? new Intl.NumberFormat("en-PH", {
                                                          style: "currency",
                                                          currency: "PHP",
                                                      }).format(Number(selectedCase.case_fee))
                                                    : "₱0.00"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Paid</span>
                                            <span>
                                                -{" "}
                                                {new Intl.NumberFormat("en-PH", {
                                                    style: "currency",
                                                    currency: "PHP",
                                                }).format(Number(selectedCase.case_fee - selectedCase.case_balance))}
                                            </span>
                                        </div>
                                        <hr className="my-1 border-gray-300 dark:border-gray-600" />
                                        <div className="flex justify-between font-semibold">
                                            <span>Remaining</span>
                                            <span>
                                                {selectedCase?.case_balance !== null && selectedCase?.case_balance !== undefined
                                                    ? new Intl.NumberFormat("en-PH", {
                                                          style: "currency",
                                                          currency: "PHP",
                                                      }).format(Number(selectedCase.case_balance))
                                                    : "₱0.00"}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowPayments(!showPayments)}
                                        className="mt-3 w-full rounded-lg bg-green-600 py-2 text-sm text-white hover:bg-green-700"
                                    >
                                        View Payment Record
                                    </button>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                    <p>
                                        <strong>Date Filed:</strong>
                                        <span className="ml-2 text-slate-500">{formatDateTime(selectedCase.case_date_created)}</span>
                                    </p>

                                    {selectedCase.case_last_updated && (
                                        <p>
                                            <strong>Last Updated:</strong>
                                            <span className="ml-2 text-slate-500">{formatDateTime(selectedCase.case_last_updated)}</span>
                                        </p>
                                    )}

                                    <p>
                                        <strong>Status:</strong>{" "}
                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
                                                selectedCase.case_status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300"
                                                    : selectedCase.case_status === "Processing"
                                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300"
                                                      : selectedCase.case_status === "Completed"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300"
                                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300"
                                            }`}
                                        >
                                            {selectedCase.case_status}
                                        </span>
                                        {/* Case Verdict */}
                                        {selectedCase.case_verdict && selectedCase.case_status === "Completed" && (
                                            <>
                                                <span> -</span>
                                                <span className="ml-2 font-semibold underline">{selectedCase.case_verdict}</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 overflow-x-auto rounded-lg border">
                            <div className="flex items-center justify-between p-4">
                                <h3 className="text-sm font-semibold">Documents</h3>

                                {selectedCase.case_status === "Processing" && (
                                    <div className="flex gap-2">
                                        <button className="rounded border border-blue-600 px-4 py-1.5 text-sm text-blue-600 hover:bg-blue-700 hover:text-white">
                                            Add Task Document
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current.click()}
                                            className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
                                        >
                                            Add Document
                                        </button>
                                        <button className="rounded bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-700">Clear</button>
                                    </div>
                                )}
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-gray-200 text-left dark:bg-slate-700">
                                    <tr>
                                        <th className="px-4 py-2">ID</th>
                                        <th className="px-4 py-2">Name</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">File</th>
                                        <th className="px-4 py-2">Uploaded By</th>
                                        <th className="px-4 py-2">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="text-gray-700 dark:text-white">
                                    {[
                                        { id: "D123", name: "Affidavit", status: "For Approval", file: "affidavit.pdf", uploader: "Joshua Go" },
                                        { id: "D124", name: "Pleadings", status: "Approved", file: "pleadings.pdf", uploader: "Noel Glow" },
                                        {
                                            id: "D125",
                                            name: "Special Proceedings",
                                            status: "Approved",
                                            file: "proceedings.pdf",
                                            uploader: "Joseph Grow",
                                        },
                                    ].map((doc) => (
                                        <tr
                                            key={doc.id}
                                            className="border-t border-gray-200 dark:border-gray-700"
                                        >
                                            <td className="px-4 py-2">{doc.id}</td>
                                            <td className="px-4 py-2">{doc.name}</td>
                                            <td className="px-4 py-2">{doc.status}</td>
                                            <td className="cursor-pointer px-4 py-2 text-blue-600 underline">{doc.file}</td>
                                            <td className="px-4 py-2">{doc.uploader}</td>
                                            <td className="space-x-2 px-4 py-2">
                                                <button className="text-blue-600 hover:underline">Edit</button>
                                                <button className="text-red-600 hover:underline">Reject</button>
                                                <button className="text-red-600 hover:underline">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* close case and dismiss case button when the case is not yet completed */}
                        {selectedCase.case_status === "Processing" && (
                            <div className="mt-6 flex items-center justify-end gap-4">
                                <button
                                    title="Closing or Finishing the Case"
                                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                                >
                                    <CheckCircle size={20} />
                                    Close Case
                                </button>
                                <button
                                    title="Dismissing Case"
                                    className="inline-flex gap-2 rounded-lg bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-700"
                                >
                                    <XCircle size={20} />
                                    Dismiss Case
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* Payment Record Header */}
                        <div className="mb-6 flex items-center gap-3 border-b pb-3">
                            <button
                                onClick={() => setShowPayments(false)}
                                className="btn-ghost"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Payment Record</h2>
                        </div>

                        {/* Payment Summary Cards */}
                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-5 shadow-sm dark:border-green-800 dark:from-green-900 dark:to-green-800">
                                <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Paid</p>
                                <p className="mt-2 text-2xl font-extrabold text-green-800 dark:text-green-200">
                                    {selectedCase?.case_balance !== null && selectedCase?.case_balance !== undefined
                                        ? formatCurrency(selectedCase.case_fee - selectedCase.case_balance)
                                        : "₱0.00"}
                                </p>
                            </div>
                            <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-5 shadow-sm dark:border-red-800 dark:from-red-900 dark:to-red-800">
                                <p className="text-sm font-medium text-red-700 dark:text-red-300">Remaining Balance</p>
                                <p className="mt-2 text-2xl font-extrabold text-red-800 dark:text-red-200">
                                    {selectedCase?.case_balance !== null && selectedCase?.case_balance !== undefined
                                        ? formatCurrency(selectedCase.case_balance)
                                        : "₱0.00"}
                                </p>
                            </div>
                            <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-5 shadow-sm dark:border-blue-800 dark:from-blue-900 dark:to-blue-800">
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Fee</p>
                                <p className="mt-2 text-2xl font-extrabold text-blue-800 dark:text-blue-200">
                                    {selectedCase?.case_fee !== null && selectedCase?.case_fee !== undefined
                                        ? formatCurrency(selectedCase.case_fee)
                                        : "₱0.00"}
                                </p>
                            </div>
                        </div>

                        {/* Payments Table */}
                        <div className="card w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm dark:border-slate-700">
                            <div className="overflow-y-auto">
                                <table className="min-w-full table-auto text-left text-sm">
                                    <thead className="sticky top-0 bg-gray-100 text-xs uppercase text-gray-600 dark:bg-slate-800 dark:text-gray-300">
                                        <tr>
                                            <th className="px-4 py-3">Payment ID</th>
                                            <th className="px-4 py-3">Client</th>
                                            <th className="px-4 py-3">Case</th>
                                            <th className="px-4 py-3">Amount</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Payment Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                        {(payments || []).length > 0 ? (
                                            payments.map((p) => (
                                                <tr
                                                    key={p.payment_id}
                                                    className="transition hover:bg-blue-50 dark:hover:bg-slate-800"
                                                >
                                                    <td className="px-4 py-3 font-medium">{p.payment_id}</td>
                                                    <td className="px-4 py-3 font-medium">{p.client_fullname}</td>
                                                    <td
                                                        className="max-w-xs truncate px-4 py-3"
                                                        title={p.ct_name}
                                                    >
                                                        {p.ct_name}
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-green-600 dark:text-green-400">
                                                        {formatCurrency(p.payment_amount)}
                                                    </td>
                                                    <td className="px-4 py-3">{formatDateTime(p.payment_date)}</td>
                                                    <td className="px-4 py-3">{p.payment_type}</td>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewModal;
