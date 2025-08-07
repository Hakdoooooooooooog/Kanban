import React, { useState, useEffect } from "react";
import { Switch } from "@base-ui-components/react";
import LightIcon from "./SVGIcons/LightIcon";
import DarkIcon from "./SVGIcons/DarkIcon";
import { useShallow } from "zustand/shallow";
import useThemeStore from "../lib/store/useThemeStore";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useThemeStore(
    useShallow((state) => ({
      theme: state.theme,
      toggleTheme: state.toggleTheme,
    }))
  );

  useEffect(() => {
    if (typeof window !== "undefined" && mounted) {
      const html = document.documentElement;
      html.classList.remove("light", "dark");
      html.classList.add(theme);
    }
  }, [theme, mounted]);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a static version that matches server-side rendering
    return (
      <div className="w-full flex items-center justify-center gap-4 p-2 bg-gray-200 dark:bg-gray-900 rounded mx-auto">
        <LightIcon className="icon" />
        <Switch.Root
          checked={false}
          className="switch"
          aria-label="Toggle theme"
        >
          <Switch.Thumb className="switch-thumb" />
        </Switch.Root>
        <DarkIcon className="icon" />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center gap-4 p-2 bg-gray-200 dark:bg-gray-900 rounded mx-auto">
      <LightIcon className="icon" />
      <Switch.Root
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        className="switch"
        aria-label="Toggle theme"
      >
        <Switch.Thumb className="switch-thumb" />
      </Switch.Root>
      <DarkIcon className="icon" />
    </div>
  );
};

export default ThemeToggle;
