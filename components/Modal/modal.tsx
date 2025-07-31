"use client";

import React, { useEffect, useMemo, memo } from "react";
import { useModalStore, ModalType } from "@/kanban/lib/store/useModalStore";
import { useColumnStore } from "@/kanban/lib/store/useColumnStore";
import { useShallow } from "zustand/shallow";
import EditTaskContent from "./ModalTypes/EditTaskContent";

import "./modal.css";

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
        return <PlaceholderContent modalType={ModalType.ADD_TASK} />;
      case ModalType.ADD_BOARD:
        return <PlaceholderContent modalType={ModalType.ADD_BOARD} />;
      case ModalType.EDIT_BOARD:
        return <PlaceholderContent modalType={ModalType.EDIT_BOARD} />;
      case ModalType.ADD_COLUMN:
        return <PlaceholderContent modalType={ModalType.ADD_COLUMN} />;
      case ModalType.EDIT_COLUMN:
        return <PlaceholderContent modalType={ModalType.EDIT_COLUMN} />;
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

// Modal Skeleton Component

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
