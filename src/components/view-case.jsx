import { useRef, useState } from "react";
import { X, MapPin, ArrowLeft } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";

const ViewModal = ({ selectedCase, setSelectedCase, tableData }) => {
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);

    const [showPayments, setShowPayments] = useState(false);

    useClickOutside([modalRef], () => setSelectedCase(null));

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
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold">Case {selectedCase.case_id}</h2>
                                <div className="mt-1 flex gap-4 text-sm text-gray-600 dark:text-gray-300">
                                    <span>Cabinet #: {selectedCase.case_cabinet}</span>
                                    <span>Drawer #: {selectedCase.case_drawer}</span>
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
                                        value={`Atty. ${getLawyerFullName(selectedCase.user_id)}`}
                                        className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-slate-800"
                                    />
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
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 overflow-x-auto rounded-lg border">
                            <div className="flex items-center justify-between p-4">
                                <h3 className="text-sm font-semibold">Documents</h3>
                                <div className="flex gap-2">
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
                                        Upload
                                    </button>
                                    <button className="rounded bg-blue-500 px-4 py-1.5 text-sm text-white">Clear</button>
                                </div>
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
                                        { id: "D124", name: "Pleadings", status: "Approved", file: "pleadings.pdf", uploader: "Noel Batcotoy" },
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
                                                <button className="text-red-600 hover:underline">Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Payment Record View */}
                        <div className="mb-5 flex items-center gap-3">
                            <button
                                onClick={() => setShowPayments(false)}
                                className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                            <h2 className="text-2xl font-semibold">Payment Record</h2>
                        </div>

                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-lg border bg-green-50 p-4 shadow dark:bg-green-900">
                                <p className="text-sm text-gray-500 dark:text-green-100">Total Paid</p>
                                <p className="text-lg font-semibold text-green-700 dark:text-green-300">₱10,000.00</p>
                            </div>
                            <div className="rounded-lg border bg-red-50 p-4 shadow dark:bg-red-900">
                                <p className="text-sm text-gray-500 dark:text-red-100">Remaining Balance</p>
                                <p className="text-lg font-semibold text-red-700 dark:text-red-300">{selectedCase.case_balance}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewModal;
