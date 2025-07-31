import { Column, useColumnStore } from "@/kanban/lib/store/useColumnStore";
import { Tasks } from "@/kanban/lib/store/useTasksStore";
import BoardCard from "./board-card";
import { generateUUID } from "@/kanban/lib/utils";
import { memo, useCallback } from "react";

const BoardColumn = memo(
  ({ column, tasks }: { column: Column; tasks: Tasks[] }) => {
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
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No tasks available in this column.
            </p>
          ) : (
            tasks.map((task) => (
              <BoardCard key={task.id} {...task} boardId={column.boardId} />
            ))
          )}
        </div>
      </div>
    );
  }
);

// Add display name for debugging
BoardColumn.displayName = "BoardColumn";

export const AddColumn = memo(({ boardId }: { boardId: string }) => {
  const addNewColumn = useColumnStore((state) => state.addColumn);

  const handleClick = useCallback(() => {
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
      boardId: boardId, // Add the boardId here
      status: columnName.toUpperCase().replace(/\s+/g, "_"),
      color: randomColor,
    });
  }, [addNewColumn, boardId]);

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
});

// Add display name for debugging
AddColumn.displayName = "AddColumn";

export default BoardColumn;
