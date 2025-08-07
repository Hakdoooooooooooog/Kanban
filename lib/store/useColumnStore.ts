import { create } from "zustand";

export type Column = {
  id: string;
  boardId: string; // Optional, used for tasks
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
  getColumnById: (boardId: string) => Column[] | undefined;
  getAllColumnStatusByBoardId: (boardId: string) => string[];
};

export const useColumnStore = create<ColumnStore>((set, get) => ({
  columns: [],
  setColumns: (columns: Column[]) =>
    set((state) => {
      const allColumns = [...state.columns, ...columns];
      // Ensure no duplicates
      const uniqueColumns = allColumns.filter(
        (column, index, self) =>
          index === self.findIndex((c) => c.id === column.id)
      );
      return { columns: uniqueColumns };
    }),
  addColumn: (column: Column) =>
    set((state) => ({
      columns: [...state.columns, column],
    })),
  getColumnById: (boardId: string) =>
    get().columns.filter((column) => column.boardId === boardId),
  getAllColumnStatusByBoardId: (boardId: string) =>
    get()
      .columns.filter((column) => column.boardId === boardId)
      .map((column) => column.status),
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
