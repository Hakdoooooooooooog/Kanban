import { create } from "zustand";
import { Column } from "./useColumnStore";

export type Tasks = {
  id: string;
  boardId: string;
  columnId: Column["id"];
  title: string;
  description: string;
  subtasks?: Subtask[];
};

export type Subtask = {
  id: string;
  taskId: string;
  title: string;
  isCompleted?: boolean;
};

type TasksStore = {
  tasks: Tasks[];
  setTasks: (tasks: Tasks[]) => void;
  addTask: (task: Tasks) => void;
  removeTask: (taskId: string) => void;
  updateTask: (taskId: string, updatedTask: Partial<Tasks>) => void;
  updateTaskStatus: (taskId: string, status: string) => void;
  getTaskById: (taskId: string) => Tasks | undefined;
  getTasksByBoardId: (boardId: string) => Tasks[];
  getSubtasksById: (taskId: string) => Subtask[];
  setSubtaskCompletion: (taskId: string, subtaskId: string) => void;
};

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  setTasks: (tasks: Tasks[]) => set({ tasks }),
  addTask: (task: Tasks) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  removeTask: (taskId: string) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
  updateTask: (taskId: string, updatedTask: Partial<Tasks>) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      ),
    })),
  updateTaskStatus: (taskId: string, status: string) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, columnId: status } : task
      ),
    })),
  getTaskById: (taskId: string) =>
    get().tasks.find((task) => task.id === taskId),
  getTasksByBoardId: (boardId: string) =>
    get().tasks.filter((task) => task.boardId === boardId),
  getSubtasksById: (taskId: string) =>
    get().tasks.find((task) => task.id === taskId)?.subtasks || [],
  setSubtaskCompletion: (taskId: string, subtaskId: string) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks?.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, isCompleted: !subtask.isCompleted }
                  : subtask
              ),
            }
          : task
      ),
    })),
}));
