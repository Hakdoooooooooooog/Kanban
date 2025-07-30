import React, { useEffect } from "react";
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
const ModalRenderer = () => {
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

  // Don't render anything if modal is not open
  if (!modal.isModalOpen || !modal.modalType) {
    return null;
  }

  // Render modal content based on type
  const renderModalContent = () => {
    switch (modal.modalType) {
      case ModalType.EDIT_TASK:
      case ModalType.ADD_TASK:
        return <EditTaskContent modal={modal} columns={columns} />;

      case ModalType.ADD_BOARD:
      case ModalType.EDIT_BOARD:
      case ModalType.ADD_COLUMN:
      case ModalType.EDIT_COLUMN:
        return <PlaceholderContent modalType={modal.modalType} />;

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 rounded-md p-8 w-[480px] m-auto">
        {renderModalContent()}
      </div>
    </div>
  );
};

const EditTaskContent = ({
  modal,
  columns,
}: {
  modal: ModalState;
  columns: Column[];
}) => {
  const [selectedStatus, setSelectedStatus] = React.useState("TODO");
  const { setSubtaskCompletion, updateTaskStatus } = useTasksStore(
    useShallow((state) => ({
      updateTaskStatus: state.updateTaskStatus,
      setSubtaskCompletion: state.setSubtaskCompletion,
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

  // Create dropdown options with display labels and values
  const dropdownOptions = columns.map((column) => ({
    label: column.status,
    value: column.id,
  }));

  const handleSelectChange = (value: string) => {
    console.log("Status change requested:", {
      from: task.columnId,
      to: value,
      taskId: currentTaskId,
    });
    setSelectedStatus(value);

    // Update the task status when user selects a new option
    if (currentTaskId && value !== task.columnId) {
      updateTaskStatus(currentTaskId, value);
    }
  };

  // Sync selectedStatus with the current task's columnId
  useEffect(() => {
    if (task.columnId) {
      setSelectedStatus(task.columnId);
    }
  }, [task.columnId]);

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
            options={dropdownOptions}
            selected={task.columnId || selectedStatus}
            onSelect={handleSelectChange}
          />
        </div>
      </div>
    </>
  );
};

// Placeholder Content for unimplemented modals
const PlaceholderContent = ({ modalType }: { modalType: string }) => (
  <div className="text-center">
    <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
      {modalType} Modal
    </h2>
    <p className="text-gray-600 dark:text-gray-400">
      This modal type is not implemented yet.
    </p>
  </div>
);

export default ModalRenderer;
