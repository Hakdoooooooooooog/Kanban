"use client";

import React, { useEffect, useState } from "react";
import Button from "../button";
import ModalRenderer from "./components/Modal/modal";
import { useTasksStore } from "@/kanban/lib/store/useTasksStore";
import { useShallow } from "zustand/shallow";
import { useColumnStore } from "@/kanban/lib/store/useColumnStore";
import { generateUUID, replaceSpacesWithDashes } from "@/kanban/lib/utils";
import BoardSkeleton from "./components/Skeleton";
import BoardColumn, { AddColumn } from "./components/board-column";
import { defaultColumns, sampleTasks } from "@/kanban/lib/const/board";

const Board = ({ boardId }: { boardId: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  const tasks = useTasksStore(
    useShallow((state) => {
      if (!state.tasks) return [];
      return state.getTasksByBoardId(boardId);
    })
  );

  const columns = useColumnStore(
    useShallow((state) => {
      if (!state.columns) return [];
      return state.getColumnById(boardId) || [];
    })
  );

  const setTasks = useTasksStore(useShallow((state) => state.setTasks));

  const setColumns = useColumnStore(useShallow((state) => state.setColumns));

  // Loading state, can be replaced with actual loading logic when fetching data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, []);

  // Initialize columns and tasks if they are empty
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

  if (columns.length === 0 && tasks.length === 0) {
    return <EmptyBoard boardId={boardId} />;
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
  const { addNewColumn } = useColumnStore(
    useShallow((state) => ({
      addNewColumn: state.addColumn,
    }))
  );

  const handleAddColumn = () => {
    const columnName = prompt("Enter column name:") || "New Column";
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
    addNewColumn({
      id: generateUUID(),
      boardId: boardId,
      status: columnName.toUpperCase().replace(/\s+/g, "_"),
      color: randomColor,
    });
  };

  return (
    <div className="min-h-[90%] flex items-center justify-center">
      <h2 className="text-lg font-bold p-4">
        This board is empty. Create a new column to get started.
      </h2>
      <Button onClick={handleAddColumn}>+ Add New Column</Button>
    </div>
  );
};

export default Board;
