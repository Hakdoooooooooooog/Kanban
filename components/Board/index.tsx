"use client";

import React, { useEffect, useState } from "react";
import Button from "../button";
import ModalRenderer from "../Modal/modal";
import { useTasksStore } from "@/kanban/lib/store/useTasksStore";
import { useShallow } from "zustand/shallow";
import { useColumnStore } from "@/kanban/lib/store/useColumnStore";
import { replaceSpacesWithDashes } from "@/kanban/lib/utils";
import BoardSkeleton from "./components/Skeleton";
import BoardColumn, { AddColumn } from "./components/board-column";
import { defaultColumns, sampleTasks } from "@/kanban/lib/const/board";
import { useBoardStore } from "@/kanban/lib/store/useBoardStore";
import { ModalType, useModalStore } from "@/kanban/lib/store/useModalStore";

const Board = ({ boardId }: { boardId: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  const tasks = useTasksStore(
    useShallow((state) => {
      return state.getTasksByBoardId(boardId);
    })
  );

  const { boards, setActiveBoard, setLoading } = useBoardStore(
    useShallow((state) => ({
      boards: state.getBoards(),
      setActiveBoard: state.setActiveBoard,
      setLoading: state.setLoading,
    }))
  );

  const columns = useColumnStore(
    useShallow((state) => {
      return state.getColumnById(boardId) || [];
    })
  );

  const setTasks = useTasksStore(useShallow((state) => state.setTasks));
  const setColumns = useColumnStore(useShallow((state) => state.setColumns));

  // Loading state, can be replaced with actual loading logic when fetching data
  useEffect(() => {
    // Set loading to true when starting to load a new board
    setLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
      setActiveBoard(boardId);
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [boardId, setActiveBoard, setLoading]);

  // Initialize columns and tasks if they are empty, this can be replaced with actual data fetching logic
  useEffect(() => {
    if (columns.length === 0) {
      setColumns(defaultColumns);
    }
    if (tasks.length === 0) {
      setTasks(sampleTasks);
    }
  }, [columns, tasks, setColumns, setTasks]);

  // Show skeleton while loading
  if (isLoading) {
    return <BoardSkeleton />;
  }

  if (!boards.some((board) => board.id === boardId)) {
    return (
      <section className="w-full min-h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-900">
        <h2 className="text-lg font-bold p-4 text-black dark:text-white">
          Board not found. Please check the board ID.
        </h2>
        <Button
          props={{
            onClick: () => (window.location.href = "/Dashboard"),
          }}
        >
          Go to Dashboard
        </Button>
      </section>
    );
  }

  if (columns.length === 0 && tasks.length === 0) {
    return <EmptyBoard boardId={boardId} />;
  }

  return (
    <section className="w-full min-h-full relative overflow-x-auto overflow-y-hidden bg-gray-200 dark:bg-gray-900 p-4">
      <div className="h-full flex gap-4 transition-all duration-400 ease-in-out min-w-max">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) =>
              replaceSpacesWithDashes(task.columnId) ===
              replaceSpacesWithDashes(column.id)
          );

          return (
            <BoardColumn key={column.id} column={column} tasks={columnTasks} />
          );
        })}

        <AddColumn boardId={boardId} />
      </div>

      <ModalRenderer />
    </section>
  );
};

const EmptyBoard = ({ boardId }: { boardId: string }) => {
  const { openModal } = useModalStore(
    useShallow((state) => ({
      openModal: state.openModal,
    }))
  );

  return (
    <div className="w-full min-h-full flex items-center justify-center">
      <h2 className="text-lg font-bold p-4">
        This board is empty. Create a new column to get started.
      </h2>
      <Button
        props={{
          onClick: () => openModal(ModalType.ADD_COLUMN, { boardId }),
        }}
      >
        + Add New Column
      </Button>

      <ModalRenderer />
    </div>
  );
};

export default Board;
