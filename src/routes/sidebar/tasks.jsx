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
                    <h2 className="title">Tasks</h2>
                    <p className="text-sm text-gray-500">Manage and track all case-related tasks</p>
                </div>
            </div>

            <div>
                
            </div>

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
                                {cases
                                    .filter((c) => c.case_status === "Processing")
                                    .map((c) => (
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

// import { useState, useEffect, useMemo } from "react";
// import { Paperclip } from "lucide-react";

// // Constants
// const ITEMS_PER_PAGE = 6;
// const PRIORITY_TABS = ["All", "High", "Mid", "Low"];

// const rawTasks = [
//     {
//         id: 1,
//         title: "Draft incorporation documents",
//         case: "Davis Incorporation",
//         description: "Prepare articles of incorporation and bylaws",
//         assignedTo: "John Cooper",
//         dueDate: "Dec 1, 2025",
//         completedDate: "Nov 25, 2022",
//         attachment: null,
//     },
//     {
//         id: 2,
//         title: "Prepare deposition questions",
//         case: "Smith vs. Henderson",
//         description: "Draft questions for opposing party deposition",
//         assignedTo: "Emma Thompson",
//         dueDate: "Aug 8, 2025",
//         completedDate: null,
//         attachment: null,
//     },
//     {
//         id: 3,
//         title: "Site inspection",
//         case: "Wilson Property Dispute",
//         description: "Visit property to document current boundary markers",
//         assignedTo: "Sarah Wilson",
//         dueDate: "Aug 12, 2025",
//         completedDate: null,
//         attachment: null,
//     },
//     {
//         id: 4,
//         title: "Contract Review",
//         case: "Anderson vs. Global Corp",
//         description: "Review the contractual obligations",
//         assignedTo: "Michael Brown",
//         dueDate: "Aug 14, 2025",
//         completedDate: null,
//         attachment: null,
//     },
//     {
//         id: 5,
//         title: "Witness Interview",
//         case: "Lopez vs. Metro Bank",
//         description: "Interview main witnesses for testimony",
//         assignedTo: "Sarah Wilson",
//         dueDate: "Aug 20, 2025",
//         completedDate: null,
//         attachment: null,
//     },
//     {
//         id: 6,
//         title: "File Court Motion",
//         case: "Davis Incorporation",
//         description: "File motion for summary judgment",
//         assignedTo: "Emma Thompson",
//         dueDate: "Aug 5, 2025",
//         completedDate: "Aug 4, 2025",
//         attachment: null,
//     },
//     {
//         id: 7,
//         title: "Research Case Law",
//         case: "Smith vs. Henderson",
//         description: "Research precedents relevant to case",
//         assignedTo: "John Cooper",
//         dueDate: "Aug 15, 2025",
//         completedDate: null,
//         attachment: null,
//     },
// ];

// // Helpers
// const getDaysRemaining = (dueDate) => {
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffTime = due - today;
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// };

// const getPriorityFromDueDate = (dueDate) => {
//     const daysLeft = getDaysRemaining(dueDate);
//     if (daysLeft <= 2) return "High";
//     if (daysLeft <= 5) return "Mid";
//     return "Low";
// };

// const priorityColor = {
//     High: "text-red-500",
//     Mid: "text-yellow-600",
//     Low: "text-gray-700",
// };

// // Tab Color Logic
// const getTabColor = (tab, isActive) => {
//     const base = "px-10 py-2 rounded-full font-medium text-sm";
//     if (!isActive) {
//         return `${base} bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-300`;
//     }

//     switch (tab) {
//         case "High":
//             return `${base} bg-red-600 text-white dark:bg-red-500`;
//         case "Mid":
//             return `${base} bg-yellow-500 text-white dark:bg-yellow-400`;
//         case "Low":
//             return `${base} bg-green-500 text-white dark:bg-green-400`;
//         default:
//             return `${base} bg-blue-500 text-white`;
//     }
// };

// export default function Tasks() {
//     const [tasks, setTasks] = useState([]);
//     const [priorityFilter, setPriorityFilter] = useState("All");
//     const [currentPage, setCurrentPage] = useState(1);

//     // Initialize tasks with computed fields
//     useEffect(() => {
//         const processed = rawTasks.map((task) => ({
//             ...task,
//             priority: getPriorityFromDueDate(task.dueDate),
//         }));
//         setTasks(processed);
//     }, []);

//     const filteredTasks = useMemo(() => {
//         return priorityFilter === "All" ? tasks : tasks.filter((task) => task.priority === priorityFilter);
//     }, [priorityFilter, tasks]);

//     const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
//     const currentTasks = filteredTasks.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

//     const handleFileChange = (e, taskId) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, attachment: file } : task)));
//     };

//     return (
//         <div className="min-h-screen space-y-6 text-black dark:text-white">
//             {/* Header */}
//             <div>
//                 <h2 className="text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">Tasks</h2>
//                 <p className="text-sm text-gray-500">Manage and track all case-related tasks</p>
//             </div>

//             {/* Priority Tabs */}
//             <div className="mb-4 flex flex-wrap gap-3">
//                 {PRIORITY_TABS.map((tab) => {
//                     const isActive = priorityFilter === tab;
//                     return (
//                         <button
//                             key={tab}
//                             onClick={() => {
//                                 setPriorityFilter(tab);
//                                 setCurrentPage(1);
//                             }}
//                             className={getTabColor(tab, isActive)}
//                         >
//                             {tab}
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* Task Cards */}
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//                 {currentTasks.map((task) => {
//                     const isOverdue = task.status !== "Completed" && new Date(task.dueDate) < new Date();

//                     return (
//                         <div
//                             key={task.id}
//                             className="card relative rounded-lg border border-gray-200 bg-white p-4 shadow-md transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
//                         >
//                             <div className="absolute right-4 top-3 text-sm font-medium">
//                                 <span className={priorityColor[task.priority]}>{task.priority}</span>
//                             </div>

//                             <h3 className="mb-1 font-semibold text-blue-700 dark:text-blue-400">{task.title}</h3>
//                             <p className="text-sm">
//                                 <strong>Case:</strong> {task.case}
//                             </p>
//                             <p className="mb-2 text-sm">{task.description}</p>
//                             <p className="mb-1 text-sm">
//                                 <strong>Assigned to:</strong> {task.assignedTo}
//                             </p>
//                             <p className="mb-1 text-sm">
//                                 <strong className="text-red-600">Due:</strong> {task.dueDate}
//                                 {isOverdue && <span className="ml-1 text-red-500">(Overdue)</span>}
//                             </p>
//                             {task.status === "Completed" && (
//                                 <p className="mb-2 text-sm text-green-600">
//                                     <strong>Completed:</strong> {task.completedDate}
//                                 </p>
//                             )}

//                             {/* File Upload */}
//                             <div className="mt-4 flex justify-end">
//                                 <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-blue-600 hover:underline">
//                                     <Paperclip size={16} />
//                                     {task.attachment ? "Change File" : "Attach File"}
//                                     <input
//                                         type="file"
//                                         className="hidden"
//                                         onChange={(e) => handleFileChange(e, task.id)}
//                                     />
//                                 </label>
//                             </div>

//                             {task.attachment && <p className="mt-1 w-48 truncate text-right text-xs text-gray-600">{task.attachment.name}</p>}
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//                 <div className="mt-4 flex items-center justify-end gap-3">
//                     <button
//                         onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                         disabled={currentPage === 1}
//                         className={`rounded border px-3 py-1 ${
//                             currentPage === 1
//                                 ? "cursor-not-allowed bg-gray-200 text-gray-400"
//                                 : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
//                         }`}
//                     >
//                         &lt;
//                     </button>

//                     <span className="text-sm text-gray-700 dark:text-white">
//                         Page {currentPage} of {totalPages}
//                     </span>

//                     <button
//                         onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                         disabled={currentPage === totalPages}
//                         className={`rounded border px-3 py-1 ${
//                             currentPage === totalPages
//                                 ? "cursor-not-allowed bg-gray-200 text-gray-400"
//                                 : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
//                         }`}
//                     >
//                         &gt;
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }
