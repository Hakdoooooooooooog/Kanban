import { create } from "zustand";

type SidebarStore = {
  isSidebarHidden: boolean;
  toggleSidebar: () => void;
};

const useSidebarStore = create<SidebarStore>((set) => ({
  isSidebarHidden: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarHidden: !state.isSidebarHidden })),
}));

export default useSidebarStore;
