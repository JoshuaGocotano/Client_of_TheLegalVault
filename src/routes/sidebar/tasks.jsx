import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import AddDocument from "@/components/add-document";
import { X } from "lucide-react";

export default function Tasks() {
    const { user } = useAuth();

    const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);

    return (
        <div className="min-h-screen space-y-6 text-black dark:text-white">
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">Tasks</h2>
                <p className="text-sm text-gray-500">Manage and track all case-related tasks</p>
            </div>

            {user.user_role === "Staff" && (
                <button
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    onClick={() => {
                        setIsAddDocumentOpen(true);
                    }}
                >
                    + Add Supporting Document
                </button>
            )}

            {/* Add Document Modal */}
            {isAddDocumentOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="relative w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <button
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                            onClick={() => setIsAddDocumentOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <AddDocument
                            caseId={null}
                            onClose={() => setIsAddDocumentOpen(false)}
                            onAdded={() => {
                                setIsAddDocumentOpen(false);
                                fetchDocuments();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
