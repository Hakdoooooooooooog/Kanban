"use client";

import React from "react";
import SidebarHeader from "./components/SidebarHeader";
import BoardsList from "./components/BoardsList";
import ThemeToggle from "../ThemeToggle";
import SidebarFooter from "./components/SidebarFooter";

const Sidebar = () => {
  const [theme, setTheme] = React.useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleAddBoard = () => {
    console.log("Add New Board clicked");
  };

  const handleHideSidebar = () => {
    console.log("Hide Sidebar clicked");
  };

  return (
    <div className="min-w-[300px] min-h-full bg-gray-800 dark:bg-gray-100 flex flex-col gap-4 border-r border-r-gray-50">
      <SidebarHeader />

      <BoardsList onAddBoard={handleAddBoard} />

      <div className="w-3/4 flex flex-col gap-4 justify-between pb-16 mx-auto">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <SidebarFooter onHide={handleHideSidebar} />
      </div>
    </div>
  );
};

export default Sidebar;
