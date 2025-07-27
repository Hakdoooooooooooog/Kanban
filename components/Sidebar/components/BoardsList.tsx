import React, { useState, useEffect } from "react";
import FluentBoardSplit24Regular from "../../SVGIcons/FluentBoardSplit24Regular";
import { BoardStore } from "@/kanban/lib/useBoardStore";

// Skeleton component for loading state
const BoardSkeleton = () => (
  <li className="w-full flex items-center gap-2 p-4 pl-10">
    <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse flex-1 max-w-32"></div>
  </li>
);

const BoardsList = ({
  boards,
  addBoard,
  setActiveBoard,
}: Pick<BoardStore, "boards" | "addBoard" | "setActiveBoard">) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const showSkeleton = isLoading || !boards || boards.length === 0;

  return (
    <div className="w-[95%] h-full flex flex-col gap-2 my-auto">
      <p className="text-sm text-gray-500 p-2 pl-10 dark:text-gray-400">
        ALL BOARDS
        <span className="ml-2">({showSkeleton ? "..." : boards.length})</span>
      </p>
      <div className="text-gray-500 dark:text-gray-400 pr-4">
        <ul className="flex flex-col gap-2 list-none p-0 m-0">
          {showSkeleton ? (
            <>
              <BoardSkeleton />
              <BoardSkeleton />
              <BoardSkeleton />
            </>
          ) : (
            <>
              {boards.map((board) => (
                <li
                  key={board.id}
                  onClick={() => {
                    if (board.isActive) return;

                    setActiveBoard(board.id);
                  }}
                  className={`item ${board.isActive ? "active" : ""}`}
                >
                  <FluentBoardSplit24Regular props={{ className: "icon" }} />
                  <span className="text-sm">{board.name}</span>
                </li>
              ))}
              <li className="w-full flex items-center gap-2 p-4 text-primary pl-10">
                <FluentBoardSplit24Regular
                  props={{ className: "icon text-primary" }}
                />
                <span
                  className="text-sm cursor-pointer"
                  onClick={() => {
                    // This is the default values for now, should replace with true value via modal
                    addBoard({
                      id: Date.now().toString(),
                      name: "New Board",
                      isActive: false,
                    });
                  }}
                >
                  + Create New Board
                </span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BoardsList;
