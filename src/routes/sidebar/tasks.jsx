import { useState } from "react";
import { Filter, Plus, Trash2, Pencil, X, UploadCloud, Paperclip } from "lucide-react";

const initialTasks = [
    {
        id: 1,
        title: "Draft incorporation documents",
        case: "Davis Incorporation",
        description: "Prepare articles of incorporation and bylaws",
        assignedTo: "John Cooper",
        status: "Completed",
        dueDate: "Dec 1, 2022",
        completedDate: "Nov 25, 2022",
        attachment: null,
    },
    {
        id: 2,
        title: "Prepare deposition questions",
        case: "Smith vs. Henderson",
        description: "Draft questions for opposing party deposition",
        assignedTo: "Emma Thompson",
        status: "Pending",
        dueDate: "Apr 1, 2023",
        completedDate: null,
        attachment: null,
    },
    {
        id: 3,
        title: "Site inspection",
        case: "Wilson Property Dispute",
        description: "Visit property to document current boundary markers",
        assignedTo: "Sarah Wilson",
        status: "In Progress",
        dueDate: "Apr 1, 2023",
        completedDate: null,
        attachment: null,
    },
    {
        id: 4,
        title: "Contract Review",
        case: "Anderson vs. Global Corp",
        description: "Review the contractual obligations",
        assignedTo: "Michael Brown",
        status: "Pending",
        dueDate: "May 5, 2023",
        completedDate: null,
        attachment: null,
    },
    {
        id: 5,
        title: "Witness Interview",
        case: "Lopez vs. Metro Bank",
        description: "Interview main witnesses for testimony",
        assignedTo: "Sarah Wilson",
        status: "In Progress",
        dueDate: "May 10, 2023",
        completedDate: null,
        attachment: null,
    },
    {
        id: 6,
        title: "File Court Motion",
        case: "Davis Incorporation",
        description: "File motion for summary judgment",
        assignedTo: "Emma Thompson",
        status: "Completed",
        dueDate: "May 15, 2023",
        completedDate: "May 12, 2023",
        attachment: null,
    },
    {
        id: 7,
        title: "Research Case Law",
        case: "Smith vs. Henderson",
        description: "Research precedents relevant to case",
        assignedTo: "John Cooper",
        status: "Pending",
        dueDate: "May 20, 2023",
        completedDate: null,
        attachment: null,
    },
];

const statusColor = {
    Completed: "text-green-600",
    Pending: "text-red-600",
    "In Progress": "text-yellow-600",
};

//  Tab colors
const getTabColor = (status, selectedStatus) => {
    const isActive = selectedStatus === status;

    switch (status) {
        case "Pending":
            return isActive ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
        case "In Progress":
            return isActive ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
        case "Completed":
            return isActive ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
        default:
            return isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
    }
};

export default function Tasks() {
    const [tasks, setTasks] = useState(initialTasks);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(tasks.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);

    const handleFileChange = (e, taskId) => {
        const file = e.target.files[0];
        if (file) {
            setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, attachment: file } : t)));
        }
    };

    return (
        <div className="min-h-screen space-y-6 text-black dark:text-white">
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">Tasks</h2>
                <p className="text-sm text-gray-500">Manage and track all case-related tasks</p>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentTasks.map((task) => (
                    <div
                        key={task.id}
                        className="card"
                    >
                        <div className="absolute right-4 top-3 text-sm font-medium">
                            <span className={statusColor[task.status]}>{task.status}</span>
                        </div>

                        <h3 className="mb-1 font-semibold text-blue-700 dark:text-blue-400">{task.title}</h3>
                        <p className="text-sm">
                            <strong>Case:</strong> {task.case}
                        </p>
                        <p className="mb-2 text-sm">{task.description}</p>
                        <p className="mb-1 text-sm">
                            <strong>Assigned to:</strong> {task.assignedTo}
                        </p>
                        <p className="mb-1 text-sm">
                            <strong className="text-red-600">Due:</strong> {task.dueDate}
                            {task.status !== "Completed" && task.dueDate === "Apr 1, 2023" && <span className="ml-1 text-red-500">(Overdue)</span>}
                        </p>
                        {task.status === "Completed" && (
                            <p className="mb-2 text-sm text-green-600">
                                <strong>Completed:</strong> {task.completedDate}
                            </p>
                        )}

                        {/* Attach File */}
                        <div className="mt-4 flex justify-end">
                            <div className="text-right">
                                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-blue-600 hover:underline">
                                    <Paperclip size={16} />
                                    {task.attachment ? "Change File" : "Attach File"}
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, task.id)}
                                    />
                                </label>
                                {task.attachment && <p className="mt-1 w-48 truncate text-right text-xs text-gray-600">{task.attachment.name}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-2 flex items-center justify-end px-4 py-3 text-sm text-gray-700 dark:text-white">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                        >
                            &lt;
                        </button>

                        <div>
                            Page {currentPage} of {totalPages}
                        </div>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
