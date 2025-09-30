import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import AddDocument from "@/components/add-document.jsx";

export default function Tasks() {
    const { user } = useAuth();

    // Case data and selection
    const [cases, setCases] = useState([]);
    const [casesLoading, setCasesLoading] = useState(false);
    const [casesError, setCasesError] = useState("");
    const [selectedCaseId, setSelectedCaseId] = useState("");

    // Trigger showing AddDocument overlay
    const [addDocCaseId, setAddDocCaseId] = useState(null);

    // Load cases once
    useEffect(() => {
        const fetchCases = async () => {
            setCasesError("");
            setCasesLoading(true);
            try {
                const res = await fetch("http://localhost:3000/api/cases", {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to load cases");
                const data = await res.json();
                setCases(Array.isArray(data) ? data : []);
            } catch (e) {
                setCasesError(e.message || "Unable to load cases");
            } finally {
                setCasesLoading(false);
            }
        };

        fetchCases();
    }, []);

    return (
        <div className="min-h-screen space-y-6 text-black dark:text-white">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">Tasks</h2>
                    <p className="text-sm text-gray-500">Manage and track all case-related tasks</p>
                </div>
            </div>

            {/* Simple inline action card */}
            {user.user_role === "Staff" && (
                <div className=" ">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Add Supporting Document</h3>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Case</label>
                            <select
                                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
                                value={selectedCaseId}
                                onChange={(e) => setSelectedCaseId(e.target.value)}
                                disabled={casesLoading}
                            >
                                <option value="">{casesLoading ? "Loading cases..." : "-- Choose a case --"}</option>
                                {casesError && (
                                    <option
                                        value=""
                                        disabled
                                    >
                                        Failed to load cases
                                    </option>
                                )}
                                {cases.map((c) => (
                                    <option
                                        key={c.case_id}
                                        value={c.case_id}
                                    >
                                        #{c.case_id} - {c.ct_name || c.case_remarks || "Untitled Case"} ({c.client_fullname})
                                    </option>
                                ))}
                            </select>
                            {casesError && <p className="mt-1 text-xs text-red-600">{casesError}</p>}
                        </div>

                        <button
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            disabled={!selectedCaseId || !!casesError || casesLoading}
                            onClick={() => setAddDocCaseId(selectedCaseId)}
                        >
                            + Add Supporting Document
                        </button>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">Select a case, then click Add Supporting Document to upload your file.</p>
                </div>
            )}

            {/* AddDocument overlay */}
            {addDocCaseId && (
                <AddDocument
                    caseId={addDocCaseId}
                    onClose={() => {
                        setAddDocCaseId(null);
                    }}
                    onAdded={() => {
                        setAddDocCaseId(null);
                    }}
                />
            )}
        </div>
    );
}
