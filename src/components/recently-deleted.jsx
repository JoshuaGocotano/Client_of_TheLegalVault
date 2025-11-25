import React, { useState, useEffect } from "react";
import { Trash2, RotateCcw, X, File, CreditCard, CheckSquare, Calendar, User, Building2, ArrowLeft, Search } from "lucide-react";
import { useAuth } from "../context/auth-context.jsx";
import toast from "react-hot-toast";
import Spinner from "./loading.jsx";

const API_BASE = "http://localhost:3000/api";

export default function RecentlyDeleted({ onClose }) {
    const { user } = useAuth() || {};
    const [activeTab, setActiveTab] = useState("documents");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Data states for each tab
    const [deletedDocuments, setDeletedDocuments] = useState([]);
    const [deletedPayments, setDeletedPayments] = useState([]);
    const [deletedTasks, setDeletedTasks] = useState([]);

    // Tab configuration
    const tabs = [
        {
            id: "documents",
            label: "Documents",
            icon: File,
            count: deletedDocuments.length
        },
        // {
        //     id: "payments",
        //     label: "Payments",
        //     icon: CreditCard,
        //     count: deletedPayments.length
        // },
        {
            id: "tasks",
            label: "Tasks",
            icon: CheckSquare,
            count: deletedTasks.length
        }
    ];

    // Fetch all deleted items when component loads
    useEffect(() => {
        fetchAllDeletedItems();
    }, []);

    const fetchAllDeletedItems = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            console.log("Fetching all items...");
            console.log("Token:", token ? "Present" : "Missing");

            // Fetch all items simultaneously - using existing endpoints
            const [documentsResponse, paymentsResponse, tasksResponse] = await Promise.all([
                fetch(`${API_BASE}/documents`, { headers }).catch(err => {
                    console.error("Documents fetch error:", err);
                    return { ok: false, status: 500 };
                }),
                fetch(`${API_BASE}/payments`, { headers }).catch(err => {
                    console.error("Payments fetch error:", err);
                    return { ok: false, status: 500 };
                }),
                fetch(`${API_BASE}/tasks`, { headers }).catch(err => {
                    console.error("Tasks fetch error:", err);
                    return { ok: false, status: 500 };
                })
            ]);

            // Process documents response
            console.log("Documents response status:", documentsResponse.status);
            if (documentsResponse.ok) {
                const documentsData = await documentsResponse.json();
                console.log("Documents data:", documentsData);
                // Filter for deleted documents if there's a status field
                const deletedDocs = documentsData.filter ?
                    documentsData.filter(doc => doc.doc_status === 'deleted' || doc.status === 'deleted' || doc.is_deleted === true) :
                    documentsData.documents || documentsData || [];
                setDeletedDocuments(deletedDocs);
            } else {
                console.error("Failed to fetch documents:", documentsResponse.status);
                setDeletedDocuments([]);
            }

            // Process payments response  
            console.log("Payments response status:", paymentsResponse.status);
            if (paymentsResponse.ok) {
                const paymentsData = await paymentsResponse.json();
                console.log("Payments data:", paymentsData);
                // Filter for deleted payments if there's a status field
                const deletedPayments = paymentsData.filter ?
                    paymentsData.filter(payment => payment.payment_status === 'deleted' || payment.status === 'deleted' || payment.is_deleted === true) :
                    paymentsData.payments || paymentsData || [];
                setDeletedPayments(deletedPayments);
            } else {
                console.error("Failed to fetch payments:", paymentsResponse.status);
                setDeletedPayments([]);
            }

            // Process tasks response
            console.log("Tasks response status:", tasksResponse.status);
            if (tasksResponse.ok) {
                const tasksData = await tasksResponse.json();
                console.log("Tasks data:", tasksData);
                // Filter for deleted tasks if there's a status field
                const deletedTasks = tasksData.filter ?
                    tasksData.filter(task => task.task_status === 'deleted' || task.status === 'deleted' || task.is_deleted === true) :
                    tasksData.tasks || tasksData || [];
                setDeletedTasks(deletedTasks);
            } else {
                console.error("Failed to fetch tasks:", tasksResponse.status);
                setDeletedTasks([]);
            }

        } catch (err) {
            console.error("Error fetching items:", err);
            setError("Failed to fetch items: " + err.message);
            setDeletedDocuments([]);
            setDeletedPayments([]);
            setDeletedTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (itemId, itemType) => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            await fetch(`${API_BASE}/${itemType}/${itemId}/restore`, {
                method: "PATCH",
                headers
            });

            toast.success(`${itemType.slice(0, -1)} restored successfully`);
            fetchAllDeletedItems(); // Refresh all data
        } catch (err) {
            toast.error("Failed to restore item");
            console.error("Error restoring item:", err);
        }
    };

    const handlePermanentDelete = async (itemId, itemType) => {
        if (!window.confirm("Are you sure you want to permanently delete this item? This action cannot be undone.")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            await fetch(`${API_BASE}/${itemType}/${itemId}/permanent`, {
                method: "DELETE",
                headers
            });

            toast.success(`${itemType.slice(0, -1)} permanently deleted`);
            fetchAllDeletedItems(); // Refresh all data
        } catch (err) {
            toast.error("Failed to delete item permanently");
            console.error("Error permanently deleting item:", err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getCurrentData = () => {
        let data = [];
        switch (activeTab) {
            case "documents": data = deletedDocuments; break;
            case "payments": data = deletedPayments; break;
            case "tasks": data = deletedTasks; break;
            default: data = [];
        }

        // Filter by search term
        if (searchTerm) {
            return data.filter(item => {
                const searchLower = searchTerm.toLowerCase();
                if (activeTab === "documents") {
                    return item.doc_name?.toLowerCase().includes(searchLower) ||
                        item.doc_type?.toLowerCase().includes(searchLower) ||
                        item.case_name?.toLowerCase().includes(searchLower);
                } else if (activeTab === "payments") {
                    return item.client_name?.toLowerCase().includes(searchLower) ||
                        item.case_name?.toLowerCase().includes(searchLower) ||
                        item.payment_method?.toLowerCase().includes(searchLower);
                } else if (activeTab === "tasks") {
                    return item.task_name?.toLowerCase().includes(searchLower) ||
                        item.assigned_to?.toLowerCase().includes(searchLower) ||
                        item.case_name?.toLowerCase().includes(searchLower);
                }
                return false;
            });
        }

        return data;
    };

    const renderDocumentItem = (doc) => (
        <div key={doc.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <File className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{doc.doc_name}</h4>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                                    {doc.doc_type}
                                </span>
                                <span>•</span>
                                <span>{doc.case_name}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                Deleted by <span className="font-medium">{doc.deleted_by}</span> on {formatDate(doc.deleted_date)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                    <button
                        onClick={() => handleRestore(doc.id, "documents")}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Restore
                    </button>
                    <button
                        onClick={() => handlePermanentDelete(doc.id, "documents")}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Forever
                    </button>
                </div>
            </div>
        </div>
    );

    const renderPaymentItem = (payment) => (
        <div key={payment.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            ${payment.payment_amount?.toFixed(2)}
                        </h4>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                                    {payment.payment_method}
                                </span>
                                <span>•</span>
                                <span>{payment.client_name}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Case: {payment.case_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                Deleted by <span className="font-medium">{payment.deleted_by}</span> on {formatDate(payment.deleted_date)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                    <button
                        onClick={() => handleRestore(payment.id, "payments")}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Restore
                    </button>
                    <button
                        onClick={() => handlePermanentDelete(payment.id, "payments")}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Forever
                    </button>
                </div>
            </div>
        </div>
    );

    const renderTaskItem = (task) => (
        <div key={task.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <CheckSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{task.task_name}</h4>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <User className="h-4 w-4" />
                                <span>{task.assigned_to}</span>
                                <span>•</span>
                                <span>{task.case_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4" />
                                <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                Deleted by <span className="font-medium">{task.deleted_by}</span> on {formatDate(task.deleted_date)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                    <button
                        onClick={() => handleRestore(task.id, "tasks")}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Restore
                    </button>
                    <button
                        onClick={() => handlePermanentDelete(task.id, "tasks")}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Forever
                    </button>
                </div>
            </div>
        </div>
    );

    const renderCurrentTab = () => {
        const currentData = getCurrentData();

        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-20">
                    <Spinner />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading deleted {activeTab}...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl mb-4">
                        <X className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-red-600 dark:text-red-400 text-lg font-medium">{error}</p>
                    <button
                        onClick={fetchAllDeletedItems}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        if (currentData.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-full mb-6">
                        <Trash2 className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No deleted {activeTab} found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                        {searchTerm
                            ? `No deleted ${activeTab} match your search criteria.`
                            : `You don't have any deleted ${activeTab} to restore.`
                        }
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            );
        }

        return (
            <div className="grid gap-6">
                {activeTab === "documents" && currentData.map(renderDocumentItem)}
                {activeTab === "payments" && currentData.map(renderPaymentItem)}
                {activeTab === "tasks" && currentData.map(renderTaskItem)}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        Recently Deleted
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Restore or permanently delete items
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <div key={tab.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${tab.id === "documents" ? "bg-blue-50 dark:bg-blue-900/20" :
                                        tab.id === "payments" ? "bg-green-50 dark:bg-green-900/20" :
                                            "bg-orange-50 dark:bg-orange-900/20"
                                        }`}>
                                        <Icon className={`h-6 w-6 ${tab.id === "documents" ? "text-blue-600 dark:text-blue-400" :
                                            tab.id === "payments" ? "text-green-600 dark:text-green-400" :
                                                "text-orange-600 dark:text-orange-400"
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{tab.label}</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{tab.count}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {tab.label}
                                        {tab.count > 0 && (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activeTab === tab.id
                                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                                }`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {renderCurrentTab()}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            Items are automatically permanently deleted after 30 days
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}