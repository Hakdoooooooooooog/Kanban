"use client";

import React, { useEffect, useState } from "react";
import Button from "../button";
import Modal from "./components/modal";
import { Tasks, useTasksStore } from "@/kanban/lib/store/useTasksStore";
import { useShallow } from "zustand/shallow";
import { useColumnStore, type Column } from "@/kanban/lib/store/useColumnStore";
import { replaceSpacesWithDashes } from "@/kanban/lib/utils";
import { ModalType, useModalStore } from "@/kanban/lib/store/useModalStore";
import BoardSkeleton from "./components/Skeleton";

// Skeleton Components

// Default columns
const defaultColumns: Column[] = [
  { id: "todo", status: "TODO", color: "#49C4E5" },
  { id: "in-progress", status: "IN_PROGRESS", color: "#635fc7" },
  { id: "done", status: "DONE", color: "#67E2AE" },
];

const SampleTasks: Tasks[] = [
  {
    id: "1",
    boardId: "1",
    title: "Task 1",
    description: "This is the first task",
    columnId: "in-progress",
    subtasks: [
      {
        id: "1.1",
        title: "Subtask 1.1",
        isCompleted: false,
      },
      {
        id: "1.2",
        title: "Subtask 1.2",
        isCompleted: true,
      },
    ],
  },
  {
    id: "2",
    boardId: "1",
    title: "Task 2",
    description: "This is the second task",
    columnId: "done",
  },
  {
    id: "3",
    boardId: "1",
    title: "Task 3",
    description: "This is the third task",
    columnId: "todo",
    subtasks: [
      {
        id: "3.1",
        title: "Subtask 3.1",
        isCompleted: false,
      },
      {
        id: "3.2",
        title: "Subtask 3.2",
        isCompleted: false,
      },
    ],
  },
];

const Board = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { tasks, setTasks } = useTasksStore(
    useShallow((state) => ({
      tasks: state.tasks,
      setTasks: state.setTasks,
    }))
  );
  const { columns, setColumns, addNewColumn } = useColumnStore(
    useShallow((state) => ({
      columns: state.columns,
      setColumns: state.setColumns,
      addNewColumn: state.addColumn,
    }))
  );

  useEffect(() => {
    // Show loading state briefly on mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Initialize columns if not already set
    if (columns.length === 0) {
      setColumns(defaultColumns);
    }

    // Initialize tasks if not already set
    if (tasks.length === 0) {
      setTasks(SampleTasks);
    }
  }, [columns, tasks, setColumns, setTasks]);

  // Show skeleton while loading
  if (isLoading) {
    return <BoardSkeleton />;
  }

  if (tasks.length === 0) {
    return <EmptyBoard onAddColumn={addNewColumn} />;
  }

  return (
    <section className="w-full h-[calc(100dvh-73px)] relative overflow-x-auto overflow-y-hidden bg-gray-200 dark:bg-gray-900 p-4">
      <div className="h-full flex gap-4 transition-all duration-400 ease-in-out min-w-max">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) =>
              replaceSpacesWithDashes(task.columnId) ===
              replaceSpacesWithDashes(column.id)
          );

          return <Column key={column.id} column={column} tasks={columnTasks} />;
        })}

        {/* Add New Column Button */}
        <AddColumn onAddColumn={addNewColumn} />
      </div>
    </section>
  );
};

const EmptyBoard = ({
  onAddColumn,
}: {
  onAddColumn: (column: Column) => void;
}) => {
  const handleAddColumn = () => {
    // For demo purposes, we'll add a default column
    const columnId = prompt("Enter column name:") || "New Column";
    const colors = [
      "#49C4E5",
      "#635fc7",
      "#67E2AE",
      "#F39C12",
      "#E74C3C",
      "#9B59B6",
      "#1ABC9C",
    ];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    onAddColumn({
      id: columnId.toLowerCase().replace(/\s+/g, "-"),
      status: "TODO",
      color: randomColor,
    });
  };

  return (
    <div className="min-h-full flex items-center justify-center">
      <h2 className="text-lg font-bold p-4">
        This board is empty. Create a new column to get started.
      </h2>
      <Button onClick={handleAddColumn}>+ Add New Column</Button>
    </div>
  );
};

const Card = ({ id: taskId, title, description, subtasks }: Tasks) => {
  const { modal, openModal, closeModal } = useModalStore(
    useShallow((state) => ({
      modal: state.modal,
      openModal: state.openModal,
      closeModal: state.closeModal,
    }))
  );

  const handleCloseModal = () => {
    closeModal();
  };

  const onOpenModal = () => {
    openModal(ModalType.EDIT_TASK, taskId);
  };

  return (
    <>
      <div
        onClick={onOpenModal}
        className="w-full p-4 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg shadow-sm cursor-pointer"
      >
        <h4 className="text-md text-black dark:text-white font-semibold">
          {title}
        </h4>
        {description && <p className="text-sm text-gray-600">{description}</p>}
        {subtasks && (
          <p className="text-sm text-gray-500 mt-2">
            {
              subtasks.filter(
                (tasks) => tasks.id === taskId && tasks.isCompleted
              ).length
            }{" "}
            of {subtasks.length} subtasks completed
          </p>
        )}
      </div>

      {modal.isModalOpen &&
        modal.modalType === ModalType.EDIT_TASK &&
        modal.data === taskId && (
          <Modal isOpen={modal.isModalOpen} onClose={handleCloseModal} />
        )}
    </>
  );
};

const Column = ({ column, tasks }: { column: Column; tasks: Tasks[] }) => {
  return (
    <div className="w-[280px] flex-shrink-0">
      <h3 className="text-md font-semibold mb-2 text-black dark:text-white">
        <span className="inline-flex items-center">
          <svg className="w-3 h-3 inline-block mr-2" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" fill={column.color} />
          </svg>
        </span>
        {column.status} ({tasks.length})
      </h3>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <Card key={task.id} {...task} />
        ))}
      </div>
    </div>
  );
};

const AddColumn = ({
  onAddColumn,
}: {
  onAddColumn: (column: Column) => void;
}) => {
  const handleClick = () => {
    // For demo purposes, we'll add a default column
    const columnId = prompt("Enter column name:") || "New Column";
    const colors = [
      "#49C4E5",
      "#635fc7",
      "#67E2AE",
      "#F39C12",
      "#E74C3C",
      "#9B59B6",
      "#1ABC9C",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    onAddColumn({
      id: columnId.toLowerCase().replace(/\s+/g, "-"),
      status: columnId.toUpperCase().replace(/\s+/g, "_"),
      color: randomColor,
    });
  };

  return (
    <div
      className="w-[280px] flex-shrink-0 flex flex-col items-center justify-center p-4 bg-gray-800/30 dark:bg-gray-400/30 rounded-md mt-8 cursor-pointer hover:bg-gray-800/50 dark:hover:bg-gray-400/50 transition-colors"
      onClick={handleClick}
    >
      <h4 className="text-lg text-gray-500 dark:text-gray-300 font-semibold">
        + New Column
      </h4>
    </div>
  );
};

export default Board;
