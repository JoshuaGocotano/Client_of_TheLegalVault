import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./task-card";

export function Column({ column, tasks }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex w-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <h2 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
        {column.title}
      </h2>

      <div className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="rounded border border-dashed border-gray-400 p-3 text-center text-xs text-gray-400">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

export default Column;
