import { create } from "zustand";

export interface Board {
  id: string;
  name: string;
  isActive?: boolean;
}

export type BoardStore = {
  boards: Board[];
  isLoading: boolean;
  getBoards: () => Board[];
  setBoards: (boards: Board[]) => void;
  setActiveBoard: (boardId: string) => void;
  getActiveBoardId: () => string | undefined;
  addBoard: (board: Board) => void;
  removeBoard: (board: Board) => void;
  setLoading: (loading: boolean) => void;
};

export const useBoardStore = create<BoardStore>()((set, get) => ({
  boards: [] as Board[],
  isLoading: false,
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
  getActiveBoardId: (): string | undefined => {
    const state = get();
    return state.boards.find((board) => board.isActive)?.id;
  },
  addBoard: (board: Board) =>
    set((state) => ({
      boards: [...state.boards, board],
    })),
  removeBoard: (board: Board) =>
    set((state) => ({
      boards: state.boards.filter((b) => b.id !== board.id),
    })),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
