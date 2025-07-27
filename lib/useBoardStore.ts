import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Board {
  id: string;
  name: string;
  isActive?: boolean;
}

export type BoardStore = {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
  setActiveBoard: (boardId: string) => void;
  getActiveBoard: () => Board | undefined;
  addBoard: (board: Board) => void;
  removeBoard: (board: Board) => void;
};

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
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
      getActiveBoard: (): Board | undefined => {
        const state = get();
        return state.boards.find((board) => board.isActive);
      },
      addBoard: (board: Board) =>
        set((state) => ({
          boards: [...state.boards, board],
        })),
      removeBoard: (board: Board) =>
        set((state) => ({
          boards: state.boards.filter((b) => b.id !== board.id),
        })),
    }),
    {
      name: "board-storage", // Name of the item in the storage
    }
  )
);
