import { Subtask } from "@/kanban/lib/store/useTasksStore";
import { Toggle } from "@base-ui-components/react";

const Subtasks = ({
  taskId,
  subtasks,
  onSubtaskToggle,
}: {
  taskId: string;
  subtasks: Subtask[] | undefined;
  onSubtaskToggle: (taskId: string, subtaskId: string) => void;
}) => {
  if (!subtasks || subtasks.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No subtasks available.
      </p>
    );
  }

  return subtasks && subtasks.length > 0 ? (
    <div className="flex flex-col gap-4 mt-2">
      <h3 className="text-sm font-bold text-gray-500 dark:text-gray-300">
        Subtasks ({subtasks.filter((subtask) => subtask.isCompleted).length} of{" "}
        {subtasks.length || 0})
      </h3>
      {subtasks.map((subtask, index) => (
        <div
          key={subtask.id || index}
          className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-md"
        >
          <Toggle
            className="toggle"
            pressed={subtask.isCompleted || false}
            onPressedChange={() => {
              if (subtask.id) {
                onSubtaskToggle(taskId, subtask.id);
              }
            }}
            render={(props, state) => {
              if (state.pressed || subtask.isCompleted) {
                return (
                  <button type="button" {...props}>
                    <CheckedIcon />
                  </button>
                );
              }

              return (
                <button type="button" {...props}>
                  <UncheckedIcon />
                </button>
              );
            }}
          />
          <p
            className={`text-sm font-bold text-black dark:text-white ${
              subtask.isCompleted ? "line-through !text-gray-600" : ""
            }`}
          >
            {subtask.title || "No title provided."}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      No subtasks available.
    </p>
  );
};

const CheckedIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="16" height="16" rx="2" fill="var(--color-primary)" />
    <path
      d="M4.5 8L7 10.5L11.5 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UncheckedIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="1"
      y="1"
      width="14"
      height="14"
      rx="2"
      stroke="var(--color-gray-500)"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

export default Subtasks;
