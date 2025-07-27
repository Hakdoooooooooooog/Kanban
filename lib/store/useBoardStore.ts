import { create } from "zustand";

export interface Board {
  id: string;
  name: string;
  isActive?: boolean;
}

export type BoardStore = {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
  setActiveBoard: (boardId: string) => void;
  getActiveBoardSlug: () => string | undefined;
  addBoard: (board: Board) => void;
  removeBoard: (board: Board) => void;
};

export const useBoardStore = create<BoardStore>()((set, get) => ({
  boards: [] as Board[],
  setBoards: (boards: Board[]) => set({ boards }),
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
