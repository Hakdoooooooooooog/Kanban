import React, { useEffect, useMemo, useCallback, useState, memo } from "react";
import DottedMenu from "../../../SVGIcons/DottedMenu";
import "./modal.css";
import { useTasksStore } from "@/kanban/lib/store/useTasksStore";
import {
  useModalStore,
  ModalType,
  ModalState,
} from "@/kanban/lib/store/useModalStore";
import { Column, useColumnStore } from "@/kanban/lib/store/useColumnStore";
import { useShallow } from "zustand/shallow";
import Dropdown from "../Dropdown";
import Subtasks from "../Subtasks";

// Main Modal Renderer - handles backdrop, ESC key, and renders modal content
const ModalRenderer = memo(() => {
  const { modal, closeModal } = useModalStore(
    useShallow((state) => ({
      modal: state.modal,
      closeModal: state.closeModal,
    }))
  );
  const columns = useColumnStore(useShallow((state) => state.columns));

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modal.isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [modal.isModalOpen, closeModal]);

  // Render modal content based on type
  const renderModalContent = useMemo(() => {
    switch (modal.modalType) {
      case ModalType.EDIT_TASK:
        return <EditTaskContent modal={modal} columns={columns} />;
      case ModalType.ADD_TASK:
        return <EditTaskContent modal={modal} columns={columns} />;
      case ModalType.ADD_BOARD:
      case ModalType.EDIT_BOARD:
      case ModalType.ADD_COLUMN:
      case ModalType.EDIT_COLUMN:
      default:
        return <PlaceholderContent modalType={modal.modalType} />;
    }
  }, [modal, columns]);

  // Don't render anything if modal is not open
  if (!modal.isModalOpen || !modal.modalType) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 rounded-md p-8 w-[480px] m-auto">
        {renderModalContent}
      </div>
    </div>
  );
});

const EditTaskContent = ({
  modal,
  columns,
}: {
  modal: ModalState;
  columns: Column[];
}) => {
  const [selectedStatus, setSelectedStatus] = useState("TODO");
  const { updateTaskStatus } = useTasksStore(
    useShallow((state) => ({
      updateTaskStatus: state.updateTaskStatus,
    }))
  );

  const currentTaskId =
    modal.data && typeof modal.data === "string" ? modal.data : undefined;

  const task = useTasksStore(
    useShallow((state) => {
      if (!currentTaskId) return null;
      return state.getTaskById(currentTaskId);
    })
  );

  const dropdownOptions = useMemo(() => {
    return columns.map((column) => ({
      label: column.status,
      value: column.id,
    }));
  }, [columns]);

  const handleSelectChange = useCallback(
    (value: string) => {
      setSelectedStatus(value);

      // Update the task status when user selects a new option
      if (currentTaskId && task && value !== task.columnId) {
        updateTaskStatus(currentTaskId, value);
      }
    },
    [currentTaskId, task, updateTaskStatus]
  );

  // Sync selectedStatus with the current task's columnId
  useEffect(() => {
    if (task && task.columnId) {
      setSelectedStatus(task.columnId);
    }
  }, [task]);

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
            options={dropdownOptions}
            selected={task.columnId || selectedStatus}
            onSelect={handleSelectChange}
          />
        </div>
      </div>
    </>
  );
};

// Modal Skeleton Component
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

// Placeholder Content for unimplemented modals
const PlaceholderContent = ({ modalType }: { modalType: string | null }) => (
  <div className="text-center">
    <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
      {modalType || "Unknown"} Modal
    </h2>
    <p className="text-gray-600 dark:text-gray-400">
      This modal type is not implemented yet.
    </p>
  </div>
);

ModalRenderer.displayName = "ModalRenderer";

export default ModalRenderer;
