import React, { useState, useEffect } from "react";
import { COLUMNS } from "@/constants";
import Column from "@/components/tasking/column";
import { DndContext } from "@dnd-kit/core";
import toast from "react-hot-toast";

export const Tasking = () => {
    const [tasks, setTasks] = useState([]);

    // Fetch tasks from backend
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/documents", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch tasks");

                const data = await res.json();
                const taskData = data.filter((doc) => doc.doc_type === "Task");
                setTasks(taskData);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id; // should match column.id (todo, in_progress, done)

        const toastId = toast.loading("Updating task status...", { duration: 4000 });

        try {
            const updatedTasks = tasks.map((task) => {
                if (task.doc_id === taskId && task.doc_status !== newStatus) {
                    // Update status in backend
                    fetch(`http://localhost:3000/api/documents/${taskId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ doc_status: newStatus }),
                    })
                        .then((res) => {
                            if (!res.ok) throw new Error("Failed to update task status");
                            toast.success("Task moved and updated status successfully!", { id: toastId, duration: 4000 });
                        })
                        .catch((error) => {
                            console.error("Error updating task status:", error);
                            toast.error("Failed to update task status", { id: toastId, duration: 4000 });
                        });

                    return { ...task, doc_status: newStatus };
                }
                return task;
            });
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Error updating task status:", error);
            toast.error("Failed to update task status", { id: toastId, duration: 4000 });
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="title">Tasks</h1>
                <p className="text-sm text-gray-500">Monitor and update tasks with our intuitive drag-and-drop interface.</p>
            </div>

            {/* Legend */}
            <div>
                <h3 className="mb-2 font-semibold text-slate-700 dark:text-slate-300">Priority Levels:</h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-red-500"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Low</span>
                    </div>
                </div>
            </div>

            <DndContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {COLUMNS.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            tasks={tasks.filter((task) => task.doc_status === column.id)}
                        />
                    ))}
                </div>
            </DndContext>
        </div>
    );
};

export default Tasking;
