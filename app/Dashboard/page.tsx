export default function Dashboard() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center flex-col gap-4 bg-gray-100 dark:bg-gray-800">
      <h2 className="text-lg font-bold p-4 text-black dark:text-white">
        Welcome to the Kanban Dashboard! Create your first board to get started.
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use the sidebar to navigate and manage your boards.
      </p>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Click on the{" "}
        <span className="font-bold underline text-primary dark:text-secondary">
          + Create New Board
        </span>{" "}
        button to add a new board.
      </p>
    </div>
  );
}
