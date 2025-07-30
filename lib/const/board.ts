import { Column } from "../store/useColumnStore";
import { Tasks } from "../store/useTasksStore";
import { generateUUID } from "../utils";

// Default columns, replace with actual data fetching in production, the id is uuid
export const defaultColumns: Column[] = [
  { id: "1", boardId: "1", status: "TODO", color: "#49C4E5" },
  { id: "2", boardId: "1", status: "IN_PROGRESS", color: "#635fc7" },
  { id: "3", boardId: "1", status: "DONE", color: "#67E2AE" },
];

// Sample tasks, replace with actual data fetching in production, their id is uuid
export const sampleTasks: Tasks[] = [
  {
    id: generateUUID(),
    boardId: "1",
    title: "Task 1",
    description: "This is the first task",
    columnId: "1",
    subtasks: [
      {
        id: generateUUID(),
        taskId: generateUUID(),
        title: "Subtask 1.1",
        isCompleted: false,
      },
      {
        id: generateUUID(),
        taskId: generateUUID(),
        title: "Subtask 1.2",
        isCompleted: true,
      },
    ],
  },
  {
    id: generateUUID(),
    boardId: "1",
    title: "Task 2",
    description: "This is the second task",
    columnId: "2",
  },
  {
    id: generateUUID(),
    boardId: "1",
    title: "Task 3",
    description: "This is the third task",
    columnId: "3",
    subtasks: [
      {
        id: generateUUID(),
        taskId: generateUUID(),
        title: "Subtask 3.1",
        isCompleted: false,
      },
      {
        id: generateUUID(),
        taskId: generateUUID(),
        title: "Subtask 3.2",
        isCompleted: false,
      },
    ],
  },
];
