import React from "react";
import Button from "../button";
import Modal from "./components/modal";

type Column = {
  id: string;
  name: string;
  color: string;
  order: number;
};

export type Tasks = {
  id: string;
  title: string;
  description?: string;
  columnName: string;
  subtasks?: Subtask[];
};

type Subtask = Tasks & {
  taskId: Tasks["id"];
  columnName: Tasks["columnName"];
  isCompleted?: boolean;
};

// Default columns
const defaultColumns: Column[] = [
  { id: "todo", name: "TODO", color: "#49C4E5", order: 0 },
  { id: "in-progress", name: "In Progress", color: "#635fc7", order: 1 },
  { id: "done", name: "Done", color: "#67E2AE", order: 2 },
];

const SampleTasks: Tasks[] = [
  {
    id: "1",
    title: "Task 1",
    description: "This is the first task",
    columnName: "in-progress",
    subtasks: [
      {
        id: "1.1",
        taskId: "1",
        title: "Subtask 1.1",
        columnName: "todo",
        isCompleted: false,
      },
      {
        id: "1.2",
        taskId: "1",
        title: "Subtask 1.2",
        columnName: "done",
        isCompleted: true,
      },
    ],
  },
  {
    id: "2",
    title: "Task 2",
    description: "This is the second task",
    columnName: "done",
  },
  {
    id: "3",
    title: "Task 3",
    description: "This is the third task",
    columnName: "todo",
    subtasks: [
      {
        id: "3.1",
        taskId: "3",
        title: "Subtask 3.1",
        columnName: "todo",
        isCompleted: false,
      },
      {
        id: "3.2",
        taskId: "3",
        title: "Subtask 3.2",
        columnName: "in-progress",
      },
    ],
  },
];

const Board = () => {
  const [openModalTaskId, setOpenModalTaskId] = React.useState<string | null>(
    null
  );
  const [columns, setColumns] = React.useState<Column[]>(defaultColumns);

  const addNewColumn = (name: string, color: string) => {
    const newColumn: Column = {
      id: `column-${Date.now()}`,
      name,
      color,
      order: columns.length,
    };
    setColumns([...columns, newColumn]);
  };

  const handleCloseModal = () => {
    setOpenModalTaskId(null);
  };

  if (SampleTasks.length === 0) {
    return <EmptyBoard onAddColumn={addNewColumn} />;
  }

  return (
    <section className="w-full h-[calc(100dvh-73px)] relative overflow-x-auto overflow-y-hidden bg-gray-200 dark:bg-gray-900 p-4">
      <div className="h-full flex gap-4 transition-all duration-400 ease-in-out min-w-max">
        {columns
          .sort((a, b) => a.order - b.order)
          .map((column) => {
            const tasks = SampleTasks.filter(
              (task) => task.columnName === column.id
            );
            return (
              <Column key={column.id} column={column} count={tasks.length}>
                {tasks.map((task) => (
                  <Card
                    key={task.id}
                    {...task}
                    isModalOpen={openModalTaskId === task.id}
                    onOpenModal={() => setOpenModalTaskId(task.id)}
                    onCloseModal={handleCloseModal}
                  />
                ))}
              </Column>
            );
          })}
        <AddColumn onAddColumn={addNewColumn} />
      </div>
    </section>
  );
};

const EmptyBoard = ({
  onAddColumn,
}: {
  onAddColumn: (name: string, color: string) => void;
}) => {
  const handleAddColumn = () => {
    // For demo purposes, we'll add a default column
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
    onAddColumn(columnName, randomColor);
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

const Card = ({
  id: taskId,
  title,
  description,
  subtasks,
  isModalOpen,
  onOpenModal,
  onCloseModal,
}: Tasks & {
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
}) => {
  return (
    <div
      onClick={onOpenModal}
      className="w-full p-4 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg shadow-sm"
    >
      <h4 className="text-md text-black dark:text-white font-semibold">
        {title}
      </h4>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {subtasks && (
        <p className="text-sm text-gray-500 mt-2">
          {
            subtasks.filter(
              (tasks) =>
                tasks.columnName === "done" &&
                tasks.taskId === taskId &&
                tasks.isCompleted
            ).length
          }{" "}
          of {subtasks.length} subtasks completed
        </p>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        task={SampleTasks.find((task) => task.id === taskId) || ({} as Tasks)}
      />
    </div>
  );
};

const Column = ({
  column,
  count,
  children,
}: {
  column: Column;
  count: number;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-[280px] flex-shrink-0">
      <h3 className="text-md font-semibold mb-2 text-black dark:text-white">
        <span className="inline-flex items-center">
          <svg className="w-3 h-3 inline-block mr-2" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" fill={column.color} />
          </svg>
        </span>
        {column.name} ({count})
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

const AddColumn = ({
  onAddColumn,
}: {
  onAddColumn: (name: string, color: string) => void;
}) => {
  const handleClick = () => {
    // For demo purposes, we'll add a default column
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
    onAddColumn(columnName, randomColor);
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
