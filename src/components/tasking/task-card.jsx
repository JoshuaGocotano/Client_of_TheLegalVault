import { useDraggable } from "@dnd-kit/core";

export function TaskCard({ task }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.doc_id,
    });

    const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`cursor-grab rounded-lg bg-slate-700 px-3 py-2 shadow-sm hover:shadow-md dark:bg-blue-950 ${task.doc_prio_level === "High" ? "border-l-4 border-red-500" : task.doc_prio_level === "Mid" ? "border-l-4 border-yellow-500" : "border-l-4 border-blue-500"}`}
            style={style}
        >
            <h3 className="text-sm font-medium text-slate-200">{task.doc_name}</h3>
            {task.doc_task && <p className="mt-2 text-xs text-slate-300">{task.doc_task}</p>}
        </div>
    );
}

export default TaskCard;
