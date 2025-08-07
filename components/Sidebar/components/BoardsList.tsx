"use client";

import React, { useState, useEffect } from "react";
import FluentBoardSplit24Regular from "../../SVGIcons/FluentBoardSplit24Regular";
import { BoardStore, useBoardStore } from "@/kanban/lib/store/useBoardStore";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { generateUUID } from "@/kanban/lib/utils";
import { useShallow } from "zustand/shallow";
import { ModalType, useModalStore } from "@/kanban/lib/store/useModalStore";

// Skeleton component for loading state
const BoardSkeleton = () => (
  <li className="w-full flex items-center gap-2 p-4 pl-10">
    <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse flex-1 max-w-32"></div>
  </li>
);

const BoardsList = ({ boards }: Pick<BoardStore, "boards">) => {
  const router = useRouter();
  const path = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const { openModal } = useModalStore(
    useShallow((state) => ({
      openModal: state.openModal,
    }))
  );

  const { isBoardLoading } = useBoardStore(
    useShallow((state) => ({
      isBoardLoading: state.isLoading,
    }))
  );

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
                    // Prevent navigation if board is currently loading or if this board is already active
                    if (
                      isBoardLoading ||
                      board.isActive ||
                      path === `/Dashboard/${board.id}`
                    ) {
                      return;
                    }
                    router.push(`/Dashboard/${board.id}`);
                  }}
                  className={`item ${
                    board.isActive || path === `/Dashboard/${board.id}`
                      ? "active"
                      : ""
                  } ${
                    isBoardLoading
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <FluentBoardSplit24Regular props={{ className: "icon" }} />
                  <span className="text-sm">{board.name}</span>
                  {isBoardLoading && path === `/Dashboard/${board.id}` && (
                    <div className="ml-auto">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </li>
              ))}
              <li className="w-full flex items-center gap-2 p-4 text-primary pl-10">
                <FluentBoardSplit24Regular
                  props={{ className: "icon text-primary" }}
                />
                <span
                  className="text-sm cursor-pointer"
                  onClick={() => {
                    openModal(ModalType.ADD_BOARD, {
                      boardId: generateUUID(),
                      boardName: `Board ${boards.length + 1}`,
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
