import Button from "../button";

type Tasks = {
  title: string;
  description?: string;
  isCompleted: boolean;
  subtasks?: Tasks[];
};

const SampleTasks: Tasks[] = [
  {
    title: "Task 1",
    description: "This is the first task",
    isCompleted: false,
    subtasks: [
      { title: "Subtask 1.1", isCompleted: false },
      { title: "Subtask 1.2", isCompleted: true },
    ],
  },
  {
    title: "Task 2",
    description: "This is the second task",
    isCompleted: true,
  },
];

const Board = () => {
  if (
    SampleTasks.length === 0 ||
    SampleTasks.every((task) => task.isCompleted)
  ) {
    return <EmptyBoard />;
  }

  return (
    <section className="w-full h-[calc(100dvh-73px)] relative overflow-x-auto overflow-y-hidden custom-scrollbar bg-gray-900 dark:bg-gray-200 p-4">
      <div className="h-full flex gap-4 transition-all duration-400 ease-in-out min-w-max">
        <Column progress="TODO" count={SampleTasks.length}>
          {SampleTasks.map((task, index) => (
            <Card
              key={index}
              title={task.title}
              description={task.description}
              subtasks={task.subtasks}
            />
          ))}
        </Column>
        <Column progress="In Progress" count={SampleTasks.length}>
          {SampleTasks.map((task, index) => (
            <Card
              key={index}
              title={task.title}
              description={task.description}
              subtasks={task.subtasks}
            />
          ))}
        </Column>
        <Column progress="Done" count={SampleTasks.length}>
          {SampleTasks.map((task, index) => (
            <Card
              key={index}
              title={task.title}
              description={task.description}
              subtasks={task.subtasks}
            />
          ))}
        </Column>
        <AddColumn />
      </div>
    </section>
  );
};

const EmptyBoard = () => {
  return (
    <div className="min-h-full flex items-center justify-center">
      <h2 className="text-lg font-bold p-4">
        This board is empty. Create a new column to get started.
      </h2>
      <Button>+ Add New Column</Button>
    </div>
  );
};

const Card = ({
  title,
  description,
  subtasks,
}: {
  title: string;
  description?: string;
  subtasks?: Tasks[];
}) => {
  return (
    <div className="w-full p-4 bg-gray-800 dark:bg-gray-200 rounded-lg shadow-sm">
      <h4 className="text-md text-white dark:text-black font-semibold">
        {title}
      </h4>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {subtasks && (
        <p className="text-sm text-gray-500 mt-2">
          {subtasks.filter((tasks) => !tasks.isCompleted).length} of{" "}
          {subtasks.length} subtasks
        </p>
      )}
    </div>
  );
};

const Column = ({
  progress,
  count,
  children,
}: {
  progress: string;
  count: number;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-[280px] flex-shrink-0">
      <h3 className="text-md font-semibold mb-2 text-white dark:text-black">
        <span className="inline-flex items-center">
          {progress === "TODO" && (
            <svg className="w-3 h-3 inline-block mr-2" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" fill="#49C4E5" />
            </svg>
          )}
          {progress === "In Progress" && (
            <svg className="w-3 h-3 inline-block mr-2" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" fill="#635fc7" />
            </svg>
          )}
          {progress === "Done" && (
            <svg className="w-3 h-3 inline-block mr-2" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" fill="#67E2AE" />
            </svg>
          )}
        </span>
        {progress} ({count})
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

const AddColumn = () => {
  return (
    <div className="w-[280px] flex-shrink-0 flex flex-col items-center justify-center p-4 bg-gray-800/30 dark:bg-gray-400/30 rounded-md mt-9">
      <h4 className="text-lg text-gray-300 dark:text-gray-500 font-semibold">
        + New Column
      </h4>
    </div>
  );
};

export default Board;
