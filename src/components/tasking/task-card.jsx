import { useDraggable } from '@dnd-kit/core';

export function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded-lg bg-slate-700 dark:bg-blue-950 p-4 shadow-sm hover:shadow-md ${task.priolevel === 'high' ? 'border-l-4 border-red-500' : task.priolevel === 'medium' ? 'border-l-4 border-yellow-500' : 'border-l-4 border-blue-500'}`}
      style={style}
    >
      <h3 className="font-medium text-slate-200">{task.title}</h3>
      {task.description && (
        <p className="mt-2 text-sm text-slate-300">{task.description}</p>
      )}
    </div>
  );
}

export default TaskCard;