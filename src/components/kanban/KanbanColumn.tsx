import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Column, Task } from "../../types/kanban";
import { SortableTaskCard } from "./SortableTaskCard";

export interface KanbanColumnProps {
  column: Column;
  onAddTask: (columnId: string) => void;
  onEditTask: (columnId: string, task: Task) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
}

export function KanbanColumn({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const taskIds = column.tasks.map((task) => task.id);

  return (
    <div
      className={`flex flex-col bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 min-w-[300px] max-w-[350px] border border-slate-700/50 transition-all duration-200 ${
        isOver ? "bg-purple-900/30 ring-2 ring-purple-500/50 border-purple-500/50" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-slate-200">{column.title}</h2>
          <span className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">
            {column.tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
          title="Add task"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
      <div ref={setNodeRef} className="flex flex-col gap-3 flex-1 min-h-[100px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(column.id, task)}
              onDelete={() => onDeleteTask(column.id, task.id)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
