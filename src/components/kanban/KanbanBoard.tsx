import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Task } from "../../types/kanban";
import { useKanbanStore } from "../../store/kanbanStore";
import { Modal, ConfirmDialog } from "../ui";
import { KanbanColumn } from "./KanbanColumn";
import { TaskForm } from "./TaskForm";
import { TaskCardOverlay } from "./TaskCardOverlay";

interface ModalState {
  isOpen: boolean;
  columnId: string | null;
  task: Task | null;
}

interface DeleteState {
  isOpen: boolean;
  columnId: string | null;
  taskId: string | null;
  taskTitle: string;
}

export function KanbanBoard() {
  const {
    columns,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    findColumnByTaskId,
    getTaskById,
  } = useKanbanStore();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    columnId: null,
    task: null,
  });

  const [deleteState, setDeleteState] = useState<DeleteState>({
    isOpen: false,
    columnId: null,
    taskId: null,
    taskTitle: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    const task = getTaskById(taskId);
    const columnId = findColumnByTaskId(taskId);

    if (task && columnId) {
      setActiveTask(task);
      setActiveColumnId(columnId);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || !activeColumnId) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which column the item is being dragged over
    const overColumn = columns.find((col) => col.id === overId);
    const overTaskColumn = findColumnByTaskId(overId);
    const targetColumnId = overColumn?.id || overTaskColumn;

    if (!targetColumnId || targetColumnId === activeColumnId) return;

    // Get the new index
    const targetColumn = columns.find((col) => col.id === targetColumnId);
    if (!targetColumn) return;

    const overIndex = targetColumn.tasks.findIndex((t) => t.id === overId);
    const newIndex = overIndex >= 0 ? overIndex : targetColumn.tasks.length;

    moveTask(activeId, activeColumnId, targetColumnId, newIndex);
    setActiveColumnId(targetColumnId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);
    setActiveColumnId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const currentColumnId = findColumnByTaskId(activeId);
    if (!currentColumnId) return;

    const column = columns.find((col) => col.id === currentColumnId);
    if (!column) return;

    const oldIndex = column.tasks.findIndex((t) => t.id === activeId);
    const newIndex = column.tasks.findIndex((t) => t.id === overId);

    if (oldIndex !== newIndex && newIndex >= 0) {
      moveTask(activeId, currentColumnId, currentColumnId, newIndex);
    }
  };

  const handleAddTask = (columnId: string) => {
    setModalState({ isOpen: true, columnId, task: null });
  };

  const handleEditTask = (columnId: string, task: Task) => {
    setModalState({ isOpen: true, columnId, task });
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    const column = columns.find((c) => c.id === columnId);
    const task = column?.tasks.find((t) => t.id === taskId);

    setDeleteState({
      isOpen: true,
      columnId,
      taskId,
      taskTitle: task?.title || "",
    });
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, columnId: null, task: null });
  };

  const handleFormSubmit = (data: Omit<Task, "id">) => {
    if (!modalState.columnId) return;

    if (modalState.task) {
      updateTask(modalState.columnId, modalState.task.id, data);
    } else {
      addTask(modalState.columnId, data);
    }

    handleModalClose();
  };

  const handleDeleteConfirm = () => {
    if (deleteState.columnId && deleteState.taskId) {
      deleteTask(deleteState.columnId, deleteState.taskId);
    }
  };

  const handleDeleteClose = () => {
    setDeleteState({
      isOpen: false,
      columnId: null,
      taskId: null,
      taskTitle: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 p-8">
      <h1 className="text-2xl font-bold text-white mb-8 tracking-tight">Kanban Board</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <Modal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        title={modalState.task ? "Edit Task" : "Create Task"}
      >
        <TaskForm
          initialData={modalState.task || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteState.isOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteState.taskTitle}"? This action cannot be undone.`}
      />
    </div>
  );
}
