import { useRef } from "react";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";

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

const ViewModal = ({ selectedCase, setSelectedCase }) => {
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);

    useClickOutside([modalRef], () => setSelectedCase(null));

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            alert(`You selected file: ${file.name}`);
        }
    };

    if (!selectedCase) return null;

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
                    <X className="h-6 w-6" />
                </button>
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">Case {selectedCase.case_id}</h2>
                        <div className="mt-1 flex gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <span>Cabinet #: {selectedCase.case_cabinet}</span>
                            <span>Drawer #: {selectedCase.case_drawer}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-400 dark:text-white">
                        <span>Dumanjug</span>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                        <div>
                            <label className="text-sm font-semibold">Case Name</label>
                            <input
                                type="text"
                                readOnly
                                value={selectedCase.name}
                                className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-slate-800"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold">Category</label>
                            <input
                                type="text"
                                readOnly
                                value={selectedCase.category}
                                className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-slate-800"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold">Client</label>
                            <input
                                type="text"
                                readOnly
                                value={selectedCase.client}
                                className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-slate-800"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold">Lawyer</label>
                            <input
                                type="text"
                                readOnly
                                value={`Atty. ${selectedCase.lawyer}`}
                                className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-slate-800"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm font-semibold">Description</label>
                            <textarea
                                value={selectedCase.description || ""}
                                onChange={(e) => setSelectedCase((prev) => ({ ...prev, description: e.target.value }))}
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
                                    <span className="font-semibold">{selectedCase.fee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Paid</span>
                                    <span>- 10,000.00</span>
                                </div>
                                <hr className="my-1 border-gray-300 dark:border-gray-600" />
                                <div className="flex justify-between font-semibold">
                                    <span>Remaining</span>
                                    <span>{selectedCase.balance}</span>
                                </div>
                            </div>
                            <button className="mt-3 w-full rounded-lg bg-green-600 py-2 text-sm text-white hover:bg-green-700">
                                View Payment Record
                            </button>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                            <p>
                                <strong>Date Filed:</strong> April 25, 2025
                            </p>
                            <p>
                                <strong>Status:</strong> <span className={getStatusColor(selectedCase.status)}>{selectedCase.status}</span>
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
            </div>
        </div>
    );
};

export default ViewModal;
