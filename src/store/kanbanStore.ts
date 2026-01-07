import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";
import type { Column, Task } from "../types/kanban";
import { sampleColumns } from "../data/sampleTasks";

interface KanbanState {
  columns: Column[];
  addTask: (columnId: string, taskData: Omit<Task, "id">) => void;
  updateTask: (
    columnId: string,
    taskId: string,
    taskData: Omit<Task, "id">
  ) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    targetColumnId: string,
    newIndex: number
  ) => void;
  findColumnByTaskId: (taskId: string) => string | null;
  getTaskById: (taskId: string) => Task | null;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      columns: sampleColumns,

      addTask: (columnId, taskData) => {
        const newTask: Task = { id: crypto.randomUUID(), ...taskData };

        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? { ...col, tasks: [...col.tasks, newTask] }
              : col
          ),
        }));
      },

      updateTask: (columnId, taskId, taskData) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  tasks: col.tasks.map((task) =>
                    task.id === taskId ? { ...task, ...taskData } : task
                  ),
                }
              : col
          ),
        }));
      },

      deleteTask: (columnId, taskId) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === columnId
              ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
              : col
          ),
        }));
      },

      moveTask: (taskId, sourceColumnId, targetColumnId, newIndex) => {
        set((state) => {
          const sourceColumn = state.columns.find(
            (col) => col.id === sourceColumnId
          );
          const task = sourceColumn?.tasks.find((t) => t.id === taskId);

          if (!task) return state;

          if (sourceColumnId === targetColumnId) {
            // Reordering within the same column
            return {
              columns: state.columns.map((col) => {
                if (col.id !== sourceColumnId) return col;

                const oldIndex = col.tasks.findIndex((t) => t.id === taskId);
                return {
                  ...col,
                  tasks: arrayMove(col.tasks, oldIndex, newIndex),
                };
              }),
            };
          }

          // Moving to a different column
          return {
            columns: state.columns.map((col) => {
              if (col.id === sourceColumnId) {
                return {
                  ...col,
                  tasks: col.tasks.filter((t) => t.id !== taskId),
                };
              }
              if (col.id === targetColumnId) {
                const newTasks = [...col.tasks];
                newTasks.splice(newIndex, 0, task);
                return { ...col, tasks: newTasks };
              }
              return col;
            }),
          };
        });
      },

      findColumnByTaskId: (taskId) => {
        const { columns } = get();
        for (const column of columns) {
          if (column.tasks.some((task) => task.id === taskId)) {
            return column.id;
          }
        }
        return null;
      },

      getTaskById: (taskId) => {
        const { columns } = get();
        for (const column of columns) {
          const task = column.tasks.find((t) => t.id === taskId);
          if (task) return task;
        }
        return null;
      },
    }),
    {
      name: "kanban-board-storage",
    }
  )
);
