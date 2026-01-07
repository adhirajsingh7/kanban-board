import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, Priority } from "../../types/kanban";
import { DropdownMenu } from "../ui";
import { PriorityBadge } from "./PriorityBadge";

interface SortableTaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const priorityAccents: Record<Priority, string> = {
  low: "from-emerald-500",
  medium: "from-amber-500",
  high: "from-red-500",
};

export function SortableTaskCard({
  task,
  onEdit,
  onDelete,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const menuItems = [
    { label: "Edit", onClick: onEdit },
    { label: "Delete", onClick: onDelete, variant: "danger" as const },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? "opacity-50" : ""}`}
    >
      {/* Priority accent bar */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b ${priorityAccents[task.priority]} to-transparent opacity-80`}
      />

      <div
        className={`bg-gradient-to-br from-slate-700/80 to-slate-800/80 rounded-xl border p-4 pl-5 transition-all duration-300 ${
          isDragging
            ? "border-purple-500 shadow-lg shadow-purple-500/20"
            : "border-slate-600/40 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            {...attributes}
            {...listeners}
            className="flex-1 cursor-grab active:cursor-grabbing"
          >
            <h3 className="font-semibold text-slate-50 text-sm leading-tight group-hover:text-white transition-colors">
              {task.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <DropdownMenu items={menuItems} />
            </div>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-600/30">
          <PriorityBadge priority={task.priority} />
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Task</span>
          </div>
        </div>
      </div>
    </div>
  );
}
