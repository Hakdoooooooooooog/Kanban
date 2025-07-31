import { create } from "zustand";

export interface Board {
  id: string;
  name: string;
  isActive?: boolean;
}

export type BoardStore = {
  boards: Board[];
  getBoards: () => Board[];
  setBoards: (boards: Board[]) => void;
  setActiveBoard: (boardId: string) => void;
  getActiveBoardSlug: () => string | undefined;
  addBoard: (board: Board) => void;
  removeBoard: (board: Board) => void;
};

export const useBoardStore = create<BoardStore>()((set, get) => ({
  boards: [] as Board[],
  getBoards: () => get().boards,
  setBoards: (boards: Board[]) =>
    set((state) => {
      const allBoards = [...state.boards, ...boards];
      // Ensure no duplicates
      const uniqueBoards = allBoards.filter(
        (board, index, self) =>
          index === self.findIndex((b) => b.id === board.id)
      );
      return { boards: uniqueBoards };
    }),
  setActiveBoard: (boardId: string) =>
    set((state) => ({
      boards: state.boards.map((board) => {
        return {
          ...board,
          isActive: board.id === boardId,
        };
      }),
    })),
  getActiveBoardSlug: (): string | undefined => {
    const state = get();
    return state.boards
      .find((board) => board.isActive)
      ?.name.replace(/\s+/g, "-")
      .toLowerCase();
  },
  addBoard: (board: Board) =>
    set((state) => ({
      boards: [...state.boards, board],
    })),
  removeBoard: (board: Board) =>
    set((state) => ({
      boards: state.boards.filter((b) => b.id !== board.id),
    })),
}));
