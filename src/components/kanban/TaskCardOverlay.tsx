import type { Task, Priority } from "../../types/kanban";
import { PriorityBadge } from "./PriorityBadge";

interface TaskCardOverlayProps {
  task: Task;
}

const priorityAccents: Record<Priority, string> = {
  low: "from-emerald-500",
  medium: "from-amber-500",
  high: "from-red-500",
};

export function TaskCardOverlay({ task }: TaskCardOverlayProps) {
  return (
    <div className="relative w-[300px] rotate-3 cursor-grabbing">
      {/* Priority accent bar */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b ${priorityAccents[task.priority]} to-transparent opacity-80`}
      />

      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl border-2 border-purple-500 p-4 pl-5 shadow-2xl shadow-purple-500/30">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-white text-sm leading-tight flex-1">
            {task.title}
          </h3>
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
