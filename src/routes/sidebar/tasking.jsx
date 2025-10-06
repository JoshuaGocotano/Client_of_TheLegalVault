import React, { useState } from "react";
import { COLUMNS, INITIAL_TASKS } from "@/constants";
import Column from "@/components/tasking/column";
import { DndContext } from "@dnd-kit/core";

export const Tasking = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="title">Tasks</h1>
        <p className="text-sm text-gray-500">
          Monitor and update tasks with our intuitive drag-and-drop interface.
        </p>
      </div>
      
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
            />
          ))}
        </div>
      </DndContext>

      {/* Legend */}
      <div>
        <h3 className="mb-2 font-semibold text-slate-700 dark:text-slate-300">
          Priority Levels:
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-red-500"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              High
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Medium
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-blue-500"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Low
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasking;
