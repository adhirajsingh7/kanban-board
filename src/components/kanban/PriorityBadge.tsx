import type { Priority } from "../../types/kanban";
import type { ReactElement } from "react";

const priorityConfig: Record<Priority, { styles: string; icon: ReactElement }> = {
  low: {
    styles: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  medium: {
    styles: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  high: {
    styles: "bg-red-500/15 text-red-400 border border-red-500/25",
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ),
  },
};

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md capitalize ${config.styles}`}
    >
      {config.icon}
      {priority}
    </span>
  );
}
