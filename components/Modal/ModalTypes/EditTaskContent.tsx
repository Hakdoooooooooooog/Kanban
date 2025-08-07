import { Column } from "@/kanban/lib/store/useColumnStore";
import { ModalState } from "@/kanban/lib/store/useModalStore";
import { useTasksStore } from "@/kanban/lib/store/useTasksStore";
import { useState, useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import Dropdown from "../../Board/components/Dropdown";
import Subtasks from "../../Board/components/Subtasks";
import DottedMenu from "../../SVGIcons/DottedMenu";

const EditTaskContent = ({
  modal,
  columns,
}: {
  modal: ModalState["data"];
  columns: Column[];
}) => {
  const [selectedStatus, setSelectedStatus] = useState("TODO");
  const { updateTaskStatus } = useTasksStore(
    useShallow((state) => ({
      updateTaskStatus: state.updateTaskStatus,
    }))
  );

  const modalData = modal as { data?: { taskId?: string; boardId?: string } };

  const currentTaskId =
    modalData.data && typeof modalData.data === "object"
      ? modalData.data.taskId
      : undefined;

  const currentBoardId =
    modalData.data && typeof modalData.data === "object"
      ? modalData.data.boardId
      : undefined;

  const task = useTasksStore(
    useShallow((state) => {
      if (!currentTaskId) return null;
      return state.getTaskById(currentTaskId);
    })
  );

  const handleSelectChange = useCallback(
    (value: string) => {
      setSelectedStatus(value);

      // Update the task status when user selects a new option
      if (currentTaskId && task && value !== task.columnId) {
        const columnIndex = columns.findIndex(
          (column) => column.status === value
        );

        if (columnIndex !== -1) {
          const newColumnId = columns[columnIndex].id;
          updateTaskStatus(currentTaskId, newColumnId);
        }
      }
    },
    [currentTaskId, task, updateTaskStatus, columns]
  );

  // Sync selectedStatus with the current task's columnId
  useEffect(() => {
    if (task && task.columnId) {
      setSelectedStatus(
        columns.find((col) => col.id === task.columnId)?.status || "TODO"
      );
    }
  }, [task, columns]);

  // If task is not found, show loading state
  if (!task) {
    return <ModalSkeleton />;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          {task.title || "Task Title"}
        </h2>
        <DottedMenu />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        {task.description || "No description provided."}
      </p>
      <div className="flex flex-col gap-4">
        {/* Subtasks */}
        <Subtasks taskId={task.id} />

        <div className="w-full flex flex-col gap-2">
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500">
            Current Status
          </h3>
          <Dropdown
            options={columns
              .filter((col) => col.boardId === currentBoardId)
              .map((col) => col.status)}
            selected={selectedStatus}
            onSelect={handleSelectChange}
          />
        </div>
      </div>
    </>
  );
};

const ModalSkeleton = () => (
  <>
    <div className="flex items-center justify-between">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-48"></div>
      <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
    </div>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-full"></div>
    <div className="flex flex-col gap-4">
      {/* Subtasks Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-32"></div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-md"
            >
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse flex-1"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Dropdown Skeleton */}
      <div className="w-full flex flex-col gap-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-24"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-full"></div>
      </div>
    </div>
  </>
);

export default EditTaskContent;
