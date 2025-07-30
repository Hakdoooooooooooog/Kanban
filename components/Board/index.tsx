"use client";

import React, { useEffect, useState } from "react";
import Button from "../button";
import ModalRenderer from "./components/Modal/modal";
import { Tasks, useTasksStore } from "@/kanban/lib/store/useTasksStore";
import { useShallow } from "zustand/shallow";
import { useColumnStore, type Column } from "@/kanban/lib/store/useColumnStore";
import { generateUUID, replaceSpacesWithDashes } from "@/kanban/lib/utils";
import BoardSkeleton from "./components/Skeleton";
import BoardColumn, { AddColumn } from "./components/board-column";

// Default columns, replace with actual data fetching in production, the id is uuid
const defaultColumns: Column[] = [
  { id: "1", status: "TODO", color: "#49C4E5" },
  { id: "2", status: "IN_PROGRESS", color: "#635fc7" },
  { id: "3", status: "DONE", color: "#67E2AE" },
];

// Sample tasks, replace with actual data fetching in production
const SampleTasks: Tasks[] = [
  {
    id: "1",
    boardId: "1",
    title: "Task 1",
    description: "This is the first task",
    columnId: "1",
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
    columnId: "2",
  },
  {
    id: "3",
    boardId: "1",
    title: "Task 3",
    description: "This is the third task",
    columnId: "3",
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
  const { columns, setColumns } = useColumnStore(
    useShallow((state) => ({
      columns: state.columns,
      setColumns: state.setColumns,
    }))
  );

  // Loading state, can be replaced with actual loading logic when fetching data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, []);

  // Initialize columns and tasks if not already set, remove this if using real data fetching
  useEffect(() => {
    if (columns.length === 0 || tasks.length === 0) {
      setColumns(defaultColumns);
      setTasks(SampleTasks);
    }
  }, [columns, tasks, setColumns, setTasks]);

  // Show skeleton while loading
  if (isLoading) {
    return <BoardSkeleton />;
  }

  if (tasks.length === 0) {
    return <EmptyBoard />;
  }

  console.log("Tasks:", tasks);

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

        <AddColumn />
      </div>

      <ModalRenderer />
    </section>
  );
};

const EmptyBoard = () => {
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
      status: columnName.toUpperCase().replace(/\s+/g, "_"),
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

export default Board;
