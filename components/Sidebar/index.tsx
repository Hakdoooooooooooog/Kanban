"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import SidebarHeader from "./components/SidebarHeader";
import BoardsList from "./components/BoardsList";
import ThemeToggle from "../ThemeToggle";
import SidebarFooter from "./components/SidebarFooter";
import { useBoardStore } from "@/kanban/lib/store/useBoardStore";
import { useShallow } from "zustand/shallow";
import useSidebarStore from "@/kanban/lib/store/useSidebarStore";
import { sidebarBoardItems } from "@/kanban/lib/const/sidebar";

const Sidebar = () => {
  const { boards, setBoard } = useBoardStore(
    useShallow((state) => ({
      boards: state.boards,
      setBoard: state.setBoards,
      addBoard: state.addBoard,
    }))
  );
  const { toggleSidebar } = useSidebarStore();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const showButtonRef = useRef<HTMLButtonElement>(null);

  const handleHideSidebar = () => {
    if (!sidebarRef.current || !showButtonRef.current) return;

    toggleSidebar();
    const tl = gsap.timeline();

    // Animate sidebar out
    tl.to(sidebarRef.current, {
      x: -300,
      duration: 0.4,
      ease: "power2.inOut",
    }).fromTo(
      showButtonRef.current,
      {
        x: -60,
        opacity: 0,
        scale: 0.8,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1)",
      }
    );
  };

  const handleShowSidebar = () => {
    if (!sidebarRef.current || !showButtonRef.current) return;

    const tl = gsap.timeline();
    tl.to(showButtonRef.current, {
      x: -60,
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      ease: "ease.in",
    }).to(sidebarRef.current, {
      x: 0,
      duration: 0.4,
      ease: "ease.out",
      onComplete: () => toggleSidebar(),
    });
  };

  useEffect(() => {
    if (showButtonRef.current) {
      gsap.set(showButtonRef.current, { x: -60, opacity: 0, scale: 0.8 });
    }
  }, []);

  // This will be replaced by fetching boards from an API
  useEffect(() => {
    // Initialize boards if not already set
    if (!boards || boards.length === 0) {
      setBoard(sidebarBoardItems);
    }
  }, [boards, setBoard]);

  return (
    <>
      {/* Main Sidebar */}
      <nav
        ref={sidebarRef}
        className="absolute left-0 top-0 w-[300px] min-h-[100dvh] bg-gray-100 dark:bg-gray-800 flex flex-col justify-between gap-4 border-r border-r-gray-200 dark:border-r-gray-50 z-1"
        style={{ transform: "translateX(0px)" }}
      >
        <SidebarHeader />

        <BoardsList boards={boards} />

        <div className="w-3/4 flex flex-col gap-4 justify-between pb-16 mx-auto">
          <ThemeToggle />
          <SidebarFooter onHide={handleHideSidebar} />
        </div>
      </nav>

      {/* Show Sidebar Button - appears when sidebar is hidden */}
      <button
        ref={showButtonRef}
        onClick={handleShowSidebar}
        className="fixed w-16 left-0 bottom-16 -translate-y-1/2 bg-primary hover:bg-primary/90 text-white p-3 rounded-r-full shadow-lg z-20 transition-colors duration-200"
        aria-label="Show Sidebar"
        style={{
          transform: "translateX(-60px) scale(0.8)",
          opacity: 0,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="mx-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
};

export default Sidebar;
