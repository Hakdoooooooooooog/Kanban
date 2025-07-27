import { create } from "zustand";

export type Column = {
  id: string;
  status: TaskStatus | string;
  color: string;
};

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
}

export type ColumnStore = {
  columns: Column[];
  setColumns: (columns: Column[]) => void;
  addColumn: (column: Column) => void;
  removeColumn: (columnId: string) => void;
  updateColumn: (columnId: string, updatedColumn: Partial<Column>) => void;
};

export const useColumnStore = create<ColumnStore>((set) => ({
  columns: [],
  setColumns: (columns: Column[]) => set({ columns }),
  addColumn: (column: Column) =>
    set((state) => ({
      columns: [...state.columns, column],
    })),
  removeColumn: (columnId: string) =>
    set((state) => ({
      columns: state.columns.filter((column) => column.id !== columnId),
    })),
  updateColumn: (columnId: string, updatedColumn: Partial<Column>) =>
    set((state) => ({
      columns: state.columns.map((column) =>
        column.id === columnId ? { ...column, ...updatedColumn } : column
      ),
    })),
}));
