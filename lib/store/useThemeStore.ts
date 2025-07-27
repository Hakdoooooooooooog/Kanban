import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
};

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme:
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      setTheme: (theme: string) => set({ theme }),
      toggleTheme: () =>
        set((state: ThemeStore) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "theme-storage", // unique name
    }
  )
);

export default useThemeStore;
