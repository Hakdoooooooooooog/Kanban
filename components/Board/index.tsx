import Button from "../button";

type Tasks = {
  id: string;
  title: string;
  description?: string;
  progress: Progress;
  subtasks?: Subtask[];
};

type Subtask = Tasks & {
  taskID: Tasks["id"];
};

enum Progress {
  TODO = "TODO",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
}

const SampleTasks: Tasks[] = [
  {
    id: "1",
    title: "Task 1",
    description: "This is the first task",
    progress: Progress.IN_PROGRESS,
    subtasks: [
      { id: "1.1", taskID: "1", title: "Subtask 1.1", progress: Progress.TODO },
      { id: "1.2", taskID: "1", title: "Subtask 1.2", progress: Progress.DONE },
    ],
  },
  {
    id: "2",
    title: "Task 2",
    description: "This is the second task",
    progress: Progress.DONE,
  },
  {
    id: "3",
    title: "Task 3",
    description: "This is the third task",
    progress: Progress.TODO,
    subtasks: [
      { id: "3.1", taskID: "3", title: "Subtask 3.1", progress: Progress.TODO },
      {
        id: "3.2",
        taskID: "3",
        title: "Subtask 3.2",
        progress: Progress.IN_PROGRESS,
      },
    ],
  },
];

const Board = () => {
  if (
    SampleTasks.length === 0 ||
    SampleTasks.every((task) => task.subtasks?.length === 0)
  ) {
    return <EmptyBoard />;
  }

  return (
    <section className="w-full h-[calc(100dvh-73px)] relative overflow-x-auto overflow-y-hidden custom-scrollbar bg-gray-900 dark:bg-gray-200 p-4">
      <div className="h-full flex gap-4 transition-all duration-400 ease-in-out min-w-max">
        {Object.values(Progress).map((progress) => {
          const tasks = SampleTasks.filter(
            (task) => task.progress === progress
          );
          return (
            <Column key={progress} progress={progress} count={tasks.length}>
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  taskID={task.id}
                  title={task.title}
                  description={task.description}
                  subtasks={task.subtasks}
                />
              ))}
            </Column>
          );
        })}
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
  taskID,
  title,
  description,
  subtasks,
}: {
  taskID?: string;
  title: string;
  description?: string;
  subtasks?: Subtask[] | undefined;
}) => {
  return (
    <div className="w-full p-4 bg-gray-800 dark:bg-gray-200 rounded-lg shadow-sm">
      <h4 className="text-md text-white dark:text-black font-semibold">
        {title}
      </h4>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {subtasks && (
        <p className="text-sm text-gray-500 mt-2">
          {
            subtasks.filter(
              (tasks) =>
                tasks.progress === Progress.DONE && tasks.taskID === taskID
            ).length
          }{" "}
          of {subtasks.length} subtasks
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
  progress: Progress;
  count: number;
  children: React.ReactNode;
}) => {
  const progressColors: Record<Progress, string> = {
    [Progress.TODO]: "#49C4E5",
    [Progress.IN_PROGRESS]: "#635fc7",
    [Progress.DONE]: "#67E2AE",
  };

  return (
    <div className="w-[280px] flex-shrink-0">
      <h3 className="text-md font-semibold mb-2 text-white dark:text-black">
        <span className="inline-flex items-center">
          <svg className="w-3 h-3 inline-block mr-2" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" fill={progressColors[progress]} />
          </svg>
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
