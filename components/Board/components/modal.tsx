import React, { useEffect } from "react";
import DottedMenu from "../../SVGIcons/DottedMenu";
import "./modal.css";
import { useTasksStore } from "@/kanban/lib/useTasksStore";
import { useModalStore } from "@/kanban/lib/store/useModalStore";
import { TaskStatus } from "@/kanban/lib/useColumnStore";
import { useShallow } from "zustand/shallow";
import Dropdown from "./Dropdown";
import Subtasks from "./Subtasks";

const Modal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedStatus, setSelectedStatus] = React.useState("TODO");
  const { setSubtaskCompletion, updateTaskStatus } = useTasksStore(
    useShallow((state) => ({
      updateTaskStatus: state.updateTaskStatus,
      setSubtaskCompletion: state.setSubtaskCompletion,
    }))
  );

  const { modal } = useModalStore(
    useShallow((state) => ({
      modal: state.modal,
    }))
  );

  const currentTaskId =
    modal.data && typeof modal.data === "string" ? modal.data : "";

  const task = useTasksStore((state) =>
    currentTaskId ? state.getTaskById(currentTaskId) : null
  ) || {
    id: "",
    boardId: "",
    title: "",
    description: "",
    columnId: "",
    subtasks: [],
  };

  console.log("Current Task:", task);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };

  const handleSelectChange = (value: string) => {
    console.log("Status change requested:", {
      from: task.columnId,
      to: value,
      taskId: currentTaskId,
    });
    setSelectedStatus(value);
    // Update the task status when user selects a new option
    if (currentTaskId && value !== task.columnId) {
      console.log("Updating task status...");
      updateTaskStatus(currentTaskId, value);
    }
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  // Sync selectedStatus with the current task's columnId
  useEffect(() => {
    if (task.columnId) {
      setSelectedStatus(task.columnId);
    }
  }, [task.columnId]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      {/* Content Container */}
      <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 rounded-md p-8 w-[480px] m-auto">
        <div className="flex items-center justify-between ">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            {task.title || "Task Title"}
          </h2>
          <DottedMenu />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {task.description || "No description provided."}
        </p>
        <div className="flex flex-col gap-4 ">
          {/* Subtasks */}
          <Subtasks
            taskId={task.id}
            subtasks={task.subtasks}
            onSubtaskToggle={setSubtaskCompletion}
          />

          <div className="w-full flex flex-col gap-2">
            <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500">
              Current Status
            </h3>
            <Dropdown
              options={[
                TaskStatus.TODO,
                TaskStatus.IN_PROGRESS,
                TaskStatus.DONE,
              ]}
              selected={task.columnId || selectedStatus}
              onSelect={handleSelectChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
