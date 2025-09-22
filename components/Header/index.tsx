"use client";

import React from "react";
import DropdownMenu, { DropdownOption } from "../dropdown-menu";
import Button from "../button";
import { ModalType, useModalStore } from "@/kanban/lib/store/useModalStore";
import { useShallow } from "zustand/shallow";
import { useBoardStore } from "@/kanban/lib/store/useBoardStore";
import { useTasksStore } from "@/kanban/lib/store/useTasksStore";

const Header = () => {
  const { openModal } = useModalStore(
    useShallow((state) => ({
      openModal: state.openModal,
    }))
  );

  const { getActiveBoardId } = useBoardStore(
    useShallow((state) => {
      return {
        getActiveBoardId: state.getActiveBoardId(),
      };
    })
  );

  const { tasks } = useTasksStore(
    useShallow((state) => ({
      tasks: state.tasks,
    }))
  );

  const currentTasks = tasks.filter(
    (task) => task.boardId === getActiveBoardId
  );

  const handleOpenModal = (data: { boardId: string | undefined }) => {
    openModal(ModalType.ADD_TASK, data);
  };

  const boardActionOptions: DropdownOption[] = [
    {
      id: "edit-board",
      label: "Edit Board",
      onClick: () => {
        console.log("Edit Board clicked");
      },
    },
    {
      id: "delete-board",
      label: "Delete Board",
      onClick: () => {
        console.log("Delete Board clicked");
      },
      variant: "danger",
    },
  ];

  return (
    <nav className="w-full min-h-[73px] flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-black dark:text-white">
        Platform Launch
      </h2>
      <div className="flex items-center gap-4">
        {getActiveBoardId && currentTasks.length > 0 && (
          <Button
            size="sm"
            props={{
              onClick: () => {
                handleOpenModal({ boardId: getActiveBoardId });
              },
            }}
          >
            + Add New Task
          </Button>
        )}

        <DropdownMenu options={boardActionOptions} />
      </div>
    </nav>
  );
};

export default Header;
