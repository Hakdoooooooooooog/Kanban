import React from "react";
import FluentBoardSplit24Regular from "../../SVGIcons/FluentBoardSplit24Regular";

interface Board {
  id: string;
  name: string;
  isActive?: boolean;
}

interface BoardsListProps {
  boards?: Board[];
  onAddBoard?: () => void;
}

const BoardsList = ({
  boards = [
    { id: "1", name: "Item 1", isActive: true },
    { id: "2", name: "Item 2" },
    { id: "3", name: "Item 3" },
  ],
  onAddBoard,
}: BoardsListProps) => {
  return (
    <div className="w-[95%] h-full flex flex-col gap-2 my-auto">
      <p className="text-sm text-gray-500 p-4 pl-10 dark:text-gray-400">
        ALL BOARDS
        <span className="ml-2">({boards.length})</span>
      </p>
      <div className="text-gray-500 dark:text-gray-400 pr-4">
        <ul className="flex flex-col gap-2 list-none p-0 m-0">
          {boards.map((board) => (
            <li
              key={board.id}
              onClick={() => {
                if (board.isActive) return;

                // Handle board selection logic here
                console.log(`Selected board: ${board.name}`);
              }}
              className={`w-full flex items-center gap-2 p-4 text-gray-400 pl-10 hover:not-[.active]:bg-gray-300/30 rounded-r-full cursor-pointer ${
                board.isActive ? "active" : ""
              }`}
            >
              <FluentBoardSplit24Regular className="icon" />
              <span className="text-sm">{board.name}</span>
            </li>
          ))}
          <li className="w-full flex items-center gap-2 p-4 text-primary pl-10">
            <FluentBoardSplit24Regular className="icon text-primary" />
            <span
              className="text-sm cursor-pointer"
              onClick={
                onAddBoard || (() => console.log("Add New Board clicked"))
              }
            >
              + Create New Board
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BoardsList;
